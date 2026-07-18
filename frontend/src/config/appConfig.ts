/**
 * Central application configuration.
 * Every module must import configuration ONLY from this file.
 * No scattered import.meta.env across the codebase.
 */

const appConfig = {
  // Backend API
  apiUrl: import.meta.env.VITE_API_URL as string,

  // Firebase Client SDK
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
  },

  // Company branding (from env — no hardcoded values)
  company: {
    name: import.meta.env.VITE_COMPANY_NAME || 'Sri Vihaan SAP Consulting',
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || '',
    supportPhone: import.meta.env.VITE_SUPPORT_PHONE || '',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  },

  // Social media
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL || '',
    instagram: import.meta.env.VITE_INSTAGRAM_URL || '',
    linkedin: import.meta.env.VITE_LINKEDIN_URL || '',
    youtube: import.meta.env.VITE_YOUTUBE_URL || '',
  },
} as const;

export default appConfig;
