const { db } = require('../config/firebase');
const { isAdminEmail } = require('../config/adminConfig');

exports.getAllUsers = async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Firestore not initialized' });
    }
    const snapshot = await db.collection('users').get();
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * GET /api/users/me/role
 *
 * Role resolution order:
 *   1. If the authenticated user's email is in ADMIN_EMAILS → role = 'admin' (no Firestore needed)
 *   2. If Firestore has a document for the user with role = 'mentor' → role = 'mentor'
 *   3. Otherwise → role = 'student'  (auto-create Firestore document on first login)
 */
exports.getMyRole = async (req, res) => {
  try {
    const email = req.user.email || '';
    const uid   = req.user.uid;

    // ── Step 1: Admin check (email-based, no Firestore) ──────────────────────
    if (isAdminEmail(email)) {
      console.log(`[getMyRole] Admin access granted for ${email}`);
      return res.status(200).json({ success: true, role: 'admin' });
    }

    // ── Step 2: Firestore lookup for mentor / student ─────────────────────────
    if (!db) {
      // Firestore unavailable — default to student so the user is not locked out
      console.warn('[getMyRole] Firestore not initialized — defaulting role to student');
      return res.status(200).json({ success: true, role: 'student' });
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const data = userDoc.data();
      // If a Firestore document says 'mentor' — honour it.
      // Even if someone manually set 'admin' in Firestore, it is ignored here;
      // admin access is controlled exclusively by adminConfig.js.
      const firestoreRole = data.role === 'mentor' ? 'mentor' : 'student';
      console.log(`[getMyRole] Firestore role for ${email}: ${firestoreRole}`);
      return res.status(200).json({ success: true, role: firestoreRole });
    }

    // ── Step 3: First-ever login — create a student document ─────────────────
    const newRole = 'student';
    await userRef.set({
      email: email,
      name: req.user.name || '',
      role: newRole,
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    console.log(`[getMyRole] New student document created for ${email}`);
    return res.status(200).json({ success: true, role: newRole });

  } catch (error) {
    console.error('Error in getMyRole:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * PUT /api/users/:id/role
 * Admin-only: update a user's role in Firestore.
 * Admins cannot have their role changed via this endpoint —
 * admin status is controlled by adminConfig.js only.
 */
exports.updateUserRole = async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Firestore not initialized' });
    }

    const userId = req.params.id;
    const { role } = req.body; // 'mentor' or 'student'

    if (!['mentor', 'student'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed values: 'mentor', 'student'. Admin access is controlled by server configuration.",
      });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent accidentally writing 'admin' into Firestore for an admin email
    const targetEmail = userDoc.data().email || '';
    if (isAdminEmail(targetEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts are managed via server configuration and cannot be modified here.',
      });
    }

    await userRef.update({ role });

    return res.status(200).json({ success: true, message: `Role updated to ${role}` });
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
