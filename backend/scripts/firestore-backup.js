#!/usr/bin/env node
/* Export Firestore to a portable JSON file. Usage: npm run firestore:backup -- backups/cms.json */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { db } = require('../src/config/firebase');

const collections = ['courses', 'blogs', 'reviews', 'faqs', 'students', 'mentors', 'batches', 'leads', 'serverEnquiries', 'accounts', 'payments', 'users'];

async function main() {
  if (!db) throw new Error('Firestore Admin SDK is not configured. Set the FIREBASE_* service-account variables.');
  const output = path.resolve(process.cwd(), process.argv[2] || `backups/firestore-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  const data = { exportedAt: new Date().toISOString(), collections: {} };
  for (const name of collections) {
    const snapshot = await db.collection(name).get();
    data.collections[name] = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
  }
  for (const id of ['branding', 'serverAccess', 'website']) {
    const snapshot = await db.collection('config').doc(id).get();
    if (snapshot.exists) data.collections.config = [...(data.collections.config || []), { id, ...snapshot.data() }];
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(data, null, 2));
  console.log(`Backup written to ${output}`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
