import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { Bell, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { isTargetedToStudent } from '../../utils/recipientTargeting';
import { markNotificationsRead } from '../../utils/notificationReadState';
import { useActiveBatch } from '../contexts/ActiveBatchContext';

export default function Notifications() {
  const { studentProfile } = useAuth();
  const db = useDB();

  const { activeBatch } = useActiveBatch();
  
  const notifications = db.notifications?.filter(n => {
    if (n.target === 'Everyone') return true;
    if (n.target === 'Students') return true;
    if (n.target === 'Batch' && n.targetId === activeBatch?.id) return isTargetedToStudent(n, studentProfile);
    if (n.target === 'Course' && activeBatch?.course === n.targetId) return true;
    if ((n.target === 'Specific Student' || n.target === 'Student') && n.targetId === studentProfile?.id) return true;
    // Campaign review request notifications
    if (n.target === 'Campaign') return isTargetedToStudent(n, studentProfile);
    return false;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

  React.useEffect(() => {
    markNotificationsRead(notifications, studentProfile);
  }, [notifications, studentProfile]);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Notifications</h2>
        <p className="text-slate-500 text-sm mt-1">Stay updated with the latest announcements and alerts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <Bell className="w-12 h-12 text-slate-200 mb-4" />
            <p>You're all caught up! No new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(notif => (
              <div key={notif.id} className="p-6 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notif.type === 'alert' ? 'bg-red-50 text-red-500' :
                  notif.type === 'success' ? 'bg-green-50 text-green-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  {notif.type === 'alert' ? <AlertCircle className="w-5 h-5" /> :
                   notif.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                   <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-slate-800">{notif.title}</h3>
                    <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{notif.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  
                  {notif.type === 'review_campaign' && (
                    <div className="mt-3">
                      <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                        Check your Dashboard to submit this review
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
