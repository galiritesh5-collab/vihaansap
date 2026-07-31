import React, { useEffect, useState } from 'react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { HelpCircle, Search, Filter, MessageSquare, CheckCircle, XCircle, User, X, Send } from 'lucide-react';

export default function DoubtSupport() {
  const db = useDB();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDoubt, setSelectedDoubt] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const filteredDoubts = db.doubts.filter(doubt => {
    const studentName = doubt.studentName || doubt.student || '';
    const title = doubt.title || doubt.subject || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || doubt.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());

  useEffect(() => {
    if (!selectedDoubt) return;
    const refreshed = db.doubts.find(doubt => doubt.id === selectedDoubt.id);
    if (refreshed) setSelectedDoubt(refreshed);
  }, [db.doubts, selectedDoubt?.id]);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDoubt) return;

    MockDB.updateItem('doubts', selectedDoubt.id, {
      ...selectedDoubt,
      replies: [...(selectedDoubt.replies || []), { text: replyText, author: 'Admin', date: new Date().toISOString() }],
      status: 'Answered',
      updatedAt: new Date().toISOString()
    });
    
    // Add unified notification for the student
    MockDB.addItem('notifications', {
      notificationId: `notif-${Date.now()}`,
      type: 'doubt_reply',
      recipientType: 'student',
      recipientIds: [selectedDoubt.studentUid || selectedDoubt.studentId],
      batchId: selectedDoubt.batchId || '',
      title: "New Reply to Your Doubt",
      message: `Admin replied to your doubt: "${selectedDoubt.title || selectedDoubt.subject}"`,
      relatedEntityType: 'doubt',
      relatedEntityId: selectedDoubt.id,
      createdAt: new Date().toISOString(),
      readBy: [],
      // Legacy fields
      target: 'Specific Student',
      targetId: selectedDoubt.studentUid || selectedDoubt.studentId,
      date: new Date().toISOString().split('T')[0]
    });
    
    setReplyText('');
    
    // Refresh selected doubt
    const currentDB = MockDB.get();
    setSelectedDoubt(currentDB.doubts.find((d: any) => d.id === selectedDoubt.id));
  };

  const handleUpdateStatus = (id: string, status: string) => {
    MockDB.updateItem('doubts', id, { status, updatedAt: new Date().toISOString() });
    if (selectedDoubt?.id === id) {
      setSelectedDoubt({ ...selectedDoubt, status });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Global Doubt Support</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and respond to student queries.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[700px]">
        {/* Left sidebar - List */}
        <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 space-y-3 shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search doubts or students..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-sm font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Answered">Answered</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredDoubts.map(doubt => (
              <div 
                key={doubt.id} 
                onClick={() => setSelectedDoubt(doubt)}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-indigo-50/30 transition-colors ${selectedDoubt?.id === doubt.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    doubt.status === 'Answered' ? 'bg-blue-100 text-blue-700' : 
                    doubt.status === 'Closed' ? 'bg-slate-100 text-slate-600' : 
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {doubt.status}
                  </span>
                  <span className="text-xs text-slate-400">{doubt.createdAt ? new Date(doubt.createdAt).toLocaleString() : doubt.date}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{doubt.title || doubt.subject}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{doubt.description || doubt.question}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> 
                    <span>{doubt.studentName || doubt.student}</span>
                  </div>
                  <span className="truncate max-w-[100px]">{db.batches.find(b => b.id === doubt.batchId)?.course || doubt.course || 'Unknown'}</span>
                </div>
              </div>
            ))}
            {filteredDoubts.length === 0 && (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full text-slate-500">
                <MessageSquare className="w-8 h-8 text-slate-300 mb-3" />
                <p className="text-sm">No doubts found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Details */}
        <div className="w-full md:w-2/3 flex flex-col h-full bg-white">
          {selectedDoubt ? (
            <>
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    {(selectedDoubt.studentName || selectedDoubt.student || 'S').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedDoubt.studentName || selectedDoubt.student}</h3>
                    <p className="text-xs text-slate-500">{db.batches.find(b => b.id === selectedDoubt.batchId)?.course || selectedDoubt.course} • Batch: {db.batches.find(b => b.id === selectedDoubt.batchId)?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedDoubt.status}
                    onChange={e => handleUpdateStatus(selectedDoubt.id, e.target.value)}
                    className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
                  >
                    <option value="Open">Mark Open</option>
                    <option value="Pending">Mark Pending</option>
                    <option value="Answered">Mark Answered</option>
                    <option value="Closed">Mark Closed</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-b border-slate-100 shrink-0">
                <h3 className="font-bold text-lg text-slate-800 mb-3">{selectedDoubt.title || selectedDoubt.subject}</h3>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedDoubt.description || selectedDoubt.question}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                 {selectedDoubt.replies?.map((reply: any, idx: number) => (
                    <div key={idx} className={`flex ${reply.author === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl ${reply.author === 'Admin' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                        <span className="text-[10px] font-bold opacity-80 block mb-1">{reply.author}</span>
                        <p className="text-sm whitespace-pre-wrap">{reply.text}</p>
                      </div>
                    </div>
                 ))}
                 {(!selectedDoubt.replies || selectedDoubt.replies.length === 0) && (
                   <div className="text-center text-slate-400 py-8 text-sm">No replies yet.</div>
                 )}
              </div>

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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center justify-center transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" /> Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
              <MessageSquare className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-600 mb-2">Select a doubt</h3>
              <p className="text-sm max-w-sm">Choose a doubt from the list on the left to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
