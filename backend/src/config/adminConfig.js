/**
 * PERMANENT ADMIN CONFIGURATION
 * ============================================================
 * Admin access is controlled entirely by this file.
 * No Firestore query is used to determine admin access.
 *
 * To add or remove an administrator:
 *   1. Edit the ADMIN_EMAILS array below.
 *   2. Redeploy the backend.
 *
 * No database changes. No UI changes. No code changes elsewhere.
 * ============================================================
 */

const ADMIN_EMAILS = [
  'riteshgali45@gmail.com',
  'vihaansapconsultancy@gmail.com',
];

/**
 * Returns true if the given email belongs to an admin.
 * @param {string | null | undefined} email
 * @returns {boolean}
 */
function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

module.exports = { ADMIN_EMAILS, isAdminEmail };
