
"""
Patches:
1) StudentLayout.tsx — replace auto-modal with persistent banner + controlled modal
2) Reviews.tsx — filter Superseded  
3) Notifications.tsx — add Submit Review CTA
4) CourseRatingModal.tsx — pre-fill from latest batch review
5) BatchDashboard.tsx — rename Campaign→Review Request in UI + supersede old reviews
"""

# ─── 1. StudentLayout.tsx ────────────────────────────────────────────────────
filepath = 'frontend/src/student/layout/StudentLayout.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Star to lucide imports if missing
if 'Star' not in content:
    content = content.replace(
        "LayoutDashboard, BookOpen, MonitorPlay, Video, \n  FileText, HelpCircle, Bell, Search, LogOut, Menu, X, Calendar",
        "LayoutDashboard, BookOpen, MonitorPlay, Video, \n  FileText, HelpCircle, Bell, Search, LogOut, Menu, X, Calendar, Star"
    )

# Replace the feedback detection block and auto-modal with new banner approach
OLD_FEEDBACK_BLOCK = '''  const [dismissedFeedback, setDismissedFeedback] = useState(false);
  
  // Also check sessionStorage
  const isSessionDismissed = pendingFeedbackBatch ? sessionStorage.getItem(`review_dismissed_${pendingFeedbackBatch.id}`) === 'true' : false;

  const showFeedbackModal = pendingFeedbackBatch && (!dismissedFeedback && !isSessionDismissed || isMandatory);'''

NEW_FEEDBACK_BLOCK = '''  // Collect ALL pending review requests (not just the first)
  const pendingCampaignNotifications = (db.notifications || []).filter((n: any) =>
    n.type === 'review_campaign' &&
    isTargetedToStudent(n, studentProfile) &&
    myBatches.some((b: any) => b.id === (db.reviewCampaigns || []).find((c: any) => c.id === n.targetId)?.batchId) &&
    !(db.reviews || []).some((r: any) => r.campaignId === n.targetId && (r.studentUid === user?.uid || r.studentId === studentProfile?.id))
  );

  const [activeReviewModal, setActiveReviewModal] = useState<{campaignId: string; batch: any} | null>(null);
  const [dismissedMandatory, setDismissedMandatory] = useState(false);

  // Mandatory modal — batch completed, no review at all
  const showMandatoryModal = mandatoryFeedbackBatch && !dismissedMandatory;'''

if OLD_FEEDBACK_BLOCK in content:
    content = content.replace(OLD_FEEDBACK_BLOCK, NEW_FEEDBACK_BLOCK)
    print("Replaced feedback block in StudentLayout.tsx")
else:
    print("WARNING: feedback block not found — checking alternate")

# Replace the JSX: remove old mandatory+requested feedback overlay, add new banner + controlled modal
OLD_JSX = '''        {/* Mandatory/Requested Feedback Overlay */}
        {showFeedbackModal && pendingFeedbackBatch && (
          <CourseRatingModal
            batch={pendingFeedbackBatch}
            course={db.courses.find(c => c.name === pendingFeedbackBatch.course)}
            campaignId={feedbackRequestNotification?.type === 'review_campaign' ? feedbackRequestNotification.targetId : undefined}
            onClose={() => setDismissedFeedback(true)}
            isMandatory={isMandatory}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <Outlet />
        </main>'''

NEW_JSX = '''        {/* Mandatory Feedback Overlay (batch completed) */}
        {showMandatoryModal && mandatoryFeedbackBatch && (
          <CourseRatingModal
            batch={mandatoryFeedbackBatch}
            course={db.courses.find((c: any) => c.name === mandatoryFeedbackBatch.course)}
            campaignId={undefined}
            onClose={() => setDismissedMandatory(true)}
            isMandatory={true}
          />
        )}

        {/* Controlled Review Modal (from banner / notification) */}
        {activeReviewModal && (
          <CourseRatingModal
            batch={activeReviewModal.batch}
            course={db.courses.find((c: any) => c.name === activeReviewModal.batch?.course)}
            campaignId={activeReviewModal.campaignId}
            onClose={() => setActiveReviewModal(null)}
            isMandatory={false}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          {/* Persistent Review Request Banners */}
          {pendingCampaignNotifications.length > 0 && (
            <div className="space-y-0">
              {pendingCampaignNotifications.map((n: any) => {
                const campaign = (db.reviewCampaigns || []).find((c: any) => c.id === n.targetId);
                const batchForCampaign = campaign ? myBatches.find((b: any) => b.id === campaign.batchId) : null;
                if (!batchForCampaign) return null;
                return (
                  <div key={n.id || n.notificationId || n.targetId} className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Star className="w-4 h-4 text-amber-600 fill-amber-400" />
                      </div>
                      <div>
                        <p className="font-bold text-amber-900 text-sm">Review Pending: {campaign?.name || 'Feedback Request'}</p>
                        <p className="text-xs text-amber-700">{n.message || 'Please share your learning experience.'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveReviewModal({ campaignId: n.targetId, batch: batchForCampaign })}
                      className="shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <Outlet />
        </main>'''

if OLD_JSX in content:
    content = content.replace(OLD_JSX, NEW_JSX)
    print("Replaced JSX section in StudentLayout.tsx")
else:
    print("WARNING: JSX section not found")

# Add Star import to lucide if not there (already done above)
# Also need to add Star to lucide imports at the top
if "Star," not in content and "Star}" not in content and "import { useDB }" in content:
    # Star is in the JSX, but not imported from lucide. Add it.
    content = content.replace(
        "FileText, HelpCircle, Bell, Search, LogOut, Menu, X, Calendar",
        "FileText, HelpCircle, Bell, Search, LogOut, Menu, X, Calendar, Star"
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("StudentLayout.tsx patched")
