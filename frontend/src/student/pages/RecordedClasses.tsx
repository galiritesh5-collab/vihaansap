import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { PlayCircle, Calendar } from 'lucide-react';
import { isTargetedToStudent } from '../../utils/recipientTargeting';
import { useActiveBatch } from '../contexts/ActiveBatchContext';

export default function RecordedClasses() {
  const { studentProfile } = useAuth();
  const db = useDB();

  const { activeBatch } = useActiveBatch();
  
  // 1. Recordings from completed sessions
  const mySessions = db.batchSessions?.filter(s => s.batchId === activeBatch?.id && isTargetedToStudent(s, studentProfile)) || [];
  const sessionRecordings = mySessions.filter(s => s.status === 'Completed' && s.recordingUrl).map(s => ({
    id: s.id,
    topic: s.topic,
    date: s.date,
    batchId: s.batchId,
    recordingUrl: s.recordingUrl
  }));

  // 2. Standalone uploaded recordings
  const standaloneRecordings = db.recordings?.filter(r => 
    r.batchId === activeBatch?.id && r.visibility !== 'Hidden' && isTargetedToStudent(r, studentProfile)
  ).map(r => ({
    id: r.id,
    topic: r.title,
    date: r.date || r.uploadDate,
    batchId: r.batchId,
    recordingUrl: r.videoUrl
  })) || [];

  const recordedSessions = [...sessionRecordings, ...standaloneRecordings]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Recorded Classes</h2>
        <p className="text-slate-500 text-sm mt-1">Access recordings of your past live sessions.</p>
      </div>

      {recordedSessions.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500">
          {activeBatch ? 'No recordings available for this batch yet.' : 'No active batch assigned yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordedSessions.map(rec => {
            const batch = db.batches.find(b => b.id === rec.batchId);
            return (
            <a href={rec.recordingUrl} target="_blank" rel="noreferrer" key={rec.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group block">
              <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-slate-300 group-hover:text-[#1763B6] transition-colors z-10 relative" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1763B6] bg-blue-50 px-2 py-1 rounded-md">
                    {batch?.course}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {rec.date}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 leading-tight mb-1">{rec.topic}</h3>
                <p className="text-xs text-slate-500">Batch: {batch?.name}</p>
              </div>
            </a>
          )})}
        </div>
      )}
    </div>
  );
}
