import re

content = '''import React, { useState } from 'react';
import { X, Star, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { MockDB } from '../../services/MockDB';

export default function CourseRatingModal({ batch, course, onClose, isMandatory }: any) {
  const { studentProfile, currentUser } = useAuth();
  
  // External link override
  const hasExternalLink = !!batch?.externalReviewLink;

  const [rating, setRating] = useState(0);
  const [trainerRating, setTrainerRating] = useState(0);
  const [contentRating, setContentRating] = useState(0);
  const [supportRating, setSupportRating] = useState(0);
  const [comments, setComments] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [recommend, setRecommend] = useState(true);
  
  const [submitted, setSubmitted] = useState(false);

  const handleDismiss = () => {
    if (batch?.id) {
      sessionStorage.setItem(eview_dismissed_, 'true');
    }
    if (onClose) onClose();
  };

  const handleExternalRedirect = () => {
    window.open(batch?.externalReviewLink, '_blank');
    handleDismiss();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    // ONE canonical review record
    const review = {
      id: ev-,
      reviewId: ev-,
      studentUid: currentUser?.uid || studentProfile?.id,
      studentName: studentProfile?.name || currentUser?.displayName || 'Student',
      batchId: batch?.id || '',
      batchName: batch?.name || '',
      courseId: course?.id || '',
      courseName: course?.name || '',
      rating,
      trainerRating,
      contentRating,
      supportRating,
      feedback: comments,
      designation: designation.trim() || undefined,
      company: company.trim() || undefined,
      recommend,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      // Backward compatibility fields for old queries:
      student: studentProfile?.name || currentUser?.displayName || 'Student',
      course: course?.name || '',
      review: comments,
      date: now
    };
    
    MockDB.addItem('reviews', review);
    
    setSubmitted(true);
    if (onClose) setTimeout(onClose, 2000);
    if (isMandatory) setTimeout(() => window.location.reload(), 2000);
  };

  const StarSelector = ({ value, onChange, label }: any) => (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-slate-700 mb-1">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={w-8 h-8 rounded-md flex items-center justify-center transition-colors }
          >
            <Star className={w-5 h-5 } />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8 relative">
        {!isMandatory && (
          <button onClick={handleDismiss} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 fill-current" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Thank You!</h3>
              <p className="text-slate-500 mt-2">Your comprehensive review has been submitted for approval.</p>
            </div>
          ) : hasExternalLink ? (
             <div className="text-center py-8 space-y-6">
                <h3 className="text-xl font-bold text-slate-800">{isMandatory ? 'Feedback Required' : 'Rate Your Course'}</h3>
                <p className="text-sm text-slate-500 font-medium">Please provide your feedback on {course?.name} via our external review form.</p>
                <button
                  onClick={handleExternalRedirect}
                  className="w-full sm:w-auto px-8 py-3 bg-[#1763B6] text-white font-bold rounded-xl hover:bg-[#145096] transition-colors inline-flex items-center justify-center gap-2"
                >
                  Go to Review Form <ExternalLink className="w-4 h-4" />
                </button>
             </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{isMandatory ? 'Feedback Required' : 'Rate Your Course'}</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">{course?.name}</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StarSelector value={rating} onChange={setRating} label="Overall Rating" />
                  <StarSelector value={trainerRating} onChange={setTrainerRating} label="Trainer Rating" />
                  <StarSelector value={contentRating} onChange={setContentRating} label="Course Content Rating" />
                  <StarSelector value={supportRating} onChange={setSupportRating} label="Support Rating" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Feedback</label>
                  <textarea
                    required
                    rows={3}
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors resize-none text-sm"
                    placeholder="Share your detailed learning experience..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm transition-colors"
                      placeholder="e.g. Consultant"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm transition-colors"
                      placeholder="e.g. IBM"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="recommend-cb"
                    checked={recommend}
                    onChange={(e) => setRecommend(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="recommend-cb" className="text-sm font-semibold text-slate-700">
                    I would recommend this course to others
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || trainerRating === 0 || contentRating === 0 || supportRating === 0 || !comments}
                  className="w-full py-3 mt-4 bg-[#1763B6] text-white font-bold rounded-xl hover:bg-[#145096] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
'''

with open('frontend/src/student/pages/CourseRatingModal.tsx', 'w') as f:
    f.write(content)
