import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
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
  'studyMaterials',
  'sessionFeedback',
  'courseRatings',
  'blogs',
  'reviews',
  'faqs',
  'schedules',
  'recordings',
  'assignments',
  'payments',
  'doubts',
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
    if (!db) {
      console.warn('[FirestoreDBService] Firestore not configured. Data will not persist.');
      return;
    }

    // Clean up any existing listeners
    this.unsubscribeAll();

    for (const colName of COLLECTIONS_TO_SYNC) {
      const colRef = collection(db, colName as string);
      const unsub = onSnapshot(
        colRef,
        (snapshot) => {
          const firestoreData: any[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

          // Merge Firestore data with MockDB (preserving initial mock data if no Firestore data exists yet)
          // For a true "production" environment, we would completely overwrite MockDB with Firestore data.
          // However, to ensure demo data doesn't completely disappear until edited, we merge by ID.
          const currentDb = MockDB.get();
          const currentCollectionData = (currentDb[colName] as any[]) || [];

          // Create a map of firestore items for quick lookup
          const firestoreMap = new Map(firestoreData.map(item => [item.id || item.uid, item]));

          // Find items that are ONLY in mock data (e.g. initial hardcoded items not yet in Firestore)
          const mockOnlyItems = currentCollectionData.filter(
            item => !firestoreMap.has(item.id) && !firestoreMap.has(item.uid)
          );

          // The final merged collection favors Firestore data
          const mergedData = [...mockOnlyItems, ...firestoreData];

          // Update MockDB silently, then dispatch the global update event
          (currentDb[colName] as any[]) = mergedData;
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
