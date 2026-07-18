const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyAuth, requireRole } = require('../middleware/auth.middleware');

// All user management routes require admin access
router.use(verifyAuth, requireRole('admin'));

router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);

module.exports = router;
