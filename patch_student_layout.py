import os

filepath = 'frontend/src/student/layout/StudentLayout.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the feedback notification search logic
old_logic = """  // Check for requested feedback (via Admin notification)
  const feedbackRequestNotification = db.notifications?.find(n => 
    (n.type === 'review_request' || n.isFeedbackRequest) && 
    myBatches.some(b => b.id === (n.targetId || n.batchId || n.relatedEntityId)) &&
    !db.reviews?.some((r: any) => r.batchId === (n.targetId || n.batchId || n.relatedEntityId) && (r.studentUid === user?.uid || r.studentId === studentProfile?.id || r.studentId === user?.uid));
  );"""

new_logic = """  // Check for requested feedback (via Admin notification)
  const feedbackRequestNotification = db.notifications?.find(n => 
    (n.type === 'review_campaign' || n.type === 'review_request' || n.isFeedbackRequest) && 
    (
      (n.type === 'review_campaign' && myBatches.some(b => b.id === db.reviewCampaigns?.find((c: any) => c.id === n.targetId)?.batchId) && !db.reviews?.some((r: any) => r.campaignId === n.targetId && (r.studentUid === user?.uid || r.studentId === studentProfile?.id || r.studentId === user?.uid)))
      || 
      (n.type !== 'review_campaign' && myBatches.some(b => b.id === (n.targetId || n.batchId || n.relatedEntityId)) && !db.reviews?.some((r: any) => r.batchId === (n.targetId || n.batchId || n.relatedEntityId) && !r.campaignId && (r.studentUid === user?.uid || r.studentId === studentProfile?.id || r.studentId === user?.uid)))
    ) && isTargetedToStudent(n, studentProfile)
  );"""

if "const feedbackRequestNotification = db.notifications?.find(n =>" in content:
    start_idx = content.find("// Check for requested feedback (via Admin notification)")
    end_idx = content.find("const requestedFeedbackBatch =", start_idx)
    content = content[:start_idx] + new_logic + "\n\n  " + content[end_idx:]
    
    # Now fix requestedFeedbackBatch
    batch_logic_old = """const requestedFeedbackBatch = feedbackRequestNotification 
    ? myBatches.find(b => b.id === (feedbackRequestNotification.targetId || feedbackRequestNotification.batchId || feedbackRequestNotification.relatedEntityId)) 
    : null;"""
    
    batch_logic_new = """const requestedFeedbackBatch = feedbackRequestNotification 
    ? myBatches.find(b => b.id === (feedbackRequestNotification.type === 'review_campaign' ? db.reviewCampaigns?.find((c: any) => c.id === feedbackRequestNotification.targetId)?.batchId : (feedbackRequestNotification.targetId || feedbackRequestNotification.batchId || feedbackRequestNotification.relatedEntityId))) 
    : null;"""
    
    content = content.replace(batch_logic_old, batch_logic_new)
    
    # Now pass campaign to modal
    modal_old = """          <CourseRatingModal
            batch={pendingFeedbackBatch}
            course={db.courses.find(c => c.name === pendingFeedbackBatch.course)}
            onClose={() => setDismissedFeedback(true)}
            isMandatory={isMandatory}
          />"""
          
    modal_new = """          <CourseRatingModal
            batch={pendingFeedbackBatch}
            course={db.courses.find(c => c.name === pendingFeedbackBatch.course)}
            campaignId={feedbackRequestNotification?.type === 'review_campaign' ? feedbackRequestNotification.targetId : undefined}
            onClose={() => setDismissedFeedback(true)}
            isMandatory={isMandatory}
          />"""
          
    content = content.replace(modal_old, modal_new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated StudentLayout.tsx")
else:
    print("Could not find feedbackRequestNotification logic in StudentLayout.tsx")
