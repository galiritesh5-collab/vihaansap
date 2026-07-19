const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/firebase');

const router = express.Router();
const PUBLIC_SUBMISSIONS = {
  leads: 'leads',
  'server-enquiries': 'serverEnquiries',
};

function cleanSubmission(body) {
  if (!body || typeof body !== 'object') return null;
  const value = { ...body };
  delete value.id;
  delete value.uid;
  for (const [key, field] of Object.entries(value)) {
    if (typeof field === 'string') value[key] = field.trim().slice(0, 4000);
  }
  return value;
}

router.post('/:type', async (req, res, next) => {
  try {
    const collectionName = PUBLIC_SUBMISSIONS[req.params.type];
    const submission = cleanSubmission(req.body);
    if (!collectionName || !submission || !submission.name || !submission.email) {
      return res.status(400).json({ success: false, error: 'A name and email address are required.' });
    }
    if (!db) return res.status(503).json({ success: false, error: 'Firestore not initialized' });

    const id = uuidv4();
    const data = {
      ...submission,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: submission.status || 'New',
    };
    await db.collection(collectionName).doc(id).set(data);
    return res.status(201).json({ success: true, data: { id } });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
