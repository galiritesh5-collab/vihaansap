import os

print("=" * 60)
print("REVIEW CAMPAIGN ARCHITECTURE — FULL AUDIT")
print("=" * 60)

results = []

def check(name, condition, fix=""):
    status = "PASS" if condition else "FAIL"
    results.append((name, status, fix))
    print(f"  [{status}] {name}")
    if not condition and fix:
        print(f"         FIX: {fix}")

# ── File reads ──────────────────────────────────────────────────────────────
types_content = open('frontend/src/types/student.types.ts', encoding='utf-8').read()
schema_content = open('frontend/src/lib/mockdb/schema.ts', encoding='utf-8').read()
mockdb_content = open('frontend/src/services/MockDB.ts', encoding='utf-8').read()
bd_content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()
layout_content = open('frontend/src/student/layout/StudentLayout.tsx', encoding='utf-8').read()
modal_content = open('frontend/src/student/pages/CourseRatingModal.tsx', encoding='utf-8').read()
notif_content = open('frontend/src/student/pages/Notifications.tsx', encoding='utf-8').read()
public_reviews = open('frontend/src/pages/Reviews.tsx', encoding='utf-8').read()

print("\n[TYPES & SCHEMA]")
check("ReviewCampaign interface exists", "interface ReviewCampaign" in types_content)
check("campaignId on StudentReview", "campaignId?: string" in types_content)
check("reviewCampaigns in schema", "reviewCampaigns" in schema_content)
check("reviewCampaigns initialData in MockDB", "reviewCampaigns: []," in mockdb_content)

print("\n[ADMIN — BATCHDASHBOARD]")
check("ReviewsFeedbackTab exists", "function ReviewsFeedbackTab" in bd_content)
check("Campaign creation (MockDB.addItem reviewCampaigns)", "MockDB.addItem('reviewCampaigns'" in bd_content)
check("Campaign notification created on submit", "type: 'review_campaign'" in bd_content)
check("Notification target set to Campaign", "target: 'Campaign'" in bd_content)
check("recipientIds on notification", "recipientIds" in bd_content)
check("recipientType: selected on notification", "recipientType: 'selected'" in bd_content)
check("targetId = campaignId on notification", "targetId: campaignId" in bd_content)
check("Campaign review list filtered by campaignId", "r.campaignId === camp.id" in bd_content or "r.campaignId === activeCampaign.id" in bd_content)
check("Admin Approve action", "status: 'Approved'" in bd_content)
check("Admin Reject action", "status: 'Rejected'" in bd_content)
check("Admin Delete action", "MockDB.deleteItem('reviews'" in bd_content)
check("Campaign close/reopen toggle", "MockDB.updateItem('reviewCampaigns'" in bd_content)
check("External link support in create modal", "externalLink" in bd_content)

print("\n[STUDENT — COURSERATINGMODAL]")
check("useDB() import (not window.MockDB)", "import { useDB }" in modal_content)
check("window.MockDB NOT present (bug fixed)", "window.MockDB" not in modal_content)
check("const db = useDB()", "const db = useDB()" in modal_content)
check("campaignId prop accepted", "campaignId" in modal_content)
check("existingReview lookup", "existingReview" in modal_content and "r.campaignId === campaignId" in modal_content)
check("Pre-fill from existingReview", "existingReview?.rating" in modal_content)
check("Edit: MockDB.updateItem if existing", "MockDB.updateItem('reviews'" in modal_content)
check("New: MockDB.addItem if not existing", "MockDB.addItem('reviews'" in modal_content)
check("campaignId saved to review", "campaignId, // new field" in modal_content or "campaignId," in modal_content)
check("External link redirect", "externalLinkUrl" in modal_content)
check("campaign?.externalLink checked", "campaign?.externalLink" in modal_content)
check("Rating required (disabled if 0)", "rating === 0" in modal_content)

print("\n[STUDENT — STUDENTLAYOUT]")
check("Campaign notifications in feedbackNotif detection", "type === 'review_campaign'" in layout_content)
check("Campaign notifications in sidebar filter", "target === 'Campaign'" in layout_content)
check("campaignId passed to modal", "campaignId={feedbackRequestNotification?.type === 'review_campaign'" in layout_content)
check("isTargetedToStudent used on campaign notif", "isTargetedToStudent(n, studentProfile)" in layout_content)

print("\n[STUDENT — NOTIFICATIONS PAGE]")
check("Campaign notifications shown", "target === 'Campaign'" in notif_content)
check("isTargetedToStudent applied", "isTargetedToStudent(n, studentProfile)" in notif_content)

print("\n[PUBLIC WEBSITE]")
check("Reviews.tsx has NO campaign awareness", "campaign" not in public_reviews.lower())
check("Reviews.tsx only shows Approved", "Approved" in public_reviews)

print("\n" + "=" * 60)
pass_count = sum(1 for _, s, _ in results if s == "PASS")
fail_count = sum(1 for _, s, _ in results if s == "FAIL")
print(f"RESULT: {pass_count} PASS / {fail_count} FAIL")
print("=" * 60)

if fail_count > 0:
    print("\nFAILED CHECKS:")
    for name, status, fix in results:
        if status == "FAIL":
            print(f"  - {name}")
