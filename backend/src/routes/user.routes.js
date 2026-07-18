const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyAuth, requireRole } = require('../middleware/auth.middleware');

// Publicly accessible (for authenticated users) to get their own role
router.get('/me/role', verifyAuth, userController.getMyRole);

// All other user management routes require admin access
router.use(verifyAuth, requireRole('admin'));

router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);

module.exports = router;
