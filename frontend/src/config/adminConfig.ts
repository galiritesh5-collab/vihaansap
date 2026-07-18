/**
 * PERMANENT ADMIN CONFIGURATION — Frontend Mirror
 * ============================================================
 * This list MUST match backend/src/config/adminConfig.js exactly.
 *
 * The backend is the security authority — this is only used as a
 * client-side fast path to avoid an unnecessary API round-trip.
 * The backend always makes the final role determination.
 * ============================================================
 */

export const ADMIN_EMAILS: string[] = [
  'riteshgali45@gmail.com',
  'vihaansapconsultancy@gmail.com',
];

/**
 * Returns true if the given email belongs to an admin.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
