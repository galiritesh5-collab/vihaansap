import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import appConfig from './appConfig';

const firebaseConfig = appConfig.firebase;

let app = null;
let authObj = null;
let dbObj = null;
let analyticsObj = null;
let storageObj = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined') {
    app = initializeApp(firebaseConfig);
    authObj = getAuth(app);
    dbObj = getFirestore(app);
    storageObj = getStorage(app);
    if (typeof window !== 'undefined') {
      analyticsObj = getAnalytics(app);
    }
  } else {
    console.warn('Firebase API key is missing. Set VITE_FIREBASE_* environment variables.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export const auth = authObj as any;
export const db = dbObj as any;
export const storage = storageObj as any;
export const analytics = analyticsObj;
