import os

filepath = 'frontend/src/student/pages/CourseRatingModal.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CourseRatingModal signature and state init
old_sig = "export default function CourseRatingModal({ batch, course, onClose, isMandatory }: any) {"
new_sig = "export default function CourseRatingModal({ batch, course, campaignId, onClose, isMandatory }: any) {"
content = content.replace(old_sig, new_sig)

# Handle external link and existing review lookup
old_init = """  const { studentProfile, currentUser } = useAuth();

  // External link override
  const hasExternalLink = !!batch?.externalReviewLink;"""

new_init = """  const { studentProfile, currentUser } = useAuth();
  const db = window.MockDB ? window.MockDB.data : ({} as any); // fallback if useDB hook is missing inside, though we can use useDB
  const campaign = campaignId && db.reviewCampaigns ? db.reviewCampaigns.find((c: any) => c.id === campaignId) : null;
  const existingReview = campaignId && db.reviews ? db.reviews.find((r: any) => r.campaignId === campaignId && (r.studentUid === currentUser?.uid || r.studentId === studentProfile?.id || r.studentId === currentUser?.uid)) : null;

  // External link override
  const hasExternalLink = !!campaign?.externalLink || !!batch?.externalReviewLink;
  const externalLinkUrl = campaign?.externalLink || batch?.externalReviewLink;"""

content = content.replace(old_init, new_init)

# Replace handleExternalRedirect
old_redirect = """  const handleExternalRedirect = () => {
    window.open(batch?.externalReviewLink, '_blank');
    handleDismiss();
  };"""

new_redirect = """  const handleExternalRedirect = () => {
    window.open(externalLinkUrl, '_blank');
    handleDismiss();
  };"""

content = content.replace(old_redirect, new_redirect)

# Replace state initialization with existingReview
old_state = """  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [recommend, setRecommend] = useState(true);"""

new_state = """  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comments, setComments] = useState(existingReview?.feedback || existingReview?.review || existingReview?.content || '');
  const [designation, setDesignation] = useState(existingReview?.designation || '');
  const [company, setCompany] = useState(existingReview?.company || '');
  const [recommend, setRecommend] = useState(existingReview?.recommend ?? true);"""

content = content.replace(old_state, new_state)

# Replace handleSubmit payload
old_payload = """    // ONE canonical review record
    const review = {
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
    };

    MockDB.addItem('reviews', review);"""

new_payload = """    // ONE canonical review record
    const review = {
      id: existingReview?.id || reviewId,
      reviewId: existingReview?.id || reviewId,
      campaignId, // new field
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
      status: 'Pending', // always reset to pending on edit
      createdAt: existingReview?.createdAt || now,
      updatedAt: now,
      // Backward compatibility fields for old queries:
      name: studentProfile?.name || currentUser?.displayName || 'Student',
      student: studentProfile?.name || currentUser?.displayName || 'Student',
      course: currentCourseName,
      review: comments,
      content: comments,
      date: existingReview?.date || now,
    };

    if (existingReview?.id) {
      MockDB.updateItem('reviews', existingReview.id, review);
    } else {
      MockDB.addItem('reviews', review);
    }"""

content = content.replace(old_payload, new_payload)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated CourseRatingModal.tsx")
