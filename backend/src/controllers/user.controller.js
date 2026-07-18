const { db } = require('../config/firebase');

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

exports.getMyRole = async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Firestore not initialized' });
    }
    const uid = req.user.uid;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const data = userDoc.data();
      return res.status(200).json({ success: true, role: data.role || 'student' });
    } else {
      // Create user if not exists
      const newRole = 'student';
      await userRef.set({
        email: req.user.email || '',
        name: req.user.name || '',
        role: newRole,
        createdAt: new Date().toISOString()
      });
      return res.status(200).json({ success: true, role: newRole });
    }
  } catch (error) {
    console.error('Error fetching/creating my role:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Firestore not initialized' });
    }

    const userId = req.params.id;
    const { role } = req.body; // 'admin', 'mentor', 'student'

    if (!['admin', 'mentor', 'student'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentRole = userDoc.data().role;

    // Admin Protection: Ensure at least one admin remains
    if (currentRole === 'admin' && role !== 'admin') {
      const adminsSnapshot = await db.collection('users').where('role', '==', 'admin').get();
      if (adminsSnapshot.size <= 1) {
        return res.status(403).json({ 
          success: false, 
          message: 'Cannot demote the last remaining administrator.' 
        });
      }
    }

    await userRef.update({ role });
    
    // Additional sync with MockDB mentors/students could happen here or in frontend

    return res.status(200).json({ success: true, message: `Role updated to ${role}` });
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
