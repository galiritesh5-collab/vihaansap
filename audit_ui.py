content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()
start = content.find("function ReviewsFeedbackTab")
end = content.find("\nfunction ", start + 10)
func = content[start:end]

# Print key parts
checks = [
    'handleApprove',
    'Superseded',  # OLD approved reviews superseded?
    'Create Campaign',
    'Send Review Request',
    'Review Request',
    'Campaign',
]
for c in checks:
    count = func.count(c)
    print(f"'{c}' appears {count} times in ReviewsFeedbackTab")
