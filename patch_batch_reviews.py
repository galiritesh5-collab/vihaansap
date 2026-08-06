import os

filepath = 'frontend/src/admin/pages/BatchDashboard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_func_start = content.find("function ReviewsFeedbackTab")
if old_func_start == -1:
    print("Not found")
    exit(1)

old_func_end = content.find("function ", old_func_start + 10)

new_func = """function ReviewsFeedbackTab({ batchId }: { batchId: string }) {
  const db = useDB();
  const batch = db.batches?.find(b => b.id === batchId);
  const activeStudents = db.students?.filter(s => s.status === 'Active' && (batch?.studentIds?.includes(s.id) || s.batch === batch?.name)) || [];
  
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', description: '', target: 'all', externalLink: '', selectedIds: [] as string[] });
  
  const campaigns = (db.reviewCampaigns || []).filter((c: any) => c.batchId === batchId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const campaignId = `camp-${Date.now()}`;
    const recipientIds = newCampaign.target === 'all' ? activeStudents.map(s => s.id) : newCampaign.selectedIds;
    
    if (recipientIds.length === 0) {
      alert("No students targeted.");
      return;
    }
    
    const payload = {
      id: campaignId,
      batchId,
      name: newCampaign.name,
      description: newCampaign.description,
      externalLink: newCampaign.externalLink || undefined,
      recipientIds,
      status: 'Active',
      createdAt: new Date().toISOString(),
      createdBy: 'Admin'
    };
    
    MockDB.addItem('reviewCampaigns', payload);
    
    // Create notifications for targeted students
    MockDB.addItem('notifications', {
      notificationId: `notif-${Date.now()}`,
      type: 'review_campaign',
      target: 'Campaign',
      targetId: campaignId,
      title: "Feedback Request: " + newCampaign.name,
      message: newCampaign.description || "Please share your learning experience.",
      date: new Date().toISOString().split('T')[0],
      isFeedbackRequest: true,
      recipientType: 'selected',
      recipientIds
    });
    
    setShowCreateModal(false);
    setNewCampaign({ name: '', description: '', target: 'all', externalLink: '', selectedIds: [] });
    alert(`Campaign created! Review request sent to ${recipientIds.length} students.`);
  };

  const activeCampaign = campaigns.find((c: any) => c.id === activeCampaignId);
  const campaignReviews = activeCampaign ? (db.reviews || []).filter((r: any) => r.campaignId === activeCampaign.id) : [];
  
  const handleApprove = (reviewId: string) => {
    MockDB.updateItem('reviews', reviewId, { status: 'Approved' });
  };
  const handleReject = (reviewId: string) => {
    MockDB.updateItem('reviews', reviewId, { status: 'Rejected' });
  };
  const handleDelete = (reviewId: string) => {
    MockDB.deleteItem('reviews', reviewId);
  };
  const handleToggleCampaignStatus = (campaign: any) => {
    MockDB.updateItem('reviewCampaigns', campaign.id, { status: campaign.status === 'Active' ? 'Closed' : 'Active' });
  };

  if (activeCampaignId && activeCampaign) {
    const approvedReviews = campaignReviews.filter((r: any) => r.status === 'Approved');
    const pendingReviews = campaignReviews.filter((r: any) => r.status === 'Pending' || !r.status);
    const rejectedReviews = campaignReviews.filter((r: any) => r.status === 'Rejected');
    const avgOverall = approvedReviews.length > 0 ? (approvedReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / approvedReviews.length).toFixed(1) : '0.0';

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveCampaignId(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-800">{activeCampaign.name}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeCampaign.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {activeCampaign.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">{activeCampaign.description || 'No description provided.'}</p>
          </div>
          <button 
            onClick={() => handleToggleCampaignStatus(activeCampaign)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors border ${activeCampaign.status === 'Active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
          >
            {activeCampaign.status === 'Active' ? 'Close Campaign' : 'Reopen Campaign'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
             <p className="text-xs font-bold text-slate-500 uppercase">Avg Rating</p>
             <p className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-1 mt-1"><Star className="w-5 h-5 text-yellow-400 fill-current"/> {avgOverall}</p>
           </div>
           <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
             <p className="text-xs font-bold text-slate-500 uppercase">Submitted</p>
             <p className="text-2xl font-bold text-slate-800 mt-1">{campaignReviews.length} <span className="text-sm text-slate-400 font-normal">/ {activeCampaign.recipientIds?.length || 0}</span></p>
           </div>
           <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
             <p className="text-xs font-bold text-slate-500 uppercase">Approved</p>
             <p className="text-2xl font-bold text-green-600 mt-1">{approvedReviews.length}</p>
           </div>
           <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
             <p className="text-xs font-bold text-slate-500 uppercase">Pending</p>
             <p className="text-2xl font-bold text-amber-600 mt-1">{pendingReviews.length}</p>
           </div>
        </div>

        {activeCampaign.externalLink && (
           <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm flex justify-between items-center">
             <p><strong>External Link Configured:</strong> {activeCampaign.externalLink}</p>
             <a href={activeCampaign.externalLink} target="_blank" rel="noreferrer" className="bg-white border border-blue-200 px-3 py-1 rounded text-xs font-bold hover:bg-blue-100">Test Link</a>
           </div>
        )}

        {campaignReviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-slate-700">No Submissions Yet</h4>
            <p className="mt-2 text-sm max-w-sm mx-auto">Students have been notified but haven't submitted feedback yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200 shadow-sm">
            {campaignReviews.map((review: any) => (
              <div key={review.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {(review.name || review.studentName || 'S').charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{review.name || review.studentName || 'Student'}</p>
                      <p className="text-xs text-slate-400">{review.createdAt ? new Date(review.createdAt).toLocaleString() : ''} &bull; {review.company ? `${review.designation} at ${review.company}` : review.course}</p>
                    </div>
                    <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      review.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      review.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {review.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < (review.rating || 5) ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">{review.rating || 5}/5</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{review.feedback || review.content || review.text || review.review}</p>
                </div>
                <div className="flex sm:flex-col gap-2 justify-end sm:justify-start shrink-0">
                  {review.status !== 'Approved' && (
                    <button onClick={() => handleApprove(review.id)} className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors">Approve</button>
                  )}
                  {review.status !== 'Rejected' && (
                    <button onClick={() => handleReject(review.id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">Reject</button>
                  )}
                  <button onClick={() => handleDelete(review.id)} className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-red-600 rounded-lg text-xs font-bold transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Review Campaigns</h3>
          <p className="text-sm text-slate-500 mt-1">Manage feedback collection campaigns for this batch.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>
      
      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-slate-700">No Campaigns Yet</h4>
          <p className="mt-2 text-sm max-w-sm mx-auto">Create a review campaign to collect feedback from students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((camp: any) => {
            const campReviews = (db.reviews || []).filter((r: any) => r.campaignId === camp.id);
            const approved = campReviews.filter((r: any) => r.status === 'Approved').length;
            const avg = approved > 0 ? (campReviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / approved).toFixed(1) : '0';
            
            return (
              <div 
                key={camp.id} 
                onClick={() => setActiveCampaignId(camp.id)}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{camp.name}</h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${camp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {camp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{camp.description || 'No description'}</p>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-slate-800">{campReviews.length}</span> / {camp.recipientIds?.length || 0} Submissions
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" /> {avg}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Create Review Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateCampaign} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Campaign Name *</label>
                <input required type="text" value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} placeholder="e.g., End of Course Feedback" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description (Optional)</label>
                <textarea value={newCampaign.description} onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} placeholder="Message to students..." rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">External Review Link (Optional)</label>
                <input type="url" value={newCampaign.externalLink} onChange={e => setNewCampaign({...newCampaign, externalLink: e.target.value})} placeholder="e.g., Google Forms URL" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                <p className="text-[10px] text-slate-400 mt-1">If provided, students will be redirected to this link instead of the internal review form.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Audience</label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 text-sm"><input type="radio" checked={newCampaign.target === 'all'} onChange={() => setNewCampaign({...newCampaign, target: 'all'})}/> All Active Students ({activeStudents.length})</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" checked={newCampaign.target === 'selected'} onChange={() => setNewCampaign({...newCampaign, target: 'selected', selectedIds: []})}/> Selected Students</label>
                </div>
                {newCampaign.target === 'selected' && (
                  <div className="border rounded-lg p-2 max-h-40 overflow-y-auto space-y-1 bg-slate-50">
                    {activeStudents.map(s => (
                      <label key={s.id} className="flex items-center gap-2 text-sm text-slate-700 p-1 hover:bg-slate-100 rounded cursor-pointer">
                        <input type="checkbox" checked={newCampaign.selectedIds.includes(s.id)} onChange={(e) => {
                          if (e.target.checked) setNewCampaign({...newCampaign, selectedIds: [...newCampaign.selectedIds, s.id]});
                          else setNewCampaign({...newCampaign, selectedIds: newCampaign.selectedIds.filter(id => id !== s.id)});
                        }}/>
                        {s.name} ({s.email})
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Create & Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"""

content = content[:old_func_start] + new_func + content[old_func_end:]
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated BatchDashboard.tsx")
