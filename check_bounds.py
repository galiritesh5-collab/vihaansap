content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()
start_idx = content.find("function ReviewsFeedbackTab")
if start_idx != -1:
    # find the next function
    end_idx = content.find("function ", start_idx + 10)
    print(f"Start: {start_idx}, End: {end_idx}")
    # let's just see how many lines we are dealing with
    print(f"Lines: {content[start_idx:end_idx].count(chr(10))}")
else:
    print("Not found")
