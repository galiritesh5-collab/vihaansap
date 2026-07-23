import React, { useState } from 'react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { Plus, Edit2, Trash2, X, Download, FileSpreadsheet, FileText, FileJson } from 'lucide-react';
import { exportBatchExcel, exportBatchCSV, exportBatchPDF } from '../utils/exportBatch';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Batches() {
  const db = useDB();
  const { userRole, currentUser } = useAuth();
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState<string | null>(null);

  const isMentor = userRole === 'mentor';
  const currentMentor = isMentor ? db.mentors?.find(m => m.email === currentUser?.email) : null;
  const assignedBatchIds = currentMentor?.assignedBatchIds || [];

  const visibleBatches = isMentor 
    ? db.batches.filter(b => assignedBatchIds.includes(b.id))
    : db.batches;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBatch.id) {
      MockDB.updateItem('batches', editingBatch.id, editingBatch);
    } else {
      MockDB.addItem('batches', editingBatch);
    }
    setEditingBatch(null);
  };


  const handleExport = (batch: any, type: 'excel' | 'pdf' | 'csv') => {
    const batchStudents = db.students.filter(s => batch.studentIds?.includes(s.id));
    const allAccounts = (db as any).accounts || [];
    
    if (type === 'excel') exportBatchExcel(batch, batchStudents, allAccounts);
    if (type === 'csv') exportBatchCSV(batch, batchStudents, allAccounts);
    if (type === 'pdf') exportBatchPDF(batch, batchStudents, allAccounts);
    
    setExportMenuOpen(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      MockDB.deleteItem('batches', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Batches</h2>
          <p className="text-slate-500 text-sm mt-1">Manage active and upcoming batches.</p>
        </div>
        {!isMentor && (
          <button 
            onClick={() => setEditingBatch({ name: '', course: '', mentor: '', students: 0, status: 'Upcoming', startDate: '', studentIds: [] })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Batch
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Batch Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mentor</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleBatches.map(batch => (
              <tr key={batch.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800">{batch.name}</p>
                  <p className="text-xs text-slate-500">Start: {batch.startDate}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{batch.course}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{batch.mentor}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    batch.status === 'Running' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {batch.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <div className="relative inline-block mr-2">
                    <button 
                      onClick={() => setExportMenuOpen(exportMenuOpen === batch.id ? null : batch.id)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Export
                    </button>
                    {exportMenuOpen === batch.id && (
                      <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden z-10 py-1">
                        <button onClick={() => handleExport(batch, 'excel')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel
                        </button>
                        <button onClick={() => handleExport(batch, 'pdf')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-600" /> PDF
                        </button>
                        <button onClick={() => handleExport(batch, 'csv')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs flex items-center gap-2">
                          <FileJson className="w-4 h-4 text-blue-600" /> CSV
                        </button>
                      </div>
                    )}
                  </div>
                  <Link to={`/admin/batches/${batch.id}`} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold mr-2">
                    Manage Workspace
                  </Link>
                  {!isMentor && (
                    <>
                      <button onClick={() => setEditingBatch(batch)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(batch.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingBatch && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{editingBatch.id ? 'Edit Batch' : 'Create Batch'}</h3>
              <button onClick={() => setEditingBatch(null)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form id="batch-form" onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Batch Name</label>
                  <input required type="text" value={editingBatch.name || ''} onChange={e => setEditingBatch({...editingBatch, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course</label>
                    <select value={editingBatch.course || ''} onChange={e => setEditingBatch({...editingBatch, course: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Select Course...</option>
                      {db.courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mentor</label>
                    <select value={editingBatch.mentor || ''} onChange={e => setEditingBatch({...editingBatch, mentor: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Select Mentor...</option>
                      {db.mentors.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
                    <input required type="date" value={editingBatch.startDate || ''} onChange={e => setEditingBatch({...editingBatch, startDate: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                    <select value={editingBatch.status || 'Upcoming'} onChange={e => setEditingBatch({...editingBatch, status: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="Upcoming">Upcoming</option>
                      <option value="Running">Running</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setEditingBatch(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">Cancel</button>
              <button type="submit" form="batch-form" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Batch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
