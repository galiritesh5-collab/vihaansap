import os

filepath = 'frontend/src/services/FirestoreDBService.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import_str = """import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';"""

new_import_str = """import {
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
import { isAdminEmail } from '../utils/authUtils';"""

if import_str in content:
    content = content.replace(import_str, new_import_str)
else:
    print("WARNING: Could not find imports to replace")

subscribe_method = """  static subscribeToAll(): void {
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

          const currentDb = MockDB.get();
          
          // Pure Firestore mirror: No merging with local mock data.
          // This completely prevents ghost data and deleted items reappearing.
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
  }"""

new_subscribe_method = """  static subscribeToAll(): void {
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
        
        // Now that we have batchIds, we can safely sync dependent collections if we have any.
        // However, we simplified the dependent rules to `allow read: if signedIn()` so 
        // they can still be fetched in bulk, allowing the frontend to filter them as usual.
        // But for true security and efficiency, we can use `in` queries if myBatchIds is not empty.
        // For simplicity (to avoid the 10-item limit of 'in' queries in Firestore), 
        // since the dependent rules are `signedIn()`, we can just fetch them normally like Admin.
      }, (err) => console.error('[FirestoreDBService] Error syncing batches for student:', err));
      
      this.unsubscribers.push(unsubBatches);
    }

    // 2. Fetch all other collections.
    for (const colName of COLLECTIONS_TO_SYNC) {
      if (!isAdmin && colName === 'batches') continue; // Handled specially above for students
      
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

    const websiteConfigUnsubscribe = onSnapshot(doc(db, 'config', 'website'), (snapshot) => {
      if (!snapshot.exists()) return;
      const currentDb = MockDB.get();
      currentDb.websiteContent = snapshot.data() as any;
      MockDB.set(currentDb);
    }, (error) => console.error('[FirestoreDBService] Error syncing website settings:', error));
    this.unsubscribers.push(websiteConfigUnsubscribe);
  }"""

if subscribe_method in content:
    content = content.replace(subscribe_method, new_subscribe_method)
else:
    print("WARNING: Could not find subscribeToAll method to replace")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated FirestoreDBService.ts")
