import os

# --- PATCH StudentLayout.tsx ---
layout_path = 'frontend/src/student/layout/StudentLayout.tsx'
with open(layout_path, 'r', encoding='utf-8') as f:
    layout_content = f.read()

# Remove the banner JSX
banner_jsx = """          {/* Persistent Review Request Banners */}
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
          )}"""

if banner_jsx in layout_content:
    layout_content = layout_content.replace(banner_jsx, "")
    print("Removed banner from StudentLayout.tsx")
else:
    print("WARNING: Banner JSX not found in StudentLayout.tsx")


# Remove pendingCampaignNotifications logic and activeReviewModal state
logic_to_remove = """  // Collect ALL pending review requests (not just the first)
  const pendingCampaignNotifications = (db.notifications || []).filter((n: any) =>
    n.type === 'review_campaign' &&
    isTargetedToStudent(n, studentProfile) &&
    myBatches.some((b: any) => b.id === (db.reviewCampaigns || []).find((c: any) => c.id === n.targetId)?.batchId) &&
    !(db.reviews || []).some((r: any) => r.campaignId === n.targetId && (r.studentUid === user?.uid || r.studentId === studentProfile?.id))
  );

  const [activeReviewModal, setActiveReviewModal] = useState<{campaignId: string; batch: any} | null>(null);"""

if logic_to_remove in layout_content:
    layout_content = layout_content.replace(logic_to_remove, "")
    print("Removed logic from StudentLayout.tsx")
else:
    print("WARNING: Logic not found in StudentLayout.tsx")

# Remove the controlled modal JSX from layout
modal_jsx = """        {/* Controlled Review Modal (from banner / notification) */}
        {activeReviewModal && (
          <CourseRatingModal
            batch={activeReviewModal.batch}
            course={db.courses.find((c: any) => c.name === activeReviewModal.batch?.course)}
            campaignId={activeReviewModal.campaignId}
            onClose={() => setActiveReviewModal(null)}
            isMandatory={false}
          />
        )}"""

if modal_jsx in layout_content:
    layout_content = layout_content.replace(modal_jsx, "")
    print("Removed modal JSX from StudentLayout.tsx")
else:
    print("WARNING: Modal JSX not found in StudentLayout.tsx")

with open(layout_path, 'w', encoding='utf-8') as f:
    f.write(layout_content)


# --- PATCH Dashboard.tsx ---
dash_path = 'frontend/src/student/pages/Dashboard.tsx'
with open(dash_path, 'r', encoding='utf-8') as f:
    dash_content = f.read()

# 1. Imports
if "import CourseRatingModal" not in dash_content:
    dash_content = dash_content.replace(
        "import SessionFeedbackModal from './SessionFeedbackModal';",
        "import SessionFeedbackModal from './SessionFeedbackModal';\nimport CourseRatingModal from './CourseRatingModal';"
    )
if "Star" not in dash_content:
    dash_content = dash_content.replace(
        "from 'lucide-react';",
        ", Star } from 'lucide-react';"
    ).replace('MessageSquare }', 'MessageSquare, Star')

# 2. Add Logic
logic_to_insert = """
  // Collect ALL pending review requests
  const pendingCampaignNotifications = (db.notifications || []).filter((n: any) =>
    n.type === 'review_campaign' &&
    isTargetedToStudent(n, studentProfile) &&
    myBatches.some((b: any) => b.id === (db.reviewCampaigns || []).find((c: any) => c.id === n.targetId)?.batchId) &&
    !(db.reviews || []).some((r: any) => r.campaignId === n.targetId && (r.studentUid === currentUser?.uid || r.studentId === studentProfile?.id))
  ).sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()); // newest first

  const [activeReviewModal, setActiveReviewModal] = useState<{campaignId: string; batch: any} | null>(null);
"""

if "const stats =" in dash_content:
    dash_content = dash_content.replace("  const stats =", logic_to_insert + "\n  const stats =")
    print("Added logic to Dashboard.tsx")
else:
    print("WARNING: 'const stats =' not found in Dashboard.tsx")


# 3. Add Banner JSX
banner_jsx = """
      {/* Persistent Review Request Banners */}
      {pendingCampaignNotifications.length > 0 && (
        <div className="space-y-4">
          {pendingCampaignNotifications.map((n: any) => {
            const campaign = (db.reviewCampaigns || []).find((c: any) => c.id === n.targetId);
            const batchForCampaign = campaign ? myBatches.find((b: any) => b.id === campaign.batchId) : null;
            if (!batchForCampaign) return null;
            return (
              <div key={n.id || n.notificationId || n.targetId} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                  onClick={() => setActiveReviewModal({ campaignId: n.targetId, batch: batchForCampaign })}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0"
                >
                  Submit Review
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Welcome Section */}"""

if "{/* Welcome Section */}" in dash_content:
    dash_content = dash_content.replace("      {/* Welcome Section */}", banner_jsx)
    print("Added banner JSX to Dashboard.tsx")
else:
    print("WARNING: '{/* Welcome Section */}' not found in Dashboard.tsx")


# 4. Add Modal JSX
modal_jsx_to_insert = """
      {activeReviewModal && (
        <CourseRatingModal
          batch={activeReviewModal.batch}
          course={db.courses.find((c: any) => c.name === activeReviewModal.batch?.course)}
          campaignId={activeReviewModal.campaignId}
          onClose={() => setActiveReviewModal(null)}
          isMandatory={false}
        />
      )}
    </div>
  );
}"""

if "    </div>\n  );\n}" in dash_content:
    dash_content = dash_content.replace("    </div>\n  );\n}", modal_jsx_to_insert)
    print("Added modal JSX to Dashboard.tsx")
else:
    print("WARNING: end of component not found in Dashboard.tsx")

with open(dash_path, 'w', encoding='utf-8') as f:
    f.write(dash_content)

print("Patching complete.")
