content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()

# Add ImageUploader import if not present
if 'ImageUploader' not in content:
    content = content.replace(
        "import { MockDB } from '../../services/MockDB';",
        "import { MockDB } from '../../services/MockDB';\nimport ImageUploader from '../components/ImageUploader';"
    )

# Replace Unsplash fallback
UNSPLASH_URL = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
LOCAL_FALLBACK = '/assets/course-default.png'

content = content.replace(
    "thumbnail: editing.thumbnail || '" + UNSPLASH_URL + "'",
    "thumbnail: editing.thumbnail || '" + LOCAL_FALLBACK + "'"
)
content = content.replace(
    "'" + UNSPLASH_URL + "'",
    "'" + LOCAL_FALLBACK + "'"
)

open('frontend/src/admin/pages/BatchDashboard.tsx', 'w', encoding='utf-8').write(content)
print('Done - BatchDashboard Unsplash removed')
