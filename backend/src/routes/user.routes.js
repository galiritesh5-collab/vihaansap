const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const mentorController = require('../controllers/mentor.controller');
const { verifyAuth, requireRole } = require('../middleware/auth.middleware');

// Publicly accessible (for authenticated users) to get their own role
router.get('/me/role', verifyAuth, userController.getMyRole);

// Dedicated mentor authorization. These routes do not use the legacy users.role model.
router.post('/mentor/session', verifyAuth, mentorController.getMyMentorSession);

// All other user management routes require admin access
router.use(verifyAuth, requireRole('admin'));

router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);
router.post('/mentor/authorize-email', mentorController.authorizeEmail);

module.exports = router;
