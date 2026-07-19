const express = require('express');
const router = express.Router();
const dbController = require('../controllers/db.controller');
const { verifyAuth, requireRole } = require('../middleware/auth.middleware');

// The marketing site needs only these explicitly public CMS collections.
router.get('/public', dbController.getPublicContent);

// The complete CMS dataset and every mutation are administrator-only.
router.get('/all', verifyAuth, requireRole('admin'), dbController.getAll);
router.get('/:collection', verifyAuth, requireRole('admin'), dbController.getCollection);
router.post('/:collection', verifyAuth, requireRole('admin'), dbController.createDocument);
router.put('/:collection/:id', verifyAuth, requireRole('admin'), dbController.updateDocument);
router.delete('/:collection/:id', verifyAuth, requireRole('admin'), dbController.deleteDocument);

module.exports = router;
