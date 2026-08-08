import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Server, LayoutDashboard, Users, UserCog, BookOpen, Layers, 
  FileText, Star, Bell, HelpCircle, 
  Settings, LogOut, Menu, X, ChevronDown, ShieldCheck, Inbox, Search, Palette, IndianRupee
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBrandingConfig } from '../../hooks/useBrandingConfig';

export default function AdminLayout() {
  const { currentUser, userRole, loading: authLoading, logout: authLogout } = useAuth();
  const { config: brandingConfig } = useBrandingConfig();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isLoading = authLoading;
  const isAuthorized = currentUser && userRole === 'admin';

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/admin-login" replace />;
  }

  const handleLogout = async () => {
    if (currentUser) await authLogout();
    // Declarative Navigate handles the redirect when state updates
  };

  const allNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Lead Management', path: '/admin/leads', icon: Inbox },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Mentors', path: '/admin/mentors', icon: UserCog },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Batches', path: '/admin/batches', icon: Layers },
    { name: 'Server Access', path: '/admin/server-access', icon: Server },
    { name: 'Accounts', path: '/admin/accounts', icon: IndianRupee },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Doubt Support', path: '/admin/doubts', icon: HelpCircle },
    { name: 'Role Management', path: '/admin/roles', icon: ShieldCheck },
    { name: 'Branding & Contact', path: '/admin/branding', icon: Palette },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const navItems = allNavItems;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-slate-300
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col border-r border-slate-800
      `}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800 shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-2 pointer-events-auto">
            <img src={brandingConfig?.adminPortalLogoUrl || "/footer-logo.png"} alt="Sri Vihaan Logo" className="max-h-10 w-auto object-contain bg-white/10 p-1 rounded" />
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium
                  ${isActive 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-slate-800 text-lg hidden sm:block">
              {navItems.find(i => location.pathname.startsWith(i.path))?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex-1 max-w-2xl mx-8 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Global Search: Students, Courses, Batches, Doubts..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 relative">

            <button
              className="flex items-center gap-3 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">{currentUser?.displayName}</p>
                <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mt-1">{userRole}</p>
              </div>
              {currentUser?.photoURL ? (
                 <img src={currentUser?.photoURL} alt="Profile" className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 object-cover" />
              ) : (
                 <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                   {(currentUser?.displayName || '?').charAt(0).toUpperCase()}
                 </div>
              )}
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown — Logout only */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium rounded-lg"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
