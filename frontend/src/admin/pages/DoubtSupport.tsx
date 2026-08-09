import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import {
  HelpCircle, Search, Filter, MessageSquare, User, Send,
  AlertCircle, Clock, CheckCircle, X, RefreshCw
} from 'lucide-react';

const PRIORITY_COLORS: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-slate-100 text-slate-600',
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  Open: { color: 'bg-blue-100 text-blue-700', label: 'Open' },
  Answered: { color: 'bg-green-100 text-green-700', label: 'Answered' },
  'Need More Information': { color: 'bg-amber-100 text-amber-700', label: 'Need More Info' },
  Closed: { color: 'bg-slate-100 text-slate-500', label: 'Closed' },
  Pending: { color: 'bg-orange-100 text-orange-700', label: 'Pending' },
};

export default function DoubtSupport({ fixedBatchId }: { fixedBatchId?: string } = {}) {
  const { currentUser, userRole } = useAuth();
  const db = useDB();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState(fixedBatchId || 'All');
  const [selectedDoubt, setSelectedDoubt] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  // Get replies for selected doubt from doubtReplies collection
  const doubtReplies = selectedDoubt
    ? (db.doubtReplies || [])
        .filter((r: any) => r.doubtId === selectedDoubt.id)
        .sort((a: any, b: any) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
    : [];

  const uniqueBatches = Array.from(new Set((db.doubts || []).map((d: any) => d.batchId).filter(Boolean)));

  const filteredDoubts = (db.doubts || []).filter((doubt: any) => {
    const studentName = doubt.studentName || doubt.student || '';
    const title = doubt.title || doubt.subject || '';
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || doubt.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || doubt.priority === priorityFilter;
    const matchesBatch = batchFilter === 'All' || doubt.batchId === batchFilter;
    const matchesMentor = userRole === 'mentor' ? doubt.mentorId === currentUser?.uid : true;
    return matchesSearch && matchesStatus && matchesPriority && matchesBatch && matchesMentor;
  }).sort((a: any, b: any) => {
    // Sort by priority first (High → Medium → Low), then by date
    const pOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
    const pDiff = (pOrder[a.priority] ?? 1) - (pOrder[b.priority] ?? 1);
    if (pDiff !== 0) return pDiff;
    return new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime();
  });

  useEffect(() => {
    if (!selectedDoubt) return;
    const refreshed = db.doubts?.find((d: any) => d.id === selectedDoubt.id);
    if (refreshed) setSelectedDoubt(refreshed);
  }, [db.doubts, selectedDoubt?.id]);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDoubt) return;
    const now = new Date().toISOString();
    const replyId = `reply-${Date.now()}`;

    const newReply = {
      id: replyId,
      doubtId: selectedDoubt.id,
      studentId: selectedDoubt.studentId,
      batchId: selectedDoubt.batchId,
      authorId: currentUser?.uid || 'admin',
      authorName: currentUser?.displayName || 'Admin',
      authorRole: userRole || 'admin',
      // backward compat
      author: currentUser?.displayName || 'Admin',
      content: replyText,
      text: replyText,
      createdAt: now,
      date: now,
    };

    // Write to separate doubtReplies collection (Firestore-ready)
    MockDB.addItem('doubtReplies', newReply);

    // Also update embedded replies array for backward compat
    MockDB.updateItem('doubts', selectedDoubt.id, {
      replies: [...(selectedDoubt.replies || []), newReply],
      status: 'Answered',
      updatedAt: now,
    });

    // Notify student
    MockDB.addItem('notifications', {
      id: `notif-${Date.now()}`,
      type: 'info',
      target: 'Specific Student',
      targetId: selectedDoubt.studentId,
      title: 'Reply to Your Doubt',
      message: `Admin replied: "${selectedDoubt.title || selectedDoubt.subject}"`,
      date: now.split('T')[0],
      createdAt: now,
    });

    setReplyText('');
  };

  const handleUpdateStatus = (id: string, status: string) => {
    MockDB.updateItem('doubts', id, { status, updatedAt: new Date().toISOString() });
    if (selectedDoubt?.id === id) {
      setSelectedDoubt({ ...selectedDoubt, status });
    }
  };

  const handleMentorAssign = (mentorId: string) => {
    if (!selectedDoubt) return;
    MockDB.updateItem('doubts', selectedDoubt.id, { mentorId, updatedAt: new Date().toISOString() });
    setSelectedDoubt({ ...selectedDoubt, mentorId });
  };

  const openCount = (db.doubts || []).filter((d: any) => d.status === 'Open' || d.status === 'Pending').length;
  const highPriorityCount = (db.doubts || []).filter((d: any) => d.priority === 'High' && d.status !== 'Closed').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">
            Doubt Support CMS
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage and respond to student queries.
            {openCount > 0 && <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{openCount} Open</span>}
            {highPriorityCount > 0 && <span className="ml-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{highPriorityCount} High Priority</span>}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" style={{ height: '75vh' }}>
        {/* Left sidebar - Ticket List */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
          {/* Filters */}
          <div className="p-3 border-b border-slate-200 space-y-2 bg-white shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search topic or student..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="flex-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Answered">Answered</option>
                <option value="Need More Information">Need Info</option>
                <option value="Closed">Closed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="flex-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <select
              value={batchFilter}
              onChange={e => setBatchFilter(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
            >
              <option value="All">All Batches</option>
              {uniqueBatches.map(bid => (
                <option key={bid as string} value={bid as string}>
                  {db.batches?.find((b: any) => b.id === bid)?.name || bid}
                </option>
              ))}
            </select>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredDoubts.map((doubt: any) => {
              const statusCfg = STATUS_CONFIG[doubt.status] || STATUS_CONFIG['Open'];
              return (
                <div
                  key={doubt.id}
                  onClick={() => setSelectedDoubt(doubt)}
                  className={`p-4 cursor-pointer hover:bg-indigo-50/30 transition-colors border-l-4 ${
                    selectedDoubt?.id === doubt.id
                      ? 'bg-indigo-50 border-l-indigo-600'
                      : 'border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${PRIORITY_COLORS[doubt.priority] || PRIORITY_COLORS['Medium']}`}>
                      {doubt.priority || 'Medium'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{doubt.title || doubt.subject}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{doubt.description || doubt.question}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{doubt.studentName || doubt.student}</span>
                    </div>
                    <span>{doubt.date || ''}</span>
                  </div>
                </div>
              );
            })}
            {filteredDoubts.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm">No doubts found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Detail & Thread */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {selectedDoubt ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex justify-between items-start shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                    {(selectedDoubt.studentName || 'S').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedDoubt.studentName || selectedDoubt.student}</h3>
                    <p className="text-xs text-slate-500">
                      {db.batches?.find((b: any) => b.id === selectedDoubt.batchId)?.name || 'Unknown Batch'} &bull; {selectedDoubt.courseName || ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {/* Mentor Assign */}
                  <select
                    value={selectedDoubt.mentorId || ''}
                    onChange={e => handleMentorAssign(e.target.value)}
                    className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
                  >
                    <option value="">Assign Mentor</option>
                    {(db.mentors || []).map((m: any) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  {/* Status */}
                  <select
                    value={selectedDoubt.status}
                    onChange={e => handleUpdateStatus(selectedDoubt.id, e.target.value)}
                    className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
                  >
                    <option value="Open">Mark Open</option>
                    <option value="Pending">Mark Pending</option>
                    <option value="Answered">Mark Answered</option>
                    <option value="Need More Information">Need More Info</option>
                    <option value="Closed">Mark Closed</option>
                  </select>
                </div>
              </div>

              {/* Original Question */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                <h3 className="font-bold text-slate-800 mb-2">{selectedDoubt.title || selectedDoubt.subject}</h3>
                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {selectedDoubt.description || selectedDoubt.question}
                </p>
              </div>

              {/* Replies Thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                {(doubtReplies.length > 0 ? doubtReplies : (selectedDoubt.replies || [])).map((reply: any, idx: number) => {
                  const isAdmin = reply.authorRole === 'admin' || reply.author === 'Admin';
                  return (
                    <div key={reply.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${isAdmin ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                        <span className="text-[10px] font-bold opacity-70 block mb-1 capitalize">
                          {reply.authorName || reply.author} · {reply.authorRole || 'student'}
                        </span>
                        <p className="text-sm whitespace-pre-wrap">{reply.content || reply.text}</p>
                        <span className="text-[10px] opacity-50 block mt-1 text-right">
                          {reply.createdAt ? new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {doubtReplies.length === 0 && (!selectedDoubt.replies || selectedDoubt.replies.length === 0) && (
                  <div className="text-center text-slate-400 py-8 text-sm">No replies yet.</div>
                )}
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-slate-200 bg-white shrink-0">
                <form onSubmit={handleReplySubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply to the student..."
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <MessageSquare className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-600 mb-2">Select a ticket</h3>
              <p className="text-sm max-w-sm">Choose a doubt from the list to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
