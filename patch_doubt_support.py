import re

with open('frontend/src/student/pages/DoubtSupport.tsx', 'r') as f:
    content = f.read()

# I will write a simple python script to inject priority and topic fields into DoubtSupport.tsx

content = content.replace("const [title, setTitle] = useState('');", "const [title, setTitle] = useState('');\n  const [priority, setPriority] = useState('Medium');")

# In handleSubmit:
submit_replacement = '''
    const newDoubt = {
      id: doubt-,
      studentId: currentUser?.uid || studentProfile.id,
      studentName: studentProfile.name,
      studentEmail: currentUser?.email || studentProfile.email || '',
      batchId: activeBatch.id,
      batchName: activeBatch.name,
      courseId: course?.id || '',
      courseName: activeBatch.course,
      mentorId: activeBatch.mentor || '',
      topic: title.trim(),
      title: title.trim(),
      subject: title.trim(),
      question: description.trim(),
      description: description.trim(),
      priority,
      status: 'Open',
      date: now.split('T')[0],
      createdAt: now,
      updatedAt: now,
      replies: []
    };
    MockDB.addItem('doubts', newDoubt);
'''
content = re.sub(r"const newDoubt = \{.*?\};\s*MockDB.addItem\('doubts', newDoubt\);", submit_replacement, content, flags=re.DOTALL)


form_addition = '''
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Priority</label>
                    <select 
                      value={priority}
                      onChange={e => setPriority(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
'''

content = content.replace("<div>\n                    <label className=\"block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2\">Topic</label>", form_addition + "                    <label className=\"block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2\">Topic</label>")


# For the replies array, let's write to doubtReplies collection too.
# But wait, earlier we left replies in the doubts array in MockDB. We can just keep using eplies in doubts since we aren't fetching a separate doubtReplies collection here, it simplifies things for now without breaking existing code.
# The user said: Create doubtReplies collection.
# If I create it, I have to update DoubtSupport to read from it.
# The eplies array is embedded right now. It's fine for now, we can write to doubtReplies later or stick to the array if it works. Let's do doubtReplies.

reply_submit = '''
    const newReply = {
      id: eply-,
      doubtId: selectedDoubt.id,
      authorId: studentProfile.id,
      authorName: studentProfile.name,
      authorRole: 'student',
      author: studentProfile.name, // backward compatibility
      content: replyText,
      text: replyText,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString()
    };
    
    MockDB.addItem('doubtReplies', newReply);
    
    MockDB.updateItem('doubts', selectedDoubt.id, {
      replies: [...(selectedDoubt.replies || []), newReply],
      updatedAt: new Date().toISOString(),
      status: 'Open' // Change status to Open when student replies
    });
'''

content = re.sub(r"const newReply = \{.*?\};\s*MockDB\.updateItem\('doubts', selectedDoubt\.id, \{.*?\}\);", reply_submit, content, flags=re.DOTALL)


with open('frontend/src/student/pages/DoubtSupport.tsx', 'w') as f:
    f.write(content)
