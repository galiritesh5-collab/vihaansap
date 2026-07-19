#!/usr/bin/env node
/* Seed CMS data from a reviewed JSON backup; refuses to overwrite non-empty collections by default. */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { db } = require('../src/config/firebase');

async function main() {
  const input = process.argv[2];
  if (!input) throw new Error('Usage: npm run firestore:seed -- backups/cms.json');
  if (!db) throw new Error('Firestore Admin SDK is not configured.');
  const source = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), input), 'utf8'));
  for (const [name, records] of Object.entries(source.collections || source)) {
    if (!Array.isArray(records) || !records.length) continue;
    const existing = await db.collection(name).limit(1).get();
    if (!existing.empty) {
      console.log(`Skipped ${name}: collection already contains data.`);
      continue;
    }
    for (let offset = 0; offset < records.length; offset += 450) {
      const batch = db.batch();
      records.slice(offset, offset + 450).forEach((record) => {
        const { id, ...data } = record;
        if (!id) throw new Error(`Missing document id in ${name}`);
        batch.set(db.collection(name).doc(id), data);
      });
      await batch.commit();
    }
    console.log(`Seeded ${records.length} ${name} records.`);
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
