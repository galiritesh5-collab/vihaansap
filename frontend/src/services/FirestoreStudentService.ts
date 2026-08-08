/**
 * FirestoreStudentService
 * ------------------------
 * Handles all Firestore operations for the students collection.
 * Each student's document ID is their Firebase Auth UID.
 *
 * Firestore path: students/{uid}
 */

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { MockDB } from './MockDB';

export class FirestoreStudentService {
  static readonly COLLECTION = 'students';

  // ─── Write / Upsert ──────────────────────────────────────────────────────

  /**
   * Called on first login OR profile save.
   * Creates the document if it doesn't exist, merges if it does.
   */
  static async upsertStudent(uid: string, data: Record<string, any>): Promise<void> {
    if (!db) {
      // Firestore not configured – fall back to MockDB only
      console.warn('[FirestoreStudentService] Firestore not available, using MockDB only.');
      return;
    }

    const ref = doc(db, this.COLLECTION, uid);
    const existing = await getDoc(ref);
    await setDoc(
      ref,
      {
        ...data,
        uid,
        ...(existing.exists() || data.createdAt ? {} : { createdAt: serverTimestamp() }),
        updatedAt: serverTimestamp(),
      },
      { merge: true }   // merge = never overwrite fields that already exist and aren't in `data`
    );
  }

  /**
   * Record the login event – update lastLogin, loginCount.
   * Only touches those three fields.
   */
  static async recordLogin(uid: string): Promise<void> {
    if (!db) return;
    const ref = doc(db, this.COLLECTION, uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      await updateDoc(ref, {
        lastLogin: serverTimestamp(),
        loginCount: (snap.data().loginCount || 0) + 1,
      });
    }
    // If doc doesn't exist yet, the Auth listener will create it when needed.
  }

  /**
   * Read a single student by UID.
   */
  static async getStudent(uid: string): Promise<Record<string, any> | null> {
    if (!db) return null;
    const ref = doc(db, this.COLLECTION, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  }

  /**
   * Update specific fields on a student document.
   * Used by the Admin Students page (course, batch, status, etc.).
   */
  static async updateStudent(uid: string, data: Record<string, any>): Promise<void> {
    if (!db) return;
    const ref = doc(db, this.COLLECTION, uid);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }

  // ─── Real-time Listener ──────────────────────────────────────────────────

  /**
   * Subscribe to the entire students collection.
   * Fires immediately with current data and on every subsequent change.
   *
   * Syncs all received documents into MockDB['students'] and dispatches
   * the 'db_updated' event so every component using useDB() re-renders.
   *
   * Returns an unsubscribe function.
   */
  static subscribeToAll(onError?: (err: Error) => void): () => void {
    if (!db) {
      console.warn('[FirestoreStudentService] Firestore not available, real-time sync disabled.');
      return () => {};
    }

    const col = collection(db, this.COLLECTION);

    const unsubscribe = onSnapshot(
      col,
      (snapshot) => {
        const firestoreStudents: any[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Merge Firestore students with MockDB (preserve non-Firestore mock students if any)
        const current = MockDB.get();
        const existingMockOnly = (current.students || []).filter(
          (s: any) => !s.uid || !firestoreStudents.some((fs) => fs.uid === s.uid)
        );

        const merged = [...existingMockOnly, ...firestoreStudents];
        (current as any).students = merged;
        MockDB.set(current);
      },
      (err) => {
        console.error('[FirestoreStudentService] Snapshot error:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  }
}
