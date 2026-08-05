content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()
# find recording edit form - look for the recording modal/form area
# Search for characteristic recording form fields
for keyword in ['rec.thumbnail', 'recording.thumbnail', 'thumbnail URL', 'thumbnail url', 'thumbnail', 'Thumbnail', 'videoUrl', 'Video URL', 'recData']:
    idx = content.find(keyword)
    if idx != -1:
        print(f'=== "{keyword}" found at {idx} ===')
        print(repr(content[max(0,idx-200):idx+500]))
        print()
        break
