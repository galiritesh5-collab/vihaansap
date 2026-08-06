content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()
# Find the ReviewsFeedbackTab
start = content.find("function ReviewsFeedbackTab")
end = content.find("\nfunction ", start + 10)
func_content = content[start:end]

# Key checks:
checks = {
    'reviewCampaigns in db': 'db.reviewCampaigns' in func_content,
    'MockDB.addItem reviewCampaigns': "MockDB.addItem('reviewCampaigns'" in func_content,
    'MockDB.addItem notifications campaign': "MockDB.addItem('notifications'" in func_content,
    'recipientIds set on notification': 'recipientIds' in func_content,
    'recipientType selected on notification': "recipientType: 'selected'" in func_content,
    'campaignId stored in notification targetId': "targetId: campaignId" in func_content,
    'type: review_campaign on notification': "type: 'review_campaign'" in func_content,
    'target: Campaign on notification': "target: 'Campaign'" in func_content,
    'handleApprove updates reviews': "MockDB.updateItem('reviews', reviewId, { status: 'Approved' })" in func_content,
    'handleReject updates reviews': "MockDB.updateItem('reviews', reviewId, { status: 'Rejected' })" in func_content,
    'handleDelete removes reviews': "MockDB.deleteItem('reviews', reviewId)" in func_content,
    'campaign status toggle': "MockDB.updateItem('reviewCampaigns'" in func_content,
}

for name, result in checks.items():
    status = 'OK' if result else 'FAIL'
    print(f"[{status}] {name}")
