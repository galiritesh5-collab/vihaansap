import React, { useState } from 'react';
import { CalendarDays, ChevronDown, ChevronRight } from 'lucide-react';
import { useDB } from '../../hooks/useDB';
import { useActiveBatch } from '../contexts/ActiveBatchContext';

/** Read-only view of the Admin Batch Course Calendar's existing syllabus/session data. */
export default function CourseCalendar() {
  const db = useDB();
  const { activeBatch } = useActiveBatch();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const course = db.courses.find(item => item.name === activeBatch?.course);
  const syllabus: string[] = course?.syllabus || [];
  const sessions = (db.batchSessions || []).filter(session => session.batchId === activeBatch?.id);
  const calendarItems = syllabus.map((topic, syllabusIndex) => {
    const session = sessions.find(item => item.syllabusIndex === syllabusIndex);
    return { topic, syllabusIndex, date: session?.date || '', time: session?.time || '', status: session?.status || 'Upcoming', subTopics: session?.subTopics || [] };
  });

  return <div className="p-4 sm:p-8 space-y-6 max-w-5xl">
    <div>
      <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Course Calendar</h2>
      <p className="text-slate-500 text-sm mt-1">Your batch schedule, maintained by your instructor.</p>
    </div>
    {!activeBatch ? <Empty message="No active batch assigned yet." /> : syllabus.length === 0 ? <Empty message="No syllabus calendar is available for this batch yet." /> : (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50"><p className="font-bold text-slate-800">{activeBatch.course} — {activeBatch.name}</p></div>
        <div className="divide-y divide-slate-100">
          {calendarItems.map(item => <div key={item.syllabusIndex} className="p-4">
            <button type="button" onClick={() => setExpandedIndex(expandedIndex === item.syllabusIndex ? null : item.syllabusIndex)} className="w-full flex items-center gap-3 text-left">
              <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">{item.syllabusIndex + 1}</span>
              <span className="flex-1 font-semibold text-slate-800">{item.topic}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : item.status === 'Live' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span>
              {expandedIndex === item.syllabusIndex ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
            </button>
            <div className="ml-10 mt-2 text-sm text-slate-500">{item.date ? `${item.date}${item.time ? ` · ${item.time}` : ''}` : 'Not scheduled yet'}</div>
            {expandedIndex === item.syllabusIndex && item.subTopics.length > 0 && <div className="ml-10 mt-3 space-y-2 border-l-2 border-slate-200 pl-4">{item.subTopics.map((subTopic: any) => <div key={subTopic.id} className="text-sm flex flex-col items-start bg-slate-50 p-3 rounded-lg border border-slate-100"><p className={`font-semibold ${subTopic.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{subTopic.title}</p><div className="flex items-center gap-2 mt-1"><p className="text-xs text-slate-500 font-bold">{subTopic.date || 'TBA'}</p><span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${subTopic.status === 'Completed' ? 'bg-green-100 text-green-700' : subTopic.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>{subTopic.status || 'Upcoming'}</span></div>{subTopic.notes && <p className="text-xs text-slate-500 mt-1">{subTopic.notes}</p>}</div>)}</div>}
          </div>)}
        </div>
      </div>
    )}
  </div>;
}

function Empty({ message }: { message: string }) { return <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500"><CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />{message}</div>; }
