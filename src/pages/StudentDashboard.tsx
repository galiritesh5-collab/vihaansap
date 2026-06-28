import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Film, FileText, CreditCard, User, LogOut, Tv, BookOpenCheck, 
  ExternalLink, CheckCircle2, ChevronRight, GraduationCap, Clock, Award, 
  Check, FileDown, Lock, Server, Play, ChevronLeft, RefreshCw 
} from 'lucide-react';
import { MOCK_SCHEDULES, MOCK_RECORDINGS, MOCK_ASSIGNMENTS, MOCK_PAYMENTS } from '../data';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'schedules' | 'recordings' | 'assignments' | 'payments'>('schedules');
  const [userEmail, setUserEmail] = useState('student@vihaan.com');
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  // Authenticity guard
  useEffect(() => {
    const role = localStorage.getItem('vihaan_user_role');
    const email = localStorage.getItem('vihaan_user_email');
    if (role !== 'student') {
      navigate('/login');
    } else if (email) {
      setUserEmail(email);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('vihaan_user_role');
    localStorage.removeItem('vihaan_user_email');
    navigate('/login');
  };

  return (
    <div id="student-portal" className="bg-slate-50 min-h-[85vh] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Portal Upper Banner Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="portal-user-hero">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1763B6] text-white rounded-2xl flex items-center justify-center font-display font-bold text-lg border border-white/10 shadow-sm shrink-0">
              ST
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-orange-500 font-bold uppercase tracking-wider bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded">
                  Cohort Member Active
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sandbox Server Connected
                </span>
              </div>
              <h1 className="font-display font-extrabold text-[#1763B6] text-lg sm:text-xl md:text-2xl mt-1">
                Student Administration Panel
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Session Account: <strong className="text-slate-650 text-slate-500 underline">{userEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {/* Quick action mock to connect sandbox */}
            <div className="bg-slate-50 border border-slate-200 text-[#1763B6] text-xs px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-1.5 hover:bg-slate-100/50 transition-colors pointer-events-auto">
              <Server className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Connect SAP GUI Sandbox</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-xs px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 pointer-events-auto font-bold"
              id="btn-logout"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab switch layout columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="portal-split-main">
          
          {/* Dashboard Left side navigation links */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-110 border-slate-100 p-4 shadow-xs space-y-4" id="portal-left-menu">
            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-2">Portal Navigation</h4>
            
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setActiveTab('schedules')}
                className={`w-full text-left rounded-lg text-xs font-semibold px-3 py-3 flex items-center justify-between transition-colors pointer-events-auto cursor-pointer ${
                  activeTab === 'schedules'
                    ? 'bg-[#1763B6] text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-schedules"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5" />
                  <span>Interactive class schedules</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'schedules' ? 'text-white' : 'text-slate-300'}`} />
              </button>

              <button
                onClick={() => setActiveTab('recordings')}
                className={`w-full text-left rounded-lg text-xs font-semibold px-3 py-3 flex items-center justify-between transition-colors pointer-events-auto cursor-pointer ${
                  activeTab === 'recordings'
                    ? 'bg-[#1763B6] text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-recordings"
              >
                <div className="flex items-center gap-2">
                  <Film className="w-4.5 h-4.5" />
                  <span>Session Recordings</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'recordings' ? 'text-white' : 'text-slate-300'}`} />
              </button>

              <button
                onClick={() => setActiveTab('assignments')}
                className={`w-full text-left rounded-lg text-xs font-semibold px-3 py-3 flex items-center justify-between transition-colors pointer-events-auto cursor-pointer ${
                  activeTab === 'assignments'
                    ? 'bg-[#1763B6] text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-assignments"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5" />
                  <span>Class Assignments</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'assignments' ? 'text-white' : 'text-slate-300'}`} />
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full text-left rounded-lg text-xs font-semibold px-3 py-3 flex items-center justify-between transition-colors pointer-events-auto cursor-pointer ${
                  activeTab === 'payments'
                    ? 'bg-[#1763B6] text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-payments"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4.5 h-4.5" />
                  <span>Tuition Payments Ledger</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'payments' ? 'text-white' : 'text-slate-300'}`} />
              </button>
            </div>

            <hr className="border-slate-100" />
            
            {/* Quick Sandbox Help note */}
            <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500 space-y-1" id="sandbox-widget">
              <span className="font-semibold text-slate-700 block">Class Sandbox System</span>
              <p className="leading-normal">Server ID: <strong className="text-slate-600">S4H_DEV_800</strong></p>
              <p className="leading-normal text-slate-400">Credentials expire inside 90 days. For server renewals open direct WhatsApp support.</p>
            </div>
          </div>

          {/* Dashboard Right content dynamic display */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-100 p-6 min-h-[50vh] shadow-xs" id="portal-right-content">
            
            {/* View 1: Schedules */}
            {activeTab === 'schedules' && (
              <div id="view-schedules" className="space-y-6">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center gap-2">
                  <div className="space-y-0.5">
                    <h3 className="font-display font-bold text-slate-800 text-base sm:text-lg">Class Schedules</h3>
                    <p className="text-xs text-slate-500">Live instructor-led classrooms. Connect with Google Meet client.</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded font-mono uppercase">
                    UTC Time Enabled
                  </span>
                </div>

                <div className="space-y-4">
                  {MOCK_SCHEDULES.map((sch) => (
                    <div 
                      key={sch.id}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                        sch.status === 'Live'
                          ? 'border-emerald-500/40 bg-emerald-50/20'
                          : 'border-slate-100'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          {sch.status === 'Live' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                              Active Lecture Live
                            </span>
                          ) : sch.status === 'Upcoming' ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-105 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                              Upcoming Slot
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                              Term Completed
                            </span>
                          )}
                          <span className="text-[11px] font-semibold text-slate-400 font-mono">ID: {sch.id}</span>
                        </div>
                        <h4 className="font-display font-semibold text-slate-800 text-sm sm:text-base leading-snug">
                          {sch.courseName}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500">
                          <p><strong>Mentor:</strong> {sch.instructor}</p>
                          <p><strong>Timing:</strong> {sch.date} | {sch.time}</p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center">
                        {sch.meetingLink ? (
                          <a
                            href={sch.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 pointer-events-auto ${
                              sch.status === 'Live'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow shadow-emerald-600/10'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <span>Join Google Lecture</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <div className="text-[11px] font-medium text-slate-400 bg-slate-100 px-3 py-2 rounded">
                            No active code link
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 2: Recordings */}
            {activeTab === 'recordings' && (
              <div id="view-recordings" className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-slate-800 text-base sm:text-lg">Cohort recordings</h3>
                  <p className="text-xs text-slate-500">HD records of completed configuration classrooms. Streams immediately inside player space.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="recordings-grid-portal">
                  {MOCK_RECORDINGS.map((video) => (
                    <div 
                      key={video.id} 
                      className="bg-slate-50 rounded-xl border border-slate-150 p-4 hover:border-[#1763B6]/35 transition-all flex flex-col justify-between space-y-4 select-none"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          <span>{video.courseName} Lecture</span>
                          <span>Uploaded: {video.uploadDate}</span>
                        </div>
                        <h4 className="font-display font-bold text-slate-800 text-sm leading-tight line-clamp-2">
                          {video.title}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-300" /> Length: {video.duration}
                        </span>
                      </div>

                      <button
                        onClick={() => alert(`Streaming configuration initialized for lecture recording record ${video.id}. This mocks media launch.`)}
                        className="w-full text-center bg-[#1763B6] hover:bg-[#277EDC] text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer pointer-events-auto"
                      >
                        <Play className="w-3.5 h-3.5 text-orange-400 fill-[#F4A62A]" />
                        <span>Stream HD Playback</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 3: Assignments */}
            {activeTab === 'assignments' && (
              <div id="view-assignments" className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-[#1763B6] text-base sm:text-lg">Class Assignments</h3>
                  <p className="text-xs text-slate-500">Complete tasks on active sandboxes and register system credentials snapshots for grading reviews.</p>
                </div>

                <div className="space-y-4">
                  {MOCK_ASSIGNMENTS.map((asg) => (
                    <div key={asg.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {asg.status === 'Graded' ? (
                            <span className="text-[10px] bg-green-105 bg-green-50 text-green-700 font-bold border border-green-200 px-2 py-0.5 rounded font-sans uppercase">
                              Graded
                            </span>
                          ) : asg.status === 'Submitted' ? (
                            <span className="text-[10px] bg-amber-105 bg-amber-50 text-amber-700 font-bold border border-amber-200 px-2 py-0.5 rounded font-sans uppercase">
                              Submitted / Pending
                            </span>
                          ) : (
                            <span className="text-[10px] bg-red-105 bg-red-50 text-red-750 text-red-600 font-bold border border-red-200 px-2 py-0.5 rounded font-sans uppercase">
                              Pending Task
                            </span>
                          )}
                          <span className="text-[11px] font-semibold text-slate-400 font-mono">DUE: {asg.dueDate}</span>
                        </div>
                        <h4 className="font-display font-bold text-slate-800 text-sm sm:text-base leading-snug">
                          {asg.title}
                        </h4>
                        <p className="text-xs text-slate-400">Target Core Module: <strong className="text-slate-500 font-medium">{asg.courseName}</strong></p>
                      </div>

                      <div className="shrink-0 flex items-center gap-3">
                        {asg.status === 'Graded' && asg.grade && (
                          <div className="bg-[#1763B6]/5 p-2 rounded-lg border border-[#1763B6]/10 text-center w-20">
                            <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">Score Status</span>
                            <span className="text-base font-extrabold text-[#1763B6] font-display block leading-none mt-0.5">{asg.grade}</span>
                          </div>
                        )}

                        {asg.status === 'Pending' ? (
                          <button
                            onClick={() => alert(`Submitting configuration screenshot for assignment ${asg.id} is simulated`)}
                            className="bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer pointer-events-auto"
                          >
                            Upload Case Work
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-slate-100 text-slate-400 font-medium text-xs px-4 py-2 rounded-lg"
                          >
                            Uploaded
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 4: Payments Ledger */}
            {activeTab === 'payments' && (
              <div id="view-payments" className="space-y-6">
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h3 className="font-display font-bold text-slate-800 text-base sm:text-lg">Tuition Ledger Receipts</h3>
                    <p className="text-xs text-slate-500">Trace your registered payment history and download printable school receipts.</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 font-sans font-bold text-xs px-3 py-1.5 rounded-lg border border-emerald-150 inline-block font-mono">
                    Ledger Status: Completed
                  </div>
                </div>

                <div className="overflow-x-auto" id="payments-table-scroller">
                  <table className="w-full text-xs sm:text-sm text-left border-collapse" id="payments-table">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-3 text-slate-500 font-semibold">T_Date</th>
                        <th className="p-3 text-slate-500 font-semibold">Receipt No</th>
                        <th className="p-3 text-slate-500 font-semibold">Installment Purpose</th>
                        <th className="p-3 text-slate-500 font-semibold text-right">Amount (INR)</th>
                        <th className="p-3 text-slate-500 font-semibold text-center">Status</th>
                        <th className="p-3 text-slate-500 font-semibold text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_PAYMENTS.map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-[11px] text-slate-500">{pay.date}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-700 font-semibold">{pay.receiptNo}</td>
                          <td className="p-3 text-slate-600 font-medium">{pay.purpose}</td>
                          <td className="p-3 text-right font-bold text-slate-700">₹{pay.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className="inline-block bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded font-sans uppercase">
                              {pay.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setActiveReceipt(pay)}
                              className="text-slate-450 hover:text-[#1763B6] p-1.5 rounded hover:bg-slate-100 transition-all pointer-events-auto inline-flex items-center justify-center cursor-pointer"
                              title="Print printable receipt"
                            >
                              <FileDown className="w-4.5 h-4.5 text-slate-400 hover:text-[#1763B6]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Printable Receipt Overlay dialog popup */}
      {activeReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 p-6 space-y-6" id="receipt-printed-card">
            
            {/* Header style */}
            <div className="flex justify-between items-start border-b border-slate-150 pb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-[#1763B6] text-orange-400" />
                <div className="flex flex-col">
                  <span className="font-display font-black text-xs text-[#1763B6] leading-none">SRI VIHAAN</span>
                  <span className="text-[8px] font-semibold text-orange-500 uppercase tracking-widest mt-0.5 leading-none">CONSULTING</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded uppercase font-mono">
                Official school receipt
              </span>
            </div>

            {/* Core facts body */}
            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-b border-slate-100 pb-3">
                <p className="text-slate-400">RECEIPT NUMBER:</p>
                <p className="text-right font-bold text-slate-800">{activeReceipt.receiptNo}</p>
                <p className="text-slate-400">PAY DATE:</p>
                <p className="text-right font-bold text-slate-800">{activeReceipt.date}</p>
                <p className="text-slate-400">STUDENT EMAIL:</p>
                <p className="text-right font-bold text-slate-800 truncate">{userEmail}</p>
              </div>

              <div className="space-y-1">
                <p className="text-slate-400 font-sans uppercase font-bold text-[10px]">T_Payment particulars:</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium font-sans">{activeReceipt.purpose}</span>
                  <span className="font-extrabold text-[#1763B6]">₹{activeReceipt.amount.toLocaleString()}.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-slate-800 pt-1 text-sm sm:text-base border-t border-slate-100">
                <span>TOTAL VOLUME:</span>
                <span className="text-emerald-600">₹{activeReceipt.amount.toLocaleString()}.00</span>
              </div>
            </div>

            <p className="text-[9px] text-[#277EDC] leading-relaxed italic text-center font-medium bg-[#277EDC]/5 p-2 rounded-lg">
              * This is a computer-generated school receipt issued under active training credentials by Sri Vihaan Consulting.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-905 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 pointer-events-auto"
              >
                <span>Print Record</span>
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer pointer-events-auto"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
