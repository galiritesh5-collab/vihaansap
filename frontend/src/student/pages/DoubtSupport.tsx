import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { HelpCircle, Plus, X, Send, Clock, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { MockDB } from '../../services/MockDB';
import { useActiveBatch } from '../contexts/ActiveBatchContext';

const PRIORITY_COLORS: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-slate-100 text-slate-600',
};

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  Open: { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Open' },
  Answered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Answered' },
  'Need More Information': { color: 'bg-amber-100 text-amber-700', icon: AlertCircle, label: 'Need Info' },
  Closed: { color: 'bg-slate-100 text-slate-500', icon: X, label: 'Closed' },
  Pending: { color: 'bg-orange-100 text-orange-700', icon: Clock, label: 'Pending' },
};

export default function DoubtSupport() {
  const { currentUser, studentProfile } = useAuth();
  const db = useDB();

  const { activeBatch } = useActiveBatch();
  const studentIds = [studentProfile?.id, currentUser?.uid].filter(Boolean);

  const myDoubts = (db.doubts || [])
    .filter((d: any) => studentIds.includes(d.studentId))
    .sort((a: any, b: any) =>
      new Date(b.createdAt || b.date || 0).getTime() -
      new Date(a.createdAt || a.date || 0).getTime()
    );

  const [selectedDoubt, setSelectedDoubt] = useState<any | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  const [replyText, setReplyText] = useState('');

  // Get replies for selected doubt
  const doubtReplies = selectedDoubt
    ? (db.doubtReplies || [])
        .filter((r: any) => r.doubtId === selectedDoubt.id)
        .sort(
          (a: any, b: any) =>
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        )
    : [];

  // Live-refresh selected doubt when db updates
  useEffect(() => {
    if (!selectedDoubt) return;
    const refreshed = db.doubts?.find((d: any) => d.id === selectedDoubt.id);
    if (refreshed) setSelectedDoubt(refreshed);
  }, [db.doubts, selectedDoubt?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch || !studentProfile || !title.trim() || !description.trim()) return;
    const course = db.courses?.find((item: any) => item.name === activeBatch.course);
    const now = new Date().toISOString();
    const doubtId = `doubt-${Date.now()}`;

    const newDoubt = {
      id: doubtId,
      studentId: currentUser?.uid || studentProfile.id,
      studentName: studentProfile.name,
      studentEmail: currentUser?.email || studentProfile.email || '',
      batchId: activeBatch.id,
      batchName: activeBatch.name,
      courseId: course?.id || '',
      courseName: activeBatch.course,
      mentorId: activeBatch.mentor || '',
      topic: title.trim(),
      title: title.trim(),
      question: description.trim(),
      description: description.trim(),
      priority,
      status: 'Open',
      date: now.split('T')[0],
      createdAt: now,
      updatedAt: now,
      replies: [],
    };

    MockDB.addItem('doubts', newDoubt);

    // Notify mentor
    MockDB.addItem('notifications', {
      id: `notif-${Date.now()}`,
      type: 'info',
      target: 'Mentors',
      title: `New Doubt from ${studentProfile.name}`,
      message: `"${title.trim()}" — ${priority} priority`,
      date: now.split('T')[0],
      createdAt: now,
      relatedDoubtId: doubtId,
    });

    setTitle('');
    setDescription('');
    setPriority('Medium');
    setIsAsking(false);
    setSelectedDoubt(null);
  };

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
      authorId: currentUser?.uid || studentProfile?.id || '',
      authorName: studentProfile?.name || 'Student',
      authorRole: 'student',
      // backward compat
      author: studentProfile?.name || 'Student',
      content: replyText,
      text: replyText,
      createdAt: now,
      date: now,
    };

    // Write to doubtReplies collection (Firestore-ready)
    MockDB.addItem('doubtReplies', newReply);

    // Also update embedded replies array for backward compat
    MockDB.updateItem('doubts', selectedDoubt.id, {
      replies: [...(selectedDoubt.replies || []), newReply],
      updatedAt: now,
      status: selectedDoubt.status === 'Answered' ? 'Open' : selectedDoubt.status,
    });

    setReplyText('');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">
            Doubt Support
          </h2>
          <p className="text-slate-500 text-sm mt-1">Raise a question — your mentor will reply soon.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Left Column: Ticket List */}
        <div className="w-full md:w-72 flex flex-col gap-3 overflow-y-auto pr-1 pb-4 shrink-0">
          <button
            onClick={() => { setIsAsking(true); setSelectedDoubt(null); }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors flex items-center justify-between ${
              isAsking ? 'border-[#1763B6] bg-blue-50/50' : 'border-dashed border-slate-200 hover:border-[#1763B6] bg-white'
            }`}
          >
            <span className="font-bold text-[#1763B6]">Ask a New Question</span>
            <Plus className="w-5 h-5 text-[#1763B6]" />
          </button>

          {myDoubts.map((doubt: any) => {
            const statusCfg = STATUS_CONFIG[doubt.status] || STATUS_CONFIG['Open'];
            return (
              <div
                key={doubt.id}
                onClick={() => { setSelectedDoubt(doubt); setIsAsking(false); }}
                className={`bg-white rounded-xl border-2 shadow-sm p-4 hover:border-slate-300 transition-all cursor-pointer ${
                  selectedDoubt?.id === doubt.id ? 'border-[#1763B6] ring-1 ring-[#1763B6]/20' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${PRIORITY_COLORS[doubt.priority] || PRIORITY_COLORS['Medium']}`}>
                    {doubt.priority || 'Medium'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-1">{doubt.title || doubt.question}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MessageCircle className="w-3 h-3" />
                  <span>{(doubt.replies?.length || 0) + (db.doubtReplies?.filter((r: any) => r.doubtId === doubt.id).length || 0)} replies</span>
                  <span className="ml-auto">{doubt.date || ''}</span>
                </div>
              </div>
            );
          })}

          {myDoubts.length === 0 && !isAsking && (
            <div className="p-8 text-center text-slate-400 text-sm">
              <HelpCircle className="w-10 h-10 mx-auto mb-3 text-slate-200" />
              No questions yet. Ask your first question!
            </div>
          )}
        </div>

        {/* Right Column: Thread or Form */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0">
          {selectedDoubt ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedDoubt(null)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors md:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{selectedDoubt.title}</h3>
                    <p className="text-xs text-slate-400">{selectedDoubt.batchName} • {selectedDoubt.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${PRIORITY_COLORS[selectedDoubt.priority] || PRIORITY_COLORS['Medium']}`}>
                    {selectedDoubt.priority || 'Medium'}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${(STATUS_CONFIG[selectedDoubt.status] || STATUS_CONFIG['Open']).color}`}>
                    {(STATUS_CONFIG[selectedDoubt.status] || STATUS_CONFIG['Open']).label}
                  </span>
                </div>
              </div>

              {/* Original Question */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Original Question</p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedDoubt.description || selectedDoubt.question}
                </p>
              </div>

              {/* Replies Thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {doubtReplies.length === 0 && (!selectedDoubt.replies || selectedDoubt.replies.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <MessageCircle className="w-12 h-12 text-slate-200 mb-3" />
                    <p className="text-sm">Waiting for mentor reply...</p>
                  </div>
                ) : (
                  <>
                    {/* Show doubtReplies (primary) or fall back to embedded replies */}
                    {(doubtReplies.length > 0 ? doubtReplies : (selectedDoubt.replies || [])).map((reply: any, idx: number) => {
                      const isMe = (reply.authorId === (currentUser?.uid || studentProfile?.id)) || reply.author === studentProfile?.name;
                      return (
                        <div key={reply.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${isMe ? 'bg-[#1763B6] text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                            <span className="text-[10px] font-bold opacity-70 block mb-1 capitalize">
                              {reply.authorName || reply.author || 'User'} • {reply.authorRole || ''}
                            </span>
                            <p className="text-sm whitespace-pre-wrap">{reply.content || reply.text}</p>
                            <span className="text-[10px] opacity-50 block mt-1 text-right">
                              {reply.createdAt ? new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Reply Input */}
              {selectedDoubt.status !== 'Closed' && (
                <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                  <form onSubmit={handleReplySubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Add more information or reply..."
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="bg-[#1763B6] hover:bg-[#145096] disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : isAsking ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
                <h3 className="font-bold text-slate-800">Ask a New Question</h3>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
                  {/* Pre-filled: Active Batch */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Active Batch
                    </label>
                    <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600">
                      {activeBatch ? `${activeBatch.course} — ${activeBatch.name}` : 'No active batch assigned yet'}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Priority
                    </label>
                    <div className="flex gap-2">
                      {['Low', 'Medium', 'High'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${
                            priority === p
                              ? p === 'High' ? 'bg-red-50 text-red-700 border-red-200' : p === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topic/Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Topic
                    </label>
                    <input
                      required
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g., Error in T-Code FS00"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
                    />
                  </div>

                  {/* Detailed Question */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Detailed Question
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Describe your issue in as much detail as possible..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAsking(false)}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!activeBatch}
                      className="flex-1 sm:flex-none bg-[#1763B6] hover:bg-[#145096] disabled:opacity-50 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    >
                      Submit Question
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-50/50">
              <HelpCircle className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">How can we help?</h3>
              <p className="text-sm mt-1 max-w-sm">
                Select a ticket from the list to view the conversation, or ask a new question.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
