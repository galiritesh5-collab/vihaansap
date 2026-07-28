import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { HelpCircle, Plus, X, Send, Paperclip } from 'lucide-react';
import { MockDB } from '../../services/MockDB';
import { useActiveBatch } from '../contexts/ActiveBatchContext';

export default function DoubtSupport() {
  const { currentUser, studentProfile } = useAuth();
  const db = useDB();
  
  const { activeBatch, enrolledBatches } = useActiveBatch();
  const myBatches = enrolledBatches;
  const studentIds = [studentProfile?.id, currentUser?.uid].filter(Boolean);
  const myDoubts = db.doubts?.filter(d => {
    if (!studentIds.includes(d.studentId) || d.batchId !== activeBatch?.id) return false;
    const lastActive = new Date(d.updatedAt || d.createdAt || d.date || 0).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return lastActive >= thirtyDaysAgo;
  }).sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime()) || [];
  
  const [selectedDoubt, setSelectedDoubt] = useState<any | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  
  const [batchId, setBatchId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!selectedDoubt) return;
    const refreshed = db.doubts?.find(doubt => doubt.id === selectedDoubt.id);
    if (refreshed) setSelectedDoubt(refreshed);
  }, [db.doubts, selectedDoubt?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch || !studentProfile || !title.trim() || !description.trim()) return;
    const course = db.courses.find(item => item.name === activeBatch.course);
    const now = new Date().toISOString();
    const newDoubt = {
      id: `doubt-${Date.now()}`,
      studentId: currentUser?.uid || studentProfile.id,
      studentUid: currentUser?.uid || studentProfile.id,
      studentName: studentProfile.name,
      studentEmail: currentUser?.email || studentProfile.email || '',
      batchId: activeBatch.id,
      batchName: activeBatch.name,
      courseId: course?.id || '',
      courseName: activeBatch.course,
      title: title.trim(),
      subject: title.trim(),
      question: description.trim(),
      description: description.trim(),
      status: 'Open',
      date: now.split('T')[0],
      createdAt: now,
      updatedAt: now,
      replies: []
    };
    MockDB.addItem('doubts', newDoubt);
    setBatchId(activeBatch?.id || '');
    setTitle('');
    setDescription('');
    setIsAsking(false);
    setSelectedDoubt(null);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDoubt) return;
    
    const newReply = {
      author: studentProfile.name,
      text: replyText,
      date: new Date().toISOString()
    };
    
    MockDB.updateItem('doubts', selectedDoubt.id, {
      replies: [...(selectedDoubt.replies || []), newReply],
      updatedAt: new Date().toISOString()
    });
    
    setReplyText('');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Doubt Support</h2>
          <p className="text-slate-500 text-sm mt-1">Get help from mentors.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Left Column: Doubt List */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
          <button 
            onClick={() => { setIsAsking(true); setSelectedDoubt(null); setBatchId(activeBatch?.id || ''); }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors flex items-center justify-between ${isAsking ? 'border-[#1763B6] bg-blue-50/50' : 'border-dashed border-slate-200 hover:border-[#1763B6] bg-white'}`}
          >
            <span className="font-bold text-[#1763B6]">Ask a New Question</span>
            <Plus className="w-5 h-5 text-[#1763B6]" />
          </button>

          {myDoubts.map(doubt => (
            <div 
              key={doubt.id} 
              onClick={() => { setSelectedDoubt(doubt); setIsAsking(false); }}
              className={`bg-white rounded-xl border ${selectedDoubt?.id === doubt.id ? 'border-[#1763B6] ring-1 ring-[#1763B6]' : 'border-slate-100'} shadow-sm p-4 hover:border-slate-200 transition-colors cursor-pointer`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    doubt.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                    doubt.status === 'Resolved' || doubt.status === 'Closed' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doubt.status}
                  </span>
                  <span className="text-xs text-slate-400">{doubt.date}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{doubt.title || doubt.question}</h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{db.batches.find(b => b.id === doubt.batchId)?.course || 'Course'}</span>
              </div>
            </div>
          ))}
          
          {myDoubts.length === 0 && (
             <div className="p-8 text-center text-slate-500 text-sm">
               You haven't asked any questions yet.
             </div>
          )}
        </div>

        {/* Right Column: Thread or Form */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
          {selectedDoubt ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-bold text-slate-800">Doubt Details</h3>
                </div>
                <button onClick={() => setSelectedDoubt(null)} className="p-2 text-slate-400 hover:text-slate-600 md:hidden">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 border-b border-slate-100 shrink-0">
                 <h3 className="font-bold text-lg text-slate-800">{selectedDoubt.title || selectedDoubt.question}</h3>
                 <div className="mt-4 bg-slate-50 p-4 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100">
                    {selectedDoubt.description || selectedDoubt.question}
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 {selectedDoubt.replies?.map((reply: any, idx: number) => (
                    <div key={idx} className={`flex ${reply.author === studentProfile.name ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl ${reply.author === studentProfile.name ? 'bg-[#1763B6] text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                        <span className="text-[10px] font-bold opacity-80 block mb-1">{reply.author}</span>
                        <p className="text-sm">{reply.text}</p>
                      </div>
                    </div>
                 ))}
                 {(!selectedDoubt.replies || selectedDoubt.replies.length === 0) && (
                   <div className="flex items-center justify-center h-full">
                     <p className="text-sm text-slate-400">Waiting for mentor reply...</p>
                   </div>
                 )}
              </div>

              {selectedDoubt.status !== 'Closed' && (
                <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                  <form onSubmit={handleReplySubmit} className="flex gap-2">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your reply..." 
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
                    />
                    <button type="submit" className="bg-[#1763B6] hover:bg-[#145096] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : isAsking ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
                <h3 className="font-bold text-slate-800">Ask a Question</h3>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Active Batch</label>
                    <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600">{activeBatch ? `${activeBatch.course} (${activeBatch.name})` : 'No active batch assigned yet'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Topic</label>
                    <input 
                      required
                      type="text" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g., Error in T-Code FS00"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Question</label>
                    <textarea 
                      required
                      rows={6}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Describe your issue in detail..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
                    />
                  </div>
                  <div>
                    <button type="button" className="text-[#1763B6] flex items-center gap-2 text-sm font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
                      <Paperclip className="w-4 h-4" /> Attach Screenshot (Future)
                    </button>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <button type="submit" className="w-full sm:w-auto bg-[#1763B6] hover:bg-[#145096] text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors">
                      Send Question
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-50/50">
              <HelpCircle className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">How can we help?</h3>
              <p className="text-sm mt-1 max-w-sm">Select a question from the list to view replies, or ask a new question.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
