import { useBrandingConfig } from './hooks/useBrandingConfig';
import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import DemoModal from './components/DemoModal';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
const WhyVihaan = lazy(() => import('./pages/WhyVihaan'));
const Courses = lazy(() => import('./pages/Courses'));
const Reviews = lazy(() => import('./pages/Reviews'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const About = lazy(() => import('./pages/About'));
const ServerAccess = lazy(() => import('./pages/ServerAccess'));
const SignIn = lazy(() => import('./pages/SignIn'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));

// Student Portal (Phase 1)

const CompleteProfile = lazy(() => import('./student/pages/CompleteProfile'));
import StudentLayout from './student/layout/StudentLayout';
const Dashboard = lazy(() => import('./student/pages/Dashboard'));
const MyCourses = lazy(() => import('./student/pages/MyCourses'));
const RecordedClasses = lazy(() => import('./student/pages/RecordedClasses'));
const StudyMaterials = lazy(() => import('./student/pages/StudyMaterials'));
const BatchWorkspace = lazy(() => import('./student/pages/BatchWorkspace'));
const DoubtSupport = lazy(() => import('./student/pages/DoubtSupport'));
const Notifications = lazy(() => import('./student/pages/Notifications'));
const MoreCourses = lazy(() => import('./student/pages/MoreCourses'));
const CourseCalendar = lazy(() => import('./student/pages/CourseCalendar'));
const TodaysSession = lazy(() => import('./student/pages/TodaysSession'));
import { ProtectedRoute } from './components/ProtectedRoute';

// Admin Portal
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
import AdminLayout from './admin/components/AdminLayout';
const AdminDashboardNew = lazy(() => import('./admin/pages/Dashboard'));
const AdminLeads = lazy(() => import('./admin/pages/Leads'));
const AdminStudents = lazy(() => import('./admin/pages/Students'));
const AdminMentors = lazy(() => import('./admin/pages/Mentors'));
const AdminCourses = lazy(() => import('./admin/pages/Courses'));
const AdminBatches = lazy(() => import('./admin/pages/Batches'));
const BatchDashboard = lazy(() => import('./admin/pages/BatchDashboard'));
const AdminBlogs = lazy(() => import('./admin/pages/Blogs'));
const AdminReviews = lazy(() => import('./admin/pages/Reviews'));
const AdminFAQs = lazy(() => import('./admin/pages/FAQs'));
const AdminNotifications = lazy(() => import('./admin/pages/Notifications'));
const AdminDoubts = lazy(() => import('./admin/pages/DoubtSupport'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));
const ServerAccessAdmin = lazy(() => import('./admin/pages/ServerAccessAdmin'));
const BrandingAdmin = lazy(() => import('./admin/pages/BrandingAdmin'));
const AccountsAdmin = lazy(() => import('./admin/pages/Accounts'));
const AdminRoleManagement = lazy(() => import('./admin/pages/RoleManagement'));
const MentorLogin = lazy(() => import('./mentor/MentorLogin'));
const MentorLayout = lazy(() => import('./mentor/MentorPortal').then(module => ({ default: module.MentorLayout })));
const MentorDashboard = lazy(() => import('./mentor/MentorPortal').then(module => ({ default: module.MentorDashboard })));
const MentorBatch = lazy(() => import('./mentor/MentorPortal').then(module => ({ default: module.MentorBatch })));

// Helper component to scroll window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ 
  handleBookDemo 
}: { 
  handleBookDemo: () => void;
}) {
  return (
    <div id="app-root-container" className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col font-sans">
      <HeaderBar />
      <Navbar onOpenDemo={handleBookDemo} />
      <main className="flex-grow" id="main-content-viewport">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  const { config } = useBrandingConfig();
  
  useEffect(() => {
    if (config?.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = config.faviconUrl;
      
      let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleLink);
      }
      appleLink.href = config.faviconUrl;
    }
  }, [config?.faviconUrl]);

  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [inquiryCourseName, setInquiryCourseName] = useState<string | null>(null);

  const handleBookDemo = () => {
    setDemoModalOpen(true);
  };

  const handleInquireCourse = (courseName: string) => {
    setInquiryCourseName(courseName);
  };

  const handleClearInquiry = () => {
    setInquiryCourseName(null);
  };

  return (
    <ErrorBoundary>
    <Router>
      <ScrollToTop />
      
      <Suspense fallback={<div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]"><div className="initial-loader-spinner"></div></div>}>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout handleBookDemo={handleBookDemo} />}>
          <Route path="/" element={<Home onOpenDemo={handleBookDemo} onInquireCourse={handleInquireCourse} />} />
          <Route path="/why-vihaan" element={<WhyVihaan onOpenDemo={handleBookDemo} />} />
          <Route path="/courses" element={<Courses onInquireCourse={handleInquireCourse} inquiryCourseName={inquiryCourseName} onClearInquiry={handleClearInquiry} />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/server-access" element={<ServerAccess />} />
          <Route path="/sign-in" element={<SignIn />} />
          {/* Retain legacy URLs without retaining their localStorage-only authorization model. */}
          <Route path="/student-dashboard" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
        </Route>

        {/* Student Portal Routes */}

        
        <Route path="/student/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
        
        <Route path="/student" element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="batch/:batchId" element={<BatchWorkspace />} />
          <Route path="recordings" element={<RecordedClasses />} />
          <Route path="materials" element={<StudyMaterials />} />
          <Route path="doubts" element={<DoubtSupport />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="course-calendar" element={<CourseCalendar />} />
          <Route path="todays-session" element={<TodaysSession />} />
          <Route path="more-courses" element={<MoreCourses />} />
        </Route>
        {/* Admin Portal Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/mentor" element={<MentorLogin />} />
        <Route path="/mentor" element={<MentorLayout />}>
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="batches/:batchId" element={<MentorBatch />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardNew />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="mentors" element={<AdminMentors />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="batches" element={<AdminBatches />} />
          <Route path="batches/:batchId" element={<BatchDashboard />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="doubts" element={<AdminDoubts />} />
          <Route path="server-access" element={<ServerAccessAdmin />} />
          <Route path="accounts" element={<AccountsAdmin />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="branding" element={<BrandingAdmin />} />
          <Route path="roles" element={<AdminRoleManagement />} />
        </Route>
      </Routes>
      </Suspense>

      {/* Book Free Demo Modal Dialog */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </Router>
    </ErrorBoundary>
  );
}
