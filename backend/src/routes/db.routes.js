const express = require('express');
const router = express.Router();
const dbController = require('../controllers/db.controller');
const { verifyAuth } = require('../middleware/auth.middleware');

// Public read/init routes - called by frontend on boot before any user is authenticated
router.post('/sync', dbController.syncDatabase);   // frontend calls this on init (no token yet)
router.get('/all', dbController.getAll);            // public read for initial data load
router.get('/:collection', dbController.getCollection); // public read

// Protected write routes - require valid Admin JWT or Firebase ID token
router.post('/:collection', verifyAuth, dbController.createDocument);
router.put('/:collection/:id', verifyAuth, dbController.updateDocument);
router.delete('/:collection/:id', verifyAuth, dbController.deleteDocument);

module.exports = router;
