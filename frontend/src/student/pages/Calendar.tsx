import React from 'react';
import { useDB } from '../../hooks/useDB';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react';
import { useActiveBatch } from '../contexts/ActiveBatchContext';
import { isTargetedToStudent } from '../../utils/recipientTargeting';

export default function Calendar() {
  const db = useDB();
  const { studentProfile } = useAuth();
  
  const { activeBatch } = useActiveBatch();
  
  const studentEvents = db.events?.filter(ev => 
    ev.target === 'Everyone' || ev.target === 'Students' || 
    (ev.target === 'Batch' && ev.targetId === activeBatch?.id)
  ) || [];

  const batchSessions = db.batchSessions
    ?.filter(s => s.batchId === activeBatch?.id && isTargetedToStudent(s, studentProfile))
    .map(s => {
       const batch = db.batches.find(b => b.id === s.batchId);
       return {
         ...s,
         title: s.topic,
         type: 'Live Class',
         batch: batch?.name,
         _isSession: true
       };
    }) || [];

  const combinedEvents = [...studentEvents, ...batchSessions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Live Class': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Holiday': return 'bg-green-100 text-green-700 border-green-200';
      case 'Batch Start': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Batch End': return 'bg-red-100 text-red-700 border-red-200';
      case 'Placement Event': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Institute Calendar</h2>
        <p className="text-slate-500 text-sm mt-1">View your upcoming live classes, holidays, and events.</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {combinedEvents.map((ev, i) => (
            <div key={ev.id || `session-${i}`} className={`p-5 rounded-xl border ${getTypeColor(ev.type)} bg-opacity-50 flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/50">{ev.type}</span>
                </div>
                <h4 className="font-bold text-base mb-1">{ev.title || ev.topic}</h4>
                {ev.batch && <p className="text-xs font-semibold opacity-80 mb-3">{ev.batch}</p>}
                
                <div className="space-y-1.5 mt-4">
                  <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                    <CalendarIcon className="w-4 h-4" /> {ev.date}
                  </div>
                  {(ev.time) && (
                     <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                       <Clock className="w-4 h-4" /> {ev.time}
                     </div>
                  )}
                </div>
              </div>
              
              {ev.type === 'Live Class' && (
                <div className="mt-5 pt-4 border-t border-current/10">
                  {ev.meetingLink ? (
                    <a href={ev.meetingLink} target="_blank" rel="noreferrer" className="w-full bg-white/80 hover:bg-white text-current font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                      <Video className="w-4 h-4" /> Join Live Class
                    </a>
                  ) : (
                    <button disabled className="w-full bg-white/50 text-current font-bold py-2 rounded-lg text-sm opacity-60 cursor-not-allowed flex items-center justify-center gap-2">
                      <Video className="w-4 h-4" /> Link Pending
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {combinedEvents.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-500">
                No upcoming events for your enrolled batches.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
