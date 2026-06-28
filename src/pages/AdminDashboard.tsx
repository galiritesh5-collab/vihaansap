import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users2, Server, TrendingUp, ChevronRight, CheckCircle, Award, Sparkles, 
  Trash2, Mail, Phone, Calendar, Send, Building2, ExternalLink, ShieldCheck, 
  LogOut, RefreshCw, Layers, Check, Hourglass, PlusCircle, AlertCircle
} from 'lucide-react';
import { SAP_COURSES } from '../data';

// Initial Mock registrations
interface DemoInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  module: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Closed';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<DemoInquiry[]>([
    {
      id: 'inq-1',
      name: 'Prakash Rao',
      email: 'prakash@example.com',
      phone: '9908000211',
      module: 'SAP FICO (Financials)',
      date: '2026-06-09',
      status: 'Pending'
    },
    {
      id: 'inq-2',
      name: 'Meenakshi Iyer',
      email: 'meera@gmail.com',
      phone: '9908000455',
      module: 'SAP SuccessFactors Cloud',
      date: '2026-06-08',
      status: 'Approved'
    },
    {
      id: 'inq-3',
      name: 'Vikram Singh',
      email: 'vikram.abap@hotmail.com',
      phone: '9908000889',
      module: 'SAP ABAP (Technical Code)',
      date: '2026-06-07',
      status: 'Approved'
    }
  ]);

  // Authenticity guard
  useEffect(() => {
    const role = localStorage.getItem('vihaan_user_role');
    if (role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('vihaan_user_role');
    localStorage.removeItem('vihaan_user_email');
    navigate('/login');
  };

  const handleApproveInquiry = (id: string) => {
    setInquiries(prev => 
      prev.map(inq => inq.id === id ? { ...inq, status: 'Approved' } : inq)
    );
  };

  const handleCloseInquiry = (id: string) => {
    setInquiries(prev => 
      prev.map(inq => inq.id === id ? { ...inq, status: 'Closed' } : inq)
    );
  };

  return (
    <div id="admin-portal" className="bg-slate-50 min-h-[85vh] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Banner Card Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="admin-upper-banner">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-center font-display font-extrabold text-lg border border-white shadow-sm shrink-0">
              AD
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-900 bg-amber-400 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Administrator Portal Active
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase font-bold">
                  System Configuration Ok
                </span>
              </div>
              <h1 className="font-display font-black text-[#1763B6] text-lg sm:text-xl md:text-2xl mt-1">
                Sri Vihaan Consulting Institutional Management
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Staff Authentication Profile: <strong className="text-slate-500 font-semibold">admin@vihaan.com</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <div className="bg-[#145096] border border-blue-900 text-[#F4A62A] text-xs px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#F4A62A] shrink-0" />
              <span>Full Access Level 3</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-650 text-red-600 border border-red-100 text-xs px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 pointer-events-auto font-bold"
              id="btn-admin-logout"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log out portal</span>
            </button>
          </div>
        </div>

        {/* Global summary stats columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="admin-summary-scores">
          
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-3xs text-center flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unresolved Demo leads</span>
            <span className="text-3xl font-display font-extrabold text-[#1763B6] mt-1">
              {inquiries.filter(i => i.status === 'Pending').length} Leads
            </span>
            <span className="text-[10px] text-orange-500 font-semibold mt-1">Awaiting counselor callbacks</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-3xs text-center flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consolidated Students</span>
            <span className="text-3xl font-display font-extrabold text-[#1763B6] mt-1">
              514 Enrolled
            </span>
            <span className="text-[10px] text-emerald-500 font-semibold mt-1">+14 New candidates this week</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-3xs text-center flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Syllabus Specialized Branches</span>
            <span className="text-3xl font-display font-extrabold text-[#1763B6] mt-1">
              8 Live modules
            </span>
            <span className="text-[10px] text-[#277EDC] font-semibold mt-1">S/4HANA systems synced</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-3xs text-center flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sandbox status</span>
            <span className="text-3xl font-display font-extrabold text-emerald-600 mt-1">
              99.9% Uptime
            </span>
            <span className="text-[10px] text-slate-400 font-semibold mt-1">Sys Log server: Active</span>
          </div>

        </div>

        {/* Dynamic Demo Registrations Panel */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm space-y-4" id="admin-registrations-block">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="space-y-0.5">
              <h3 className="font-display font-bold text-slate-800 text-base sm:text-lg flex items-center gap-1.5">
                <Layers className="w-5 h-5 text-[#1763B6]" />
                <span>On-demand Demo Counselor Requests</span>
              </h3>
              <p className="text-xs text-slate-500">
                Track and approve incoming inquiries submitted by prospective participants. Approve to send invitation logs.
              </p>
            </div>
            <button
              onClick={() => alert('Lead status database refresh initialized')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer pointer-events-auto self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh dataset</span>
            </button>
          </div>

          <div className="overflow-x-auto" id="admin-inq-scroller">
            {inquiries.length > 0 ? (
              <table className="w-full text-left text-xs sm:text-sm border-collapse" id="admin-leads-table">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-3 text-slate-500 font-semibold">T_Date</th>
                    <th className="p-3 text-slate-500 font-semibold">Inquirer Details</th>
                    <th className="p-3 text-slate-500 font-semibold">Contact Details</th>
                    <th className="p-3 text-slate-500 font-semibold">Requested Module</th>
                    <th className="p-3 text-slate-500 font-semibold text-center">Inquiry State</th>
                    <th className="p-3 text-slate-500 font-semibold text-right">Moderator Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/20">
                      <td className="p-3 font-mono text-[11px] text-slate-505 text-slate-400">{inq.date}</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800 text-sm block">{inq.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">ID: {inq.id}</span>
                      </td>
                      <td className="p-3 space-y-0.5 text-xs">
                        <p className="text-slate-600 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span>{inq.email}</span>
                        </p>
                        <p className="text-slate-650 text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span>+91 {inq.phone}</span>
                        </p>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{inq.module}</td>
                      <td className="p-3 text-center">
                        {inq.status === 'Approved' ? (
                          <span className="inline-block bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2.5 py-0.5 rounded font-sans uppercase">
                            Approved & Invite sent
                          </span>
                        ) : inq.status === 'Closed' ? (
                          <span className="inline-block bg-slate-150 bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded font-sans uppercase">
                            Closed / Archived
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded font-sans uppercase animate-pulse">
                            <Hourglass className="w-3 h-3 text-amber-600" /> Pending Callback
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          {inq.status === 'Pending' && (
                            <button
                              onClick={() => handleApproveInquiry(inq.id)}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-colors cursor-pointer pointer-events-auto"
                              title="Approve registration and dispatch WhatsApp invite"
                            >
                              Approve Invite
                            </button>
                          )}
                          {inq.status !== 'Closed' && (
                            <button
                              onClick={() => handleCloseInquiry(inq.id)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] px-2.5 py-1.5 rounded transition-colors cursor-pointer pointer-events-auto"
                              title="Archive leads record"
                            >
                              Archive Record
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-6 text-slate-400 italic">No demo registration records currently found.</p>
            )}
          </div>
        </div>

        {/* Advanced staff operations summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="admin-advanced-split">
          
          <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-3" id="admin-advanced-classes">
            <h4 className="font-display font-semibold text-slate-800 text-sm">Active Configuration Classes status</h4>
            <div className="space-y-2.5 text-xs text-slate-500">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-105 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">SAP FICO Class Saturday Batch</span>
                  <span className="text-[10px]">Cohort led by Vivek Naidu: Active</span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Active</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-105 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">SAP ABAP Technical Batch</span>
                  <span className="text-[10px]">Cohort led by Satish Kumar: Completed Lecture</span>
                </div>
                <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Inactive</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-3" id="admin-advanced-sandbox">
            <h4 className="font-display font-semibold text-slate-800 text-sm">Cloud Training GUI Sandboxes</h4>
            <div className="space-y-3.5 text-xs text-slate-500">
              <div className="p-3 border border-slate-100 rounded-lg flex justify-between items-center bg-emerald-50/20">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-700 block">ecc6.vihaan.com (ECC Client)</span>
                  <span className="text-[10px]">CPU allocation: 15% | RAM: 128GB</span>
                </div>
                <span className="text-emerald-600 font-bold font-mono">99.9% HEALTH</span>
              </div>
              <div className="p-3 border border-slate-100 rounded-lg flex justify-between items-center bg-emerald-50/20">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-700 block">s4hana.vihaan.com (S/4HANA Launchpad)</span>
                  <span className="text-[10px]">HANA DB integration: Synced</span>
                </div>
                <span className="text-emerald-600 font-bold font-mono">99.8% HEALTH</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
