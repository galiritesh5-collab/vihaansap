import os

filepath = 'test_suite.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# I need to update the file reads to also include Dashboard
if "dash = open('frontend/src/student/pages/Dashboard.tsx', encoding='utf-8').read()" not in content:
    content = content.replace(
        "layout = open('frontend/src/student/layout/StudentLayout.tsx', encoding='utf-8').read()",
        "layout = open('frontend/src/student/layout/StudentLayout.tsx', encoding='utf-8').read()\ndash = open('frontend/src/student/pages/Dashboard.tsx', encoding='utf-8').read()"
    )

# Test 4: Only selected students receive notifications
# The 'isTargetedToStudent(n, studentProfile)' check is now in Dashboard as well
content = content.replace('"isTargetedToStudent(n, studentProfile)" in layout', '"isTargetedToStudent(n, studentProfile)" in dash')

# Test 6: Student opens notification and submits review
# The check "type === 'review_campaign'" in layout was moved to Dashboard
content = content.replace('"type === \'review_campaign\'" in layout', '"type === \'review_campaign\'" in dash')
content = content.replace('"target === \'Campaign\'" in layout', '"target === \'Campaign\'" in layout') # Layout still has the sidebar filter

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
