/**
 * Central backend configuration.
 * Every backend module must import from this file only.
 * No scattered process.env reads across the codebase.
 */

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ? process.env.FIREBASE_PROJECT_ID.trim() : undefined,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? process.env.FIREBASE_CLIENT_EMAIL.trim() : undefined,
    // Handle both \n (local .env) and \\n (Render env vars) formats
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').trim()
      : undefined,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ? process.env.FIREBASE_STORAGE_BUCKET.trim() : undefined,
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },

  web3forms: {
    key: process.env.WEB3FORMS_KEY,
  },
};

module.exports = config;
