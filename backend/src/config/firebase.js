const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const config = require('./config');

let db = null;

try {
  const { projectId, clientEmail, privateKey, storageBucket } = config.firebase;

  // Startup diagnostic logging
  console.log('=== Firebase Admin SDK Initialization ===');
  console.log(`FIREBASE_PROJECT_ID: ${projectId || 'NOT SET'}`);
  console.log(`FIREBASE_CLIENT_EMAIL: ${clientEmail ? clientEmail.substring(0, 20) + '...' : 'NOT SET'}`);
  console.log(`FIREBASE_PRIVATE_KEY: ${privateKey ? 'SET (length: ' + privateKey.length + ')' : 'NOT SET'}`);

  if (projectId && clientEmail && privateKey) {
    let app;
    if (admin.apps.length === 0) {
      app = admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket,
      });
      console.log(`Firebase Admin SDK initialized. Project: ${projectId}`);
    } else {
      console.log('Firebase Admin SDK already initialized. Reusing existing app.');
      app = admin.apps[0];
    }
    db = getFirestore(app);
    console.log('Firestore client created via Admin SDK.');
  } else {
    console.warn('=== FIREBASE CREDENTIALS MISSING ===');
    console.warn('Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in environment.');
  }
} catch (error) {
  console.error('=== FIREBASE INIT ERROR ===');
  console.error('Message:', error.message);
}

module.exports = { admin, db };
