/**
 * Navbar.tsx — Sri Vihaan Consulting
 *
 * BRANDING ASSETS (LOCAL FILES — No Firebase/Firestore)
 * ─────────────────────────────────────────────────────
 * Main Logo  : src/assets/branding/logo.svg  (or logo.png)
 *              Recommended: 320 × 90 px | Display: 220 × 62 px | Transparent PNG
 *
 * Replace the SVG file with your actual logo. The <img> tag below
 * will automatically pick it up — no code change needed.
 */

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, User, BookOpenCheck, LogOut, GraduationCap, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBrandingConfig } from '../../hooks/useBrandingConfig';

// Local branding asset removed in favor of /web-logo.png from public folder

interface NavbarProps {
  onOpenDemo: () => void;
}

export default function Navbar({ onOpenDemo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  
  const { config } = useBrandingConfig();
  const { currentUser, logout: firebaseLogout } = useAuth();
  const navigate = useNavigate();

  // Listen to sticky scroll status
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Watch admin session state (localStorage-based, not Firebase)
  const checkAdminSession = () => {
    const role = localStorage.getItem('vihaan_user_role');
    setAdminRole(role === 'admin' ? role : null);
  };

  useEffect(() => {
    checkAdminSession();
    const handler = () => checkAdminSession();
    window.addEventListener('storage', handler);
    const interval = setInterval(checkAdminSession, 1000);
    return () => {
      window.removeEventListener('storage', handler);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    if (adminRole) {
      localStorage.removeItem('vihaan_user_role');
      localStorage.removeItem('vihaan_user_email');
      setAdminRole(null);
      navigate('/login');
    } else if (currentUser) {
      await firebaseLogout();
      navigate('/');
    }
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Why Sri Vihaan', path: '/why-vihaan' },
    { name: 'SAP Courses', path: '/courses' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'FAQ', path: '/faq' },
    { name: 'About Us', path: '/about' },
    { name: '⭐ Server Access', path: '/server-access', isHighlighted: true }
  ];

  return (
    <nav
      id="main-navbar"
      className={`sticky top-0 w-full z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
          : 'bg-white py-0 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[72px] gap-4 xl:gap-6">

          {/* ── Logo / Brand ──────────────────────────────── */}
          <div className="shrink-0 flex items-center mr-2 xl:mr-6">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center group pointer-events-auto"
              id="nav-logo-link"
            >
              {/*
               * LOCAL LOGO — src/assets/branding/logo.svg
               * To replace: drop your logo.png into that folder and update the import above.
               *
               * Recommended : 320 × 90 px, transparent PNG
               * Display     : max-h-[50px] max-w-[200px] (matches original size)
               */}
              <img
                src={config?.headerLogoUrl || "/header-logo.png"}
                alt="Sri Vihaan Consulting"
                className="max-h-[48px] sm:max-h-[54px] max-w-[180px] sm:max-w-[220px] object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* ── Center Navigation Links (Desktop) ──────── */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2" id="desktop-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 pointer-events-auto relative whitespace-nowrap ${
                    link.isHighlighted
                      ? isActive
                        ? 'text-orange-600 bg-orange-50 font-bold border border-orange-200'
                        : 'text-orange-600 font-bold border border-orange-100 hover:bg-orange-50'
                      : isActive
                        ? 'text-[#1763B6] bg-slate-50 font-semibold'
                        : 'text-slate-600 hover:text-[#1763B6] hover:bg-slate-50/60'
                  }`
                }
                id={`nav-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ── Right Action Buttons (Desktop) ─────────── */}
          <div className="shrink-0 hidden lg:flex items-center gap-2 xl:gap-3 ml-2 xl:ml-4" id="desktop-actions">
            {(adminRole || currentUser) ? (
              <div className="flex items-center gap-2" id="nav-user-indicator">
                <Link
                  to={adminRole === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-5 text-[13px] font-semibold text-[#1763B6] border border-[#1763B6] rounded-full hover:bg-[#1763B6] hover:text-white transition-all pointer-events-auto shadow-sm"
                  id="btn-nav-dashboard"
                >
                  <User className="w-4 h-4" />
                  <span>Portal</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white rounded-full hover:bg-red-500 border border-transparent hover:border-red-500 transition-all cursor-pointer pointer-events-auto"
                  title="Logout"
                  id="btn-nav-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center gap-1.5 h-10 px-5 text-[13px] font-semibold text-[#1763B6] border border-[#1763B6] rounded-full hover:bg-[#1763B6] hover:text-white transition-all pointer-events-auto shadow-sm"
                id="btn-nav-signin"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={onOpenDemo}
              className="inline-flex items-center justify-center h-10 px-5 text-[13px] font-semibold text-white bg-[#F4A62A] border border-[#e09521] rounded-full shadow-md shadow-amber-400/20 hover:bg-[#e09521] transition-all cursor-pointer pointer-events-auto whitespace-nowrap"
              id="btn-nav-demo"
            >
              Book Free Demo
            </button>
          </div>

          {/* ── Mobile: Always-visible action buttons ────── */}
          <div className="lg:hidden flex items-center gap-2 ml-auto" id="mobile-action-buttons">
            {/* Portal / Sign-In button — always visible on mobile */}
            {(adminRole || currentUser) ? (
              <Link
                to={adminRole === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-3 text-[12px] font-semibold text-[#1763B6] border border-[#1763B6] rounded-full hover:bg-[#1763B6] hover:text-white transition-all pointer-events-auto"
                id="btn-mobile-portal-top"
              >
                <User className="w-3.5 h-3.5" />
                <span>Portal</span>
              </Link>
            ) : (
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center gap-1.5 h-9 px-3 text-[12px] font-semibold text-[#1763B6] border border-[#1763B6] rounded-full hover:bg-[#1763B6] hover:text-white transition-all pointer-events-auto"
                id="btn-mobile-signin-top"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Book Free Demo — always visible on mobile */}
            <button
              onClick={() => { setIsOpen(false); onOpenDemo(); }}
              className="inline-flex items-center justify-center h-9 px-3 text-[12px] font-semibold text-white bg-[#F4A62A] border border-[#e09521] rounded-full hover:bg-[#e09521] transition-all pointer-events-auto whitespace-nowrap"
              id="btn-mobile-demo-top"
            >
              Book Demo
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center w-9 h-9 text-slate-600 hover:text-[#1763B6] hover:bg-slate-100 rounded-full focus:outline-none cursor-pointer pointer-events-auto transition-colors"
              aria-label="Toggle Navigation Menu"
              id="btn-hamburger"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Drawer Navigation ─────────────────────── */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg absolute top-full left-0 w-full z-40 py-3 px-4" id="mobile-drawer">
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-between ${
                    link.isHighlighted
                      ? 'text-orange-600 font-bold'
                      : isActive
                        ? 'text-[#1763B6] bg-slate-50 font-semibold'
                        : 'text-slate-600 hover:text-[#1763B6] hover:bg-slate-50/60'
                  }`
                }
                id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </NavLink>
            ))}
          </div>

          {/* Mobile: Logout (only when logged in) */}
          {(adminRole || currentUser) && (
            <>
              <hr className="border-slate-100 my-3" />
              <button
                onClick={handleLogout}
                className="w-full text-center bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer pointer-events-auto block border border-red-100"
                id="btn-mobile-logout"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
