import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDB } from '../../hooks/useDB';
import { Send, ArrowLeft, Users, Calendar, Video, FileText, CheckSquare, MessageSquare, Star, Settings, Plus, PlayCircle, Edit2, Trash2, HelpCircle, X, ChevronDown, CheckCircle } from 'lucide-react';
import { MockDB } from '../../services/MockDB';
import ImageUploader from '../components/ImageUploader';
import DoubtSupport from './DoubtSupport';
import { useAuth } from '../../contexts/AuthContext';
import { BatchPlannerWeek, BatchSession, StudyMaterial, CourseRating, SessionFeedback } from '../../types';
import { enrolledStudentsForBatch } from '../../utils/recipientTargeting';

function TodaySessionTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches?.find(b => b.id === batchId);
  const students = enrolledStudentsForBatch(batch, db.students || []);
  const sessions = (db.batchSessions?.filter(s => s.batchId === batchId) || [])
    .sort((a, b) => new Date(b.sessionDateTime || b.createdAt || 0).getTime() - new Date(a.sessionDateTime || a.createdAt || 0).getTime());
  const [editing, setEditing] = useState<any | null>(null);
  const [recipientType, setRecipientType] = useState<'all' | 'selected'>('all');
  const [recipientIds, setRecipientIds] = useState<string[]>([]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const payload = { ...editing, batchId, recipientType, recipientIds: recipientType === 'all' ? [] : recipientIds, createdAt: editing.createdAt || new Date().toISOString() };
      if (editing.id) {
        MockDB.updateItem('batchSessions', editing.id, payload);
      } else {
        MockDB.addItem('batchSessions', payload);
        MockDB.addItem('notifications', {
          title: "New Live Session Scheduled",
          message: `A new session "${payload.title || payload.topic}" has been scheduled.`,
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          type: 'info',
          target: 'Batch',
          targetId: batchId,
          recipientType: recipientType,
          recipientIds: payload.recipientIds,
        });
      }
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Today's Session</h3>
        <button 
          onClick={() => { setEditing({ title: '', platform: 'Google Meet', meetingLink: '', sessionDateTime: '' }); setRecipientType('all'); setRecipientIds([]); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Session
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title *</label>
              <input required type="text" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform *</label>
              <select required value={editing.platform || ''} onChange={e => setEditing({...editing, platform: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Google Meet</option><option>Microsoft Teams</option><option>Zoom</option><option>Webex</option><option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meeting Link *</label>
              <input required type="url" value={editing.meetingLink || ''} onChange={e => setEditing({...editing, meetingLink: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date & Time *</label>
              <input required type="datetime-local" value={editing.sessionDateTime || ''} onChange={e => setEditing({...editing, sessionDateTime: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Visibility</label>
              <label className="mr-5 text-sm"><input type="radio" checked={recipientType === 'all'} onChange={() => setRecipientType('all')} /> All Students in Batch</label>
              <label className="text-sm"><input type="radio" checked={recipientType === 'selected'} onChange={() => setRecipientType('selected')} /> Selected Students</label>
              {recipientType === 'selected' && <div className="mt-3 max-h-40 overflow-auto rounded-lg border bg-white p-3 space-y-2">{students.map(s => <label key={s.id} className="block text-sm"><input type="checkbox" checked={recipientIds.includes(s.id)} onChange={() => setRecipientIds(ids => ids.includes(s.id) ? ids.filter(id => id !== s.id) : [...ids, s.id])} /> {s.name || s.email}</label>)}</div>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Publish Session</button>
          </div>
        </form>
      ) : <div className="divide-y rounded-xl border bg-white">{sessions.map(s => <div key={s.id} className="p-4 flex justify-between"><div><p className="font-bold">{s.title || s.topic}</p><p className="text-sm text-slate-500">{s.platform || 'Meeting'} Â· {s.sessionDateTime ? new Date(s.sessionDateTime).toLocaleString() : `${s.date || ''} ${s.time || ''}`}</p></div><button onClick={() => { setEditing(s); setRecipientType(s.recipientType || s.recipientMode || 'all'); setRecipientIds(s.recipientIds || []); }} className="text-indigo-600 font-semibold text-sm">Edit</button></div>)}{sessions.length === 0 && <div className="p-10 text-center text-slate-500">No sessions published.</div>}</div>}
    </div>
  );
}

function CourseCalendarTab({ batchId }: { batchId: string }) {
  const db = useDB();

  // --- Master source: course syllabus ---
  const batch = db.batches.find(b => b.id === batchId);
  const course = db.courses.find(c => c.name === batch?.course);
  const syllabus: string[] = course?.syllabus || [];

  // --- Overrides stored per syllabusIndex ---
  const sessionOverrides = db.batchSessions?.filter(s => s.batchId === batchId) || [];

  // Merge syllabus + overrides into a unified session list
  const mergedSessions = syllabus.map((topic, idx) => {
    const override = sessionOverrides.find((s: any) => s.syllabusIndex === idx);
    return {
      syllabusIndex: idx,
      topic,
      date: override?.date || '',
      time: override?.time || '',
      status: (override?.status || 'Upcoming') as 'Upcoming' | 'Live' | 'Completed',
      subTopics: override?.subTopics || [],
      id: override?.id || null,
    };
  });

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ date: string; time: string; status: string; subTopics: import('../../types').SubTopic[] }>({ date: '', time: '', status: 'Upcoming', subTopics: [] });
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const openEdit = (idx: number) => {
    const s = mergedSessions[idx];
    setEditForm({ date: s.date, time: s.time, status: s.status, subTopics: [...(s.subTopics || [])] });
    setEditingIdx(idx);
    setExpandedRow(idx); // Expand to show subtopics while editing
  };

  const addSubTopic = () => {
    setEditForm(f => ({
      ...f,
      subTopics: [...f.subTopics, { id: `st-${Date.now()}`, title: '', date: '', status: 'Upcoming', notes: '' }]
    }));
  };

  const updateSubTopic = (stId: string, field: string, value: string) => {
    setEditForm(f => ({
      ...f,
      subTopics: f.subTopics.map(st => st.id === stId ? { ...st, [field]: value } : st)
    }));
  };

  const deleteSubTopic = (stId: string) => {
    setEditForm(f => ({
      ...f,
      subTopics: f.subTopics.filter(st => st.id !== stId)
    }));
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    const s = mergedSessions[editingIdx];
    const payload = {
      batchId,
      syllabusIndex: editingIdx,
      topic: s.topic,
      date: editForm.date,
      time: editForm.time,
      status: editForm.status as any,
      subTopics: editForm.subTopics,
    };
    if (s.id) {
      MockDB.updateItem('batchSessions', s.id, payload);
    } else {
      MockDB.addItem('batchSessions', payload);
    }

    setEditingIdx(null);
  };

  const totalSessions = syllabus.length;
  const completedSessions = mergedSessions.filter(s => s.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Course Calendar</h3>
          {syllabus.length > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              Auto-imported from <span className="font-semibold text-indigo-600">{course?.name}</span> syllabus â€¢ {completedSessions}/{totalSessions} sessions completed
            </p>
          )}
        </div>
      </div>

      {syllabus.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <p className="text-amber-700 font-semibold text-sm">No syllabus found for this batch's course.</p>
          <p className="text-amber-600 text-xs mt-1">
            Go to <strong>Admin â†’ Courses â†’ {batch?.course}</strong> and add syllabus topics. They will appear here automatically.
          </p>
        </div>
      )}

      {/* Inline edit panel */}
      {editingIdx !== null && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <p className="text-sm font-bold text-slate-700">Editing Session #{editingIdx + 1}: {mergedSessions[editingIdx].topic}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
              <input type="date" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Time</label>
              <input type="time" value={editForm.time} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
              <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          
          {/* Subtopics Editor */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-slate-700">Sub Topics</h4>
              <button onClick={addSubTopic} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Subtopic
              </button>
            </div>
            <div className="space-y-3">
              {editForm.subTopics.map((st, i) => (
                <div key={st.id} className="grid grid-cols-12 gap-2 items-start bg-white p-2 rounded border border-slate-200">
                  <div className="col-span-4">
                    <input type="text" placeholder="Subtopic Title" value={st.title} onChange={e => updateSubTopic(st.id, 'title', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-3">
                    <input type="date" value={st.date} onChange={e => updateSubTopic(st.id, 'date', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-2">
                    <select value={st.status} onChange={e => updateSubTopic(st.id, 'status', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input type="text" placeholder="Notes (optional)" value={st.notes || ''} onChange={e => updateSubTopic(st.id, 'notes', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-1 flex justify-center mt-1">
                    <button onClick={() => deleteSubTopic(st.id)} className="text-red-400 hover:text-red-600 p-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {editForm.subTopics.length === 0 && (
                <p className="text-xs text-slate-400 italic">No subtopics added.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => { setEditingIdx(null); setExpandedRow(null); }} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="button" onClick={saveEdit} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Changes</button>
          </div>
        </div>
      )}

      {/* Merged sessions table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">#</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Topic (from Syllabus)</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mergedSessions.map((s, idx) => (
              <React.Fragment key={idx}>
                <tr className={`hover:bg-slate-50 ${s.status === 'Completed' ? 'opacity-75' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                    <div className="flex items-center gap-2">
                      <span className={s.status === 'Completed' ? 'line-through text-slate-400' : ''}>{s.topic}</span>
                      {s.subTopics && s.subTopics.length > 0 && (
                        <button 
                          onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                          className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold hover:bg-slate-200 transition-colors"
                        >
                          {s.subTopics.length} Subtopics {expandedRow === idx ? 'â–²' : 'â–¼'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {s.date ? (
                      <>
                        <p className="font-bold text-slate-800 text-sm">{s.date}</p>
                        <p className="text-xs text-slate-500">{s.time}</p>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      s.status === 'Live' ? 'bg-orange-50 text-orange-600' :
                      s.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(idx)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold p-1">Edit</button>
                    {s.status !== 'Completed' && (
                      <button
                        onClick={() => {
                          const payload = { batchId, syllabusIndex: idx, topic: s.topic, date: s.date || new Date().toISOString().split('T')[0], time: s.time, status: 'Completed' as const, subTopics: s.subTopics };
                          if (s.id) { MockDB.updateItem('batchSessions', s.id, payload); } else { MockDB.addItem('batchSessions', payload); }
                        }}
                        className="text-emerald-600 hover:text-emerald-800 text-xs font-bold p-1"
                      >
                        âœ“ Done
                      </button>
                    )}
                  </td>
                </tr>
                {/* Expandable Subtopics Row */}
                {expandedRow === idx && s.subTopics && s.subTopics.length > 0 && (
                  <tr className="bg-slate-50/50">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="pl-12 pr-4 py-2 space-y-2 border-l-2 border-indigo-200 ml-4">
                        {s.subTopics.map(st => (
                          <div key={st.id} className="flex items-start justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                            <div>
                              <p className={`text-sm font-bold ${st.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                {st.title}
                              </p>
                              {st.notes && <p className="text-xs text-slate-500 mt-1 italic">{st.notes}</p>}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold text-slate-600">{st.date}</p>
                              <div className="flex items-center justify-end gap-2 mt-1">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  st.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                  st.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {st.status}
                                </span>
                                {st.status !== 'Completed' && (
                                  <button
                                    onClick={() => {
                                      const newSubTopics = s.subTopics.map((sub: any) => sub.id === st.id ? { ...sub, status: 'Completed' } : sub);
                                      const payload = { batchId, syllabusIndex: idx, topic: s.topic, date: s.date, time: s.time, status: s.status, subTopics: newSubTopics };
                                      if (s.id) { MockDB.updateItem('batchSessions', s.id, payload); } else { MockDB.addItem('batchSessions', payload); }
                                    }}
                                    className="text-emerald-600 hover:text-emerald-800 text-[10px] font-bold p-1 bg-emerald-50 rounded"
                                  >
                                    âœ“ Done
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {mergedSessions.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500">Add syllabus topics to the course to populate this calendar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}




function OverviewTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches.find(b => b.id === batchId);
  if (!batch) return null;

  const students = db.students.filter(s => s.batch === batch.name);
  const materials = db.studyMaterials?.filter(m => m.batchId === batchId) || [];
  const recordings = db.recordings?.filter(r => r.batchId === batchId) || [];
  const doubts = db.doubts?.filter(d => d.batchId === batchId) || [];
  const pendingDoubts = doubts.filter(d => d.status === 'Pending' || d.status === 'Open').length;
  
  const sessions = db.batchSessions?.filter(s => s.batchId === batchId) || [];
  const todaySession = sessions.find(s => s.status === 'Live') || sessions.find(s => s.status === 'Upcoming');
  
  const notifications = db.notifications?.filter(n => n.target === 'Batch' && n.targetId === batchId) || [];
  const latestAnnouncement = notifications.length > 0 ? notifications[notifications.length - 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Batch Overview</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Students</p>
          <p className="text-2xl font-black text-indigo-600">{students.length}</p>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Doubts</p>
          <p className="text-2xl font-black text-orange-500">{pendingDoubts}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Study Materials</p>
          <p className="text-2xl font-black text-indigo-600">{materials.length}</p>
        </div>
      </div>
      
      <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-5">
             <h4 className="font-bold text-slate-800 mb-3">Today's Class</h4>
             {todaySession ? (
               <div>
                 <p className="text-sm font-bold text-indigo-600">{todaySession.topic}</p>
                 <p className="text-xs text-slate-500 mt-1">{todaySession.date} &bull; {todaySession.time}</p>
                 <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider rounded">{todaySession.status}</span>
               </div>
             ) : (
               <p className="text-sm text-slate-500">No session scheduled for today.</p>
             )}
          </div>
          
          <div className="border border-slate-200 rounded-xl p-5">
             <h4 className="font-bold text-slate-800 mb-3">Latest Announcement</h4>
             {latestAnnouncement ? (
               <div>
                 <p className="text-sm font-bold text-slate-800">{latestAnnouncement.title}</p>
                 <p className="text-xs text-slate-600 mt-1 line-clamp-2">{latestAnnouncement.message}</p>
                 <p className="text-[10px] text-slate-400 mt-2">{latestAnnouncement.date}</p>
               </div>
             ) : (
               <p className="text-sm text-slate-500">No recent announcements.</p>
             )}
          </div>
      </div>
    </div>
  );
}


function ReviewsFeedbackTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches?.find(b => b.id === batchId);
  const [editingExternalLink, setEditingExternalLink] = useState(false);
  const [externalLink, setExternalLink] = useState(batch?.externalReviewLink || '');
  
  // Reviews for this batch
  const batchReviews = (db.reviews || []).filter((r: any) => r.batchId === batchId);
  
  const approvedReviews = batchReviews.filter(r => r.status === 'Approved');
  const avgOverall = approvedReviews.length > 0 ? (approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / approvedReviews.length).toFixed(1) : '0.0';
  
  const handleSendReviewRequest = () => {
    // Send to all active students in batch
    const activeStudents = db.students?.filter(s => s.status === 'Active' && (batch?.studentIds?.includes(s.id) || s.batch === batch?.name));
    
    if (activeStudents?.length === 0) {
      alert("No active students found in this batch.");
      return;
    }
    
    // Create one notification targeting this batch (Student Portal resolves target === 'Batch' & targetId === activeBatch.id)
    MockDB.addItem('notifications', {
      notificationId: `notif-${Date.now()}`,
      type: 'review_request',
      target: 'Batch',
      targetId: batchId,
      title: "Course Feedback Requested",
      message: "Please share your learning experience.",
      date: new Date().toISOString().split('T')[0],
      isFeedbackRequest: true
    });
    alert(`Review request sent to ${activeStudents?.length || 0} active students.`);
  };

  const handleSaveExternalLink = () => {
    MockDB.updateItem('batches', batchId, { externalReviewLink: externalLink });
    setEditingExternalLink(false);
  };

  const handleApprove = (reviewId: string) => {
    MockDB.updateItem('reviews', reviewId, { status: 'Approved' });
  };

  const handleReject = (reviewId: string) => {
    MockDB.updateItem('reviews', reviewId, { status: 'Rejected' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Reviews & Feedback</h3>
          <p className="text-sm text-slate-500 mt-1">Manage student feedback and reviews for this batch.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSendReviewRequest}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Send Review Request
          </button>
        </div>
      </div>
      
      {/* Stats and External Link Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Average Rating</p>
            <p className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-current" /> {avgOverall}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Reviews</p>
            <p className="text-xl font-bold text-slate-800">{batchReviews.length}</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">External Review Link</p>
            {!editingExternalLink ? (
              <button onClick={() => setEditingExternalLink(true)} className="text-xs text-indigo-600 font-bold hover:underline">Edit</button>
            ) : (
              <button onClick={handleSaveExternalLink} className="text-xs text-green-600 font-bold hover:underline">Save</button>
            )}
          </div>
          {editingExternalLink ? (
            <input 
              type="text" 
              value={externalLink} 
              onChange={e => setExternalLink(e.target.value)}
              placeholder="https://forms.google.com/..." 
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
            />
          ) : (
            <p className="text-sm text-slate-700 truncate">{batch?.externalReviewLink || "Not configured. Using in-app review form."}</p>
          )}
        </div>
      </div>

      {batchReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-slate-700">No Reviews Yet</h4>
          <p className="mt-2 text-sm max-w-sm mx-auto">Send a review request to enrolled students. Their submissions will appear here for your approval.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200 shadow-sm">
          {batchReviews.map((review: any) => (
            <div key={review.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
                    {(review.name || review.studentName || 'S').charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{review.name || review.studentName || 'Student'}</p>
                    <p className="text-xs text-slate-400">{review.date || review.createdAt || ''} &bull; {review.course}</p>
                  </div>
                  <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    review.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    review.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {review.status || 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < (review.rating || 5) ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">{review.rating || 5}/5</span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">{review.feedback || review.content || review.text || review.review}</p>
              </div>
              <div className="flex sm:flex-col gap-2 justify-end sm:justify-start shrink-0">
                {review.status !== 'Approved' && (
                  <button onClick={() => handleApprove(review.id)} className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors">
                    Approve
                  </button>
                )}
                {review.status !== 'Rejected' && (
                  <button onClick={() => handleReject(review.id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LiveClassesTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches?.find(b => b.id === batchId);
  const enrolledStudents = db.students?.filter(s => batch?.studentIds?.includes(s.id)) || [];
  const allLiveClasses = (db.liveClasses || [])
    .filter(lc => lc.batchId === batchId)
    .sort((a, b) => new Date(b.scheduledAt || b.createdAt || 0).getTime() - new Date(a.scheduledAt || a.createdAt || 0).getTime());

  const [editing, setEditing] = useState<any | null>(null);
  const [recipientMode, setRecipientMode] = useState<'all' | 'selected'>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const openNew = () => {
    setEditing({ title: '', meetingLink: '', platform: 'Zoom', scheduledAt: '' });
    setRecipientMode('all');
    setSelectedStudentIds([]);
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const item = {
      ...editing,
      batchId,
      recipientType: recipientMode,
      recipientMode,
      recipientIds: recipientMode === 'all' ? [] : selectedStudentIds,
      createdAt: new Date().toISOString(),
    };
    if (editing.id) {
      MockDB.updateItem('liveClasses', editing.id, item);
    } else {
      MockDB.addItem('liveClasses', item);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Live Classes</h3>
        <button onClick={openNew} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Publish Live Class
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
              <input required type="text" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. SAP MM Module 3 Live Session" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform</label>
              <select value={editing.platform || 'Zoom'} onChange={e => setEditing({...editing, platform: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Zoom</option>
                <option>Microsoft Teams</option>
                <option>Google Meet</option>
                <option>Webex</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date & Time</label>
              <input required type="datetime-local" value={editing.scheduledAt || ''} onChange={e => setEditing({...editing, scheduledAt: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meeting Link</label>
              <input required type="url" value={editing.meetingLink || ''} onChange={e => setEditing({...editing, meetingLink: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipients</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={recipientMode === 'all'} onChange={() => setRecipientMode('all')} />
                  <span className="text-sm font-semibold text-slate-700">All Students in Batch</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={recipientMode === 'selected'} onChange={() => setRecipientMode('selected')} />
                  <span className="text-sm font-semibold text-slate-700">Selected Students</span>
                </label>
              </div>
              {recipientMode === 'selected' && (
                <div className="mt-3 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-white">
                  {enrolledStudents.length === 0 && <p className="text-sm text-slate-400">No students enrolled.</p>}
                  {enrolledStudents.map(s => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                      <input type="checkbox" checked={selectedStudentIds.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                      {s.name} <span className="text-slate-400 text-xs">({s.email})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Publish Live Class</button>
          </div>
        </form>
      )}

      <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-xl overflow-hidden">
        {allLiveClasses.map(lc => (
          <div key={lc.id} className="p-4 flex flex-col sm:flex-row justify-between gap-3 hover:bg-slate-50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{lc.platform}</span>
                <span className="text-xs text-slate-500">{lc.scheduledAt ? new Date(lc.scheduledAt).toLocaleString() : ''}</span>
              </div>
              <h4 className="font-bold text-slate-800">{lc.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Recipients: {lc.recipientMode === 'selected' ? `${(lc.recipientIds || []).length} selected students` : 'All students'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={lc.meetingLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">Open Link</a>
              <button onClick={() => MockDB.deleteItem('liveClasses', lc.id)} className="text-slate-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {allLiveClasses.length === 0 && !editing && (
          <div className="p-10 text-center text-slate-500">
            <Video className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-700">No Live Classes published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StudyMaterialsTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches?.find(b => b.id === batchId);
  const enrolledStudents = db.students?.filter(s => batch?.studentIds?.includes(s.id)) || [];
  const materials = (db.studyMaterials?.filter(m => m.batchId === batchId) || [])
    .sort((a, b) => new Date(b.uploadDate || b.createdAt || 0).getTime() - new Date(a.uploadDate || a.createdAt || 0).getTime());
  const [editing, setEditing] = useState<Partial<any> | null>(null);
  const [recipientMode, setRecipientMode] = useState<'all' | 'selected'>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const matData = {
        ...editing,
        recipientType: recipientMode,
        recipientMode,
        recipientIds: recipientMode === 'all' ? [] : selectedStudentIds,
        createdAt: editing.createdAt || new Date().toISOString(),
      };
      if (editing.id) {
        MockDB.updateItem('studyMaterials', editing.id, matData);
      } else {
        const newMat = {
          ...matData,
          id: `mat-${Date.now()}`,
          batchId,
          uploadDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          downloadAllowed: editing.downloadAllowed ?? true,
          visibility: editing.visibility || 'Students'
        };
        MockDB.addItem('studyMaterials', newMat);
        if (newMat.visibility === 'Students') {
          MockDB.addItem('notifications', {
            notificationId: `notif-${Date.now()}`,
            type: 'material_upload',
            recipientType: recipientMode,
            recipientIds: matData.recipientIds,
            batchId: batchId,
            title: "New Study Material",
            message: `New material "${editing.title || 'Untitled'}" is available for download.`,
            relatedEntityType: 'material',
            relatedEntityId: newMat.id || '',
            createdAt: new Date().toISOString(),
            readBy: [],
            // Legacy fields
            target: 'Batch',
            targetId: batchId,
            date: new Date().toISOString().split('T')[0]
          });
        }
      }
      setEditing(null);
    }
  };

  const openNew = () => {
    setEditing({ title: '', platform: 'Google Drive', url: '', visibility: 'Students' });
    setRecipientMode('all');
    setSelectedStudentIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Study Materials</h3>
        <button
          onClick={openNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Study Material
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
              <input required type="text" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Chapter 1 Notes" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform *</label>
              <select required value={editing.platform || ''} onChange={e => setEditing({...editing, platform: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg"><option>Google Drive</option><option>Google Docs</option><option>Google Sheets</option><option>OneDrive</option><option>YouTube</option><option>Website</option><option>Other</option></select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link *</label>
              <input required type="url" value={editing.url || ''} onChange={e => setEditing({...editing, url: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipients</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={recipientMode === 'all'} onChange={() => setRecipientMode('all')} />
                  <span className="text-sm font-semibold text-slate-700">All Students in Batch</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={recipientMode === 'selected'} onChange={() => setRecipientMode('selected')} />
                  <span className="text-sm font-semibold text-slate-700">Selected Students</span>
                </label>
              </div>
              {recipientMode === 'selected' && (
                <div className="mt-3 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-white">
                  {enrolledStudents.length === 0 && <p className="text-sm text-slate-400">No students enrolled.</p>}
                  {enrolledStudents.map(s => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                      <input type="checkbox" checked={selectedStudentIds.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                      {s.name} <span className="text-slate-400 text-xs">({s.email})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              Publish Material
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Details</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Platform</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Recipients</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map(mat => (
              <tr key={mat.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{mat.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{mat.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">{mat.platform || mat.type || 'Legacy Link'}</p>
                  <p className="text-xs text-slate-500">Published {mat.uploadDate || mat.createdAt}</p>
                </td>
                <td className="px-4 py-4 text-xs text-slate-500">
                  {mat.recipientMode === 'selected' ? `${(mat.recipientIds || []).length} students` : 'All'}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button onClick={() => { setEditing(mat); setRecipientMode(mat.recipientMode || 'all'); setSelectedStudentIds(mat.recipientIds || []); }} className="text-indigo-600 hover:text-indigo-800 p-2 font-semibold text-sm">Edit</button>
                    <button onClick={() => MockDB.deleteItem('studyMaterials', mat.id)} className="text-slate-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {materials.length === 0 && !editing && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No documents added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function AssignmentsTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const assignments = db.assignments?.filter(a => a.batchId === batchId) || [];
  const [editing, setEditing] = useState<Partial<import('../../types').Assignment> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      if (editing.id) {
        MockDB.updateItem('assignments', editing.id, editing);
      } else {
        MockDB.addItem('assignments', { ...editing, batchId, status: editing.status || 'Active' });
      }
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Assignments</h3>
        <button 
          onClick={() => setEditing({ title: '', description: '', dueDate: new Date().toISOString().split('T')[0], marks: 100, status: 'Active' })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Assignment
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
              <input required type="text" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <textarea required rows={3} value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
              <input required type="date" value={editing.dueDate || ''} onChange={e => setEditing({...editing, dueDate: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Marks</label>
              <input required type="number" value={editing.marks || ''} onChange={e => setEditing({...editing, marks: parseInt(e.target.value) as any})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Assignment</button>
          </div>
        </form>
      )}

      <div className="divide-y divide-slate-100">
        {assignments.map(a => (
          <div key={a.id} className="py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{a.title}</h4>
                <p className="text-xs text-slate-500">Due: {a.dueDate} â€¢ Marks: {a.marks}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${a.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'}`}>{a.status}</span>
              <button onClick={() => setEditing(a)} className="text-sm text-indigo-600 font-semibold hover:underline">Edit</button>
              <button onClick={() => MockDB.deleteItem('assignments', a.id)} className="text-slate-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {assignments.length === 0 && !editing && <div className="text-slate-500 py-8 text-center">No assignments added.</div>}
      </div>
    </div>
  );
}


function StudentsTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const { userRole } = useAuth();
  const isMentor = userRole === 'mentor';
  const batch = db.batches.find(b => b.id === batchId);
  const enrolledStudents = db.students.filter(s => batch?.studentIds?.includes(s.id));
  const availableStudents = db.students.filter(s => !batch?.studentIds?.includes(s.id));

  const addStudent = (studentId: string) => {
    const updatedBatch = { ...batch, studentIds: [...(batch?.studentIds || []), studentId], students: (batch?.students || 0) + 1 };
    MockDB.updateItem('batches', batchId, updatedBatch);
    MockDB.updateItem('students', studentId, { batch: batch?.name, course: batch?.course });
  };

  const removeStudent = (studentId: string) => {
    const updatedBatch = { ...batch, studentIds: batch?.studentIds?.filter((id: string) => id !== studentId), students: (batch?.students || 1) - 1 };
    MockDB.updateItem('batches', batchId, updatedBatch);
    MockDB.updateItem('students', studentId, { batch: '', course: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800">Enrolled Students ({enrolledStudents.length}/{batch?.maxStudents || 50})</h3>
        {!isMentor && (
          <select onChange={(e) => { if(e.target.value) addStudent(e.target.value); e.target.value=''; }} className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 max-w-xs w-full">
            <option value="">+ Assign Student</option>
            {availableStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
          </select>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
              {!isMentor && <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrolledStudents.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.status}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.email}</td>
                {!isMentor && (
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeStudent(s.id)} className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 bg-red-50 rounded">Remove</button>
                  </td>
                )}
              </tr>
            ))}
            {enrolledStudents.length === 0 && (
              <tr><td colSpan={isMentor ? 2 : 3} className="text-center py-8 text-slate-500">No students assigned to this batch.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



function RecordingsTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches?.find(b => b.id === batchId);
  const enrolledStudents = db.students?.filter(s => batch?.studentIds?.includes(s.id)) || [];
  const recordings = (db.recordings?.filter(r => r.batchId === batchId) || [])
    .sort((a, b) => new Date(b.date || b.uploadDate || 0).getTime() - new Date(a.date || a.uploadDate || 0).getTime());
  const [editing, setEditing] = useState<any | null>(null);
  const [recipientMode, setRecipientMode] = useState<'all' | 'selected'>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const recData = {
        ...editing,
        batchId,
        recipientType: recipientMode,
        recipientMode,
        recipientIds: recipientMode === 'all' ? [] : selectedStudentIds,
      };
      if (editing.id) {
        MockDB.updateItem('recordings', editing.id, recData);
      } else {
        const batchObj = db.batches.find(b => b.id === batchId);
        const newRec = {
          ...recData,
          courseName: batchObj?.course || '',
          uploadDate: new Date().toISOString().split('T')[0],
          visibility: editing.visibility || 'Students',
          thumbnail: editing.thumbnail || '/assets/course-default.png'
        };
        MockDB.addItem('recordings', newRec);
        if (newRec.visibility === 'Students') {
          MockDB.addItem('notifications', {
            title: "New Class Recording",
            message: `Recording for "${newRec.title}" is now available.`,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            type: 'info',
            target: 'Batch',
            targetId: batchId,
            recipientType: recipientMode,
            recipientIds: recData.recipientIds,
          });
        }
      }
      setEditing(null);
    }
  };

  const openNew = () => {
    setEditing({ title: '', source: 'Google Drive', videoUrl: '', visibility: 'Students', date: new Date().toISOString().split('T')[0] });
    setRecipientMode('all');
    setSelectedStudentIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Recorded Classes</h3>
        <button
          onClick={openNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Upload Recording
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
              <input required type="text" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <textarea value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={2} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recording Date</label>
              <input required type="date" value={editing.date || ''} onChange={e => setEditing({...editing, date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (e.g. 1h 30m)</label>
              <input type="text" value={editing.duration || ''} onChange={e => setEditing({...editing, duration: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Source</label>
              <select value={editing.source || 'Google Drive'} onChange={e => setEditing({...editing, source: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Google Drive">Google Drive</option>
                <option value="YouTube">YouTube</option>
                <option value="Teams">Teams</option>
                <option value="OneDrive">OneDrive</option>
                <option value="Direct Upload">Upload Video</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Visibility</label>
              <select value={editing.visibility || 'Students'} onChange={e => setEditing({...editing, visibility: e.target.value as any})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Students">Visible to Students</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link / Video URL</label>
              <input required type="text" value={editing.videoUrl || ''} onChange={e => setEditing({...editing, videoUrl: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <ImageUploader
                label="Recording Thumbnail (optional)"
                value={editing.thumbnail || ''}
                onChange={(url) => setEditing({...editing, thumbnail: url})}
                folder="recordings"
                maxDimension={1200}
                recommendedSize="1200 × 675 px"
                recommendedFormat="PNG, JPG, WEBP"
                previewClassName="w-full h-28 object-cover rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipients</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={recipientMode === 'all'} onChange={() => setRecipientMode('all')} />
                  <span className="text-sm font-semibold text-slate-700">All Students</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={recipientMode === 'selected'} onChange={() => setRecipientMode('selected')} />
                  <span className="text-sm font-semibold text-slate-700">Selected Students</span>
                </label>
              </div>
              {recipientMode === 'selected' && (
                <div className="mt-3 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-white">
                  {enrolledStudents.length === 0 && <p className="text-sm text-slate-400">No students enrolled.</p>}
                  {enrolledStudents.map(s => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                      <input type="checkbox" checked={selectedStudentIds.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                      {s.name} <span className="text-slate-400 text-xs">({s.email})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Recording</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recordings.map(rec => (
          <div key={rec.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-32 bg-slate-100 relative">
              <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <a href={rec.videoUrl} target="_blank" rel="noreferrer" className="bg-white/90 text-slate-900 p-3 rounded-full hover:scale-110 transition-transform">
                  <PlayCircle className="w-6 h-6" />
                </a>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                {rec.duration || '--:--'}
              </div>
              {rec.visibility === 'Hidden' && (
                <div className="absolute top-2 right-2 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded">Hidden</div>
              )}
              {rec.recipientMode === 'selected' && (
                <div className="absolute top-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-1 rounded">Selected</div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-bold text-slate-800 line-clamp-1">{rec.title}</h4>
              {rec.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rec.description}</p>}
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md">{rec.source || 'Video'}</span>
                  <span>{rec.date}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(rec); setRecipientMode(rec.recipientMode || 'all'); setSelectedStudentIds(rec.recipientIds || []); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => MockDB.deleteItem('recordings', rec.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {recordings.length === 0 && !editing && (
        <div className="text-slate-500 p-12 text-center bg-white rounded-xl border border-slate-200 flex flex-col items-center">
          <PlayCircle className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-700">No Recordings</h3>
          <p className="text-sm mt-1 max-w-sm">Upload class recordings or link to external videos.</p>
        </div>
      )}
    </div>
  );
}




function NotificationsTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches?.find(b => b.id === batchId);
  const enrolledStudents = db.students?.filter(s => batch?.studentIds?.includes(s.id)) || [];
  const notifications = (db.notifications?.filter(n => n.target === 'Batch' && n.targetId === batchId) || [])
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  const [editing, setEditing] = useState<any | null>(null);
  const [recipientMode, setRecipientMode] = useState<'all' | 'selected'>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const notif = {
        ...editing,
        target: 'Batch',
        targetId: batchId,
        date: new Date().toISOString(),
        recipientType: recipientMode,
        recipientMode,
        recipientIds: recipientMode === 'all' ? [] : selectedStudentIds,
      };
      if (editing.id) {
        MockDB.updateItem('notifications', editing.id, notif);
      } else {
        MockDB.addItem('notifications', notif);
      }
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Batch Notifications</h3>
        <button 
          onClick={() => { setEditing({ title: '', message: '', type: 'info' }); setRecipientMode('all'); setSelectedStudentIds([]); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Send Notification
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
              <input required type="text" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
              <select value={editing.type || 'info'} onChange={e => setEditing({...editing, type: e.target.value as any})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="info">Info</option>
                <option value="alert">Alert</option>
                <option value="success">Success</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
              <textarea required rows={3} value={editing.message || ''} onChange={e => setEditing({...editing, message: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipients</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={recipientMode === 'all'} onChange={() => setRecipientMode('all')} />
                  <span className="text-sm font-semibold text-slate-700">All Students</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={recipientMode === 'selected'} onChange={() => setRecipientMode('selected')} />
                  <span className="text-sm font-semibold text-slate-700">Selected Students</span>
                </label>
              </div>
              {recipientMode === 'selected' && (
                <div className="mt-3 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-white">
                  {enrolledStudents.length === 0 && <p className="text-sm text-slate-400">No students enrolled.</p>}
                  {enrolledStudents.map(s => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                      <input type="checkbox" checked={selectedStudentIds.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                      {s.name} <span className="text-slate-400 text-xs">({s.email})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Send</button>
          </div>
        </form>
      )}

      <div className="divide-y divide-slate-100">
        {notifications.map(n => (
          <div key={n.id} className="py-4 flex justify-between items-start">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                {n.title}
              </h4>
              <p className="text-sm text-slate-600 mt-1">{n.message}</p>
              <p className="text-xs text-slate-500 mt-2">{n.date ? new Date(n.date).toLocaleString() : ''} {n.recipientMode === 'selected' ? `â€¢ ${(n.recipientIds||[]).length} recipients` : 'â€¢ All students'}</p>
            </div>
            <button onClick={() => MockDB.deleteItem('notifications', n.id)} className="text-slate-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {notifications.length === 0 && !editing && <div className="text-slate-500 py-8 text-center">No notifications sent to this batch.</div>}
      </div>
    </div>
  );
}





function DoubtSupportTab({ batchId }: { batchId: string }) {
  return (
    <div className="-m-6">
      <DoubtSupport fixedBatchId={batchId} />
    </div>
  );
}

export default function BatchDashboard() {
  const { batchId } = useParams();
  const db = useDB();
  const batch = db.batches.find(b => b.id === batchId);

  const [activeTab, setActiveTab] = useState("Today's Session");

  if (!batch) {
    return <div className="p-8">Batch not found. <Link to="/admin/batches" className="text-indigo-600 underline">Go Back</Link></div>;
  }

  const tabs = [
    { name: 'Overview', icon: Calendar },
    { name: 'Students', icon: Users },
    { name: 'Course Calendar', icon: Calendar },
    { name: "Today's Session", icon: Video },
    { name: 'Study Materials', icon: FileText },
    { name: 'Recordings', icon: PlayCircle },
    { name: 'Notifications', icon: MessageSquare },
    { name: 'Doubt Support', icon: MessageSquare },
    { name: 'Reviews & Feedback', icon: Star },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/batches" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">{batch.name}</h2>
          <p className="text-slate-500 text-sm mt-1">{batch.course} &bull; Mentor: {batch.mentor}</p>
        </div>
      </div>

      <div className="bg-white p-2 rounded-xl border border-slate-200 flex overflow-x-auto gap-2">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.name ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-[500px]">
        {activeTab === 'Overview' && <OverviewTab batchId={batchId as string} />}
        {activeTab === "Today's Session" && <TodaySessionTab batchId={batchId as string} />}
        {activeTab === 'Course Calendar' && <CourseCalendarTab batchId={batchId as string} />}
        {activeTab === 'Study Materials' && <StudyMaterialsTab batchId={batchId as string} />}
        {activeTab === 'Students' && <StudentsTab batchId={batchId as string} />}
        {activeTab === 'Recordings' && <RecordingsTab batchId={batchId as string} />}
        {activeTab === 'Notifications' && <NotificationsTab batchId={batchId as string} />}
        {activeTab === 'Doubt Support' && <DoubtSupportTab batchId={batchId as string} />}
        {activeTab === 'Reviews & Feedback' && <ReviewsFeedbackTab batchId={batchId as string} />}
      </div>
    </div>
  );
}
