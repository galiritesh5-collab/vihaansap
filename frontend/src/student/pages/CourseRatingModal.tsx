import React, { useState } from 'react';
import { X, Star, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { useActiveBatch } from '../contexts/ActiveBatchContext';
import { MockDB } from '../../services/MockDB';
import { markReviewRequestNotificationsRead } from '../../utils/notificationReadState';

export default function CourseRatingModal({ batch, course, campaignId, onClose, isMandatory }: any) {
  const { studentProfile, currentUser } = useAuth();
  const db = useDB();
  const campaign = campaignId && db.reviewCampaigns ? db.reviewCampaigns.find((c: any) => c.id === campaignId) : null;
  // Check for an already-submitted review for THIS specific campaign
  const existingCampaignReview = campaignId && db.reviews ? db.reviews.find((r: any) => r.campaignId === campaignId && (r.studentUid === currentUser?.uid || r.studentId === studentProfile?.id || r.studentId === currentUser?.uid)) : null;
  // If no review for this campaign yet, pre-fill from the student's latest review for the same batch
  const latestBatchReview = !existingCampaignReview && db.reviews && (batch?.id) 
    ? [...(db.reviews as any[])].filter((r: any) => r.batchId === batch.id && (r.studentUid === currentUser?.uid || r.studentId === studentProfile?.id)).sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0]
    : null;
  // Use campaign review for editing; latest batch review for pre-fill; otherwise blank
  const existingReview = existingCampaignReview || latestBatchReview || null;

  // External link override
  const hasExternalLink = !!campaign?.externalLink || !!batch?.externalReviewLink;
  const externalLinkUrl = campaign?.externalLink || batch?.externalReviewLink;

  const { enrolledBatches } = useActiveBatch();
  
  // Use passed batch/course as initial, or default to first enrolled batch
  const initialBatchId = batch?.id || (enrolledBatches.length > 0 ? enrolledBatches[0].id : '');
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);

  // Derived selected batch/course
  const currentBatch = enrolledBatches.find(b => b.id === selectedBatchId) || batch;
  const currentCourseName = currentBatch?.course || course?.name || '';

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comments, setComments] = useState(existingReview?.feedback || existingReview?.review || existingReview?.content || '');
  const [designation, setDesignation] = useState(existingReview?.designation || '');
  const [company, setCompany] = useState(existingReview?.company || '');
  const [recommend, setRecommend] = useState(existingReview?.recommend ?? true);
  const [submitted, setSubmitted] = useState(false);

  const handleDismiss = () => {
    if (batch?.id) {
      sessionStorage.setItem(`review_dismissed_${batch.id}`, 'true');
    }
    if (onClose) onClose();
  };

  const handleExternalRedirect = () => {
    window.open(externalLinkUrl, '_blank');
    handleDismiss();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const reviewId = `rev-${Date.now()}`;

    // ONE canonical review record — use existing campaign review id for edits, new id otherwise
    const review = {
      id: existingCampaignReview?.id || reviewId,
      reviewId: existingCampaignReview?.id || reviewId,
      campaignId, // new field
      studentUid: currentUser?.uid || studentProfile?.id,
      studentName: studentProfile?.name || currentUser?.displayName || 'Student',
      batchId: currentBatch?.id || '',
      batchName: currentBatch?.name || '',
      courseId: currentBatch?.courseId || course?.id || '',
      courseName: currentCourseName,
      rating,
      feedback: comments,
      designation: designation.trim() || undefined,
      company: company.trim() || undefined,
      recommend,
      status: 'Pending', // always reset to pending on edit
      createdAt: existingCampaignReview?.createdAt || now,
      updatedAt: now,
      // Backward compatibility fields for old queries:
      name: studentProfile?.name || currentUser?.displayName || 'Student',
      student: studentProfile?.name || currentUser?.displayName || 'Student',
      course: currentCourseName,
      review: comments,
      content: comments,
      date: existingCampaignReview?.date || now,
    };

    // Only update the SAME CAMPAIGN review; for pre-filled-from-previous, always create a new record
    if (existingCampaignReview?.id) {
      await MockDB.updateItem('reviews', existingCampaignReview.id, review);
    } else {
      await MockDB.addItem('reviews', review);
    }

    // A campaign request is complete only for this student after its review saves.
    markReviewRequestNotificationsRead(campaignId, db.notifications || [], studentProfile || currentUser);
    setSubmitted(true);
    if (onClose) setTimeout(onClose, 2000);
    if (isMandatory) setTimeout(() => window.location.reload(), 2000);
  };

  const StarSelector = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-slate-700 mb-1">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
              value >= star ? 'bg-orange-100 text-orange-500' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Star className={`w-5 h-5 ${value >= star ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm overflow-y-auto">
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
              <p className="text-sm text-slate-500 font-medium">
                Please provide your feedback for {course?.name} via our external review form.
              </p>
              <button
                onClick={handleExternalRedirect}
                className="w-full sm:w-auto px-8 py-3 bg-[#1763B6] text-white font-bold rounded-xl hover:bg-[#145096] transition-colors inline-flex items-center justify-center gap-2"
              >
                Go to Review Form <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {isMandatory ? 'Feedback Required' : campaign?.name ? `Request: ${campaign.name}` : latestBatchReview ? 'Update Your Review' : 'Rate Your Course'}
              </h3>
              {latestBatchReview && !existingCampaignReview && (
                <p className="text-xs text-indigo-600 font-semibold mb-4 bg-indigo-50 px-3 py-1.5 rounded-lg">
                  Pre-filled from your previous review. You may update it below.
                </p>
              )}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">📘 Course</label>
                  <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700 cursor-not-allowed opacity-85">
                    {currentCourseName || 'Not assigned'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">👥 Batch</label>
                  <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700 cursor-not-allowed opacity-85">
                    {currentBatch?.name || 'Not assigned'}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex justify-center mb-2">
                  <StarSelector value={rating} onChange={setRating} label="Overall Rating" />
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
                  />
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
                    onChange={e => setRecommend(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="recommend-cb" className="text-sm font-semibold text-slate-700">
                    I would recommend this course to others
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || !comments}
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
