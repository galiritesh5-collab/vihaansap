#!/usr/bin/env node
/* One-time recovery migration from the repository's original static CMS datasets. */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const ts = require('../../frontend/node_modules/typescript');
const { db } = require('../src/config/firebase');

function loadModule(relativePath) {
  const source = fs.readFileSync(path.resolve(__dirname, '..', '..', relativePath), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('exports', 'module', output)(module.exports, module); // Static repository data only.
  return module.exports;
}

async function seedIfEmpty(name, records) {
  const existing = await db.collection(name).limit(1).get();
  if (!existing.empty) return console.log(`Skipped ${name}: collection already contains data.`);
  for (let offset = 0; offset < records.length; offset += 450) {
    const batch = db.batch();
    records.slice(offset, offset + 450).forEach((record, index) => {
      const id = String(record.id || record.slug || `${name}-${offset + index + 1}`);
      batch.set(db.collection(name).doc(id), { ...record, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    });
    await batch.commit();
  }
  console.log(`Recovered ${records.length} ${name} records.`);
}

async function seedConfig(id, data) {
  const ref = db.collection('config').doc(id);
  if ((await ref.get()).exists) return console.log(`Skipped config/${id}: document already exists.`);
  await ref.set({ ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  console.log(`Recovered config/${id}.`);
}

async function main() {
  if (!db) throw new Error('Firestore Admin SDK is not configured. Back up production first, then set FIREBASE_* variables.');
  const data = loadModule('frontend/src/data.ts');
  const blogSource = loadModule('frontend/src/data/blogs.ts');
  await seedIfEmpty('courses', data.SAP_COURSES || []);
  await seedIfEmpty('reviews', data.STUDENT_REVIEWS || []);
  await seedIfEmpty('faqs', data.FAQS || []);
  await seedIfEmpty('blogs', (blogSource.BLOGS || []).map((blog) => ({
    ...blog,
    id: blog.slug,
    status: 'Published',
    shortDescription: blog.preview,
    coverImage: blog.image,
  })));
  const shared = loadModule('frontend/src/types/shared.types.ts');
  await seedConfig('branding', shared.defaultBrandingConfig || {});
  await seedConfig('website', {
    heroTitle: 'Master SAP With Real-Time Scenarios',
    heroSubtitle: 'Premium Live Training by Industry Experts.',
    contactEmail: 'info@srivihaansap.com',
    contactPhone: '+91 98765 43210',
  });
  console.log('Static CMS recovery completed. Server Access retains the repository default and is created by the approved admin only.');
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
