content = open('frontend/src/student/layout/StudentLayout.tsx', encoding='utf-8').read()
idx = content.find('<CourseRatingModal')
while idx != -1:
    print(f"AT {idx}:")
    print(content[idx:idx+400])
    print()
    idx = content.find('<CourseRatingModal', idx+1)
