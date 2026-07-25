import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { Calendar, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { useActiveBatch } from '../contexts/ActiveBatchContext';

export default function WeeklyPlanner() {
  const db = useDB();
  const { activeBatch } = useActiveBatch();
  const allPlanners = db.batchPlanner?.filter(p => p.batchId === activeBatch?.id).sort((a, b) => a.weekNumber - b.weekNumber) || [];

  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

  const toggleWeek = (id: string) => {
    setExpandedWeeks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Weekly Planner</h2>
        <p className="text-slate-500 text-sm mt-1">Track your course progression week by week.</p>
      </div>

      {!activeBatch ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500">
          No active batch assigned yet.
        </div>
      ) : (
        <div className="space-y-8">
          {[activeBatch].map(batch => {
            const course = db.courses.find(c => c.name === batch.course);
            const batchPlanner = allPlanners.filter(p => p.batchId === batch.id);

            return (
              <div key={batch.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-[#1763B6] rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 leading-tight">{course?.name}</h3>
                    <p className="text-sm text-slate-500">Batch: {batch.name} • Mentor: {batch.mentor}</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {batchPlanner.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No weekly planner available for this batch yet.
                    </div>
                  ) : (
                    batchPlanner.map(week => (
                      <div key={week.id} className="p-4 sm:p-6 transition-colors hover:bg-slate-50">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleWeek(week.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-lg flex flex-col items-center justify-center shrink-0 border border-slate-200">
                              <span className="text-[10px] font-bold uppercase tracking-wider">Week</span>
                              <span className="text-xl font-black leading-none">{week.weekNumber}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{week.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">{week.topics?.length || 0} Topics</p>
                            </div>
                          </div>
                          <div className="text-slate-400">
                            {expandedWeeks[week.id] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                          </div>
                        </div>

                        {expandedWeeks[week.id] && (
                          <div className="mt-4 pl-16">
                            <ul className="list-disc text-sm text-slate-600 space-y-2 ml-4">
                              {week.topics?.map((topic, i) => (
                                <li key={i}>{topic}</li>
                              ))}
                            </ul>
                            {(!week.topics || week.topics.length === 0) && (
                              <p className="text-sm text-slate-400">No topics listed.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
