import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, User, BookOpenCheck, LogOut, GraduationCap, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onOpenDemo: () => void;
}

export default function Navbar({ onOpenDemo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  // Listen to sticky scroll status
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update logic to watch mock session state
  const checkSession = () => {
    const role = localStorage.getItem('vihaan_user_role');
    const email = localStorage.getItem('vihaan_user_email');
    setUserRole(role);
    setUserEmail(email);
  };

  useEffect(() => {
    checkSession();
    // Set up rapid poll or window storage listener for multi-page reactive sync
    const handler = () => checkSession();
    window.addEventListener('storage', handler);
    const interval = setInterval(checkSession, 1000); // quick poll for immediate interactive feedback!
    
    return () => {
      window.removeEventListener('storage', handler);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vihaan_user_role');
    localStorage.removeItem('vihaan_user_email');
    setUserRole(null);
    setUserEmail(null);
    setIsOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Why Sri Vihaan Consulting', path: '/why-vihaan' },
    { name: 'SAP Courses', path: '/courses' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'FAQ', path: '/faq' },
    { name: 'About Us', path: '/about' }
  ];

  return (
    <nav
      id="main-navbar"
      className={`sticky top-0 w-full z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-white py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo / Brand */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 group pointer-events-auto"
            id="nav-logo-link"
          >
            <div className="bg-[#1763B6] p-2 rounded-lg text-white group-hover:bg-[#277EDC] transition-all shadow-sm">
              <GraduationCap className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-lg text-[#1763B6] tracking-tight hover:text-[#277EDC] transition-all leading-tight">
                SRI VIHAAN
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-orange-500 uppercase tracking-widest leading-none">
                CONSULTING
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2" id="desktop-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 pointer-events-auto relative ${
                    isActive
                      ? 'text-[#1763B6] bg-slate-50 font-semibold'
                      : 'text-slate-600 hover:text-[#1763B6] hover:bg-slate-50/50'
                  }`
                }
                id={`nav-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3" id="desktop-actions">
            {userRole ? (
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200" id="nav-user-indicator">
                <Link
                  to={userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1763B6] hover:text-[#277EDC] px-3 py-1.5 rounded-full hover:bg-white transition-all pointer-events-auto"
                  id="btn-nav-dashboard"
                >
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  <span>Portal</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer pointer-events-auto"
                  title="Logout"
                  id="btn-nav-logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
null
            )}

            <button
              onClick={onOpenDemo}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#F4A62A] rounded-full shadow-lg shadow-amber-500/10 hover:bg-[#e09521] transition-all cursor-pointer pointer-events-auto"
              id="btn-nav-demo"
            >
              Book Free Demo
            </button>
          </div>

          {/* Responsive Hamburger Icon (Mobile) */}
          <div className="flex lg:hidden items-center" id="hamburger-container">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-[#1763B6] p-2 focus:outline-none cursor-pointer pointer-events-auto"
              aria-label="Toggle Navigation Menu"
              id="btn-hamburger"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 shadow-lg absolute top-full left-0 w-full z-40 py-4 px-4 space-y-3" id="mobile-drawer">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? 'text-[#1763B6] bg-slate-50 font-bold'
                      : 'text-slate-600 hover:text-[#1763B6] hover:bg-slate-50/50'
                  }`
                }
                id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </NavLink>
            ))}
          </div>

          <hr className="border-slate-100 my-2" />

          {/* Mobile Actions */}
          <div className="flex flex-col gap-2 px-3 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenDemo();
              }}
              className="w-full text-center bg-slate-50 hover:bg-slate-100 text-[#1763B6] border border-slate-200 font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer block pointer-events-auto"
              id="btn-mobile-demo"
            >
              Book Free Demo
            </button>

            {userRole ? (
              <div className="space-y-2">
                <Link
                  to={userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-sm py-2.5 rounded-lg transition-colors pointer-events-auto"
                  id="btn-mobile-portal"
                >
                  <User className="w-4 h-4" />
                  <span>Go to My Portal</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer pointer-events-auto block"
                  id="btn-mobile-logout"
                >
                  Sign Out Account
                </button>
              </div>
            ) : (
null
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
