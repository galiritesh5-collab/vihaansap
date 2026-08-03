with open('frontend/src/admin/pages/Reviews.tsx', 'r') as f:
    content = f.read()

# I will write a simple python script to inject the features.

imports = "import { Plus, Edit2, Trash2, X, CheckCircle, XCircle, RefreshCw, Eye, DownloadCloud } from 'lucide-react';"
content = content.replace("import { Plus, Edit2, Trash2, X, CheckCircle, XCircle } from 'lucide-react';", imports)

import_modal = '''
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  
  const handleImport = () => {
    try {
      const parsed = JSON.parse(importData);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      arr.forEach(rev => {
        MockDB.addItem('reviews', {
          ...rev,
          status: 'Pending',
          createdAt: new Date().toISOString()
        });
      });
      alert(Successfully imported \ reviews to Pending status.);
      setShowImport(false);
      setImportData('');
    } catch (e) {
      alert("Invalid JSON format. Please provide an array of review objects.");
    }
  };

  const handleRequestResubmission = (review: any) => {
    if (window.confirm('This will delete the current review and send a new request to the student. Continue?')) {
      // 1. Delete review
      MockDB.deleteItem('reviews', review.id);
      // 2. Send notification to student
      MockDB.addItem('notifications', {
        notificationId: 
otif-\,
        type: 'review_request',
        target: 'Specific Student',
        targetId: review.studentId || review.uid || '',
        title: "Please Resubmit Your Feedback",
        message: "We noticed an issue with your previous review. Could you please resubmit it?",
        date: new Date().toISOString().split('T')[0],
        isFeedbackRequest: true
      });
      alert('Resubmission requested.');
    }
  };
'''

content = content.replace("const handleSave = (e: React.FormEvent) => {", import_modal + "\n  const handleSave = (e: React.FormEvent) => {")

buttons = '''<button onClick={() => setShowImport(true)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
          <DownloadCloud className="w-4 h-4" /> Import Reviews
        </button>
        <button'''
content = content.replace('<button \n          onClick={() => setEditingReview({', buttons + ' \n          onClick={() => setEditingReview({')
content = content.replace('<button onClick={() => setEditingReview({', buttons + ' onClick={() => setEditingReview({')

actions = '''<button onClick={() => handleApprove(review)} className="p-2 text-slate-400 hover:text-green-600 rounded-lg hover:bg-green-50" title="Approve">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleReject(review)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Reject">
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleRequestResubmission(review)} className="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50" title="Request Resubmission">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingReview(review)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>'''
content = content.replace('''<button onClick={() => handleApprove(review)} className="p-2 text-slate-400 hover:text-green-600 rounded-lg hover:bg-green-50" title="Approve">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleReject(review)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Reject">
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingReview(review)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>''', actions)

modal_html = '''{showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Import External Reviews</h3>
              <button onClick={() => setShowImport(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">Paste review data in JSON format. They will be added as "Pending Approval".</p>
              <textarea 
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={8}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder='[{"name": "John Doe", "rating": 5, "content": "Great course!"}]'
              ></textarea>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowImport(false)} className="px-4 py-2 font-bold text-slate-600">Cancel</button>
              <button onClick={handleImport} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">Import Reviews</button>
            </div>
          </div>
        </div>
      )}'''
      
content = content.replace('{editingReview && (', modal_html + '\n\n      {editingReview && (')

with open('frontend/src/admin/pages/Reviews.tsx', 'w') as f:
    f.write(content)
