#!/usr/bin/env node
/* Restore a backup created by firestore-backup.js. Existing documents are merged, never deleted. */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { db } = require('../src/config/firebase');

async function main() {
  const input = process.argv[2];
  if (!input) throw new Error('Usage: npm run firestore:restore -- backups/file.json');
  if (!db) throw new Error('Firestore Admin SDK is not configured.');
  const backup = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), input), 'utf8'));
  for (const [name, documents] of Object.entries(backup.collections || {})) {
    if (!Array.isArray(documents)) continue;
    for (let offset = 0; offset < documents.length; offset += 450) {
      const batch = db.batch();
      documents.slice(offset, offset + 450).forEach((record) => {
        const { id, ...data } = record;
        if (!id) throw new Error(`Missing document id in ${name}`);
        batch.set(db.collection(name).doc(id), data, { merge: true });
      });
      await batch.commit();
    }
  }
  console.log('Restore completed. No documents were deleted.');
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
