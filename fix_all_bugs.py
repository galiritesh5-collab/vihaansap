import os

# ──────────────────────────────────────────────────────────────────────────────
# FIX 1: CourseRatingModal.tsx — replace window.MockDB with useDB() hook
# ──────────────────────────────────────────────────────────────────────────────
filepath = 'frontend/src/student/pages/CourseRatingModal.tsx'
content = open(filepath, encoding='utf-8').read()

# Add useDB import
if "import { useDB } from '../../hooks/useDB';" not in content:
    content = content.replace(
        "import { useAuth } from '../../contexts/AuthContext';",
        "import { useAuth } from '../../contexts/AuthContext';\nimport { useDB } from '../../hooks/useDB';"
    )

# Replace window.MockDB usage
old_db_line = "  const db = window.MockDB ? window.MockDB.data : ({} as any); // fallback if useDB hook is missing inside, though we can use useDB"
new_db_line = "  const db = useDB();"
content = content.replace(old_db_line, new_db_line)

open(filepath, 'w', encoding='utf-8').write(content)
print("Fixed CourseRatingModal.tsx — useDB() now used correctly")


# ──────────────────────────────────────────────────────────────────────────────
# FIX 2: StudentLayout.tsx — add 'Campaign' target to notification filter
# ──────────────────────────────────────────────────────────────────────────────
filepath = 'frontend/src/student/layout/StudentLayout.tsx'
content = open(filepath, encoding='utf-8').read()

# Fix the notifications filter to include Campaign notifications
old_notif_filter = """  const notifications = db.notifications?.filter(n => {
    if (n.target === 'Everyone' || n.target === 'Students') return true;
    if (n.target === 'Batch' && myBatches.some(b => b.id === n.targetId)) return isTargetedToStudent(n, studentProfile);
    if (n.target === 'Course' && myBatches.some(b => b.course === n.targetId)) return true;
    if (n.target === 'Specific Student' && n.targetId === studentProfile?.id) return true;
    return false;
  }) || [];"""

new_notif_filter = """  const notifications = db.notifications?.filter(n => {
    if (n.target === 'Everyone' || n.target === 'Students') return true;
    if (n.target === 'Batch' && myBatches.some(b => b.id === n.targetId)) return isTargetedToStudent(n, studentProfile);
    if (n.target === 'Course' && myBatches.some(b => b.course === n.targetId)) return true;
    if (n.target === 'Specific Student' && n.targetId === studentProfile?.id) return true;
    // Campaign notifications — show if student is in recipientIds
    if (n.target === 'Campaign') return isTargetedToStudent(n, studentProfile);
    return false;
  }) || [];"""

if old_notif_filter in content:
    content = content.replace(old_notif_filter, new_notif_filter)
    print("Fixed StudentLayout.tsx — Campaign notifications now visible in sidebar count")
else:
    print("WARNING: Could not find notification filter in StudentLayout.tsx")

open(filepath, 'w', encoding='utf-8').write(content)


# ──────────────────────────────────────────────────────────────────────────────
# FIX 3: student/pages/Notifications.tsx — add 'Campaign' target
# ──────────────────────────────────────────────────────────────────────────────
filepath = 'frontend/src/student/pages/Notifications.tsx'
content = open(filepath, encoding='utf-8').read()

old_filter = """  const notifications = db.notifications?.filter(n => {
    if (n.target === 'Everyone') return true;
    if (n.target === 'Students') return true;
    if (n.target === 'Batch' && n.targetId === activeBatch?.id) return isTargetedToStudent(n, studentProfile);
    if (n.target === 'Course' && activeBatch?.course === n.targetId) return true;
    if ((n.target === 'Specific Student' || n.target === 'Student') && n.targetId === studentProfile?.id) return true;
    return false;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];"""

new_filter = """  const notifications = db.notifications?.filter(n => {
    if (n.target === 'Everyone') return true;
    if (n.target === 'Students') return true;
    if (n.target === 'Batch' && n.targetId === activeBatch?.id) return isTargetedToStudent(n, studentProfile);
    if (n.target === 'Course' && activeBatch?.course === n.targetId) return true;
    if ((n.target === 'Specific Student' || n.target === 'Student') && n.targetId === studentProfile?.id) return true;
    // Campaign review request notifications
    if (n.target === 'Campaign') return isTargetedToStudent(n, studentProfile);
    return false;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];"""

if old_filter in content:
    content = content.replace(old_filter, new_filter)
    print("Fixed Notifications.tsx — Campaign notifications now shown in student Notifications page")
else:
    print("WARNING: Could not find filter in Notifications.tsx")

# Also need to add missing import for isTargetedToStudent if not there
# (it's already there from prior commits)

open(filepath, 'w', encoding='utf-8').write(content)
print("All fixes applied.")
