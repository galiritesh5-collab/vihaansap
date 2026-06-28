import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimer from './pages/Disclaimer';
import RefundPolicy from './pages/RefundPolicy';

// Helper component to scroll window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
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
      <div id="app-root-container" className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col font-sans">
        
        {/* Professional Contact slim Header bar */}
        <HeaderBar />

        {/* Sticky responsive navigation Navbar */}
        <Navbar onOpenDemo={handleBookDemo} />

        {/* Main Routed page layout viewport */}
        <main className="flex-grow" id="main-content-viewport">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  onOpenDemo={handleBookDemo} 
                  onInquireCourse={handleInquireCourse} 
                />
              } 
            />
            <Route 
              path="/why-vihaan" 
              element={
                <WhyVihaan 
                  onOpenDemo={handleBookDemo} 
                />
              } 
            />
            <Route 
              path="/courses" 
              element={
                <Courses 
                  onInquireCourse={handleInquireCourse} 
                  inquiryCourseName={inquiryCourseName} 
                  onClearInquiry={handleClearInquiry} 
                />
              } 
            />
            <Route 
              path="/reviews" 
              element={<Reviews />} 
            />
            <Route 
              path="/blogs" 
              element={<Blogs />} 
            />
            <Route 
              path="/blogs/:slug" 
              element={<BlogDetail />} 
            />
            <Route 
              path="/faq" 
              element={<FAQPage />} 
            />
            <Route 
              path="/about" 
              element={<About />} 
            />
            <Route 
              path="/login" 
              element={<Login />} 
            />
            <Route 
              path="/student-dashboard" 
              element={<StudentDashboard />} 
            />
            <Route 
              path="/admin-dashboard" 
              element={<AdminDashboard />} 
            />
            <Route 
              path="/privacy-policy" 
              element={<PrivacyPolicy />} 
            />
            <Route 
              path="/terms-conditions" 
              element={<TermsConditions />} 
            />
            <Route 
              path="/cookie-policy" 
              element={<CookiePolicy />} 
            />
            <Route 
              path="/disclaimer" 
              element={<Disclaimer />} 
            />
            <Route 
              path="/refund-policy" 
              element={<RefundPolicy />} 
            />
          </Routes>
        </main>

        {/* Professional corporate footer */}
        <Footer />

        {/* Live floating WhatsApp drawer support */}
        <FloatingWhatsApp />

        {/* Book Free Demo Modal Dialog */}
        <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />

      </div>
    </Router>
  );
}
