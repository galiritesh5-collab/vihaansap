import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDB } from '../../hooks/useDB';
import { Send, ArrowLeft, Users, Calendar, Video, FileText, CheckSquare, MessageSquare, Star, Settings, Plus, PlayCircle, Edit2, Trash2, HelpCircle, X, ChevronDown, CheckCircle } from 'lucide-react';
import { MockDB } from '../../services/MockDB';
import { useAuth } from '../../contexts/AuthContext';
import { BatchPlannerWeek, BatchSession, StudyMaterial, CourseRating, SessionFeedback } from '../../types';

function TodaySessionTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const sessions = db.batchSessions?.filter(s => s.batchId === batchId) || [];
  const todaySession = sessions.find(s => s.status === 'Live') || sessions.find(s => s.status === 'Upcoming');
  const [editing, setEditing] = useState<Partial<BatchSession> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      if (editing.id) {
        MockDB.updateItem('batchSessions', editing.id, editing);
      } else {
        MockDB.addItem('batchSessions', { ...editing, batchId });
      }
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Today's Session</h3>
        <button 
          onClick={() => setEditing({ topic: '', date: new Date().toISOString().split('T')[0], time: '10:00 AM', status: 'Upcoming', visibleFrom: '', visibleUntil: '' })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Session
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Topic</label>
              <input required type="text" value={editing.topic || ''} onChange={e => setEditing({...editing, topic: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
              <select value={editing.status || 'Upcoming'} onChange={e => setEditing({...editing, status: e.target.value as any})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
              <input required type="date" value={editing.date || ''} onChange={e => setEditing({...editing, date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time</label>
              <input required type="time" value={editing.time || ''} onChange={e => setEditing({...editing, time: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meeting Link (e.g. Teams, Zoom)</label>
              <input type="url" value={editing.meetingLink || ''} onChange={e => setEditing({...editing, meetingLink: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {editing.status === 'Completed' && (
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recording URL</label>
                <input type="url" value={editing.recordingUrl || ''} onChange={e => setEditing({...editing, recordingUrl: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            )}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Visible From (Optional)</label>
              <input type="datetime-local" value={editing.visibleFrom || ''} onChange={e => setEditing({...editing, visibleFrom: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Visible Until (Optional)</label>
              <input type="datetime-local" value={editing.visibleUntil || ''} onChange={e => setEditing({...editing, visibleUntil: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Session</button>
          </div>
        </form>
      ) : todaySession ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                todaySession.status === 'Live' ? 'bg-red-50 text-red-600' : 
                todaySession.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {todaySession.status}
              </span>
              <span className="text-sm font-semibold text-slate-500">{todaySession.date} at {todaySession.time}</span>
            </div>
            <h4 className="text-xl font-bold text-slate-800">{todaySession.topic}</h4>
            {todaySession.meetingLink && (
              <a href={todaySession.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-[#1763B6] hover:text-[#145096] font-semibold text-sm">
                <Video className="w-4 h-4" /> Join Meeting Link
              </a>
            )}
          </div>
          <button onClick={() => setEditing(todaySession)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
            Edit Session
          </button>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
          No active or upcoming sessions for today. Click "Create Session" to add one.
        </div>
      )}

      <div>
        <h4 className="font-bold text-slate-800 mb-4">Past Sessions</h4>
        <div className="space-y-2">
          {sessions.filter(s => s.status === 'Completed').map(s => (
            <div key={s.id} className="p-4 bg-white border border-slate-100 rounded-lg flex justify-between items-center hover:shadow-sm transition-shadow">
              <div>
                <p className="font-bold text-slate-800">{s.topic}</p>
                <p className="text-xs text-slate-500">{s.date}</p>
              </div>
              <button onClick={() => setEditing(s)} className="text-sm text-indigo-600 font-semibold hover:underline">Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeeklyPlannerTab({ batchId }: { batchId: string }) {
    const db = useDB();
    const planner = db.batchPlanner?.filter(p => p.batchId === batchId).sort((a, b) => a.weekNumber - b.weekNumber) || [];
    const [editing, setEditing] = useState<Partial<BatchPlannerWeek> | null>(null);
    const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
    const [newSubTopic, setNewSubTopic] = useState<Record<string, string>>({});
  
    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (editing) {
        if (editing.id) {
          MockDB.updateItem('batchPlanner', editing.id, editing);
        } else {
          MockDB.addItem('batchPlanner', { ...editing, batchId, weekNumber: planner.length + 1, topicItems: [] });
        }
        setEditing(null);
      }
    };

    const toggleSubTopicStatus = (weekId: string, week: BatchPlannerWeek, topicId: string, subId: string) => {
      const topicItems = (week.topicItems || []).map(t => {
        if (t.id !== topicId) return t;
        const subTopics = (t.subTopics || []).map(s => 
          s.id === subId ? { ...s, status: s.status === 'Completed' ? 'Upcoming' : 'Completed' } : s
        );
        const allDone = subTopics.length > 0 && subTopics.every(s => s.status === 'Completed');
        return { ...t, subTopics, status: allDone ? 'Completed' : t.status === 'Completed' ? 'In Progress' : t.status } as any;
      });
      MockDB.updateItem('batchPlanner', weekId, { ...week, topicItems });
    };

    const addSubTopic = (weekId: string, week: BatchPlannerWeek, topicId: string) => {
      const title = newSubTopic[topicId]?.trim();
      if (!title) return;
      const topicItems = (week.topicItems || []).map(t => {
        if (t.id !== topicId) return t;
        return { ...t, subTopics: [...(t.subTopics || []), { id: `st-${Date.now()}`, title, status: 'Upcoming' }] };
      });
      MockDB.updateItem('batchPlanner', weekId, { ...week, topicItems });
      setNewSubTopic({ ...newSubTopic, [topicId]: '' });
    };

    const addTopicToWeek = (weekId: string, week: BatchPlannerWeek, title: string) => {
      if (!title.trim()) return;
      const topicItems = [...(week.topicItems || []), { id: `t-${Date.now()}`, title, status: 'Upcoming', subTopics: [] }];
      MockDB.updateItem('batchPlanner', weekId, { ...week, topicItems });
    };

    const setTopicStatus = (weekId: string, week: BatchPlannerWeek, topicId: string, status: string) => {
      const topicItems = (week.topicItems || []).map(t => t.id === topicId ? { ...t, status } : t);
      const allDone = topicItems.length > 0 && topicItems.every(t => t.status === 'Completed');
      const anyInProgress = topicItems.some(t => t.status === 'In Progress' || t.status === 'Completed');
      const weekStatus = allDone ? 'Completed' : anyInProgress ? 'In Progress' : 'Upcoming';
      MockDB.updateItem('batchPlanner', weekId, { ...week, topicItems, status: weekStatus });
    };
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Weekly Planner</h3>
          <button 
            onClick={() => setEditing({ title: '', topics: [] })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Week
          </button>
        </div>
  
        {editing && (
          <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Week Title</label>
              <input required type="text" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Introduction to SAP FICO" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Topics (comma separated)</label>
              <textarea required rows={3} value={editing.topics?.join(', ') || ''} onChange={e => setEditing({...editing, topics: e.target.value.split(',').map(t => t.trim())})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Week</button>
            </div>
          </form>
        )}
  
        <div className="space-y-4">
          {planner.map((week, idx) => {
            const topicItems = week.topicItems || week.topics.map((t, ti) => ({ id: `legacy-${ti}`, title: t, status: 'Upcoming', subTopics: [] }));
            const completedTopics = topicItems.filter(t => t.status === 'Completed').length;
            const progress = topicItems.length > 0 ? Math.round((completedTopics / topicItems.length) * 100) : 0;
            const isExpanded = expandedWeeks[week.id];

            return (
              <div key={week.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Week Header */}
                <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpandedWeeks(prev => ({...prev, [week.id]: !prev[week.id]}))}>
                  <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 ${
                    week.status === 'Completed' ? 'bg-green-50 text-green-700' :
                    week.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Week</span>
                    <span className="text-xl font-black">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 truncate">{week.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        week.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        week.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>{week.status || 'Upcoming'}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 font-medium shrink-0">{completedTopics}/{topicItems.length} topics</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); setEditing(week); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={e => { e.stopPropagation(); MockDB.deleteItem('batchPlanner', week.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Topics List (Expanded) */}
                {isExpanded && (
                  <div className="border-t border-slate-100 divide-y divide-slate-50">
                    {topicItems.map((topic) => (
                      <div key={topic.id} className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <select
                            value={topic.status}
                            onChange={e => setTopicStatus(week.id, week, topic.id, e.target.value)}
                            className={`text-xs font-bold px-2 py-1 rounded-md border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                              topic.status === 'Completed' ? 'bg-green-50 text-green-700' :
                              topic.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <span className="font-semibold text-slate-700 text-sm">{topic.title}</span>
                        </div>
                        {/* Sub-topics */}
                        {topic.subTopics && topic.subTopics.length > 0 && (
                          <div className="ml-8 space-y-1.5">
                            {topic.subTopics.map(sub => (
                              <div key={sub.id} className="flex items-center gap-2">
                                <button onClick={() => toggleSubTopicStatus(week.id, week, topic.id, sub.id)} className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-colors ${sub.status === 'Completed' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-green-400'}`}>
                                  {sub.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                                </button>
                                <span className={`text-xs ${sub.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-600'}`}>{sub.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Add sub-topic input */}
                        <div className="ml-8 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add sub-topic..."
                            value={newSubTopic[topic.id] || ''}
                            onChange={e => setNewSubTopic({ ...newSubTopic, [topic.id]: e.target.value })}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubTopic(week.id, week, topic.id); } }}
                            className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                          <button onClick={() => addSubTopic(week.id, week, topic.id)} className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Add</button>
                        </div>
                      </div>
                    ))}
                    {/* Add new topic */}
                    <div className="p-3 flex gap-2">
                      <input
                        type="text"
                        id={`new-topic-${week.id}`}
                        placeholder="Add topic to this week..."
                        className="flex-1 text-sm px-3 py-2 border border-dashed border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            addTopicToWeek(week.id, week, input.value);
                            input.value = '';
                          }
                        }}
                      />
                      <button onClick={() => {
                        const input = document.getElementById(`new-topic-${week.id}`) as HTMLInputElement;
                        if (input) { addTopicToWeek(week.id, week, input.value); input.value = ''; }
                      }} className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700">+ Topic</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {planner.length === 0 && !editing && (
          <div className="text-slate-500 p-12 text-center bg-white rounded-xl border border-slate-200 flex flex-col items-center">
            <Calendar className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-700">No Weekly Planner Yet</h3>
            <p className="text-sm mt-1 max-w-sm">Create weekly plans to track batch progress week by week.</p>
          </div>
        )}
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

    // Update progress for enrolled students based on COMPLETED Main Topics
    const allSessions = db.batchSessions?.filter((ss: any) => ss.batchId === batchId) || [];
    const total = syllabus.length || 1;
    const completedCount = [...allSessions.filter((ss: any) => ss.id !== s.id), { ...payload }].filter((ss: any) => ss.status === 'Completed').length;

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
              Auto-imported from <span className="font-semibold text-indigo-600">{course?.name}</span> syllabus • {completedSessions}/{totalSessions} sessions completed
            </p>
          )}
        </div>
      </div>

      {syllabus.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <p className="text-amber-700 font-semibold text-sm">No syllabus found for this batch's course.</p>
          <p className="text-amber-600 text-xs mt-1">
            Go to <strong>Admin → Courses → {batch?.course}</strong> and add syllabus topics. They will appear here automatically.
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
                          {s.subTopics.length} Subtopics {expandedRow === idx ? '▲' : '▼'}
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
                          const allS = db.batchSessions?.filter((ss: any) => ss.batchId === batchId) || [];
                          const total2 = syllabus.length || 1;
                          const done = [...allS.filter((ss: any) => ss.id !== s.id), { ...payload }].filter((ss: any) => ss.status === 'Completed').length;
                          const prog = Math.round((done / total2) * 100);
                          (batch?.studentIds || []).forEach((sid: string) => MockDB.updateItem('students', sid, { progress: prog }));
                        }}
                        className="text-emerald-600 hover:text-emerald-800 text-xs font-bold p-1"
                      >
                        ✓ Done
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
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                st.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                st.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {st.status}
                              </span>
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
  const pendingDoubts = doubts.filter(d => d.status === 'Pending').length;
  
  const sessions = db.batchSessions?.filter(s => s.batchId === batchId) || [];
  const todaySession = sessions.find(s => s.status === 'Live') || sessions.find(s => s.status === 'Upcoming');
  
  const notifications = db.notifications?.filter(n => n.target === 'Batch' && n.targetId === batchId) || [];
  const latestAnnouncement = notifications.length > 0 ? notifications[notifications.length - 1] : null;

  // calculate completion based on sessions or just random
  const completionPercentage = Math.round((sessions.filter(s => s.status === 'Completed').length / (sessions.length || 1)) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Batch Overview</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Students</p>
          <p className="text-2xl font-black text-indigo-600">{students.length}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Completion</p>
          <p className="text-2xl font-black text-indigo-600">{completionPercentage}%</p>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-slate-200 rounded-xl p-5">
           <h4 className="font-bold text-slate-800 mb-4">Quick Actions</h4>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
             <button className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 text-xs font-bold transition-colors text-center">
               <FileText className="w-5 h-5 mb-1" /> Upload Material
             </button>
             <button className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 text-xs font-bold transition-colors text-center">
               <PlayCircle className="w-5 h-5 mb-1" /> Upload Recording
             </button>
             <button className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 text-xs font-bold transition-colors text-center">
               <Video className="w-5 h-5 mb-1" /> Add Topic
             </button>
             <button className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 text-xs font-bold transition-colors text-center">
               <MessageSquare className="w-5 h-5 mb-1" /> Send Notice
             </button>
             <button className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 text-xs font-bold transition-colors text-center">
               <HelpCircle className="w-5 h-5 mb-1" /> View Doubts
             </button>
             <button className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 text-xs font-bold transition-colors text-center">
               <CheckSquare className="w-5 h-5 mb-1" /> Complete Session
             </button>
           </div>
        </div>
        
        <div className="space-y-6">
          <div className="border border-slate-200 rounded-xl p-5">
             <h4 className="font-bold text-slate-800 mb-3">Today's Class</h4>
             {todaySession ? (
               <div>
                 <p className="text-sm font-bold text-indigo-600">{todaySession.topic}</p>
                 <p className="text-xs text-slate-500 mt-1">{todaySession.date} • {todaySession.time}</p>
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
    </div>
  );
}


function ReviewsFeedbackTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches?.find(b => b.id === batchId);
  
  // Reviews for this batch
  const batchReviews = (db.reviews || []).filter((r: any) => r.batchId === batchId);
  
  const handleSendReviewRequest = () => {
    MockDB.addItem('notifications', {
      title: "Course Feedback Requested",
      message: "Your batch has requested course feedback. Please share your rating and review.",
      date: new Date().toISOString().split('T')[0],
      type: 'info',
      target: 'Batch',
      targetId: batchId,
      isFeedbackRequest: true
    });
    alert("Review request sent to all students in this batch.");
  };

  const handleApprove = (reviewId: string) => {
    MockDB.updateItem('reviews', reviewId, { status: 'Approved' });
  };

  const handleReject = (reviewId: string) => {
    MockDB.updateItem('reviews', reviewId, { status: 'Rejected' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Reviews & Feedback</h3>
          <p className="text-sm text-slate-500 mt-1">Manage student feedback and reviews for this batch.</p>
        </div>
        <button 
          onClick={handleSendReviewRequest}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 shrink-0"
        >
          <MessageSquare className="w-4 h-4" /> Send Review Request
        </button>
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
                    <p className="text-xs text-slate-400">{review.date} • {review.course}</p>
                  </div>
                  <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    review.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    review.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {review.status || 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className={`w-3.5 h-3.5 ${star <= (review.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-600">{review.content || review.text}</p>
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                {review.status !== 'Approved' && (
                  <button onClick={() => handleApprove(review.id)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors">
                    Approve
                  </button>
                )}
                {review.status !== 'Rejected' && (
                  <button onClick={() => handleReject(review.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-colors">
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

function StudyMaterialsTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const materials = db.studyMaterials?.filter(m => m.batchId === batchId) || [];
  const sessions = db.batchSessions?.filter(s => s.batchId === batchId) || [];
  const [editing, setEditing] = useState<Partial<StudyMaterial> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      if (editing.id) {
        MockDB.updateItem('studyMaterials', editing.id, editing);
      } else {
        MockDB.addItem('studyMaterials', { 
          ...editing, 
          batchId, 
          uploadDate: new Date().toISOString().split('T')[0],
          downloadAllowed: editing.downloadAllowed ?? true,
          visibility: editing.visibility || 'Students'
        });
      }
      setEditing(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Process each file using FileReader to create a real downloadable data URL
    Array.from(files as FileList).forEach((file: File) => {
      let fileExt = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      if (['PPTX'].includes(fileExt)) fileExt = 'PPTX';
      else if (['DOCX'].includes(fileExt)) fileExt = 'DOCX';
      else if (['XLS', 'XLSX', 'CSV'].includes(fileExt)) fileExt = 'Excel';
      else if (['PNG', 'JPG', 'JPEG', 'GIF'].includes(fileExt)) fileExt = 'Images';
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        MockDB.addItem('studyMaterials', {
          title: file.name,
          description: 'Uploaded from device',
          type: fileExt,
          url: dataUrl, // Real base64 data URL — downloads correctly
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          visibility: 'Students',
          downloadAllowed: true,
          batchId,
          uploadDate: new Date().toISOString().split('T')[0]
        });
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = ''; // reset input
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Study Materials</h3>
        <button 
          onClick={() => setEditing({ title: '', type: 'PDF', visibility: 'Students', downloadAllowed: true })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Material
        </button>
      </div>

      <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
        <input 
          type="file" 
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
        />
        <div className="flex flex-col items-center justify-center">
          <FileText className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-slate-600 font-medium">Drag & Drop files here, or click to <span className="text-indigo-600">Upload From Device</span></p>
          <p className="text-slate-400 text-xs mt-2">Supports PDF, PPT, DOC, Excel, ZIP, TXT, Images. Multiple files allowed.</p>
        </div>
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
              <select value={editing.type || 'PDF'} onChange={e => setEditing({...editing, type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="PDF">PDF</option>
                <option value="PPT">PPT</option>
                <option value="PPTX">PPTX</option>
                <option value="DOC">DOC</option>
                <option value="DOCX">DOCX</option>
                <option value="Excel">Excel</option>
                <option value="ZIP">ZIP</option>
                <option value="TXT">TXT</option>
                <option value="Images">Images</option>
                <option value="Other">Other uploaded files</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assign to Session (Optional)</label>
              <select value={editing.sessionId || ''} onChange={e => setEditing({...editing, sessionId: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">No Session Assigned</option>
                {sessions.map(s => <option key={s.id} value={s.id}>{s.topic} ({s.date})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Visibility</label>
              <select value={editing.visibility || 'Students'} onChange={e => setEditing({...editing, visibility: e.target.value as any})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Students">Visible to Students</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" id="dl-allowed" checked={editing.downloadAllowed ?? true} onChange={e => setEditing({...editing, downloadAllowed: e.target.checked})} className="mr-2" />
              <label htmlFor="dl-allowed" className="text-sm text-slate-700">Allow Download</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Material</button>
          </div>
        </form>
      )}

      <div className="divide-y divide-slate-100 bg-white rounded-xl border shadow-sm">
        {materials.map(mat => (
          <div key={mat.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 mt-1">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{mat.title}</h4>
                {mat.description && <p className="text-sm text-slate-600 mt-0.5">{mat.description}</p>}
                <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-slate-500">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md">{mat.type}</span>
                  <span>{mat.uploadDate}</span>
                  {mat.visibility === 'Hidden' && <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Hidden</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <a href={mat.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg">View</a>
              <button onClick={() => setEditing(mat)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => MockDB.deleteItem('studyMaterials', mat.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {materials.length === 0 && !editing && (
          <div className="text-slate-500 p-12 text-center flex flex-col items-center">
            <FileText className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-700">No Study Materials</h3>
            <p className="text-sm mt-1 max-w-sm">Upload materials from your device or add external links to share with students.</p>
          </div>
        )}
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
                <p className="text-xs text-slate-500">Due: {a.dueDate} ΓÇó Marks: {a.marks}</p>
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
  const recordings = db.recordings?.filter(r => r.batchId === batchId) || [];
  const [editing, setEditing] = useState<Partial<import('../../types').Recording> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      if (editing.id) {
        MockDB.updateItem('recordings', editing.id, editing);
      } else {
        const batch = db.batches.find(b => b.id === batchId);
        MockDB.addItem('recordings', { 
          ...editing, 
          batchId, 
          courseName: batch?.course || '',
          uploadDate: new Date().toISOString().split('T')[0],
          visibility: editing.visibility || 'Students',
          thumbnail: editing.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        });
      }
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Recorded Classes</h3>
        <button 
          onClick={() => setEditing({ title: '', source: 'Google Drive', videoUrl: '', visibility: 'Students', date: new Date().toISOString().split('T')[0] })}
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
              <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <a href={rec.videoUrl} target="_blank" rel="noreferrer" className="bg-white/90 text-slate-900 p-3 rounded-full hover:scale-110 transition-transform">
                  <PlayCircle className="w-6 h-6" />
                </a>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                {rec.duration || '--:--'}
              </div>
              {rec.visibility === 'Hidden' && (
                <div className="absolute top-2 right-2 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded">
                  Hidden
                </div>
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
                  <button onClick={() => setEditing(rec)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
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
  const notifications = db.notifications?.filter(n => n.target === 'Batch' && n.targetId === batchId) || [];
  const [editing, setEditing] = useState<Partial<import('../../types').Notification> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      if (editing.id) {
        MockDB.updateItem('notifications', editing.id, editing);
      } else {
        MockDB.addItem('notifications', { ...editing, target: 'Batch', targetId: batchId, date: new Date().toISOString().split('T')[0] });
      }
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Batch Notifications</h3>
        <button 
          onClick={() => setEditing({ title: '', message: '', type: 'info' })}
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
              <p className="text-xs text-slate-500 mt-2">{n.date}</p>
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
  const db = useDB();
  const doubts = db.doubts?.filter(d => d.batchId === batchId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
  const [selectedDoubt, setSelectedDoubt] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDoubt) return;

    MockDB.updateItem('doubts', selectedDoubt.id, {
      ...selectedDoubt,
      replies: [...(selectedDoubt.replies || []), { text: replyText, author: 'Admin', date: new Date().toISOString() }],
      status: 'Answered'
    });
    
    setReplyText('');
    const currentDB = MockDB.get();
    setSelectedDoubt(currentDB.doubts.find((d: any) => d.id === selectedDoubt.id));
  };

  const handleUpdateStatus = (id: string, status: string) => {
    MockDB.updateItem('doubts', id, { status });
    if (selectedDoubt?.id === id) {
      setSelectedDoubt({ ...selectedDoubt, status });
    }
  };

  if (!selectedDoubt) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Doubt Support</h3>
        </div>
        
        <div className="divide-y divide-slate-100 bg-white rounded-xl border shadow-sm">
          {doubts.map(d => (
            <div key={d.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{d.title || d.subject}</h4>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                  d.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 
                  d.status === 'Answered' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>{d.status}</span>
              </div>
              <p className="text-sm text-slate-600 mb-2 line-clamp-2">{d.description || d.question}</p>
              <p className="text-xs text-slate-500">Student: {d.studentName || d.student} ΓÇó Date: {d.date}</p>
              <div className="mt-4 flex justify-end">
                <button onClick={() => setSelectedDoubt(d)} className="text-sm font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">View & Reply</button>
              </div>
            </div>
          ))}
          {doubts.length === 0 && <div className="text-slate-500 py-8 text-center">No doubts reported for this batch.</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedDoubt(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-bold text-slate-800">{selectedDoubt.studentName || selectedDoubt.student}</h3>
          </div>
        </div>
        <select 
          value={selectedDoubt.status}
          onChange={e => handleUpdateStatus(selectedDoubt.id, e.target.value)}
          className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
        >
          <option value="Pending">Mark Pending</option>
          <option value="Answered">Mark Answered</option>
          <option value="Closed">Mark Closed</option>
        </select>
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
      </div>

      <div className="p-4 border-t border-slate-200 bg-white shrink-0">
        <form onSubmit={handleReplySubmit} className="flex gap-2">
          <input 
            type="text" 
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Type your reply..." 
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center justify-center">
            <Send className="w-4 h-4 mr-2" /> Send
          </button>
        </form>
      </div>
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
    { name: 'Weekly Planner', icon: Calendar },
    { name: "Today's Session", icon: Video },
    { name: 'Study Materials', icon: FileText },
    { name: 'Recordings', icon: PlayCircle },
    { name: 'Notifications', icon: MessageSquare },
    { name: 'Doubt Support', icon: MessageSquare },
    { name: 'Reviews & Feedback', icon: Star },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/batches" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">{batch.name}</h2>
          <p className="text-slate-500 text-sm mt-1">{batch.course} • Mentor: {batch.mentor}</p>
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
        {activeTab === 'Weekly Planner' && <WeeklyPlannerTab batchId={batchId as string} />}
        {activeTab === 'Study Materials' && <StudyMaterialsTab batchId={batchId as string} />}
        {activeTab === 'Students' && <StudentsTab batchId={batchId as string} />}
        {activeTab === 'Recordings' && <RecordingsTab batchId={batchId as string} />}
        {activeTab === 'Notifications' && <NotificationsTab batchId={batchId as string} />}
        {activeTab === 'Doubt Support' && <DoubtSupportTab batchId={batchId as string} />}
        {activeTab === 'Reviews & Feedback' && <ReviewsFeedbackTab batchId={batchId as string} />}
        {activeTab === 'Settings' && <div className="text-slate-500 py-8 text-center">Batch settings and configuration.</div>}
      </div>
    </div>
  );
}



