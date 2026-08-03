import re

with open('frontend/src/admin/pages/BatchDashboard.tsx', 'r') as f:
    content = f.read()

# I will use a python script to parse and replace the ReviewsFeedbackTab component 
# to include stats and the external link config.

tab_pattern = re.compile(r'function ReviewsFeedbackTab\(\{ batchId \}: \{ batchId: string \}\) \{.*?return \(.*?\);\s*\}', re.DOTALL)
match = tab_pattern.search(content)

if not match:
    print("Could not find ReviewsFeedbackTab")
    exit(1)

new_tab = '''function ReviewsFeedbackTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches?.find(b => b.id === batchId);
  const [editingExternalLink, setEditingExternalLink] = useState(false);
  const [externalLink, setExternalLink] = useState(batch?.externalReviewLink || '');
  
  // Reviews for this batch
  const batchReviews = (db.reviews || []).filter((r: any) => r.batchId === batchId);
  
  const approvedReviews = batchReviews.filter(r => r.status === 'Approved');
  const avgOverall = approvedReviews.length > 0 ? (approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / approvedReviews.length).toFixed(1) : '0.0';
  
  const handleSendReviewRequest = () => {
    // Send to all active students in batch
    const activeStudents = db.students?.filter(s => s.status === 'Active' && (batch?.studentIds?.includes(s.id) || s.batch === batch?.name));
    
    if (activeStudents?.length === 0) {
      alert("No active students found in this batch.");
      return;
    }
    
    // Create one notification targeting this batch (Student Portal resolves target === 'Batch' & targetId === activeBatch.id)
    MockDB.addItem('notifications', {
      notificationId: 
otif-,
      type: 'review_request',
      target: 'Batch',
      targetId: batchId,
      title: "Course Feedback Requested",
      message: "Please share your learning experience.",
      date: new Date().toISOString().split('T')[0],
      isFeedbackRequest: true
    });
    alert(Review request sent to  active students.);
  };

  const handleSaveExternalLink = () => {
    MockDB.updateItem('batches', batchId, { externalReviewLink: externalLink });
    setEditingExternalLink(false);
  };

  const handleApprove = (reviewId: string) => {
    MockDB.updateItem('reviews', reviewId, { status: 'Approved' });
  };

  const handleReject = (reviewId: string) => {
    MockDB.updateItem('reviews', reviewId, { status: 'Rejected' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Reviews & Feedback</h3>
          <p className="text-sm text-slate-500 mt-1">Manage student feedback and reviews for this batch.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSendReviewRequest}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Send Review Request
          </button>
        </div>
      </div>
      
      {/* Stats and External Link Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Average Rating</p>
            <p className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-current" /> {avgOverall}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Reviews</p>
            <p className="text-xl font-bold text-slate-800">{batchReviews.length}</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">External Review Link</p>
            {!editingExternalLink ? (
              <button onClick={() => setEditingExternalLink(true)} className="text-xs text-indigo-600 font-bold hover:underline">Edit</button>
            ) : (
              <button onClick={handleSaveExternalLink} className="text-xs text-green-600 font-bold hover:underline">Save</button>
            )}
          </div>
          {editingExternalLink ? (
            <input 
              type="text" 
              value={externalLink} 
              onChange={e => setExternalLink(e.target.value)}
              placeholder="https://forms.google.com/..." 
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
            />
          ) : (
            <p className="text-sm text-slate-700 truncate">{batch?.externalReviewLink || "Not configured. Using in-app review form."}</p>
          )}
        </div>
      </div>

      {batchReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-slate-700">No Reviews Yet</h4>
          <p className="mt-2 text-sm max-w-sm mx-auto">Send a review request to enrolled students. Their submissions will appear here for your approval.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200 shadow-sm">
          {batchReviews.map((review: any) => (
            <div key={review.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
                    {(review.name || review.studentName || 'S').charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{review.name || review.studentName || 'Student'}</p>
                    <p className="text-xs text-slate-400">{review.date || review.createdAt || ''} &bull; {review.course}</p>
                  </div>
                  <span className={ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full }>
                    {review.status || 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={w-3.5 h-3.5 } />
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">{review.rating || 5}/5</span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">{review.feedback || review.content || review.text || review.review}</p>
              </div>
              <div className="flex sm:flex-col gap-2 justify-end sm:justify-start shrink-0">
                {review.status !== 'Approved' && (
                  <button onClick={() => handleApprove(review.id)} className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors">
                    Approve
                  </button>
                )}
                {review.status !== 'Rejected' && (
                  <button onClick={() => handleReject(review.id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}'''

content = content[:match.start()] + new_tab + content[match.end():]

with open('frontend/src/admin/pages/BatchDashboard.tsx', 'w') as f:
    f.write(content)
