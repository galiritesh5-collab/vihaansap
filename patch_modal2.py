filepath = 'frontend/src/student/pages/CourseRatingModal.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the existing review / campaign lookup with enhanced prefill logic
old_lookup = """  const db = useDB();
  const campaign = campaignId && db.reviewCampaigns ? db.reviewCampaigns.find((c: any) => c.id === campaignId) : null;
  const existingReview = campaignId && db.reviews ? db.reviews.find((r: any) => r.campaignId === campaignId && (r.studentUid === currentUser?.uid || r.studentId === studentProfile?.id || r.studentId === currentUser?.uid)) : null;

  // External link override
  const hasExternalLink = !!campaign?.externalLink || !!batch?.externalReviewLink;
  const externalLinkUrl = campaign?.externalLink || batch?.externalReviewLink;"""

new_lookup = """  const db = useDB();
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
  const externalLinkUrl = campaign?.externalLink || batch?.externalReviewLink;"""

if old_lookup in content:
    content = content.replace(old_lookup, new_lookup)
    print("Replaced review lookup in CourseRatingModal.tsx")
else:
    print("WARNING: Lookup block not found in CourseRatingModal.tsx")

# Update modal title to show campaign name
old_heading = """              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {isMandatory ? 'Feedback Required' : 'Rate Your Course'}
              </h3>"""

new_heading = """              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {isMandatory ? 'Feedback Required' : campaign?.name ? `Request: ${campaign.name}` : latestBatchReview ? 'Update Your Review' : 'Rate Your Course'}
              </h3>
              {latestBatchReview && !existingCampaignReview && (
                <p className="text-xs text-indigo-600 font-semibold mb-4 bg-indigo-50 px-3 py-1.5 rounded-lg">
                  Pre-filled from your previous review. You may update it below.
                </p>
              )}"""

if old_heading in content:
    content = content.replace(old_heading, new_heading)
    print("Updated modal heading in CourseRatingModal.tsx")
else:
    print("WARNING: heading not found in CourseRatingModal.tsx")

# Update submit logic — if existingCampaignReview exists, update it; else if latestBatchReview exists create new; else addItem
# Current logic already handles: existingReview?.id → updateItem, else addItem
# This still works since existingReview is now existingCampaignReview for the update check
# But we need to make sure we only UPDATE if it's the same-campaign review (not latestBatch prefill)
old_submit = """    if (existingReview?.id) {
      MockDB.updateItem('reviews', existingReview.id, review);
    } else {
      MockDB.addItem('reviews', review);
    }"""

new_submit = """    // Only update the SAME CAMPAIGN review; for pre-filled-from-previous, always create a new record
    if (existingCampaignReview?.id) {
      MockDB.updateItem('reviews', existingCampaignReview.id, review);
    } else {
      MockDB.addItem('reviews', review);
    }"""

if old_submit in content:
    content = content.replace(old_submit, new_submit)
    print("Updated submit logic in CourseRatingModal.tsx")
else:
    print("WARNING: submit logic not found in CourseRatingModal.tsx")

# Also fix the review id logic — when prefilling from latestBatchReview, use a new ID
old_review_id = """    // ONE canonical review record
    const review = {
      id: existingReview?.id || reviewId,
      reviewId: existingReview?.id || reviewId,"""

new_review_id = """    // ONE canonical review record — use existing campaign review id for edits, new id otherwise
    const review = {
      id: existingCampaignReview?.id || reviewId,
      reviewId: existingCampaignReview?.id || reviewId,"""

if old_review_id in content:
    content = content.replace(old_review_id, new_review_id)
    print("Fixed review id logic in CourseRatingModal.tsx")
else:
    print("WARNING: review id logic not found in CourseRatingModal.tsx")

# And fix createdAt to use campaign review's date (not latestBatch)
old_dates = """      createdAt: existingReview?.createdAt || now,
      updatedAt: now,
      // Backward compatibility fields for old queries:
      name: studentProfile?.name || currentUser?.displayName || 'Student',
      student: studentProfile?.name || currentUser?.displayName || 'Student',
      course: currentCourseName,
      review: comments,
      content: comments,
      date: existingReview?.date || now,"""

new_dates = """      createdAt: existingCampaignReview?.createdAt || now,
      updatedAt: now,
      // Backward compatibility fields for old queries:
      name: studentProfile?.name || currentUser?.displayName || 'Student',
      student: studentProfile?.name || currentUser?.displayName || 'Student',
      course: currentCourseName,
      review: comments,
      content: comments,
      date: existingCampaignReview?.date || now,"""

if old_dates in content:
    content = content.replace(old_dates, new_dates)
    print("Fixed dates logic in CourseRatingModal.tsx")
else:
    print("WARNING: dates logic not found in CourseRatingModal.tsx")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("CourseRatingModal.tsx patched")
