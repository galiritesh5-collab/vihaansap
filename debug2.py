content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()
# Look for videoUrl in form
idx = content.find('Link / Video URL')
if idx == -1:
    idx = content.find('videoUrl')
print('Link/Video URL at:', idx)
print(repr(content[max(0,idx-100):idx+2000]))
