import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDB } from '../../hooks/useDB';
import { useAuth } from '../../contexts/AuthContext';
import { MockDB } from '../../services/MockDB';
import { isTargetedToStudent, studentIdentifiers } from '../../utils/recipientTargeting';
import { BookOpen, Calendar, Video, FileText, PlayCircle, MessageSquare, HelpCircle, ArrowLeft, CheckCircle, Send, Paperclip, Star, X, Download, Bell } from 'lucide-react';

export default function BatchWorkspace() {
  const { batchId } = useParams();
  const { studentProfile } = useAuth();
  const db = useDB();
  const batch = db.batches.find(b => b.id === batchId);
  const course = db.courses.find(c => c.name === batch?.course);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState(studentProfile?.name || '');
  const [designation, setDesignation] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!batch || !course) return <div className="p-8">Batch not found</div>;

  const tabs = ['Overview', 'Weekly Planner', "Today's Session", 'Study Materials', 'Recorded Classes', 'Notifications', 'Doubts'];

  // Data
  const materials = (db.studyMaterials?.filter(m => {
    if (m.batchId !== batchId) return false;
    if (m.visibility === 'Hidden') return false;
    return isTargetedToStudent(m, studentProfile);
  }) || []).sort((a, b) => new Date(b.uploadDate || b.createdAt || 0).getTime() - new Date(a.uploadDate || a.createdAt || 0).getTime());

  const recordings = (db.recordings?.filter(r => {
    if (r.batchId !== batchId) return false;
    if (r.visibility === 'Hidden') return false;
    return isTargetedToStudent(r, studentProfile);
  }) || []).sort((a, b) => new Date(b.date || b.uploadDate || 0).getTime() - new Date(a.date || a.uploadDate || 0).getTime());

  // Notifications: filter by batch, respect recipient targeting, newest first
  const notifications = (db.notifications?.filter(n => {
    const isBatchNotif = n.target === 'Batch' && n.targetId === batchId;
    const isGlobal = n.target === 'Entire Platform';
    const isCourse = n.target === 'Course' && n.targetId === course.name;
    const isStudent = n.target === 'Student' && n.targetId === studentProfile?.id;
    if (!isBatchNotif && !isGlobal && !isCourse && !isStudent) return false;
    return !isBatchNotif || isTargetedToStudent(n, studentProfile);
  }) || []).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  // Unread notifications badge — stored in localStorage per student
  const storageKey = `notif_read_${studentProfile?.id}_${batchId}`;
  const readIds: string[] = (() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  })();
  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    localStorage.setItem(storageKey, JSON.stringify(allIds));
  };

  const doubts = db.doubts?.filter(d => d.batchId === batchId && d.studentId === studentProfile.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
  const sessions = db.batchSessions?.filter(s => s.batchId === batchId && isTargetedToStudent(s, studentProfile)) || [];
  const reviewRequest = (db.notifications || []).filter(n => n.targetId === batchId && n.isFeedbackRequest && isTargetedToStudent(n, studentProfile)).sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime())[0];
  const feedbackRequested = Boolean(reviewRequest);
  const hasSubmittedReview = Boolean(reviewRequest && db.reviews?.some((r: any) => r.reviewRequestId === reviewRequest.id && studentIdentifiers(studentProfile).includes(r.studentUid || r.studentId)));

  // Today's Session expires five hours after the scheduled session time.
  const now = new Date();
  const activeSessions = sessions.filter(s => {
    const scheduled = s.sessionDateTime ? new Date(s.sessionDateTime) : null;
    if (scheduled && now.getTime() > scheduled.getTime() + 5 * 60 * 60 * 1000) return false;
    if (!scheduled && s.visibleFrom && new Date(s.visibleFrom) > now) return false;
    if (!scheduled && s.visibleUntil && new Date(s.visibleUntil) < now) return false;
    return true;
  });

  const todaySession = activeSessions.sort((a, b) => new Date(b.sessionDateTime || b.createdAt || 0).getTime() - new Date(a.sessionDateTime || a.createdAt || 0).getTime())[0];

  // Planners
  const planners = db.batchPlanner?.filter(p => p.batchId === batchId).sort((a, b) => a.weekNumber - b.weekNumber) || [];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">

      {/* Review Submission Modal — shown when admin sends review request and student hasn't submitted */}
      {(showFeedbackModal || (feedbackRequested && !hasSubmittedReview)) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Rate Your Course</h3>
            </div>
            {reviewSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-700">Thank you for your review!</h4>
                <p className="text-slate-500 text-sm mt-1">Your feedback has been submitted for approval.</p>
                <button onClick={() => setShowFeedbackModal(false)} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm">Close</button>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                const batchObj = db.batches?.find(b => b.id === batchId);
                MockDB.addItem('reviews', {
                  reviewRequestId: reviewRequest?.id,
                  studentUid: studentIdentifiers(studentProfile)[0],
                  studentId: studentIdentifiers(studentProfile)[0],
                  studentName: reviewName,
                  name: reviewName,
                  designation,
                  role: designation,
                  courseId: course.id,
                  courseName: course.name,
                  course: course.name,
                  batchId,
                  batchName: batchObj?.name || '',
                  // store in both content and text so both Admin views display it
                  content: reviewText,
                  text: reviewText,
                  rating: reviewRating,
                  status: 'Pending',
                  submittedAt: new Date().toISOString(),
                  date: new Date().toISOString(),
                });
                setReviewSubmitted(true);
              }} className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">We'd love to hear about your overall course experience.</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewRating(s)}>
                        <Star className={`w-8 h-8 transition-colors ${s <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Feedback *</label>
                  <textarea required value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience with this course..." rows={4} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name *</label><input required value={reviewName} onChange={e => setReviewName(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation *</label><input required value={designation} onChange={e => setDesignation(e.target.value)} placeholder="SAP Consultant, Student..." className="w-full px-4 py-2 border border-slate-200 rounded-lg" /></div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">Submit Review</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Feedback Request Banner */}
      {feedbackRequested && !hasSubmittedReview && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <p className="font-bold text-indigo-800 text-sm">Your feedback has been requested!</p>
              <p className="text-indigo-600 text-xs mt-0.5">Help us improve by sharing your experience.</p>
            </div>
          </div>
          <button onClick={() => setShowFeedbackModal(true)} className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-colors">
            Submit Review
          </button>
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <Link to="/student/courses" className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">{course.name}</h2>
          <p className="text-slate-500 text-sm mt-1">{batch.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-200 bg-slate-50" style={{ WebkitOverflowScrolling: 'touch' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'Notifications') markAllRead();
              }}
              className={`relative whitespace-nowrap px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab}
              {tab === 'Notifications' && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="p-6 min-h-[500px]">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mentor</p>
                  <p className="font-bold text-slate-800">{batch.mentor}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Schedule</p>
                  <p className="font-bold text-slate-800">{batch.schedule}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <p className="font-bold text-slate-800">{batch.status}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Students</p>
                  <p className="font-bold text-slate-800">{batch.students || 0}</p>
               </div>
               <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4">
                 <h4 className="font-bold text-slate-800 mb-4">Latest Updates</h4>
                 {notifications.length > 0 ? (
                   <div className="space-y-3">
                     {notifications.slice(0, 3).map(n => (
                       <div key={n.id} className="p-4 border border-slate-200 rounded-xl">
                         <h5 className="font-bold text-slate-800">{n.title}</h5>
                         <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500">No recent updates.</div>
                 )}
               </div>

               <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
                 <h4 className="font-bold text-slate-800 mb-4">Course Syllabus</h4>
                 {course.syllabus && course.syllabus.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {course.syllabus.map((topic: string, i: number) => (
                        <div key={i} className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs flex items-start gap-2.5 shadow-sm">
                          <span className="w-5 h-5 rounded-full bg-[#1763B6]/10 text-[#1763B6] font-display font-extrabold text-[10px] flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-slate-700 font-medium">{topic}</span>
                        </div>
                      ))}
                    </div>
                 ) : (
                   <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500">No syllabus provided.</div>
                 )}
               </div>
            </div>
          )}
          
          {activeTab === 'Weekly Planner' && (
            <div className="space-y-4">
              {planners.length > 0 ? planners.map(p => (
                <div key={p.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                   <h4 className="font-bold text-slate-800">Week {p.weekNumber}: {p.topic}</h4>
                   <p className="text-sm text-slate-600 mt-2">{p.description}</p>
                </div>
              )) : <div className="p-12 text-center text-slate-500">No weekly planner available for this batch yet.</div>}
            </div>
          )}
          
          {activeTab === "Today's Session" && (
            <div>
              {todaySession ? (
                <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm max-w-2xl">
                   <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                        {new Date(todaySession.sessionDateTime || 0) <= now ? 'LIVE' : 'UPCOMING'}
                      </span>
                      <span className="text-sm font-semibold text-slate-500">{todaySession.platform || 'Meeting'} · {todaySession.sessionDateTime ? new Date(todaySession.sessionDateTime).toLocaleString() : `${todaySession.date || ''} ${todaySession.time || ''}`}</span>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-6">{todaySession.title || todaySession.topic}</h3>
                   {todaySession.meetingLink && (
                     <a href={todaySession.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                       <Video className="w-5 h-5" /> Join Session
                     </a>
                   )}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                   <Video className="w-12 h-12 text-slate-300 mb-4" />
                   <h3 className="text-lg font-bold text-slate-700">No Session Today</h3>
                   <p className="text-sm mt-1 max-w-sm">There is no live session scheduled for today.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Study Materials' && (
            <div className="space-y-4">
              {materials.length > 0 ? materials.map(m => (
                <div key={m.id} className="p-4 flex items-center justify-between border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{m.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{m.type} • Uploaded: {m.uploadDate}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                     {m.url && <a href={m.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-sm rounded-lg transition-colors">Open Material</a>}
                   </div>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                   <FileText className="w-12 h-12 text-slate-300 mb-4" />
                   <h3 className="text-lg font-bold text-slate-700">No Study Materials</h3>
                   <p className="text-sm mt-1 max-w-sm">No study materials have been uploaded for this batch yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Recorded Classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordings.length > 0 ? recordings.map(r => (
                <div key={r.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col group">
                   <div className="h-40 bg-slate-100 relative">
                     <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <a href={r.videoUrl} target="_blank" rel="noreferrer" className="bg-white/90 text-slate-900 p-3 rounded-full hover:scale-110 transition-transform">
                         <PlayCircle className="w-6 h-6" />
                       </a>
                     </div>
                   </div>
                   <div className="p-4 flex-1">
                     <h4 className="font-bold text-slate-800 line-clamp-2 mb-2">{r.title}</h4>
                     <p className="text-xs text-slate-500">{r.date} • {r.duration || 'N/A'} • {r.source || 'Video'}</p>
                   </div>
                </div>
              )) : (
                <div className="col-span-full p-12 text-center text-slate-500 flex flex-col items-center">
                   <PlayCircle className="w-12 h-12 text-slate-300 mb-4" />
                   <h3 className="text-lg font-bold text-slate-700">No Recordings</h3>
                   <p className="text-sm mt-1 max-w-sm">Recorded classes will appear here after live sessions are completed.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-4">
              {notifications.length > 0 ? notifications.map(n => (
                <div key={n.id} className={`p-4 border rounded-xl ${n.type === 'alert' ? 'border-red-200 bg-red-50/30' : n.type === 'success' ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${n.type === 'alert' ? 'bg-red-100 text-red-700' : n.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{n.type || 'info'}</span>
                    <span className="text-xs font-semibold text-slate-500">{n.date ? new Date(n.date).toLocaleString() : ''}</span>
                  </div>
                  <h4 className="font-bold text-slate-800">{n.title}</h4>
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{n.message}</p>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                   <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
                   <h3 className="text-lg font-bold text-slate-700">No Notifications</h3>
                   <p className="text-sm mt-1">You're all caught up.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Doubts' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Link to="/student/doubts" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm">Ask a Question</Link>
              </div>
              <div className="space-y-4">
                {doubts.length > 0 ? doubts.map(d => (
                  <div key={d.id} className="p-4 border border-slate-200 rounded-xl bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-800">{d.title || d.subject}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        d.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                        d.status === 'Answered' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                      }`}>{d.status}</span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{d.description || d.question}</p>
                    <div className="mt-4 flex justify-between items-center text-xs">
                      <span className="text-slate-500">{d.date}</span>
                      <Link to="/student/doubts" className="text-indigo-600 font-bold hover:underline">View Thread</Link>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-slate-500 flex flex-col items-center border border-slate-200 rounded-xl">
                     <HelpCircle className="w-12 h-12 text-slate-300 mb-4" />
                     <h3 className="text-lg font-bold text-slate-700">No Doubts Asked</h3>
                     <p className="text-sm mt-1">You haven't asked any questions for this batch yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
