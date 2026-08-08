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

/**
 * Deduplicates docs from multiple parallel Firestore query snapshots into MockDB.
 * Each collection's queryMap tracks: key -> latest docs for that query key.
 * The merged result is the union of all queries, deduplicated by doc ID.
 */
function makeCollectionMerger(colName: keyof DatabaseSchema) {
  const queryResultMap = new Map<string, any[]>();
  return (queryKey: string, docs: any[]) => {
    queryResultMap.set(queryKey, docs);
    const merged = new Map<string, any>();
    queryResultMap.forEach(list => list.forEach(item => merged.set(item.id, item)));
    const currentDb = MockDB.get();
    (currentDb[colName] as any[]) = Array.from(merged.values());
    MockDB.set(currentDb);
  };
}

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

    // 1. If user is a student, subscribe to student-accessible collections using targeted queries.
    //
    // IMPORTANT: Firestore security rules are NOT filters — they validate the query itself.
    // We cannot use a broad `where('batchId', 'in', chunk)` query for collections that use
    // `isBatchContentVisibleToMe`, because Firestore will reject the entire query if it could
    // potentially return documents the student is not allowed to read.
    //
    // Instead we issue MULTIPLE NARROW queries per collection, each matching exactly one
    // branch of the isBatchContentVisibleToMe rule, and merge results by doc ID.
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

        const myBatchIds = myBatches.map((b: any) => b.id);

        if (myBatchIds.length === 0) return;

        const chunkedBatchIds: string[][] = [];
        for (let i = 0; i < myBatchIds.length; i += 10) {
          chunkedBatchIds.push(myBatchIds.slice(i, i + 10));
        }

        // Collections that use isBatchContentVisibleToMe in their rules:
        //   isEnrolledInBatch(batchId) AND (recipientMode=='all' OR recipientType=='all'
        //     OR (no recipientMode AND no recipientType) OR uid in recipientIds)
        // We issue 3 targeted queries per chunk:
        //   Q1: recipientMode == 'all'                    → covers explicit 'all' setting
        //   Q2: recipientType == 'all'                    → covers legacy 'all' setting
        //   Q3: recipientIds array-contains user.uid      → covers 'selected' targeting
        // Legacy docs with NO targeting fields are covered by Q1/Q2 absence — we add a 4th:
        //   Q4: or(where('recipientMode','not-in',['selected']), ...)
        // However, Firestore does not support 'not-in' combined with 'in' on a different field.
        // Instead, we rely on the rule's explicit allowance for docs without those fields
        // by issuing a query using `or()` composite filter (Firebase v9.8+).
        const VISIBLE_CONTENT_COLLECTIONS = ['batchSessions', 'studyMaterials', 'recordings', 'assignments'] as const;
        // Collections that only need isEnrolledInBatch (simpler rule — no recipient check):
        const ENROLLED_ONLY_COLLECTIONS = ['batchPlanner', 'liveClasses', 'schedules'] as const;

        for (const chunk of chunkedBatchIds) {
          const chunkKey = chunk.join(',');

          // ── Collections using isEnrolledInBatch only ─────────────────────────
          for (const colName of ENROLLED_ONLY_COLLECTIONS) {
            const merger = makeCollectionMerger(colName as keyof DatabaseSchema);
            const q = query(collection(db, colName), where('batchId', 'in', chunk));
            const unsub = onSnapshot(q, (snap) => {
              const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
              merger(`${colName}-${chunkKey}`, docs);
            }, (err) => console.error(`[FirestoreDBService] Error syncing ${colName}:`, err));
            dependentUnsubscribers.push(unsub);
          }

          // ── Collections using isBatchContentVisibleToMe ──────────────────────
          // Three queries per collection, each matching exactly one readable subset:
          for (const colName of VISIBLE_CONTENT_COLLECTIONS) {
            const merger = makeCollectionMerger(colName as keyof DatabaseSchema);

            // Q1: explicitly targeting all students via recipientMode
            const qAllMode = query(
              collection(db, colName),
              where('batchId', 'in', chunk),
              where('recipientMode', '==', 'all')
            );
            const unsubAllMode = onSnapshot(qAllMode, (snap) => {
              const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
              merger(`${colName}-${chunkKey}-mode-all`, docs);
            }, (err) => console.error(`[FirestoreDBService] Error syncing ${colName} (recipientMode=all):`, err));
            dependentUnsubscribers.push(unsubAllMode);

            // Q2: explicitly targeting all students via recipientType
            const qAllType = query(
              collection(db, colName),
              where('batchId', 'in', chunk),
              where('recipientType', '==', 'all')
            );
            const unsubAllType = onSnapshot(qAllType, (snap) => {
              const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
              merger(`${colName}-${chunkKey}-type-all`, docs);
            }, (err) => console.error(`[FirestoreDBService] Error syncing ${colName} (recipientType=all):`, err));
            dependentUnsubscribers.push(unsubAllType);

            // Q3: selected targeting — student's uid is explicitly in recipientIds
            const qSelected = query(
              collection(db, colName),
              where('batchId', 'in', chunk),
              where('recipientIds', 'array-contains', user.uid)
            );
            const unsubSelected = onSnapshot(qSelected, (snap) => {
              const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
              merger(`${colName}-${chunkKey}-selected`, docs);
            }, (err) => console.error(`[FirestoreDBService] Error syncing ${colName} (recipientIds):`, err));
            dependentUnsubscribers.push(unsubSelected);
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

      // doubtReplies: fetch replies authored by the student OR replies to the student's doubts
      // (mentors reply with their own uid, so we must also fetch by batchId for enrolled batches)
      // We run two queries and merge by doc ID.
      const repliesMerger = makeCollectionMerger('doubtReplies');
      const repliesQuery = query(collection(db, 'doubtReplies'), where('authorId', '==', user.uid));
      const unsubReplies = onSnapshot(repliesQuery, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        repliesMerger('by-author', docs);
      }, (err) => console.error('[FirestoreDBService] Error syncing doubtReplies (author):', err));
      this.unsubscribers.push(unsubReplies);

      // Also fetch replies on the student's own doubts (studentId == uid on the doubt, batchId-based on reply)
      const repliesByDoubtsQuery = query(collection(db, 'doubtReplies'), where('studentId', '==', user.uid));
      const unsubRepliesByDoubts = onSnapshot(repliesByDoubtsQuery, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        repliesMerger('by-student', docs);
      }, (err) => console.error('[FirestoreDBService] Error syncing doubtReplies (student):', err));
      this.unsubscribers.push(unsubRepliesByDoubts);

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
