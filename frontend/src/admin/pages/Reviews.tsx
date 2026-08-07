import React, { useState } from 'react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { Plus, Edit2, Trash2, X, CheckCircle, XCircle, RefreshCw, Eye, DownloadCloud } from 'lucide-react';

export default function Reviews() {
  const db = useDB();
  const [editingReview, setEditingReview] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [batchFilter, setBatchFilter] = useState<string>('All');

  const pendingCount = db.reviews?.filter((r: any) => !r.status || r.status === 'Pending').length || 0;
  const filteredReviews = db.reviews?.filter((r: any) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesBatch = batchFilter === 'All' || r.batchId === batchFilter;
    return matchesStatus && matchesBatch;
  }).sort((a: any, b: any) => new Date(b.submittedAt || b.createdAt || b.date || 0).getTime() - new Date(a.submittedAt || a.createdAt || a.date || 0).getTime()) || [];
  
  // Extract unique batches for the filter dropdown
  const uniqueBatches = Array.from(new Set(db.reviews?.map((r: any) => r.batchId).filter(Boolean)));


  
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  
  const handleImport = () => {
    try {
      const parsed = JSON.parse(importData);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      arr.forEach(rev => {
        MockDB.addItem('reviews', {
          ...rev,
          status: 'Pending',
          createdAt: new Date().toISOString()
        });
      });
      alert(`Successfully imported ${arr.length} reviews to Pending status.`);
      setShowImport(false);
      setImportData('');
    } catch (e) {
      alert("Invalid JSON format. Please provide an array of review objects.");
    }
  };

  const handleRequestResubmission = (review: any) => {
    if (window.confirm('This will delete the current review and send a new request to the student. Continue?')) {
      // 1. Delete review
      MockDB.deleteItem('reviews', review.id);
      // 2. Send notification to student
      MockDB.addItem('notifications', {
        notificationId: `notif-${Date.now()}`,
        type: 'review_request',
        target: 'Specific Student',
        targetId: review.studentId || review.uid || '',
        title: "Please Resubmit Your Feedback",
        message: "We noticed an issue with your previous review. Could you please resubmit it?",
        date: new Date().toISOString().split('T')[0],
        isFeedbackRequest: true
      });
      alert('Resubmission requested.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview.id) {
      MockDB.updateItem('reviews', editingReview.id, editingReview);
    } else {
      MockDB.addItem('reviews', { ...editingReview });
    }
    setEditingReview(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      MockDB.deleteItem('reviews', id);
    }
  };

  const handleApprove = (review: any) => {
    MockDB.updateItem('reviews', review.id, { ...review, status: 'Approved' });
  };

  const handleReject = (review: any) => {
    MockDB.updateItem('reviews', review.id, { ...review, status: 'Rejected' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Reviews CMS</h2>
          <p className="text-slate-500 text-sm mt-1">Manage public student testimonials. {pendingCount > 0 && <span className="ml-2 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount} Pending</span>}</p>
        </div>
        <button onClick={() => setShowImport(true)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
          <DownloadCloud className="w-4 h-4" /> Import Reviews
        </button>
        <button 
          onClick={() => setEditingReview({ name: '', role: '', company: '', text: '', rating: 5, status: 'Pending', avatar: '', course: '' })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${ statusFilter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900' }`}>
              {s} {s === 'Pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>
        
        <select 
          value={batchFilter} 
          onChange={(e) => setBatchFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Batches</option>
          {uniqueBatches.map(b => (
            <option key={b as string} value={b as string}>{db.batches?.find(batch => batch.id === b)?.name || b}</option>
          ))}
        </select>
      </div>


      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Review</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReviews?.map(review => (
              <tr key={review.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800">{review.studentName || review.name || review.student}</p>
                  <p className="text-xs text-slate-500">{review.designation || review.role} {review.company ? `@ ${review.company}` : ''}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-800">{review.courseName || review.course || review.module}</p>
                  <p className="text-xs text-slate-500">{review.batchName || db.batches?.find(b => b.id === review.batchId)?.name || review.batchId}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{review.feedback || review.content || review.text || review.review}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{review.rating} / 5</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    review.status === 'Approved' ? 'bg-green-50 text-green-600' : 
                    review.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {review.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleApprove(review)} className="p-2 text-slate-400 hover:text-green-600 rounded-lg hover:bg-green-50" title="Approve">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleReject(review)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Reject">
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleRequestResubmission(review)} className="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50" title="Request Resubmission">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingReview(review)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Import External Reviews</h3>
              <button onClick={() => setShowImport(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">Paste review data in JSON format. They will be added as "Pending Approval".</p>
              <textarea 
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={8}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder='[{"name": "John Doe", "rating": 5, "content": "Great course!"}]'
              ></textarea>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowImport(false)} className="px-4 py-2 font-bold text-slate-600">Cancel</button>
              <button onClick={handleImport} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">Import Reviews</button>
            </div>
          </div>
        </div>
      )}

      {editingReview && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{editingReview.id ? 'Edit Review' : 'Create Review'}</h3>
              <button onClick={() => setEditingReview(null)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form id="review-form" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Student Name</label>
                    <input required type="text" value={editingReview.name || ''} onChange={e => setEditingReview({...editingReview, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rating</label>
                    <input required type="number" min="1" max="5" value={editingReview.rating || ''} onChange={e => setEditingReview({...editingReview, rating: Number(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Student Photo URL</label>
                    <input type="text" value={editingReview.avatar || editingReview.image || ''} onChange={e => setEditingReview({...editingReview, avatar: e.target.value, image: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation</label>
                    <input type="text" value={editingReview.designation || ''} onChange={e => setEditingReview({...editingReview, designation: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. SAP Consultant" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">📘 Course Name</label>
                    <input type="text" value={editingReview.courseName || editingReview.course || editingReview.module || ''} onChange={e => setEditingReview({...editingReview, courseName: e.target.value, course: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. SAP FICO" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">👥 Batch Name</label>
                    <input type="text" value={editingReview.batchName || ''} onChange={e => setEditingReview({...editingReview, batchName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Batch 12 - Jan 2026" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                    <input required type="text" value={editingReview.role || ''} onChange={e => setEditingReview({...editingReview, role: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company</label>
                    <input required type="text" value={editingReview.company || ''} onChange={e => setEditingReview({...editingReview, company: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                  <select value={editingReview.status || 'Pending'} onChange={e => setEditingReview({...editingReview, status: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Review Content</label>
                  <textarea required rows={4} value={editingReview.text || ''} onChange={e => setEditingReview({...editingReview, text: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setEditingReview(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">Cancel</button>
              <button type="submit" form="review-form" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
