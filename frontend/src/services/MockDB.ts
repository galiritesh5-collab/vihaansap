import { SAP_COURSES, STUDENT_REVIEWS, FAQS, MOCK_SCHEDULES, MOCK_RECORDINGS, MOCK_ASSIGNMENTS, MOCK_PAYMENTS } from '../data';
import { MOCK_STUDENTS, MOCK_MENTORS, MOCK_BATCHES, MOCK_BLOGS, MOCK_DOUBTS } from '../admin/mock/data';
import { BLOGS } from '../data/blogs';
import { DatabaseSchema } from '../lib/mockdb/schema';
export type { DatabaseSchema };

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialBlogs = BLOGS.map((b, i) => ({
  id: 'blog-' + (i + 1),
  title: b.title,
  author: b.author,
  date: b.date,
  status: 'Published',
  content: b.content,
  coverImage: b.image,
  shortDescription: b.preview,
  slug: b.slug,
  categories: [],
  tags: [],
  featured: false
}));

const initialData: DatabaseSchema = {
  courses: SAP_COURSES,
  students: MOCK_STUDENTS,
  mentors: MOCK_MENTORS,
  batches: MOCK_BATCHES,
  batchPlanner: [],
  batchSessions: [],
  studyMaterials: [],
  sessionFeedback: [],
  courseRatings: [],
  blogs: initialBlogs,
  reviews: [...STUDENT_REVIEWS],
  faqs: FAQS,
  schedules: MOCK_SCHEDULES,
  recordings: MOCK_RECORDINGS,
  assignments: MOCK_ASSIGNMENTS,
  payments: MOCK_PAYMENTS,
  doubts: MOCK_DOUBTS,
  notifications: [],
  events: [],
  leads: [],
  websiteContent: {
    heroTitle: "Master SAP With Real-Time Scenarios",
    heroSubtitle: "Premium Live Training by Industry Experts. Accelerate your career with real-world scenarios, hands-on server access, and expert placement guidance.",
    contactEmail: "info@srivihaansap.com",
    contactPhone: "+91 98765 43210"
  },
  serverEnquiries: [],
  accounts: [],
  serverPayments: []
};

// In-memory cache for immediate UI rendering (optimistic UI)
let cachedDB: DatabaseSchema = { ...initialData };
let isSynced = false;

import { auth, db as firestoreDb } from '../config/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const getHeaders = async () => {
  const headers: any = { 'Content-Type': 'application/json' };
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export class MockDB {
  static async initAsync() {
    if (isSynced) return;
    try {
      await fetch(`${API_URL}/db/sync`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(initialData)
      });
      const res = await fetch(`${API_URL}/db/all`, { headers: await getHeaders() });
      const json = await res.json();
      if (json.success && json.data) {
        cachedDB = { ...cachedDB, ...json.data };
      }
    } catch (err) {
      console.warn('Backend not reachable, falling back to local memory.', err);
    } finally {
      // Always start Firestore real-time sync whether mock backend works or not
      import('./FirestoreDBService').then(m => {
        m.FirestoreDBService.subscribeToAll();
      });
      isSynced = true;
      window.dispatchEvent(new Event('db_updated'));
    }
  }

  static get(): DatabaseSchema {
    if (!isSynced) {
      // Fire async init in background
      this.initAsync();
    }
    return cachedDB;
  }

  static set(data: DatabaseSchema) {
    cachedDB = data;
    window.dispatchEvent(new Event('db_updated'));
  }

  // Generic CRUD using Backend APIs
  static getCollection<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    return this.get()[collection];
  }

  static async updateCollection(collectionName: keyof DatabaseSchema, newData: any[]) {
    // Optimistic UI update
    const db = this.get();
    (db[collectionName] as any) = newData;
    this.set(db);
  }

  static async addItem(collection: keyof DatabaseSchema, item: any) {
    item.id = item.id || Math.random().toString(36).substr(2, 9);
    // Optimistic UI update
    const db = this.get();
    (db[collection] as any[]).push(item);
    this.set(db);

    // Backend update (now handled by Firebase Admin SDK on the server)
    try {
      await fetch(`${API_URL}/db/${String(collection)}`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(item)
      });
    } catch (err) {
      console.warn('Backend not reachable for addItem');
    }
  }

  static async updateItem(collection: keyof DatabaseSchema, id: string, item: any) {
    // Optimistic UI update
    const db = this.get();
    const index = (db[collection] as any[]).findIndex(i => (i.id === id || i.uid === id));
    if (index > -1) {
      (db[collection] as any[])[index] = { ...((db[collection] as any[])[index]), ...item };
      this.set(db);
    }

    // Backend update (now handled by Firebase Admin SDK on the server)
    try {
      await fetch(`${API_URL}/db/${String(collection)}/${id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(item)
      });
    } catch (err) {
      console.warn('Backend not reachable for updateItem');
    }
  }

  static async deleteItem(collection: keyof DatabaseSchema, id: string) {
    // Optimistic UI update
    const db = this.get();
    (db[collection] as any[]) = (db[collection] as any[]).filter(i => (i.id !== id && i.uid !== id));
    this.set(db);

    // Backend update (now handled by Firebase Admin SDK on the server)
    try {
      await fetch(`${API_URL}/db/${String(collection)}/${id}`, {
        method: 'DELETE',
        headers: await getHeaders()
      });
    } catch (err) {
      console.warn('Backend not reachable for deleteItem');
    }
  }
}
