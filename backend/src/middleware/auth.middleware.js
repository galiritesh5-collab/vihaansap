const jwt = require('jsonwebtoken');
const { admin } = require('../config/firebase');

exports.verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Try verifying as Admin custom JWT first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'admin') {
        req.user = decoded;
        return next();
      }
    } catch (jwtErr) {
      // If it's not a valid Admin JWT, it might be a Firebase Auth token.
      // If Firebase Admin SDK is not initialized properly, we can't verify Firebase tokens.
      if (!admin || admin.apps.length === 0) {
        return res.status(500).json({ success: false, message: 'Server configuration error: Firebase Admin SDK not initialized' });
      }

      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        return next();
      } catch (firebaseErr) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication' });
  }
};
