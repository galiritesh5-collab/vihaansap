const { admin, db } = require('../config/firebase');
const { isAdminEmail } = require('../config/adminConfig');

/**
 * verifyAuth — Verifies Firebase ID Token sent from the frontend.
 * Sets req.user = { uid, email, name, ... } on success.
 */
exports.verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    if (!admin || admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Firebase Admin SDK not initialized',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // { uid, email, name, picture, ... }
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
 * requireRole — Middleware factory that checks if the authenticated user has the required role.
 *
 * For 'admin':
 *   Checks email against ADMIN_EMAILS in adminConfig.js. Zero Firestore reads.
 *
 * For 'mentor':
 *   Reads Firestore users/{uid}.role and checks for 'mentor'.
 *
 * Usage:
 *   router.get('/...', verifyAuth, requireRole('admin'), handler)
 *   router.get('/...', verifyAuth, requireRole('mentor'), handler)
 */
exports.requireRole = (requiredRole) => async (req, res, next) => {
  try {
    const email = req.user?.email || '';
    const uid   = req.user?.uid;

    // ── Admin: purely email-based, no Firestore ───────────────────────────────
    if (requiredRole === 'admin') {
      if (isAdminEmail(email)) {
        req.userRole = 'admin';
        return next();
      }
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Administrator access required.',
      });
    }

    // ── Mentor / Student: Firestore lookup ────────────────────────────────────
    if (!db) {
      return res.status(500).json({ success: false, message: 'Firestore not initialized' });
    }

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(403).json({ success: false, message: 'Forbidden: User not found in Firestore' });
    }

    const { role } = userDoc.data();

    if (role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires role '${requiredRole}', found '${role}'`,
      });
    }

    req.userRole = role;
    return next();
  } catch (err) {
    console.error('requireRole middleware error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during authorization' });
  }
};
