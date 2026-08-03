import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, MonitorPlay, Video, 
  FileText, HelpCircle, Bell, Search, LogOut, Menu, X, Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { useBrandingConfig } from '../../hooks/useBrandingConfig';
import CourseRatingModal from '../pages/CourseRatingModal';
import { isTargetedToStudent } from '../../utils/recipientTargeting';
import { ActiveBatchProvider, useActiveBatch } from '../contexts/ActiveBatchContext';

// ─── Dynamic student status helper ─────────────────────────────────────────
function useStudentStatus(userId: string | undefined, studentProfileId: string | undefined) {
  const db = useDB();

  if (!userId && !studentProfileId) return { label: 'REGISTERED', color: 'bg-slate-100 text-slate-500' };

  const myBatches = db.batches?.filter(
    b => b.studentIds?.includes(studentProfileId || '') || b.studentIds?.includes(userId || '')
  ) || [];

  if (myBatches.length === 0) {
    // Signed in, no batch assigned → Visitor / Registered
    return { label: 'REGISTERED', color: 'bg-slate-100 text-slate-500' };
  }

  const hasCompleted = myBatches.every(b => b.status === 'Completed');
  const hasActive    = myBatches.some(b => b.status === 'Ongoing' || b.status === 'Upcoming');

  if (hasCompleted && !hasActive) {
    // All batches completed → Alumni
    return { label: 'ALUMNI', color: 'bg-green-100 text-green-700' };
  }

  // Has at least one active / upcoming batch → Active Student
  return { label: 'ACTIVE STUDENT', color: 'bg-blue-50 text-[#1763B6]' };
}
// ───────────────────────────────────────────────────────────────────────────

export default function StudentLayout() {
  return <ActiveBatchProvider><StudentLayoutContent /></ActiveBatchProvider>;
}

