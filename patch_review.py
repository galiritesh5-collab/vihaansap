import re

with open('frontend/src/student/pages/CourseRatingModal.tsx', 'r') as f:
    content = f.read()

# Add useActiveBatch import
if 'useActiveBatch' not in content:
    content = content.replace("import { useAuth } from '../../contexts/AuthContext';", "import { useAuth } from '../../contexts/AuthContext';\nimport { useActiveBatch } from '../contexts/ActiveBatchContext';")

# Update component logic
logic_pattern = r"const \[rating, setRating\] = useState\(0\);.*?const \[submitted, setSubmitted\] = useState\(false\);"
new_logic = """const { enrolledBatches } = useActiveBatch();
  
  // Use passed batch/course as initial, or default to first enrolled batch
  const initialBatchId = batch?.id || (enrolledBatches.length > 0 ? enrolledBatches[0].id : '');
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);

  // Derived selected batch/course
  const currentBatch = enrolledBatches.find(b => b.id === selectedBatchId) || batch;
  const currentCourseName = currentBatch?.course || course?.name || '';

  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [submitted, setSubmitted] = useState(false);"""
content = re.sub(logic_pattern, new_logic, content, flags=re.DOTALL)

# Update submit handler object
submit_obj_pattern = r"const review = \{.*?date: now,\n\s*\};"
new_submit_obj = """const review = {
      id: reviewId,
      reviewId: reviewId,
      studentUid: currentUser?.uid || studentProfile?.id,
      studentName: studentProfile?.name || currentUser?.displayName || 'Student',
      batchId: currentBatch?.id || '',
      batchName: currentBatch?.name || '',
      courseId: currentBatch?.courseId || course?.id || '',
      courseName: currentCourseName,
      rating,
      feedback: comments,
      designation: designation.trim() || undefined,
      company: company.trim() || undefined,
      recommend,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      // Backward compatibility fields for old queries:
      name: studentProfile?.name || currentUser?.displayName || 'Student',
      student: studentProfile?.name || currentUser?.displayName || 'Student',
      course: currentCourseName,
      review: comments,
      content: comments,
      date: now,
    };"""
content = re.sub(submit_obj_pattern, new_submit_obj, content, flags=re.DOTALL)

# Remove the extra star selectors in JSX and replace the static <p> with a dropdown
jsx_pattern = r"<p className=\"text-sm text-slate-500 mb-6 font-medium\">\{course\?\.name\}</p>\s*<form onSubmit=\{handleSubmit\} className=\"space-y-5\">\s*<div className=\"grid grid-cols-1 sm:grid-cols-2 gap-4\">\s*<StarSelector value=\{rating\} onChange=\{setRating\} label=\"Overall Rating\" />.*?</div>"
new_jsx = """<div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-1">Course</label>
                <select
                  value={selectedBatchId}
                  onChange={e => setSelectedBatchId(e.target.value)}
                  disabled={!!batch || enrolledBatches.length === 0}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1763B6] bg-slate-50 text-sm font-semibold text-slate-700 disabled:opacity-75"
                >
                  {batch && !enrolledBatches.find(b => b.id === batch.id) && (
                     <option value={batch.id}>{course?.name}</option>
                  )}
                  {enrolledBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.course}</option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex justify-center mb-2">
                  <StarSelector value={rating} onChange={setRating} label="Overall Rating" />
                </div>"""
content = re.sub(jsx_pattern, new_jsx, content, flags=re.DOTALL)

# Update disabled state on submit button
content = content.replace("rating === 0 || trainerRating === 0 || contentRating === 0 || supportRating === 0 || !comments", "rating === 0 || !comments")

with open('frontend/src/student/pages/CourseRatingModal.tsx', 'w') as f:
    f.write(content)
