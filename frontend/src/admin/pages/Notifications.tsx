import React, { useState } from 'react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { Plus, Edit2, Trash2, X, Send, Pin } from 'lucide-react';
import StudentRecipientSelector from '../components/StudentRecipientSelector';
export default function Notifications() {
  const db = useDB();
  const [editingNotif, setEditingNotif] = useState<any>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotif.id) {
      MockDB.updateItem('notifications', editingNotif.id, editingNotif);
    } else {
      MockDB.addItem('notifications', { ...editingNotif, date: new Date().toISOString().split('T')[0] });
    }
    setEditingNotif(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      MockDB.deleteItem('notifications', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Notifications</h2>
          <p className="text-slate-500 text-sm mt-1">Send announcements to students and mentors.</p>
        </div>
        <button 
          onClick={() => setEditingNotif({ title: '', message: '', target: 'Entire Platform', priority: 'Normal', pinned: false })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Notification
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title / Message</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Expiry</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.notifications.map(notif => (
              <tr key={notif.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {notif.priority === 'Urgent' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                    {notif.priority === 'Important' && <span className="w-2 h-2 rounded-full bg-orange-500"></span>}
                    {notif.priority === 'Normal' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                    {notif.title}
                    {notif.pinned && <Pin className="w-3 h-3 text-indigo-500" />}
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-sm mt-1">{notif.message}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                    {notif.target} {notif.targetId ? `(${notif.targetId})` : ''}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex flex-col">
                    <span>{notif.date}</span>
                    {notif.expiryDate && <span className="text-xs text-slate-400">Expires: {notif.expiryDate}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setEditingNotif(notif)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(notif.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {db.notifications.length === 0 && (
               <tr>
                 <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No notifications found.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingNotif && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{editingNotif.id ? 'Edit Notification' : 'New Notification'}</h3>
              <button onClick={() => setEditingNotif(null)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form id="notif-form" onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                  <input required type="text" value={editingNotif.title || ''} onChange={e => setEditingNotif({...editingNotif, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                  <textarea required rows={4} value={editingNotif.message || ''} onChange={e => setEditingNotif({...editingNotif, message: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                    <select value={editingNotif.priority || 'Normal'} onChange={e => setEditingNotif({...editingNotif, priority: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Audience</label>
                    <select value={editingNotif.target || 'Entire Platform'} onChange={e => setEditingNotif({...editingNotif, target: e.target.value, targetId: ''})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="Entire Platform">Entire Platform</option>
                      <option value="Course">Specific Course</option>
                      <option value="Batch">Specific Batch</option>
                      <option value="Student">Specific Student</option>
                    </select>
                  </div>
                </div>

                {['Course', 'Batch', 'Student'].includes(editingNotif.target) && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select {editingNotif.target}</label>
                    {editingNotif.target === 'Course' && (
                      <select required value={editingNotif.targetId || ''} onChange={e => setEditingNotif({...editingNotif, targetId: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select a Course</option>
                        {db.courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    )}
                    {editingNotif.target === 'Batch' && (
                      <select required value={editingNotif.targetId || ''} onChange={e => setEditingNotif({...editingNotif, targetId: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select a Batch</option>
                        {db.batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    )}
                    {editingNotif.target === 'Student' && (
                      <StudentRecipientSelector
                        students={db.students}
                        selectedIds={editingNotif.targetId ? editingNotif.targetId.split(',') : []}
                        onChange={(ids) => setEditingNotif({ ...editingNotif, targetId: ids.join(',') })}
                        emptyMessage="No students enrolled."
                      />
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date (Optional)</label>
                  <input type="date" value={editingNotif.expiryDate || ''} onChange={e => setEditingNotif({...editingNotif, expiryDate: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="pinned" checked={editingNotif.pinned || false} onChange={e => setEditingNotif({...editingNotif, pinned: e.target.checked})} className="mr-2 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="pinned" className="text-sm font-semibold text-slate-700">Pin to top of Student Dashboard</label>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button onClick={() => setEditingNotif(null)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 text-sm">Cancel</button>
              <button type="submit" form="notif-form" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {editingNotif.id ? 'Save Changes' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
