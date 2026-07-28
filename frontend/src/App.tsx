import { useBrandingConfig } from './hooks/useBrandingConfig';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import DemoModal from './components/DemoModal';

// Pages
import Home from './pages/Home';
import WhyVihaan from './pages/WhyVihaan';
import Courses from './pages/Courses';
import Reviews from './pages/Reviews';
import FAQPage from './pages/FAQPage';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import ServerAccess from './pages/ServerAccess';
import SignIn from './pages/SignIn';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimer from './pages/Disclaimer';
import RefundPolicy from './pages/RefundPolicy';

// Student Portal (Phase 1)

import CompleteProfile from './student/pages/CompleteProfile';
import StudentLayout from './student/layout/StudentLayout';
import Dashboard from './student/pages/Dashboard';
import MyCourses from './student/pages/MyCourses';
import RecordedClasses from './student/pages/RecordedClasses';
import StudyMaterials from './student/pages/StudyMaterials';
import BatchWorkspace from './student/pages/BatchWorkspace';
import DoubtSupport from './student/pages/DoubtSupport';
import Notifications from './student/pages/Notifications';
import MoreCourses from './student/pages/MoreCourses';
import CourseCalendar from './student/pages/CourseCalendar';
import TodaysSession from './student/pages/TodaysSession';
import { ProtectedRoute } from './components/ProtectedRoute';

// Admin Portal
import AdminLogin from './admin/pages/AdminLogin';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboardNew from './admin/pages/Dashboard';
import AdminLeads from './admin/pages/Leads';
import AdminStudents from './admin/pages/Students';
import AdminMentors from './admin/pages/Mentors';
import AdminCourses from './admin/pages/Courses';
import AdminBatches from './admin/pages/Batches';
import BatchDashboard from './admin/pages/BatchDashboard';
import AdminBlogs from './admin/pages/Blogs';
import AdminReviews from './admin/pages/Reviews';
import AdminFAQs from './admin/pages/FAQs';
import AdminNotifications from './admin/pages/Notifications';
import AdminDoubts from './admin/pages/DoubtSupport';
import AdminSettings from './admin/pages/Settings';
import ServerAccessAdmin from './admin/pages/ServerAccessAdmin';
import BrandingAdmin from './admin/pages/BrandingAdmin';
import AccountsAdmin from './admin/pages/Accounts';
import AdminRoleManagement from './admin/pages/RoleManagement';

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
    <Router>
      <ScrollToTop />
      
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

      {/* Book Free Demo Modal Dialog */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </Router>
  );
}
