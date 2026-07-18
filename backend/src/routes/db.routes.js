const express = require('express');
const router = express.Router();
const dbController = require('../controllers/db.controller');
const { verifyAuth } = require('../middleware/auth.middleware');

// Public or selectively public routes (sync and all might need to be read-only open, 
// but sync is POST so it should probably be admin-only, but MockDB calls it on boot.
// For now, we secure create/update/delete.
router.post('/sync', verifyAuth, dbController.syncDatabase);
router.get('/all', dbController.getAll);
router.get('/:collection', dbController.getCollection);

// Protected routes (Only logged in users can modify data)
router.post('/:collection', verifyAuth, dbController.createDocument);
router.put('/:collection/:id', verifyAuth, dbController.updateDocument);
router.delete('/:collection/:id', verifyAuth, dbController.deleteDocument);

module.exports = router;
