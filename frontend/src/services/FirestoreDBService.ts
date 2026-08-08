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

    // 1. If user is a student, we subscribe to student-accessible collections using targeted queries.
    if (!isAdmin) {
      let dependentUnsubscribers: (() => void)[] = [];
      const batchesQuery = query(collection(db, 'batches'), where('studentIds', 'array-contains', user.uid));
      const unsubBatches = onSnapshot(batchesQuery, (snapshot) => {
        dependentUnsubscribers.forEach(unsubscribe => unsubscribe());
        dependentUnsubscribers = [];
        const myBatches = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const currentDb = MockDB.get();
        (currentDb['batches'] as any[]) = myBatches;
        MockDB.set(currentDb);

        const myBatchIds = myBatches.map(b => b.id);
        const BATCH_DEPENDENT_COLLECTIONS = ['batchPlanner', 'batchSessions', 'liveClasses', 'studyMaterials', 'schedules', 'recordings', 'assignments'];
        
        if (myBatchIds.length > 0) {
          const chunkedBatchIds = [];
          for (let i = 0; i < myBatchIds.length; i += 10) {
            chunkedBatchIds.push(myBatchIds.slice(i, i + 10));
          }
          
          for (const colName of BATCH_DEPENDENT_COLLECTIONS) {
            for (const chunk of chunkedBatchIds) {
              const q = query(collection(db, colName), where('batchId', 'in', chunk));
              const unsub = onSnapshot(q, (snapshot) => {
                const firestoreData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                const currentDb = MockDB.get();
                const existingOthers = ((currentDb[colName as keyof DatabaseSchema] as any[]) || []).filter(
                  (item: any) => !chunk.includes(item.batchId)
                );
                (currentDb[colName as keyof DatabaseSchema] as any[]) = [...existingOthers, ...firestoreData];
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

      // Public collections (read allowed for all)
      const PUBLIC_COLLECTIONS = ['courses', 'blogs', 'faqs', 'events', 'courseRatings', 'reviews'];
      for (const colName of PUBLIC_COLLECTIONS) {
        const colRef = collection(db, colName);
        const unsub = onSnapshot(colRef, (snapshot) => {
          const firestoreData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          const currentDb = MockDB.get();
          (currentDb[colName as keyof DatabaseSchema] as any[]) = firestoreData;
          MockDB.set(currentDb);
        }, (err) => console.error(`[FirestoreDBService] Error syncing public ${colName}:`, err));
        this.unsubscribers.push(unsub);
      }

      // User-specific collections with exact rule-matching queries
      const doubtsQuery = query(collection(db, 'doubts'), where('studentId', '==', user.uid));
      const unsubDoubts = onSnapshot(doubtsQuery, (snapshot) => {
        const firestoreData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const currentDb = MockDB.get();
        currentDb.doubts = firestoreData;
        MockDB.set(currentDb);
      }, (err) => console.error('[FirestoreDBService] Error syncing doubts:', err));
      this.unsubscribers.push(unsubDoubts);

      const repliesQuery = query(collection(db, 'doubtReplies'), where('authorId', '==', user.uid));
      const unsubReplies = onSnapshot(repliesQuery, (snapshot) => {
        const firestoreData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const currentDb = MockDB.get();
        currentDb.doubtReplies = firestoreData;
        MockDB.set(currentDb);
      }, (err) => console.error('[FirestoreDBService] Error syncing doubtReplies:', err));
      this.unsubscribers.push(unsubReplies);

      const paymentsQuery = query(collection(db, 'payments'), where('studentId', '==', user.uid));
      const unsubPayments = onSnapshot(paymentsQuery, (snapshot) => {
        const firestoreData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const currentDb = MockDB.get();
        currentDb.payments = firestoreData;
        MockDB.set(currentDb);
      }, (err) => console.error('[FirestoreDBService] Error syncing payments:', err));
      this.unsubscribers.push(unsubPayments);

      const campaignsQuery = query(collection(db, 'reviewCampaigns'), where('recipientIds', 'array-contains', user.uid));
      const unsubCampaigns = onSnapshot(campaignsQuery, (snapshot) => {
        const firestoreData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const currentDb = MockDB.get();
        currentDb.reviewCampaigns = firestoreData;
        MockDB.set(currentDb);
      }, (err) => console.error('[FirestoreDBService] Error syncing reviewCampaigns:', err));
      this.unsubscribers.push(unsubCampaigns);

      // Targeted notifications (Targeted UID, Everyone, Students, TargetId)
      const notifQueries = [
        query(collection(db, 'notifications'), where('recipientIds', 'array-contains', user.uid)),
        query(collection(db, 'notifications'), where('target', '==', 'Everyone')),
        query(collection(db, 'notifications'), where('target', '==', 'Students')),
        query(collection(db, 'notifications'), where('targetId', '==', user.uid)),
      ];
      const notifDataMap = new Map<number, any[]>();
      notifQueries.forEach((q, index) => {
        const unsub = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          notifDataMap.set(index, docs);
          const merged = new Map<string, any>();
          notifDataMap.forEach(list => list.forEach(item => merged.set(item.id, item)));
          const currentDb = MockDB.get();
          currentDb.notifications = Array.from(merged.values());
          MockDB.set(currentDb);
        }, (err) => console.error(`[FirestoreDBService] Error syncing notifications (q${index}):`, err));
        this.unsubscribers.push(unsub);
      });
    }

    // 2. Admins retain full collection subscriptions.
    if (isAdmin) {
      for (const colName of COLLECTIONS_TO_SYNC) {
        const colRef = collection(db, colName as string);
        const unsub = onSnapshot(
          colRef,
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
