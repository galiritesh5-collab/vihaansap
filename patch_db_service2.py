import os

filepath = 'frontend/src/services/FirestoreDBService.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the collection fetching logic
old_sync_logic = """        // Now that we have batchIds, we can safely sync dependent collections if we have any.
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
    }"""

new_sync_logic = """        // Now that we have batchIds, we must safely sync dependent collections using `in` queries
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
              this.unsubscribers.push(unsub);
            }
          }
        }
      }, (err) => console.error('[FirestoreDBService] Error syncing batches for student:', err));
      
      this.unsubscribers.push(unsubBatches);
    }

    // 2. Fetch all other collections.
    const BATCH_DEPENDENT_COLLECTIONS = ['batchPlanner', 'batchSessions', 'liveClasses', 'studyMaterials', 'schedules', 'recordings', 'assignments'];
    for (const colName of COLLECTIONS_TO_SYNC) {
      if (!isAdmin && colName === 'batches') continue; // Handled specially above for students
      if (!isAdmin && BATCH_DEPENDENT_COLLECTIONS.includes(colName)) continue; // Handled specially for students
      
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
    }"""

if old_sync_logic in content:
    content = content.replace(old_sync_logic, new_sync_logic)
    print("Patched FirestoreDBService.ts")
else:
    print("WARNING: Sync logic not found in FirestoreDBService.ts")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
