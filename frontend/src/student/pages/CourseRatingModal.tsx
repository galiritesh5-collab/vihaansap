import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { MockDB } from '../../services/MockDB';

export default function CourseRatingModal({ batch, course, onClose, isMandatory }: any) {
  const { studentProfile, currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleDismiss = () => {
    if (batch?.id) {
      sessionStorage.setItem(`review_dismissed_${batch.id}`, 'true');
    }
    if (onClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    // ONE canonical review record
    const review = {
      id: `rev-${Date.now()}`,
      reviewId: `rev-${Date.now()}`,
      studentUid: currentUser?.uid || studentProfile?.id,
      studentName: studentProfile?.name || currentUser?.displayName || 'Student',
      batchId: batch?.id || '',
      batchName: batch?.name || '',
      courseId: course?.id || '',
      courseName: course?.name || '',
      rating,
      feedback: comments,
      designation: designation.trim() || undefined,
      company: company.trim() || undefined,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm z-[100]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        {!isMandatory && (
          <button onClick={handleDismiss} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
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
              <p className="text-slate-500 mt-2">Your review has been submitted for approval.</p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{isMandatory ? 'Feedback Required' : 'Rate Your Course'}</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">{course?.name}</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          rating >= star ? 'bg-orange-100 text-orange-500' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Feedback</label>
                  <textarea
                    required
                    rows={3}
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors resize-none text-sm"
                    placeholder="Share your learning experience..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation (Optional)</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm transition-colors"
                      placeholder="e.g. Consultant"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company (Optional)</label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm transition-colors"
                      placeholder="e.g. IBM"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || !comments}
                  className="w-full py-3 mt-2 bg-[#1763B6] text-white font-bold rounded-xl hover:bg-[#145096] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
