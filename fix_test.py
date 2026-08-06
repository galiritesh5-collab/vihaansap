filepath = 'test_suite.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix false negative for Test 7 and Test 16
content = content.replace('"existingReview?.id" in modal', '"existingCampaignReview?.id" in modal')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
