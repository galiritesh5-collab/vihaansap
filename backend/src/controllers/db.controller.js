const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

// Note: The frontend fetches everything on initial load using 'sync' and 'all'.
// With Firebase, doing a full dump of the database might be slow, but to maintain
// 100% existing functionality for the frontend's MockDB initialization, we will
// fetch all required collections from Firestore.

const COLLECTIONS = [
  'courses', 'students', 'mentors', 'batches', 'batchPlanner', 'batchSessions',
  'studyMaterials', 'sessionFeedback', 'courseRatings', 'blogs', 'reviews', 'reviewCampaigns',
  'faqs', 'schedules', 'recordings', 'assignments', 'payments', 'doubts',
  'notifications', 'events', 'leads', 'serverEnquiries', 'accounts', 'serverPayments'
];

const PUBLIC_COLLECTIONS = ['courses', 'blogs', 'reviews', 'faqs'];
const ALLOWED_COLLECTIONS = new Set(COLLECTIONS);

function isAllowedCollection(collectionName) {
  return typeof collectionName === 'string' && ALLOWED_COLLECTIONS.has(collectionName);
}

exports.getPublicContent = async (req, res, next) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'Firestore not initialized' });

    const data = {};
    await Promise.all(PUBLIC_COLLECTIONS.map(async (collectionName) => {
      const snapshot = await db.collection(collectionName).get();
      data[collectionName] = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
    }));
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'Firestore not initialized' });

    const data = {};
    
    // Fetch all collections in parallel to speed up initial load
    const promises = COLLECTIONS.map(async (collectionName) => {
      const snapshot = await db.collection(collectionName).get();
      data[collectionName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
    
    await Promise.all(promises);

    // Also fetch the single document configs if needed, though frontend uses useBrandingConfig etc directly.
    // We'll return the structure MockDB expects.
    
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getCollection = async (req, res, next) => {
  try {
    const { collection } = req.params;
    if (!isAllowedCollection(collection)) {
      return res.status(404).json({ success: false, error: 'Unknown collection' });
    }
    if (!db) return res.status(500).json({ success: false, error: 'Firestore not initialized' });

    const snapshot = await db.collection(collection).get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createDocument = async (req, res, next) => {
  try {
    const { collection } = req.params;
    if (!isAllowedCollection(collection)) {
      return res.status(404).json({ success: false, error: 'Unknown collection' });
    }
    if (!db) return res.status(500).json({ success: false, error: 'Firestore not initialized' });

    const newItem = { ...req.body, createdAt: req.body.createdAt || new Date().toISOString() };
    const docId = newItem.id || newItem.uid || uuidv4();
    newItem.id = docId; // ensure id is set
    
    // Use set with merge to create or update if it exists
    await db.collection(collection).doc(docId).set({
      ...newItem,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    next(err);
  }
};

exports.updateDocument = async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    if (!isAllowedCollection(collection)) {
      return res.status(404).json({ success: false, error: 'Unknown collection' });
    }
    if (!db) return res.status(500).json({ success: false, error: 'Firestore not initialized' });

    await db.collection(collection).doc(id).set({
      ...req.body,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Return the body as updated data (approximation for frontend expectations)
    res.status(200).json({ success: true, data: { id, ...req.body } });
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    if (!isAllowedCollection(collection)) {
      return res.status(404).json({ success: false, error: 'Unknown collection' });
    }
    if (!db) return res.status(500).json({ success: false, error: 'Firestore not initialized' });

    await db.collection(collection).doc(id).delete();
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.syncDatabase = async (req, res, next) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'Firestore not initialized' });

    const fullState = req.body;
    
    // Allows frontend to send its initial local storage seed data if backend is empty.
    // In an enterprise environment, you only want to do this if Firestore is completely empty.
    // For safety, we will check if a key collection (e.g., courses) has data. If it has data, we skip sync.
    const coursesSnap = await db.collection('courses').limit(1).get();
    
    if (coursesSnap.empty) {
      console.log('Firestore appears empty. Seeding from frontend payload...');
      // Use batched writes for efficient seeding
      let batch = db.batch();
      let operationCount = 0;
      
      for (const key of Object.keys(fullState)) {
        if (Array.isArray(fullState[key])) {
          for (const item of fullState[key]) {
            const docId = item.id || item.uid || uuidv4();
            item.id = docId;
            const docRef = db.collection(key).doc(docId);
            batch.set(docRef, item, { merge: true });
            operationCount++;
            
            // Firestore batches have a limit of 500 operations
            if (operationCount >= 450) {
              await batch.commit();
              batch = db.batch();
              operationCount = 0;
            }
          }
        }
      }
      
      if (operationCount > 0) {
        await batch.commit();
      }
      return res.status(200).json({ success: true, message: 'Database seeded to Firestore' });
    }

    res.status(200).json({ success: true, message: 'Database already has data. Sync skipped.' });
  } catch (err) {
    next(err);
  }
};
