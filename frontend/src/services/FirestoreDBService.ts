import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { auth } from '../config/firebase';
import { isAdminEmail } from '../config/adminConfig';
import { db } from '../config/firebase';
import { DatabaseSchema } from '../lib/mockdb/schema';
import { MockDB } from './MockDB';

// List of all collections that need to be synced between MockDB and Firestore.
// 'students' is handled via FirestoreStudentService specifically in AuthContext,
// but we can safely include it here or let it be handled separately. We'll handle
// everything generically here.
const COLLECTIONS_TO_SYNC: (keyof DatabaseSchema)[] = [
  'courses',
  'batches',
  'students',
  'mentors',
  'batchPlanner',
  'batchSessions',
  'liveClasses',
  'studyMaterials',
  'sessionFeedback',
  'courseRatings',
  'blogs',
  'reviews',
  'reviewCampaigns',
  'faqs',
  'schedules',
  'recordings',
  'assignments',
  'payments',
  'doubts',
  'doubtReplies',
  'notifications',
  'events',
  'leads',
  'serverEnquiries',
  'accounts',
  'serverPayments',
];

export class FirestoreDBService {
  private static unsubscribers: (() => void)[] = [];

  /**
   * Initializes real-time listeners for all collections.
   * Keeps MockDB (the synchronous in-memory store) completely up to date.
   */
  static subscribeToAll(): void {
    if (!db || !auth.currentUser) {
      console.warn('[FirestoreDBService] Firestore or Auth not configured/ready.');
      return;
    }

    const user = auth.currentUser;
    const isAdmin = isAdminEmail(user.email);

    // Clean up any existing listeners
    this.unsubscribeAll();

    // 1. If user is a student, we must first securely fetch their enrolled batches.
    // We cannot query the full batches collection because of least-privilege Firestore Rules.
    if (!isAdmin) {
      const batchesQuery = query(collection(db, 'batches'), where('studentIds', 'array-contains', user.uid));
      const unsubBatches = onSnapshot(batchesQuery, (snapshot) => {
        const myBatches = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const currentDb = MockDB.get();
        (currentDb['batches'] as any[]) = myBatches;
        MockDB.set(currentDb);

        const myBatchIds = myBatches.map(b => b.id);
        
        // Now that we have batchIds, we must safely sync dependent collections using `in` queries
        // because Firestore rules enforce `isEnrolledInBatch(resource.data.batchId)`.
        const BATCH_DEPENDENT_COLLECTIONS = ['batchPlanner', 'batchSessions', 'liveClasses', 'schedules', 'assignments'];
        const TARGETED_COLLECTIONS = ['studyMaterials', 'recordings'];
        
        if (myBatchIds.length > 0) {
          // Firestore 'in' queries support max 10 values. We must chunk them if necessary.
          const chunkedBatchIds = [];
          for (let i = 0; i < myBatchIds.length; i += 10) {
            chunkedBatchIds.push(myBatchIds.slice(i, i + 10));
          }
          
          for (const colName of BATCH_DEPENDENT_COLLECTIONS) {
            // Unsubscribe existing listeners for this collection if any
            for (const chunk of chunkedBatchIds) {
              const q = query(collection(db, colName), where('batchId', 'in', chunk));
              const unsub = onSnapshot(q, (snapshot) => {
                const firestoreData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                const currentDb = MockDB.get();
                (currentDb[colName] as any[]) = firestoreData;
                MockDB.set(currentDb);
              }, (err) => console.error(`[FirestoreDBService] Error syncing dependent ${colName}:`, err));
              this.unsubscribers.push(unsub);
            }
          }

          // Implement multi-query merger for collections with targeted visibility (studyMaterials, recordings)
          for (const colName of TARGETED_COLLECTIONS) {
            for (const chunk of chunkedBatchIds) {
              const colRef = collection(db, colName);
              const mergerState = new Map<string, any>();
              
              const mergeDocs = (docs: any[]) => {
                docs.forEach(d => mergerState.set(d.id, d));
                const currentDb = MockDB.get();
                (currentDb[colName as 'studyMaterials' | 'recordings'] as any[]) = Array.from(mergerState.values());
                MockDB.set(currentDb);
              };

              // Q1: Target 'all'
              const q1 = query(colRef, where('batchId', 'in', chunk), where('recipientMode', '==', 'all'));
              this.unsubscribers.push(onSnapshot(q1, snap => mergeDocs(snap.docs.map(d => ({ id: d.id, ...d.data() }))), err => console.error(`Sync error ${colName} Q1:`, err)));

              // Q2: Target 'all' (legacy field)
              const q2 = query(colRef, where('batchId', 'in', chunk), where('recipientType', '==', 'all'));
              this.unsubscribers.push(onSnapshot(q2, snap => mergeDocs(snap.docs.map(d => ({ id: d.id, ...d.data() }))), err => console.error(`Sync error ${colName} Q2:`, err)));

              // Q3: Target selected student
              const q3 = query(colRef, where('batchId', 'in', chunk), where('recipientIds', 'array-contains', user.uid));
              this.unsubscribers.push(onSnapshot(q3, snap => mergeDocs(snap.docs.map(d => ({ id: d.id, ...d.data() }))), err => console.error(`Sync error ${colName} Q3:`, err)));

              // Q4: Legacy visibility 'Students'
              const q4 = query(colRef, where('batchId', 'in', chunk), where('visibility', '==', 'Students'));
              this.unsubscribers.push(onSnapshot(q4, snap => mergeDocs(snap.docs.map(d => ({ id: d.id, ...d.data() }))), err => console.error(`Sync error ${colName} Q4:`, err)));

              // Q5: Legacy visibility 'Everyone'
              const q5 = query(colRef, where('batchId', 'in', chunk), where('visibility', '==', 'Everyone'));
              this.unsubscribers.push(onSnapshot(q5, snap => mergeDocs(snap.docs.map(d => ({ id: d.id, ...d.data() }))), err => console.error(`Sync error ${colName} Q5:`, err)));
            }
          }
        }
      }, (err) => console.error('[FirestoreDBService] Error syncing batches for student:', err));
      
      this.unsubscribers.push(unsubBatches);

      // ── Scoped doubts subscription ─────────────────────────────────────────
      // Rule: allow read if studentId == request.auth.uid
      const doubtsQuery = query(collection(db, 'doubts'), where('studentId', '==', user.uid));
      const unsubDoubts = onSnapshot(doubtsQuery, (snapshot) => {
        const firestoreData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const currentDb = MockDB.get();
        (currentDb['doubts'] as any[]) = firestoreData;
        MockDB.set(currentDb);
      }, (err) => console.error('[FirestoreDBService] Error syncing doubts:', err));
      this.unsubscribers.push(unsubDoubts);

      // ── Scoped doubtReplies subscription ───────────────────────────────────
      // Rule: allow read if authorId == request.auth.uid OR studentId == request.auth.uid
      // We need two queries to cover both branches, merged by doc ID.
      const replyResults = new Map<string, Map<string, any>>();
      const mergeReplies = (key: string, docs: any[]) => {
        replyResults.set(key, new Map(docs.map(d => [d.id, d])));
        const merged = new Map<string, any>();
        replyResults.forEach(m => m.forEach((v, k) => merged.set(k, v)));
        const currentDb = MockDB.get();
        (currentDb['doubtReplies'] as any[]) = Array.from(merged.values());
        MockDB.set(currentDb);
      };

      // Q1: Replies authored by this student
      const repliesByAuthor = query(collection(db, 'doubtReplies'), where('authorId', '==', user.uid));
      const unsubRepliesAuthor = onSnapshot(repliesByAuthor, (snapshot) => {
        mergeReplies('author', snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => console.error('[FirestoreDBService] Error syncing doubtReplies (author):', err));
      this.unsubscribers.push(unsubRepliesAuthor);

      // Q2: Replies on this student's doubts (e.g. mentor replies)
      const repliesByStudent = query(collection(db, 'doubtReplies'), where('studentId', '==', user.uid));
      const unsubRepliesStudent = onSnapshot(repliesByStudent, (snapshot) => {
        mergeReplies('student', snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => console.error('[FirestoreDBService] Error syncing doubtReplies (student):', err));
      this.unsubscribers.push(unsubRepliesStudent);
    }

    // 2. Students receive only the collections used by their portal. Admins
    // retain the existing full administrative subscriptions.
    const BATCH_DEPENDENT_COLLECTIONS = ['batchPlanner', 'batchSessions', 'liveClasses', 'studyMaterials', 'schedules', 'recordings', 'assignments'];
    const STUDENT_COLLECTIONS = new Set(['reviews', 'reviewCampaigns', 'notifications', 'events', 'courses', 'blogs', 'faqs', 'courseRatings']);
    for (const colName of COLLECTIONS_TO_SYNC) {
      if (!isAdmin && colName === 'batches') continue; // Handled specially above for students
      if (!isAdmin && BATCH_DEPENDENT_COLLECTIONS.includes(colName)) continue; // Handled specially for students
      if (!isAdmin && !STUDENT_COLLECTIONS.has(colName)) continue;
      
      const colRef = collection(db, colName as string);
      const collectionQuery = !isAdmin && (colName === 'notifications' || colName === 'reviewCampaigns')
        ? query(colRef, where('recipientIds', 'array-contains', user.uid))
        : colRef;
      const unsub = onSnapshot(
        collectionQuery,
        (snapshot) => {
          const firestoreData: any[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

          const currentDb = MockDB.get();
          (currentDb[colName] as any[]) = firestoreData;
          MockDB.set(currentDb);
        },
        (error) => {
          console.error(`[FirestoreDBService] Error syncing collection ${colName}:`, error);
        }
      );
      this.unsubscribers.push(unsub);
    }

    const websiteConfigUnsubscribe = onSnapshot(doc(db, 'config', 'website'), (snapshot) => {
      if (!snapshot.exists()) return;
      const currentDb = MockDB.get();
      currentDb.websiteContent = snapshot.data() as any;
      MockDB.set(currentDb);
    }, (error) => console.error('[FirestoreDBService] Error syncing website settings:', error));
    this.unsubscribers.push(websiteConfigUnsubscribe);
  }

  static unsubscribeAll(): void {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }

  // ─── Generic Write Operations ─────────────────────────────────────────────

  static async upsert(collectionName: keyof DatabaseSchema, id: string, data: any): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, collectionName as string, id);
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.error(`[FirestoreDBService] Error upserting to ${collectionName}:`, err);
    }
  }

  static async delete(collectionName: keyof DatabaseSchema, id: string): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, collectionName as string, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error(`[FirestoreDBService] Error deleting from ${collectionName}:`, err);
    }
  }
}
