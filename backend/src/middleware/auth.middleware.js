const { admin, db } = require('../config/firebase');

/**
 * verifyAuth — Verifies Firebase ID Token (from frontend auth.currentUser.getIdToken()).
 * No custom JWT. No hardcoded credentials.
 * Works for Admin, Mentor, and Student because Firebase issues tokens for all roles.
 */
exports.verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    if (!admin || admin.apps.length === 0) {
      return res.status(500).json({ success: false, message: 'Server configuration error: Firebase Admin SDK not initialized' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // { uid, email, ... }
      return next();
    } catch (firebaseErr) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired Firebase token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication' });
  }
};

/**
 * requireRole — Middleware factory that verifies the user has a specific Firestore role.
 * Usage: router.delete('/...', verifyAuth, requireRole('admin'), handler)
 */
exports.requireRole = (requiredRole) => async (req, res, next) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Firestore not initialized' });
    }
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(403).json({ success: false, message: 'Forbidden: User not found in Firestore' });
    }
    const { role } = userDoc.data();
    if (role !== requiredRole) {
      return res.status(403).json({ success: false, message: `Forbidden: Requires role '${requiredRole}', found '${role}'` });
    }
    req.userRole = role;
    return next();
  } catch (err) {
    console.error('requireRole middleware error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during authorization' });
  }
};
