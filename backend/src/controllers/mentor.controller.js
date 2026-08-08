const { db } = require('../config/firebase');

const mentorIdForEmail = (email) => String(email || '').trim().toLowerCase();

/** Admin authorization is intentionally email-first: a Google UID does not exist
 * until the mentor completes their first sign-in. */
exports.authorizeEmail = async (req, res) => {
  try {
    const email = mentorIdForEmail(req.body.email);
    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Gmail address.' });
    }
    const ref = db.collection('mentors').doc(email);
    const existing = await ref.get();
    if (!existing.exists) {
      await ref.set({
        uid: null, email, name: '', phone: '', photoURL: '', designation: '',
        assignedBatchIds: [], status: 'active', createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await ref.update({ status: existing.data().status || 'active', updatedAt: new Date().toISOString() });
    }
    return res.json({ success: true, id: email, created: !existing.exists });
  } catch (error) {
    console.error('Mentor email authorization failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to authorize mentor email.' });
  }
};

/** Validates the signed-in Google account and binds its UID to the admin record. */
exports.getMyMentorSession = async (req, res) => {
  try {
    const email = mentorIdForEmail(req.user.email);
    const ref = db.collection('mentors').doc(email);
    const snapshot = await ref.get();
    if (!snapshot.exists || snapshot.data().status !== 'active') {
      return res.status(403).json({ success: false, message: 'This Google account is not authorized as a mentor. Please contact the administrator.' });
    }
    const mentor = snapshot.data();
    if (mentor.uid && mentor.uid !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'This Google account is not authorized as a mentor. Please contact the administrator.' });
    }
    if (!mentor.uid) {
      await ref.update({ uid: req.user.uid, updatedAt: new Date().toISOString() });
      mentor.uid = req.user.uid;
    }
    return res.json({ success: true, data: { id: snapshot.id, ...mentor } });
  } catch (error) {
    console.error('Mentor session validation failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to verify mentor access.' });
  }
};
