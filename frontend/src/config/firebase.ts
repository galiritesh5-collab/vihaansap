import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app = null;
let authObj = null;
let dbObj = null;
let analyticsObj = null;
let storageObj = null;

try {
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_api_key' &&
    firebaseConfig.apiKey !== 'undefined'
  ) {
    app = initializeApp(firebaseConfig);
    authObj = getAuth(app);
    dbObj = getFirestore(app);
    storageObj = getStorage(app);
    if (typeof window !== 'undefined') {
      analyticsObj = getAnalytics(app);
    }
  } else {
    console.warn('Firebase API key is missing. Authentication will be disabled.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export const auth = authObj as any;
export const db = dbObj as any;
export const storage = storageObj as any;
export const analytics = analyticsObj;
