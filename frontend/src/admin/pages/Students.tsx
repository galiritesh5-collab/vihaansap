import React, { useEffect, useMemo, useState } from 'react';
import { Search, MoreVertical, X, CheckCircle, Ban } from 'lucide-react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { FirestoreDBService }
from '../../services/FirestoreDBService';
import { FirestoreStudentService } from '../../services/FirestoreStudentService';

function whatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const number = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function buildEnrollmentWelcomeMessage(studentName: string, batchName: string, courseName: string): string {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  
  return `Hello Mr./Ms. ${studentName},

🎉 Congratulations!

You have been successfully enrolled in

📘 Course:
${courseName}

👥 Batch:
${batchName}

📅 Enrollment Date:
${currentDate}

Welcome to Sri Vihaan SAP Consulting.

We are excited to have you as part of our learning community.

You will receive complete guidance throughout your SAP journey.

If you have any questions, please feel free to contact us anytime.

Best Regards,
Sri Vihaan SAP Consulting`;
}

function timestampValue(value: any): number {
  if (!value) return 0;
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

const isRecentlyJoined = (student: any) => {
  const joinedAt = timestampValue(student.createdAt || student.joinedAt || student.date);
  return joinedAt > 0 && Date.now() - joinedAt <= 7 * 24 * 60 * 60 * 1000;
};

export default function Students() {
    const db = useDB();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBackground, setFilterBackground] = useState('');
  
  const filteredStudents = useMemo(() => db.students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse ? student.course === filterCourse : true;
    const matchesBatch = filterBatch ? student.batch === filterBatch : true;
    const matchesStatus = filterStatus ? student.status === filterStatus : true;
    const matchesBg = filterBackground ? student.background === filterBackground : true;
    
    return matchesSearch && matchesCourse && matchesBatch && matchesStatus && matchesBg;
  }).sort((a: any, b: any) => {
    const loginDiff = timestampValue(b.lastLogin) - timestampValue(a.lastLogin);
    if (loginDiff) return loginDiff;
    return timestampValue(b.createdAt || b.joinedAt || b.date) - timestampValue(a.createdAt || a.joinedAt || a.date);
  }), [db.students, searchTerm, filterCourse, filterBatch, filterStatus, filterBackground]);

  useEffect(() => {
    const existing = new Set((db.notifications || []).filter((n: any) => n.type === 'student_joined').map((n: any) => n.studentId));
    db.students.filter(isRecentlyJoined).filter((student: any) => !existing.has(student.id || student.uid)).forEach((student: any) => {
      const studentId = student.id || student.uid;
      MockDB.addItem('notifications', { id: `student_joined_${studentId}`, type: 'student_joined', studentId, target: 'Admin', targetId: 'admin', title: 'New student joined', message: `${student.name || student.email || 'A student'} joined the platform.`, date: new Date().toISOString().slice(0, 10), createdAt: new Date().toISOString() });
    });
  }, [db.students, db.notifications]);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Edit states
  const [editCourse, setEditCourse] = useState('');
  const [editBatch, setEditBatch] = useState('');
  const [editCourseStatus, setEditCourseStatus] = useState('In Progress');

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setEditCourse(student.course || '');
    setEditBatch(student.batch || '');
    setEditCourseStatus(student.courseStatus || 'In Progress');
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await MockDB.updateItem('students', id, { status });
    // Also persist to Firestore using the student's uid
    const student = db.students.find((s: any) => s.id === id);
    if (student?.uid) {
      FirestoreStudentService.updateStudent(student.uid, { status }).catch(console.error);
    }
    if (selectedStudent?.id === id) {
      setSelectedStudent({ ...selectedStudent, status });
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedStudent) return;
    const updatePayload = {
      course: editCourse,
      batch: editBatch,
      courseStatus: editCourseStatus,
    };

    await MockDB.updateItem('students', selectedStudent.id, updatePayload);

    // ── Persist to Firestore ──────────────────────────────────────────────
    if (selectedStudent.uid) {
      FirestoreStudentService.updateStudent(selectedStudent.uid, updatePayload).catch(console.error);
    }

    // Update Batch to include student
    const currentDB = MockDB.get();
    const targetBatch = currentDB.batches.find((b: any) => b.name === editBatch);
    if (targetBatch) {
      const studentIds = targetBatch.studentIds || [];
      if (!studentIds.includes(selectedStudent.id)) {
        MockDB.updateItem('batches', targetBatch.id, {
          studentIds: [...studentIds, selectedStudent.id],
        });
        FirestoreDBService.upsert('batches', targetBatch.id, { studentIds: [...studentIds, selectedStudent.id] }).catch(console.error);
      }
    }

    // Remove from old batch if it changed
    if (selectedStudent.batch && selectedStudent.batch !== editBatch) {
      const oldBatch = currentDB.batches.find((b: any) => b.name === selectedStudent.batch);
      if (oldBatch) {
        const updatedOldStudentIds = (oldBatch.studentIds || []).filter((id: string) => id !== selectedStudent.id);
        MockDB.updateItem('batches', oldBatch.id, {
          studentIds: updatedOldStudentIds,
        });
        FirestoreDBService.upsert('batches', oldBatch.id, { studentIds: updatedOldStudentIds }).catch(console.error);
      }
    }

    setSelectedStudent({
      ...selectedStudent,
      ...updatePayload,
    });
    alert('Student profile updated successfully!');
  };

  const handleSendWelcome = () => {
    if (selectedStudent?.phone && editBatch && editCourse) {
      window.open(whatsAppLink(selectedStudent.phone, buildEnrollmentWelcomeMessage(selectedStudent.name, editBatch, editCourse)), "_blank");
    } else {
      alert("Please ensure the student has a phone number, course, and batch assigned.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Main List */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedStudent ? 'pr-[400px]' : ''}`}>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Students</h2>
            <p className="text-slate-500 text-sm mt-1">
              Manage student enrollments and progress.
              <span className="ml-2 inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
                Live Sync
              </span>
            </p>
          </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search students..." 
                className="w-full sm:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option value="">All Courses</option>
              {db.courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option value="">All Batches</option>
              {db.batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select value={filterBackground} onChange={e => setFilterBackground(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option value="">All Backgrounds</option>
              <option value="Working Professional">Working Professional</option>
              <option value="Student">Student</option>
              <option value="Career Switcher">Career Switcher</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course/Batch</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">No students found matching filters.</td></tr>
                )}
                {filteredStudents.map(student => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => handleSelectStudent(student)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                            {student.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-2"><span>{student.role || 'Student'}</span>{isRecentlyJoined(student) && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">New</span>}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{student.email}</p>
                      <p className="text-xs text-slate-500">{student.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        student.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">{student.course}</p>
                      <p className="text-xs text-slate-500">{student.batch}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{timestampValue(student.lastLogin) ? new Date(timestampValue(student.lastLogin)).toLocaleString() : 'Never logged in'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Drawer */}
      <div className={`fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 z-50 ${selectedStudent ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedStudent && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-lg text-slate-800">Student Profile</h3>
              <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center">
                {selectedStudent.avatar ? (
                   <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-slate-50 shadow-sm" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-display font-bold text-3xl mx-auto mb-4">
                    {selectedStudent.name.charAt(0)}
                  </div>
                )}
                <h4 className="font-bold text-xl text-slate-800">{selectedStudent.name}</h4>
                <p className="text-sm text-slate-500">{selectedStudent.email} • {selectedStudent.phone}</p>
                <p className="text-xs text-slate-400 mt-1">Registered: {selectedStudent.date || 'N/A'} • Age: {selectedStudent.age || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</p>
                  <p className="text-sm font-bold text-slate-800">{selectedStudent.role || 'Student'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-bold text-slate-800">{selectedStudent.status}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Enrollment Details</h5>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assign Course</label>
                  <select 
                    value={editCourse}
                    onChange={(e) => {
                      setEditCourse(e.target.value);
                      setEditBatch('');
                    }}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">No Course Assigned</option>
                    {db.courses.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assign Batch</label>
                  <select 
                    value={editBatch}
                    onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">No Batch Assigned</option>
                    {db.batches.filter(b => !editCourse || b.course === editCourse).map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Course Status</label>
                  <select value={editCourseStatus} onChange={e => setEditCourseStatus(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm mb-4">
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>

                <button onClick={handleSaveChanges} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors mt-2">
                  Save Changes
                </button>
                
                {editCourse && editBatch && (
                  <button onClick={handleSendWelcome} className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-2.5 rounded-lg text-sm font-semibold transition-colors mt-2 flex items-center justify-center gap-2 shadow-sm">
                    📱 Send WhatsApp Welcome
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <h5 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Quick Actions</h5>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleUpdateStatus(selectedStudent.id, 'Active')} className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedStudent.id, 'Deactivated')} className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Ban className="w-4 h-4" /> Deactivate
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedStudent.id, 'Rejected')} className="col-span-2 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Reject Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
