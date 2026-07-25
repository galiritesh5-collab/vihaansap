import React from 'react';
import { MonitorPlay } from 'lucide-react';
import { useDB } from '../../hooks/useDB';
import { useAuth } from '../../contexts/AuthContext';
import { useActiveBatch } from '../contexts/ActiveBatchContext';
import { isTargetedToStudent } from '../../utils/recipientTargeting';

export default function TodaysSession() {
  const db = useDB();
  const { studentProfile } = useAuth();
  const { activeBatch } = useActiveBatch();
  const now = Date.now();
  const sessions = (db.batchSessions || []).filter(session => {
    if (session.batchId !== activeBatch?.id || !isTargetedToStudent(session, studentProfile)) return false;
    const scheduled = new Date(session.sessionDateTime || `${session.date || ''} ${session.time || ''}`).getTime();
    return Number.isFinite(scheduled) && now <= scheduled + 4 * 60 * 60 * 1000;
  }).sort((a, b) => new Date(b.sessionDateTime || b.createdAt || 0).getTime() - new Date(a.sessionDateTime || a.createdAt || 0).getTime());
  const session = sessions[0];

  return <div className="p-4 sm:p-8 space-y-6 max-w-4xl">
    <div><h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Today's Session</h2><p className="text-slate-500 text-sm mt-1">Your active session for the selected batch.</p></div>
    {!activeBatch ? <Empty message="No active batch assigned yet." /> : !session ? <Empty message="No active session for this batch." /> : <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">{new Date(session.sessionDateTime || 0).getTime() <= now ? 'Live' : 'Upcoming'}</span>
      <h3 className="text-xl font-bold text-slate-800 mt-4">{session.title || session.topic}</h3>
      <p className="text-sm text-slate-500 mt-2">{session.platform || 'Meeting'} · {session.sessionDateTime ? new Date(session.sessionDateTime).toLocaleString() : `${session.date || ''} ${session.time || ''}`}</p>
      {session.meetingLink && <a href={session.meetingLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 bg-[#1763B6] hover:bg-[#145096] text-white px-5 py-3 rounded-lg font-bold"><MonitorPlay className="w-5 h-5" />Join Session</a>}
    </div>}
  </div>;
}

function Empty({ message }: { message: string }) { return <div className="p-10 text-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500"><MonitorPlay className="w-12 h-12 text-slate-200 mx-auto mb-3" />{message}</div>; }
