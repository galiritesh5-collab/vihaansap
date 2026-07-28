import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { MockDB } from '../../services/MockDB';

export default function CourseRatingModal({ batch, course, onClose, isMandatory }: any) {
  const { studentProfile } = useAuth();
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const review = {
      batchId: batch.id,
      courseId: course.id,
      studentId: studentProfile?.id,
      overallRating: rating,
      comments,
      status: 'Pending',
      date: new Date().toISOString()
    };
    MockDB.addItem('courseRatings', review);
    
    // Also push to generic reviews to show in admin dashboard reviews easily
    MockDB.addItem('reviews', {
      student: studentProfile?.name || 'Student',
      studentName: studentProfile?.name || 'Student',
      studentId: studentProfile?.id,
      course: course.name,
      batchId: batch.id,
      rating,
      review: comments,
      status: 'Pending',
      date: new Date().toISOString()
    });

    setSubmitted(true);
    if (onClose) setTimeout(onClose, 2000);
    if (isMandatory) window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm z-[100]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        {!isMandatory && (
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
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
              <h3 className="text-xl font-bold text-slate-800 mb-2">{isMandatory ? 'Feedback Required' : 'Rate Your Course'}</h3>
              <p className="text-sm text-slate-500 mb-6">{course?.name}</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Comments</label>
                  <textarea
                    required
                    rows={4}
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors resize-none"
                    placeholder="Share your learning experience..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || !comments}
                  className="w-full py-3 bg-[#1763B6] text-white font-bold rounded-xl hover:bg-[#145096] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
