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
      let dependentUnsubscribers: (() => void)[] = [];
      const batchesQuery = query(collection(db, 'batches'), where('studentIds', 'array-contains', user.uid));
      const unsubBatches = onSnapshot(batchesQuery, (snapshot) => {
        // The batch listener can fire repeatedly. Tear down the previous
        // dependent collection listeners before rebuilding their batch query.
        dependentUnsubscribers.forEach(unsubscribe => unsubscribe());
        dependentUnsubscribers = [];
        const myBatches = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const currentDb = MockDB.get();
        (currentDb['batches'] as any[]) = myBatches;
        MockDB.set(currentDb);

        const myBatchIds = myBatches.map(b => b.id);
        
        // Now that we have batchIds, we must safely sync dependent collections using `in` queries
        // because Firestore rules enforce `isEnrolledInBatch(resource.data.batchId)`.
        const BATCH_DEPENDENT_COLLECTIONS = ['batchPlanner', 'batchSessions', 'liveClasses', 'studyMaterials', 'schedules', 'recordings', 'assignments'];
        
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
                // We append or overwrite based on the chunk. For simplicity, if we chunk, 
                // it might get complex. Assuming max 10 batches for now:
                (currentDb[colName] as any[]) = firestoreData;
                MockDB.set(currentDb);
              }, (err) => console.error(`[FirestoreDBService] Error syncing dependent ${colName}:`, err));
              dependentUnsubscribers.push(unsub);
            }
          }
        }
      }, (err) => console.error('[FirestoreDBService] Error syncing batches for student:', err));
      
      this.unsubscribers.push(() => {
        dependentUnsubscribers.forEach(unsubscribe => unsubscribe());
        unsubBatches();
      });
    }

    // 2. Students receive only the collections used by their portal. Admins
    // retain the existing full administrative subscriptions.
    const BATCH_DEPENDENT_COLLECTIONS = ['batchPlanner', 'batchSessions', 'liveClasses', 'studyMaterials', 'schedules', 'recordings', 'assignments'];
    const STUDENT_COLLECTIONS = new Set(['reviews', 'reviewCampaigns', 'notifications', 'doubts', 'doubtReplies', 'events', 'courses', 'blogs', 'faqs', 'courseRatings']);
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
