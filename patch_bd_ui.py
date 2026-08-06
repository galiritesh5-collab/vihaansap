filepath = 'frontend/src/admin/pages/BatchDashboard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find("function ReviewsFeedbackTab")
end = content.find("\nfunction ", start + 10)
func_old = content[start:end]

# --- UI text replacements inside the function ---
func_new = func_old

# Create Campaign → Send Review Request
func_new = func_new.replace('onClick={() => setShowCreateModal(true)}\n          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"\n        >\n          <Plus className="w-4 h-4" /> Create Campaign', 
                             'onClick={() => setShowCreateModal(true)}\n          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"\n        >\n          <Plus className="w-4 h-4" /> Send Review Request')

# Heading text changes
func_new = func_new.replace('"Review Campaigns"', '"Review Requests"')
func_new = func_new.replace('"Manage feedback collection campaigns for this batch."', '"Manage review requests sent to students in this batch."')
func_new = func_new.replace('"Create Review Campaign"', '"Send Review Request"')
func_new = func_new.replace('No Campaigns Yet', 'No Review Requests Yet')
func_new = func_new.replace('Create a review campaign to collect feedback from students.', 'Send a review request to collect feedback from students.')
func_new = func_new.replace('"Campaign created!', '"Review Request sent!')
func_new = func_new.replace('"No Campaigns Yet"', '"No Review Requests Yet"')
func_new = func_new.replace('"campaign"', '"review request"')

# Modal title and field labels
func_new = func_new.replace('<label className="block text-xs font-bold text-slate-500 uppercase mb-1">Campaign Name *</label>', 
                             '<label className="block text-xs font-bold text-slate-500 uppercase mb-1">Request Title *</label>')
func_new = func_new.replace('placeholder="e.g., End of Course Feedback"', 'placeholder="e.g., End of Course Feedback"')

# Status badge
func_new = func_new.replace('{camp.status === \'Active\' ? \'bg-green-100 text-green-700\' : \'bg-slate-100 text-slate-500\'}',
                             '{camp.status === \'Active\' ? \'bg-green-100 text-green-700\' : \'bg-slate-100 text-slate-500\'}')

# --- handleApprove — add supersede logic ---
old_approve = """  const handleApprove = (reviewId: string) => {
    MockDB.updateItem('reviews', reviewId, { status: 'Approved' });
  };"""

new_approve = """  const handleApprove = (reviewId: string) => {
    // Find the review being approved
    const reviewToApprove = (db.reviews || []).find((r: any) => r.id === reviewId);
    // Supersede any other approved reviews for the same student + batch
    if (reviewToApprove?.studentUid && reviewToApprove?.batchId) {
      const oldApproved = (db.reviews || []).filter((r: any) =>
        r.id !== reviewId &&
        r.status === 'Approved' &&
        r.batchId === reviewToApprove.batchId &&
        r.studentUid === reviewToApprove.studentUid
      );
      oldApproved.forEach((r: any) => MockDB.updateItem('reviews', r.id, { status: 'Superseded' }));
    }
    MockDB.updateItem('reviews', reviewId, { status: 'Approved' });
  };"""

if old_approve in func_new:
    func_new = func_new.replace(old_approve, new_approve)
    print("Supersede logic added to handleApprove")
else:
    print("WARNING: handleApprove not found")

# Replace in content
content = content[:start] + func_new + content[end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("BatchDashboard.tsx patched")
