content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()
idx = content.find("function ReviewsFeedbackTab")
print(repr(content[idx:idx+1500]))
