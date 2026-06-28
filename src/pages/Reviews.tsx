import React, { useState } from 'react';
import { STUDENT_REVIEWS } from '../data';
import { StudentReview } from '../types';
import TestimonialCard from '../components/TestimonialCard';
import { Star, SquarePen, Sparkles, AlertCircle, Quote, CheckCircle2 } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState<StudentReview[]>(STUDENT_REVIEWS);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newModule, setNewModule] = useState('SAP FICO');
  const [newText, setNewText] = useState('');
  const [newRole, setNewRole] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newText) {
      setError('Please fill in your name and review details.');
      return;
    }
    setError('');

    const newReviewItem: StudentReview = {
      id: `custom-rev-${Date.now()}`,
      name: newName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', // Default modern avatar
      module: newModule,
      rating: newRating,
      text: newText,
      date: new Date().toISOString().split('T')[0],
      designation: newRole ? newRole : 'Candidate (In Placement Guidance)'
    };

    // Prepend user review
    setReviews([newReviewItem, ...reviews]);
    setSuccess(true);
    setTimeout(() => {
      setNewName('');
      setNewRating(5);
      setNewText('');
      setNewRole('');
      setSuccess(false);
      setShowForm(false);
    }, 2000);
  };

  return (
    <div id="reviews-page" className="space-y-12 py-12 md:py-16">
      
      {/* Header section with Stats review metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4" id="reviews-page-header">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1763B6] tracking-tight">
          Student Reviews & Success Stories
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Read their testimonials below.
        </p>

        {/* Global Rating stats bar */}
        <div className="pt-6 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4" id="reviews-meta-stats">
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col justify-center items-center">
            <span className="text-3xl font-display font-extrabold text-[#1763B6]">4.8 / 5</span>
            <div className="flex gap-0.5 mt-1 text-[#F4A62A] fill-[#F4A62A]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current text-slate-300" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-2 uppercase tracking-wide">Average Score</span>
          </div>

          

          {/* Call-to-action button to write a review */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col justify-center items-center">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setSuccess(false);
                setError('');
              }}
              className="bg-[#1763B6] hover:bg-[#277EDC] text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 pointer-events-auto"
              id="btn-toggle-review-form"
            >
              <SquarePen className="w-4 h-4" />
              <span>Submit Your Feedback</span>
            </button>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">Earned sandbox certificates</span>
          </div>
        </div>
      </section>

      {/* Review Submission Form (Simulated Drawer) */}
      {showForm && (
        <section className="max-w-2xl mx-auto px-4" id="review-submission-wrapper">
          <div className="bg-white rounded-xl border border-[#277EDC]/20 p-6 md:p-8 shadow-sm space-y-4">
            
            <div className="flex justify-between items-start border-b border-slate-105 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-orange-400" />
                <h3 className="font-display font-bold text-slate-850 text-base sm:text-lg">Submit a Student Review</h3>
              </div>
              <button 
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer pointer-events-auto"
              >
                Cancel
              </button>
            </div>

            {!success ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4" id="form-submit-review">
                {error && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Naidu"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                      id="input-review-name"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                      Professional Role / Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Associate Consultant at Capgemini"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                      id="input-review-role"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* SAP Module */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                      Target SAP Module Checked
                    </label>
                    <select
                      value={newModule}
                      onChange={(e) => setNewModule(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                      id="select-review-module"
                    >
                      <option value="SAP FICO">SAP FICO</option>
                      <option value="SAP MM">SAP MM</option>
                      <option value="SAP SD">SAP SD</option>
                      <option value="SAP ABAP">SAP ABAP</option>
                      <option value="SAP HCM" disabled className="text-slate-400">SAP HCM (Coming Soon)</option>
                      <option value="SAP BASIS" disabled className="text-slate-400">SAP BASIS (Coming Soon)</option>
                      <option value="SAP PP" disabled className="text-slate-400">SAP PP (Coming Soon)</option>
                      <option value="SAP SuccessFactors" disabled className="text-slate-400">SAP SuccessFactors (Coming Soon)</option>
                    </select>
                  </div>

                  {/* Rating Stars */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                      Rating Score
                    </label>
                    <div className="flex items-center gap-1 mt-2.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewRating(i + 1)}
                          className="text-slate-250 cursor-pointer pointer-events-auto"
                        >
                          <Star 
                            className={`w-6 h-6 ${i < newRating ? 'text-[#F4A62A] fill-[#F4A62A]' : 'text-slate-200'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                    Your Testimonial Content
                  </label>
                  <textarea
                    rows={4}
                    required
                    maxLength={500}
                    placeholder="Describe how classes were handled, your training server experience, and career mentorship help details..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all py-2.5 min-h-[100px]"
                    id="input-review-content"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1763B6] hover:bg-[#277EDC] text-white font-bold py-3 rounded-lg text-xs sm:text-sm shadow flex items-center justify-center gap-1.5 cursor-pointer pointer-events-auto"
                    id="btn-submit-review-form"
                  >
                    <span>Submit Verified Review</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4" id="review-success">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-100">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-850 text-lg">Review Appended Successfully!</h4>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Thank you, <span className="font-semibold text-slate-800">{newName}</span>. Your student story has been logged and published on our wall.
                  </p>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* Grid of Alumni Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="reviews-cards-wall-section">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8" id="reviews-output-grid">
          {reviews.map((rev) => (
            <div key={rev.id} className="transition-all hover:scale-[1.01]" id={`review-element-${rev.id}`}>
              <TestimonialCard review={rev} />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
