const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin credentials loaded from environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASS) {
      return res.status(500).json({ success: false, message: 'Admin credentials not configured on server.' });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      // Create a signed JWT using the JWT_SECRET from env
      const token = jwt.sign(
        { role: 'admin', email: ADMIN_EMAIL },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: 'admin-1',
          name: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin'

        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};
