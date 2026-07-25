import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { BookOpen, Star, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CourseRatingModal from './CourseRatingModal';
import { useActiveBatch } from '../contexts/ActiveBatchContext';

export default function MyCourses() {
  const { studentProfile } = useAuth();
  const db = useDB();
  const [ratingBatch, setRatingBatch] = useState<any>(null);
  const { setActiveBatchId, enrolledBatches } = useActiveBatch();
  const navigate = useNavigate();

  const myBatches = enrolledBatches;

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">My Workspaces (Batches)</h2>
        <p className="text-slate-500 text-sm mt-1">Access your enrolled courses and active batches.</p>
      </div>

      {myBatches.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500">
          <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p>You are not enrolled in any batches currently.</p>
          <Link to="/courses" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">Explore Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBatches.map(batch => {
            const course = db.courses.find(c => c.name === batch.course);
            return (
            <div key={batch.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                <img src={course?.thumbnail || "/assets/course-default.png"} alt={course?.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#1763B6]">
                  {batch.status}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{course?.name}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{batch.name} &bull; Mentor: {batch.mentor}</p>
                
                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {batch.duration || course?.duration || '8 Weeks'}
                    </div>
                  </div>
                  
                  {batch.status === 'Completed' ? (
                    <button onClick={() => setRatingBatch(batch)} className="w-full py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                      <Star className="w-4 h-4" /> Rate Course
                    </button>
                  ) : (
                    <button onClick={() => { setActiveBatchId(batch.id); navigate('/student/dashboard'); }} className="w-full py-2.5 bg-[#1763B6] text-white hover:bg-[#145096] rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                      Switch to this Batch
                    </button>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
      
      {ratingBatch && (
        <CourseRatingModal 
          batch={ratingBatch} 
          course={db.courses.find(c => c.name === ratingBatch.course)} 
          onClose={() => setRatingBatch(null)} 
        />
      )}
    </div>
  );
}

