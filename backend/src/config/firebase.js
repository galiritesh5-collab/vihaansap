const admin = require('firebase-admin');

let db = null;

try {
  // If the required environment variables are present, initialize the Admin SDK using cert object
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle newline characters in the private key from env variables
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    // If running without credentials (e.g., local dev testing without secrets or Render default),
    // warn and initialize an empty or default app if needed, though without credentials Firestore calls will fail.
    console.warn('Firebase Admin credentials missing. Make sure to set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
    // You can also initialize with default credentials if running on GCP/Firebase environments:
    // admin.initializeApp();
  }
  
  if (admin.apps.length > 0) {
    db = admin.firestore();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

module.exports = { admin, db };
