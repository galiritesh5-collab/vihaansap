import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, MonitorPlay, Bell, HelpCircle, ArrowRight, Video, FileText, CheckCircle, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDB } from '../../hooks/useDB';
import SessionFeedbackModal from './SessionFeedbackModal';
import CourseRatingModal from './CourseRatingModal';
import { useActiveBatch } from '../contexts/ActiveBatchContext';
import { isTargetedToStudent } from '../../utils/recipientTargeting';
import { isNotificationRead } from '../../utils/notificationReadState';

export default function Dashboard() {
  const { currentUser, studentProfile } = useAuth();
  const db = useDB();
  const [feedbackSession, setFeedbackSession] = useState<any>(null);
  const { activeBatch, enrolledBatches } = useActiveBatch();

  // Find batches where this student is enrolled
  const myBatches = enrolledBatches;
  
  // Find sessions for these batches
  const mySessions = db.batchSessions?.filter(s => myBatches.some(b => b.id === s.batchId) && isTargetedToStudent(s, studentProfile)) || [];
  const todayKey = new Date().toISOString().slice(0, 10);
  const upcomingSessions = mySessions.filter(s => {
    const scheduled = new Date(s.sessionDateTime || `${s.date || ''} ${s.time || ''}`).getTime();
    const isToday = (s.sessionDateTime || s.date || '').slice(0, 10) === todayKey;
    return (s.status === 'Live' || s.status === 'Upcoming') && Number.isFinite(scheduled) && (isToday || (s.status === 'Live' && Date.now() <= scheduled + 4 * 60 * 60 * 1000));
  });
  const pastSessions = mySessions.filter(s => s.status === 'Completed');

  // Filter student notifications
  const studentNotifs = db.notifications?.filter(n => {
    if (n.target === 'Everyone' || n.target === 'Students') return isTargetedToStudent(n, studentProfile);
    if (n.target === 'Batch' && myBatches.some(batch => batch.id === n.targetId)) return isTargetedToStudent(n, studentProfile);
    if (n.target === 'Course' && myBatches.some(batch => batch.course === n.targetId)) return true;
    if ((n.target === 'Specific Student' || n.target === 'Student') && n.targetId === studentProfile?.id) return true;
    if (n.target === 'Campaign') return isTargetedToStudent(n, studentProfile);
    return false;
  }) || [];
  const unreadStudentNotifs = studentNotifs.filter(notification => !isNotificationRead(notification, studentProfile || currentUser));
  const myDoubts = db.doubts?.filter(d => d.studentId === studentProfile?.id) || [];
  
  // Find past sessions missing feedback
  const pendingFeedbackSessions = pastSessions.filter(s => {
    return !db.sessionFeedback?.some(f => f.sessionId === s.id && f.studentId === studentProfile?.id);
  });


  // Review requests deliberately live on the dashboard until the student submits
  // the review for that specific campaign. Notifications remain a secondary path.
  const pendingReviewRequests = (db.notifications || [])
    .map((notification: any) => {
      const campaign = (db.reviewCampaigns || []).find((item: any) => item.id === notification.targetId);
      return {
        notification,
        campaign,
        batchId: campaign?.batchId || notification.batchId,
        name: campaign?.name || notification.campaignName || notification.title?.replace(/^Feedback Request:\s*/, '') || 'Feedback Request',
      };
    })
    .filter(({ notification, campaign, batchId }: any) => {
      if (notification.type !== 'review_campaign') return false;
      // The notification carries the batch and active state so a student does not
      // lose the dashboard entry while the campaign listener is reconnecting.
      if (campaign ? campaign.status !== 'Active' : notification.reviewRequestStatus === 'Closed') return false;
      if (!isTargetedToStudent(notification, studentProfile)) return false;
      if (campaign && !isTargetedToStudent(campaign, studentProfile)) return false;
      // Architecture B: Removed myBatches dependency.
      // if (!myBatches.some((batch: any) => batch.id === batchId)) return false;

      return !(db.reviews || []).some((review: any) =>
        review.campaignId === notification.targetId &&
        (review.studentUid === currentUser?.uid || review.studentId === studentProfile?.id || review.studentId === currentUser?.uid)
      );
    })
    .sort(({ notification: a, campaign: campaignA }: any, { notification: b, campaign: campaignB }: any) =>
      new Date(campaignB?.createdAt || b.createdAt || b.date || 0).getTime() -
      new Date(campaignA?.createdAt || a.createdAt || a.date || 0).getTime()
    );

  const [activeReviewModal, setActiveReviewModal] = useState<{campaignId: string; batch: any} | null>(null);

  const stats = [
    { name: 'Total Enrolled Courses', value: myBatches.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: "Today's Sessions", value: upcomingSessions.length, icon: MonitorPlay, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Unread Notifications', value: unreadStudentNotifs.length, icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Pending Doubts', value: myDoubts.filter(d => d.status === 'Pending').length, icon: HelpCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  if (studentProfile?.status === 'Pending') {
    return (
      <div className="p-4 sm:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10">
            <CheckCircle className="w-10 h-10 text-[#1763B6]" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight relative z-10 mb-3">
            Registration Successful
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed relative z-10 mb-2">
            Your account has been created successfully.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed relative z-10 mb-8">
            Our team will verify your enrollment and assign your purchased course or batch.
            Once assigned, your learning dashboard will automatically become available.
          </p>
          <a
            href="https://wa.me/917075999336"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1763B6] hover:bg-[#145096] text-white font-bold rounded-xl transition-colors shadow-sm relative z-10"
          >
            Contact WhatsApp Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      

      {/* Persistent Review Request Banners */}
      {pendingReviewRequests.length > 0 && (
        <section className="space-y-4" aria-labelledby="review-requests-heading">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="review-requests-heading" className="text-xl font-display font-extrabold text-slate-800">Review Requests</h2>
              <p className="text-sm text-slate-600">You have {pendingReviewRequests.length} pending review request{pendingReviewRequests.length === 1 ? '' : 's'}.</p>
            </div>
          </div>
          {pendingReviewRequests.map(({ notification: n, campaign, batchId, name }: any) => {
            const batchForCampaign = (db.batches || []).find((batch: any) => batch.id === batchId) || { id: batchId, course: campaign?.course || 'Assigned Course' };
            return (
              <div key={n.targetId} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 shadow-inner">
                    <Star className="w-6 h-6 text-red-600 fill-red-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 text-lg flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                      Review Pending: {name}
                    </h3>
                    <p className="text-sm text-red-800 mt-1 max-w-2xl">{n.message || 'Your mentor has requested you to share your learning experience. Your feedback helps improve our training programs.'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveReviewModal({ campaignId: n.targetId, batch: batchForCampaign })}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0"
                >
                  Submit Review
                </button>
              </div>
            );
          })}
        </section>
      )}

      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            Welcome back, {currentUser?.displayName || currentUser?.email}!
          </h2>
          <p className="text-slate-500 mt-2 max-w-2xl text-sm sm:text-base">
            You have {upcomingSessions.length} upcoming classes today. Resume your recent courses to keep up your learning streak.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Continue Learning */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">My Active Batches</h3>
              <Link to="/student/courses" className="text-sm font-semibold text-[#1763B6] hover:underline">View All</Link>
            </div>
            <div className="p-4 sm:p-6">
              {myBatches.length > 0 ? myBatches.slice(0, 2).map(batch => {
                const course = db.courses.find(c => c.name === batch.course);
                return (
                <div key={batch.id} className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6 last:mb-0">
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
                    <img src={course?.thumbnail || "/assets/course-default.png"} alt={course?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1763B6] bg-blue-50 px-2 py-1 rounded-md">
                        {batch.status}
                      </span>
                      <h4 className="font-bold text-slate-800 text-lg mt-2 leading-tight">{batch.course}</h4>
                      <p className="text-sm text-slate-500 mt-1">Batch: {batch.name} &bull; Mentor: {batch.mentor}</p>
                    </div>
                    <Link to="/student/courses" className="inline-block w-full sm:w-auto bg-[#1763B6] hover:bg-[#145096] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors mt-2 text-center">
                      Go to Workspace
                    </Link>
                  </div>
                </div>
              )}) : (
                <p className="text-slate-500 text-sm">You are not enrolled in any active batches.</p>
              )}
            </div>
          </div>

          {/* Upcoming Live Class */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Today's Sessions</h3>
              <Link to="/student/todays-session" className="text-sm font-semibold text-[#1763B6] hover:underline">Open Today's Session</Link>
            </div>
            <div className="p-4 sm:p-6">
              {upcomingSessions.length > 0 ? upcomingSessions.slice(0, 2).map(cls => {
                const batch = db.batches.find(b => b.id === cls.batchId);
                const recording = (db.recordings || []).find((item: any) => item.batchId === cls.batchId && (item.sessionId === cls.id || item.title === cls.title || item.title === cls.topic));
                return (
                <div key={cls.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-orange-100 bg-orange-50/50 mb-4 last:mb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-orange-100 flex items-center justify-center shrink-0">
                      <MonitorPlay className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{cls.topic}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{cls.date || new Date(cls.sessionDateTime).toLocaleDateString()}</span> at <span className="font-medium text-slate-700">{cls.time || new Date(cls.sessionDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> &bull; {batch?.course} &bull; Mentor: {batch?.mentor || 'Assigned mentor'}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-orange-700">{cls.status || 'Upcoming'}{recording || cls.recordingUrl ? ' • Recording available' : ''}</p>
                    </div>
                  </div>
                  {cls.meetingLink ? (
                    <a href={cls.meetingLink} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors shrink-0 text-center">
                      Join Live
                    </a>
                  ) : (
                    <button disabled className="w-full sm:w-auto px-4 py-2 bg-orange-200 text-white text-sm font-bold rounded-lg shrink-0 cursor-not-allowed">
                      Link Pending
                    </button>
                  )}
                  {(recording?.videoUrl || cls.recordingUrl) && <a href={recording?.videoUrl || cls.recordingUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-4 py-2 border border-orange-300 text-orange-700 text-sm font-bold rounded-lg text-center">View Recording</a>}
                </div>
              )}) : (
                <p className="text-slate-500 text-sm">No upcoming live sessions.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          
          {/* Pending Feedback */}
          {pendingFeedbackSessions.length > 0 && (
            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Pending Feedback</h3>
                  <p className="text-xs text-slate-500">You have {pendingFeedbackSessions.length} session(s) to review.</p>
                </div>
              </div>
              <div className="space-y-3">
                {pendingFeedbackSessions.slice(0, 2).map(s => (
                  <div key={s.id} className="bg-white p-3 rounded-xl border border-orange-100/50 shadow-sm flex items-center justify-between">
                    <div className="truncate pr-4">
                      <p className="text-sm font-bold text-slate-800 truncate">{s.topic}</p>
                      <p className="text-xs text-slate-500">{s.date}</p>
                    </div>
                    <button onClick={() => setFeedbackSession(s)} className="text-xs font-bold text-orange-600 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors shrink-0">
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Support Card */}
          <div className="bg-gradient-to-br from-[#1763B6] to-[#0C3E7B] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            <HelpCircle className="w-8 h-8 text-white/80 mb-4" />
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Facing issues with your coursework or portal access? Our support team is available on WhatsApp.
            </p>
            <a 
              href="https://wa.me/917075999336" 
              target="_blank" 
              rel="noreferrer"
              className="block text-center w-full bg-white text-[#1763B6] font-bold py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Contact Support
            </a>
          </div>

          {/* Recent Recordings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Recent Recordings</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {pastSessions.filter(s => s.recordingUrl).length > 0 ? pastSessions.filter(s => s.recordingUrl).slice(0, 3).map(rec => {
                const batch = db.batches.find(b => b.id === rec.batchId);
                return (
                <a href={rec.recordingUrl} target="_blank" rel="noreferrer" key={rec.id} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer flex gap-3 block">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Video className="w-4 h-4 text-[#1763B6]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{rec.topic}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{batch?.course} &bull; {rec.date}</p>
                  </div>
                </a>
              )}) : (
                <div className="p-4 text-sm text-slate-500">No recent recordings available.</div>
              )}
            </div>
            <Link to="/student/recordings" className="block w-full text-center py-3 text-xs font-bold text-[#1763B6] hover:bg-slate-50 border-t border-slate-100 transition-colors">
              View All Recordings
            </Link>
          </div>

        </div>
      </div>

      {feedbackSession && (
        <SessionFeedbackModal 
          session={feedbackSession} 
          batch={db.batches.find(b => b.id === feedbackSession.batchId)} 
          onClose={() => setFeedbackSession(null)} 
        />
      )}

      {activeReviewModal && (
        <CourseRatingModal
          batch={activeReviewModal.batch}
          course={db.courses.find((c: any) => c.name === activeReviewModal.batch?.course)}
          campaignId={activeReviewModal.campaignId}
          onClose={() => setActiveReviewModal(null)}
          isMandatory={false}
        />
      )}
    </div>
  );
}