function StudentLayoutContent() {
  const { currentUser: user, loading, logout, studentProfile } = useAuth();
  const { config: brandingConfig } = useBrandingConfig();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const status = useStudentStatus(user?.uid, studentProfile?.id);
  const { activeBatch, enrolledBatches, setActiveBatchId } = useActiveBatch();

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  const db = useDB();

  // Check for mandatory feedback (Batch Completed)
  const myBatches = db.batches?.filter(b => b.studentIds?.includes(user?.uid) || b.studentIds?.includes((user as any)?.id)) || [];
  const mandatoryFeedbackBatch = myBatches.find(b => {
    if (b.status !== 'Completed') return false;
    const hasFeedback = db.reviews?.some((r: any) => r.batchId === b.id && (r.studentUid === user?.uid || r.studentId === studentProfile?.id || r.studentId === user?.uid));
    return !hasFeedback;
  });

  // Check for requested feedback (via Admin notification)
  const feedbackRequestNotification = db.notifications?.find(n => 
    (n.type === 'review_request' || n.isFeedbackRequest) && 
    myBatches.some(b => b.id === (n.targetId || n.batchId || n.relatedEntityId)) &&
    !db.reviews?.some((r: any) => r.batchId === (n.targetId || n.batchId || n.relatedEntityId) && (r.studentUid === user?.uid || r.studentId === studentProfile?.id || r.studentId === user?.uid))
  );
  
  const requestedFeedbackBatch = feedbackRequestNotification 
    ? myBatches.find(b => b.id === (feedbackRequestNotification.targetId || feedbackRequestNotification.batchId || feedbackRequestNotification.relatedEntityId)) 
    : null;

  const pendingFeedbackBatch = mandatoryFeedbackBatch || requestedFeedbackBatch;
  const isMandatory = !!mandatoryFeedbackBatch;

  const [dismissedFeedback, setDismissedFeedback] = useState(false);
  
  // Also check sessionStorage
  const isSessionDismissed = pendingFeedbackBatch ? sessionStorage.getItem(`review_dismissed_${pendingFeedbackBatch.id}`) === 'true' : false;

  const showFeedbackModal = pendingFeedbackBatch && (!dismissedFeedback && !isSessionDismissed || isMandatory);

  const notifications = db.notifications?.filter(n => {
    if (n.target === 'Everyone' || n.target === 'Students') return true;
    if (n.target === 'Batch' && myBatches.some(b => b.id === n.targetId)) return isTargetedToStudent(n, studentProfile);
    if (n.target === 'Course' && myBatches.some(b => b.course === n.targetId)) return true;
    if (n.target === 'Specific Student' && n.targetId === studentProfile?.id) return true;
    return false;
  }) || [];
  
  useEffect(() => {
    const lastRead = localStorage.getItem('lastReadNotifications');
    if (location.pathname === '/student/notifications') {
      localStorage.setItem('lastReadNotifications', new Date().toISOString());
      setUnreadCount(0);
    } else {
      if (!lastRead) {
        setUnreadCount(notifications.length);
      } else {
        const unread = notifications.filter(n => new Date(n.date) > new Date(lastRead));
        setUnreadCount(unread.length);
      }
    }
  }, [location.pathname, notifications]);

  const navItems = [
    { name: 'Dashboard',        path: '/student/dashboard',     icon: LayoutDashboard },
    { name: 'My Courses',       path: '/student/courses',        icon: BookOpen },
    { name: "Today's Session", path: '/student/todays-session', icon: MonitorPlay },
    { name: 'Recorded Classes', path: '/student/recordings',     icon: Video },
    { name: 'Study Materials',  path: '/student/materials',      icon: FileText },
    { name: 'Course Calendar',  path: '/student/course-calendar', icon: Calendar },
    { name: 'Doubt Support',    path: '/student/doubts',         icon: HelpCircle },
    { name: 'Notifications',    path: '/student/notifications',  icon: Bell },
    { name: 'More Courses',     path: '/student/more-courses',   icon: Search },
  ];

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
        w-64 bg-[#0C3E7B] text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Sidebar Header — branding */}
        <div className="h-[72px] flex items-center bg-[#092e5c] border-b border-white/10 shrink-0">
          <Link
            to="/student/dashboard"
            className="flex items-center justify-center w-full h-full px-5 py-3"
          >
            <img
              src="/footer-logo.png"
              alt="Sri Vihaan SAP Consulting"
              className="h-10 max-w-[180px] w-auto object-contain"
            />
          </Link>
          <button
            className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative
                  ${isActive
                    ? 'bg-[#1763B6] text-white font-medium shadow-sm'
                    : 'text-slate-300 hover:bg-[#145096] hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-sm flex-1">{item.name}</span>
                {item.name === 'Notifications' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full absolute right-3">
                    {unreadCount}
                  </span>
                )}
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
            <h1 className="font-display font-semibold text-slate-800 text-lg hidden sm:block">
              {navItems.find(i => i.path === location.pathname)?.name || 'Student Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <label className="sr-only" htmlFor="active-batch">Current Batch</label>
              <select
                id="active-batch"
                value={activeBatch?.id || ''}
                onChange={event => setActiveBatchId(event.target.value)}
                disabled={enrolledBatches.length === 0}
                className="max-w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:text-slate-400"
              >
                {enrolledBatches.length === 0 ? <option value="">No active batch assigned yet</option> : enrolledBatches.map(batch => <option key={batch.id} value={batch.id}>{batch.course} — {batch.name}</option>)}
              </select>
            </div>
            {/* Name + Dynamic Status Badge */}
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div>
                <p className="text-sm font-bold text-slate-800 leading-none">{user?.displayName || 'Student'}</p>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>

            {/* Avatar — click toggles dropdown, only Logout inside */}
            <div className="relative">
              <button
                onClick={() => setAvatarOpen(prev => !prev)}
                className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#1763B6] transition-all hover:border-[#1763B6]"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-600">
                    {user?.displayName?.[0] || '?'}
                  </span>
                )}
              </button>

              {/* Backdrop */}
              {avatarOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setAvatarOpen(false)} />
              )}

              {/* Dropdown — Logout only */}
              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1 animate-in fade-in zoom-in duration-150 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { setAvatarOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mandatory/Requested Feedback Overlay */}
        {showFeedbackModal && pendingFeedbackBatch && (
          <CourseRatingModal
            batch={pendingFeedbackBatch}
            course={db.courses.find(c => c.name === pendingFeedbackBatch.course)}
            onClose={() => setDismissedFeedback(true)}
            isMandatory={isMandatory}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/917075999336"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all z-50"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
