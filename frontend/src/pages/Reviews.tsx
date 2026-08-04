import React from 'react';
import { useDB } from '../hooks/useDB';
import { StudentReview } from '../types';
import TestimonialCard from '../components/TestimonialCard';
import { Star } from 'lucide-react';

export default function Reviews() {
  const db = useDB();
  const approvedReviews = db.reviews.filter(r => String(r.status).toLowerCase() === 'approved');
  const averageRating = approvedReviews.length > 0 ? approvedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / approvedReviews.length : 0;

  return (
    <div id="reviews-page-wrapper" className="space-y-6 pb-16 bg-slate-50/30 min-h-screen">
      
      {/* Header section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="reviews-header">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1763B6]/10 text-[#1763B6] text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-[#1763B6]" />
            Student Success Stories
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-slate-850 tracking-tight leading-tight">
            Success Stories From <br className="hidden md:block" /> Our Students
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Every review on this page is submitted by verified Sri Vihaan SAP learners who completed or are currently enrolled in our training programs.
          </p>
        </div>
      </section>

      {/* Average Rating & Grid of Alumni Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="reviews-cards-wall-section">
        {approvedReviews.length > 0 ? (
          <>
            <div className="flex flex-col items-center justify-center mb-8 space-y-2">
              <div className="text-5xl font-extrabold text-slate-800">{averageRating.toFixed(1)}</div>
              <div className="flex items-center gap-1 text-[#F4A62A]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < Math.round(averageRating) ? 'fill-current' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-500">Based on {approvedReviews.length} reviews</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8" id="reviews-output-grid">
              {approvedReviews.map((rev) => (
                <div key={rev.id} className="transition-all hover:scale-[1.01]" id={`review-element-${rev.id}`}>
                  <TestimonialCard review={rev as StudentReview} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl max-w-2xl mx-auto">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-slate-800 mb-2">No reviews available yet.</h3>
            <p className="text-slate-500">Student reviews will appear here once they are approved by the administration.</p>
          </div>
        )}
      </section>

    </div>
  );
}
