/**
 * Application route path constants.
 * Use these instead of hardcoded string literals.
 */

// Public website routes
export const ROUTES = {
  HOME: '/',
  WHY_VIHAAN: '/why-vihaan',
  COURSES: '/courses',
  REVIEWS: '/reviews',
  BLOGS: '/blogs',
  BLOG_DETAIL: '/blogs/:slug',
  FAQ: '/faq',
  ABOUT: '/about',
  SERVER_ACCESS: '/server-access',
  LOGIN: '/login',

  // Legal pages
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_CONDITIONS: '/terms-conditions',
  COOKIE_POLICY: '/cookie-policy',
  DISCLAIMER: '/disclaimer',
  REFUND_POLICY: '/refund-policy',

  // Student portal
  STUDENT_LOGIN: '/student-login',
  STUDENT: '/student',
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_COMPLETE_PROFILE: '/student/complete-profile',
  STUDENT_COURSES: '/student/courses',
  STUDENT_BATCH: '/student/batch/:batchId',
  STUDENT_RECORDINGS: '/student/recordings',
  STUDENT_MATERIALS: '/student/materials',
  STUDENT_DOUBTS: '/student/doubts',
  STUDENT_NOTIFICATIONS: '/student/notifications',
  STUDENT_CALENDAR: '/student/calendar',
  STUDENT_WEEKLY_PLANNER: '/student/weekly-planner',
  STUDENT_MORE_COURSES: '/student/more-courses',

  // Admin portal
  ADMIN_LOGIN: '/admin-login',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_LEADS: '/admin/leads',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_MENTORS: '/admin/mentors',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_BATCHES: '/admin/batches',
  ADMIN_BATCH_DETAIL: '/admin/batches/:batchId',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_FAQS: '/admin/faqs',
  ADMIN_CALENDAR: '/admin/calendar',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_DOUBTS: '/admin/doubts',
  ADMIN_SERVER_ACCESS: '/admin/server-access',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_BRANDING: '/admin/branding',
} as const;
