import os

# --- PATCH Dashboard.tsx ---
dash_path = 'frontend/src/student/pages/Dashboard.tsx'
with open(dash_path, 'r', encoding='utf-8') as f:
    dash_content = f.read()

# Remove myBatches.some dependency
logic_to_replace = """  // Collect ALL pending review requests
  const pendingCampaignNotifications = (db.notifications || []).filter((n: any) =>
    n.type === 'review_campaign' &&
    isTargetedToStudent(n, studentProfile) &&
    myBatches.some((b: any) => b.id === (db.reviewCampaigns || []).find((c: any) => c.id === n.targetId)?.batchId) &&
    !(db.reviews || []).some((r: any) => r.campaignId === n.targetId && (r.studentUid === currentUser?.uid || r.studentId === studentProfile?.id))
  ).sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()); // newest first"""

new_logic = """  // Collect ALL pending review requests
  // Architecture B: We rely purely on the notification targeting, NOT on whether the student is currently enrolled in the batch.
  const pendingCampaignNotifications = (db.notifications || []).filter((n: any) => {
    if (n.type !== 'review_campaign') return false;
    if (!isTargetedToStudent(n, studentProfile)) return false;
    
    // Ensure the campaign is still active
    const campaign = (db.reviewCampaigns || []).find((c: any) => c.id === n.targetId);
    if (campaign && campaign.status !== 'Active') return false;
    if (campaign && !isTargetedToStudent(campaign, studentProfile)) return false;

    // Ensure student hasn't already submitted a review for this campaign
    return !(db.reviews || []).some((r: any) => r.campaignId === n.targetId && (r.studentUid === currentUser?.uid || r.studentId === studentProfile?.id));
  }).sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()); // newest first"""

if logic_to_replace in dash_content:
    dash_content = dash_content.replace(logic_to_replace, new_logic)
    print("Patched Dashboard.tsx logic")
else:
    print("WARNING: Logic not found in Dashboard.tsx")


# Also update the banner JSX to pass batchId directly if batch object is not found
banner_to_replace = """              <div key={n.id || n.notificationId || n.targetId} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 shadow-inner">
                    <Star className="w-6 h-6 text-red-600 fill-red-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 text-lg flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                      Review Pending: {campaign?.name || 'Feedback Request'}
                    </h3>
                    <p className="text-sm text-red-800 mt-1 max-w-2xl">{n.message || 'Your mentor has requested you to share your learning experience. Your feedback helps improve our training programs.'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveReviewModal({ campaignId: n.targetId, batch: batchForCampaign })}"""

new_banner = """              <div key={n.id || n.notificationId || n.targetId} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 shadow-inner">
                    <Star className="w-6 h-6 text-red-600 fill-red-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 text-lg flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                      Review Pending: {campaign?.name || 'Feedback Request'}
                    </h3>
                    <p className="text-sm text-red-800 mt-1 max-w-2xl">{n.message || 'Your mentor has requested you to share your learning experience. Your feedback helps improve our training programs.'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveReviewModal({ campaignId: n.targetId, batch: batchForCampaign || { id: campaign?.batchId || n.batchId, course: campaign?.course || 'Unknown Course' } })}"""

# Wait, `if (!batchForCampaign) return null;` is above this block!
batch_check_to_replace = """          {pendingCampaignNotifications.map((n: any) => {
            const campaign = (db.reviewCampaigns || []).find((c: any) => c.id === n.targetId);
            const batchForCampaign = campaign ? myBatches.find((b: any) => b.id === campaign.batchId) : null;
            if (!batchForCampaign) return null;
            return ("""

new_batch_check = """          {pendingCampaignNotifications.map((n: any) => {
            const campaign = (db.reviewCampaigns || []).find((c: any) => c.id === n.targetId);
            // Search all batches, not just myBatches, or fall back to an empty object with ID
            const batchForCampaign = (db.batches || []).find((b: any) => b.id === (campaign?.batchId || n.batchId)) || null;
            return ("""

if batch_check_to_replace in dash_content:
    dash_content = dash_content.replace(batch_check_to_replace, new_batch_check)
    print("Patched batch loop logic")
else:
    print("WARNING: Batch check loop not found in Dashboard.tsx")

if banner_to_replace in dash_content:
    dash_content = dash_content.replace(banner_to_replace, new_banner)
    print("Patched activeReviewModal click")
else:
    print("WARNING: Banner onClick not found in Dashboard.tsx")

with open(dash_path, 'w', encoding='utf-8') as f:
    f.write(dash_content)


# --- PATCH CourseRatingModal.tsx ---
modal_path = 'frontend/src/student/pages/CourseRatingModal.tsx'
with open(modal_path, 'r', encoding='utf-8') as f:
    modal_content = f.read()

# We need to make sure the modal doesn't crash if batch.name or course.name is missing.
# Wait, let's just make sure we safely fallback.
# In CourseRatingModal.tsx:
# `const reviewBatch = batch || activeBatch;`
# `batchId: reviewBatch.id`
# `course: reviewBatch.course`
# Since we passed `{ id: campaign?.batchId || n.batchId, course: campaign?.course || 'Unknown Course' }`
# it should already work without changes to CourseRatingModal.tsx.


# --- PATCH firestore.rules ---
rules_path = 'firestore.rules'
with open(rules_path, 'r', encoding='utf-8') as f:
    rules_content = f.read()

old_rules = """    match /batches/{document} { allow read: if admin() || (signedIn() && request.auth.uid in resource.data.studentIds); allow write: if admin(); }
    match /batchPlanner/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /batchSessions/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /liveClasses/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /studyMaterials/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /courseRatings/{document} { allow read: if true; allow write: if admin(); }
    match /schedules/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /recordings/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /assignments/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }"""

new_rules = """    // Helper function to check if the student is enrolled in the parent batch
    function isEnrolledInBatch(batchId) {
      return request.auth.uid in get(/databases/$(database)/documents/batches/$(batchId)).data.studentIds;
    }

    match /batches/{document} { allow read: if admin() || (signedIn() && request.auth.uid in resource.data.studentIds); allow write: if admin(); }
    match /batchPlanner/{document} { allow read: if admin() || (signedIn() && isEnrolledInBatch(resource.data.batchId)); allow write: if admin(); }
    match /batchSessions/{document} { allow read: if admin() || (signedIn() && isEnrolledInBatch(resource.data.batchId)); allow write: if admin(); }
    match /liveClasses/{document} { allow read: if admin() || (signedIn() && isEnrolledInBatch(resource.data.batchId)); allow write: if admin(); }
    match /studyMaterials/{document} { allow read: if admin() || (signedIn() && isEnrolledInBatch(resource.data.batchId)); allow write: if admin(); }
    match /courseRatings/{document} { allow read: if true; allow write: if admin(); }
    match /schedules/{document} { allow read: if admin() || (signedIn() && isEnrolledInBatch(resource.data.batchId)); allow write: if admin(); }
    match /recordings/{document} { allow read: if admin() || (signedIn() && isEnrolledInBatch(resource.data.batchId)); allow write: if admin(); }
    match /assignments/{document} { allow read: if admin() || (signedIn() && isEnrolledInBatch(resource.data.batchId)); allow write: if admin(); }"""

if old_rules in rules_content:
    rules_content = rules_content.replace(old_rules, new_rules)
    print("Patched firestore.rules")
else:
    print("WARNING: Old rules not found in firestore.rules")

with open(rules_path, 'w', encoding='utf-8') as f:
    f.write(rules_content)

