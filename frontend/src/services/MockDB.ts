import { DatabaseSchema } from '../lib/mockdb/schema';
export type { DatabaseSchema };

const API_URL = import.meta.env.VITE_API_URL;

const initialData: DatabaseSchema = {
  courses: [],
  students: [],
  mentors: [],
  batches: [],
  batchPlanner: [],
  batchSessions: [],
  liveClasses: [],
  studyMaterials: [],
  sessionFeedback: [],
  courseRatings: [],
  blogs: [],
  reviews: [],
  reviewCampaigns: [],
  faqs: [],
  schedules: [],
  recordings: [],
  assignments: [],
  payments: [],
  doubts: [],
  doubtReplies: [],
  notifications: [],
  events: [],
  leads: [],
  websiteContent: {
    heroTitle: "Master SAP With Real-Time Scenarios",
    heroSubtitle: "Premium Live Training by Industry Experts.",
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
import { FirestoreDBService } from './FirestoreDBService';

// Get auth token (works for admin, mentor, student since all use Firebase Auth)
const getHeaders = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.warn("Failed to get Firebase token for MockDB sync");
    }
  }

  return headers;
};

export class MockDB {
  static async initAsync() {
    if (isSynced) return;
    try {
      const res = await fetch(`${API_URL}/db/public`);
      const json = await res.json();
      if (json.success && json.data) {
        cachedDB = { ...cachedDB, ...json.data };
      }
    } catch (err) {
      console.warn('Backend not reachable, falling back to local memory.', err);
    } finally {
      isSynced = true;
      window.dispatchEvent(new Event('db_updated'));
    }
  }

  /** Load protected operational data after the backend has verified an admin. */
  static async loadAdminData() {
    try {
      const res = await fetch(`${API_URL}/db/all`, { headers: await getHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Unable to load CMS data');
      cachedDB = { ...cachedDB, ...json.data };
      this.set(cachedDB);
    } catch (err) {
      console.error('Unable to load protected CMS data', err);
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

    // Instead of relying on backend REST endpoints (which are admin-only), 
    // directly write to Firestore using client SDK. This ensures no MockDB isolation.
    try {
      await FirestoreDBService.upsert(collection, item.id, item);
    } catch (err) {
      console.warn('Failed to sync addItem to Firestore:', err);
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

    try {
      await FirestoreDBService.upsert(collection, id, item);
    } catch (err) {
      console.warn('Failed to sync updateItem to Firestore:', err);
    }
  }

  
  static async deleteItem(collection: keyof DatabaseSchema, id: string) {
    // Optimistic UI update
    const db = this.get();
    (db[collection] as any[]) = (db[collection] as any[]).filter(i => (i.id !== id && i.uid !== id));
    this.set(db);

    try {
      await FirestoreDBService.delete(collection, id);
    } catch (err) {
      console.warn('Failed to sync deleteItem to Firestore:', err);
    }
  }
}
