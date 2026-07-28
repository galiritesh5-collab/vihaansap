import React from 'react';
import { useDB } from '../../hooks/useDB';
import { useActiveBatch } from '../contexts/ActiveBatchContext';
import CourseCard from '../../components/CourseCard';

export default function MoreCourses() {
  const db = useDB();
  
  const { activeBatch } = useActiveBatch();
  const activeCourseName = activeBatch?.course;
  
  // Show only published courses that the student isn't currently enrolled in via active batch
  const activeCourses = db.courses.filter(course => course.status === 'Published' && course.name !== activeCourseName);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">More Courses</h2>
          <p className="text-slate-500 text-sm mt-1">Explore other SAP modules to upskill.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCourses.map(course => (
          <CourseCard key={course.id} course={course} onInquire={(name) => console.log('Inquire about:', name)} />
        ))}
      </div>
      
      {activeCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <p className="text-slate-500">No additional courses available at the moment.</p>
        </div>
      )}
    </div>
  );
}
