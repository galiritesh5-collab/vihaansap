import React, { useState } from 'react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { Plus, Edit2, Trash2, X, CheckCircle, XCircle } from 'lucide-react';

export default function Reviews() {
  const db = useDB();
  const [editingReview, setEditingReview] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');

  const pendingCount = db.reviews?.filter((r: any) => !r.status || r.status === 'Pending').length || 0;
  const filteredReviews = statusFilter === 'All' ? db.reviews : db.reviews?.filter((r: any) => r.status === statusFilter) || [];

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
        <button 
          onClick={() => setEditingReview({ name: '', role: '', company: '', text: '', rating: 5, status: 'Pending', avatar: '', course: '' })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {/* Status Filter Bar */}
      <div className="flex gap-2">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${ statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' }`}>
            {s} {s === 'Pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
          </button>
        ))}
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
                  <p className="text-sm font-bold text-slate-800">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.role} @ {review.company}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{review.course || review.module}</td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{review.text}</td>
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
                  <button onClick={() => setEditingReview(review)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course / Module</label>
                    <input required type="text" value={editingReview.course || editingReview.module || ''} onChange={e => setEditingReview({...editingReview, course: e.target.value, module: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
