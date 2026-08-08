import { collection, doc, documentId, getDoc, onSnapshot, query, setDoc, serverTimestamp, where, type Unsubscribe } from 'firebase/firestore';
import appConfig from '../config/appConfig';
import { auth, db } from '../config/firebase';

export interface MentorRecord {
  id: string; uid: string | null; email: string; name: string; phone: string;
  photoURL: string; designation: string; assignedBatchIds: string[];
  status: 'active' | 'disabled'; createdAt?: string; updatedAt?: string;
}

export const mentorDocumentId = (email: string) => email.trim().toLowerCase();

async function mentorHeaders() {
  if (!auth.currentUser) throw new Error('Not authenticated');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${await auth.currentUser.getIdToken()}` };
}

export const MentorService = {
  async authorizeEmail(email: string) {
    const response = await fetch(`${appConfig.apiUrl}/users/mentor/authorize-email`, {
      method: 'POST', headers: await mentorHeaders(), body: JSON.stringify({ email }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.success) throw new Error(payload.message || 'Unable to authorize mentor email.');
    return payload;
  },
  async validateSession(): Promise<MentorRecord> {
    const response = await fetch(`${appConfig.apiUrl}/users/mentor/session`, { method: 'POST', headers: await mentorHeaders() });
    const payload = await response.json();
    if (!response.ok || !payload.success) throw new Error(payload.message || 'This Google account is not authorized as a mentor. Please contact the administrator.');
    return payload.data;
  },
  subscribeAdmin(callback: (mentors: MentorRecord[]) => void, onError: (error: Error) => void): Unsubscribe {
    return onSnapshot(collection(db, 'mentors'), snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as MentorRecord))), onError);
  },
  subscribeMine(email: string, callback: (mentor: MentorRecord | null) => void, onError: (error: Error) => void): Unsubscribe {
    return onSnapshot(doc(db, 'mentors', mentorDocumentId(email)), snap => callback(snap.exists() ? { id: snap.id, ...snap.data() } as MentorRecord : null), onError);
  },
  subscribeAssignedBatches(mentor: MentorRecord, callback: (batches: any[]) => void, onError: (error: Error) => void): Unsubscribe {
    if (!mentor.assignedBatchIds.length) { callback([]); return () => undefined; }
    // Security rules re-check each returned batch; this query does not grant access.
    return onSnapshot(query(collection(db, 'batches'), where(documentId(), 'in', mentor.assignedBatchIds.slice(0, 10))), snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
  },
  async getBatch(batchId: string) {
    const snap = await getDoc(doc(db, 'batches', batchId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },
  async saveAdmin(record: Partial<MentorRecord> & { email: string }) {
    const id = mentorDocumentId(record.email);
    const existing = await getDoc(doc(db, 'mentors', id));
    await setDoc(doc(db, 'mentors', id), {
      ...record, email: id, uid: existing.exists() ? existing.data().uid || null : null,
      status: record.status || 'active', updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    }, { merge: true });
  },
};
