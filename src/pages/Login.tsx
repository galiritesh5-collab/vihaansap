import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Users, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const navigate = useNavigate();

  // Temporarily disable the login by returning the under construction view
  const isUnderConstruction = true;

  if (isUnderConstruction) {
    return (
      <div id="login-page-container" className="py-16 px-4 bg-slate-50 min-h-[75vh] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(#1763B605_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        <div 
          id="login-card-wrapper" 
          className="max-w-md w-full bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
        >
          <div className="bg-[#1763B6] text-white p-6 text-center space-y-1 relative">
            <div className="absolute top-2 right-2 text-white/5">
              <Lock className="w-24 h-24" />
            </div>
            <div className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-[10px] text-orange-400 font-bold uppercase tracking-wider relative z-10 border border-white/5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sri Vihaan Consulting Learning Portal</span>
            </div>
            <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight relative z-10">
              Student Login
            </h2>
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 inline-block">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-bold text-sm mb-1">Under Construction</h3>
              <p className="text-xs">
                Student Portal is currently under development and will be available soon.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-[#1763B6] hover:bg-[#277EDC] text-white font-bold py-3 rounded-lg text-xs sm:text-sm shadow hover:shadow-md transition-colors block cursor-pointer pointer-events-auto"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    // Set mock user roles accordingly for local reactive session
    if (activeTab === 'admin') {
      localStorage.setItem('vihaan_user_role', 'admin');
      localStorage.setItem('vihaan_user_email', email);
      navigate('/admin-dashboard');
    } else {
      localStorage.setItem('vihaan_user_role', 'student');
      localStorage.setItem('vihaan_user_email', email);
      navigate('/student-dashboard');
    }
  };

  const autofill = (role: 'student' | 'admin') => {
    setError('');
    setActiveTab(role);
    if (role === 'admin') {
      setEmail('admin@vihaan.com');
      setPassword('admin123');
    } else {
      setEmail('student@vihaan.com');
      setPassword('student123');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotOpen(false);
      setForgotSuccess(false);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div id="login-page-container" className="py-16 px-4 bg-slate-50 min-h-[75vh] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(#1763B605_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div 
        id="login-card-wrapper" 
        className="max-w-md w-full bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
      >
        
        {/* Banner upper frame */}
        <div className="bg-[#1763B6] text-white p-6 text-center space-y-1 relative">
          <div className="absolute top-2 right-2 text-white/5">
            <Lock className="w-24 h-24" />
          </div>
          <div className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-[10px] text-orange-400 font-bold uppercase tracking-wider relative z-10 border border-white/5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sri Vihaan Consulting Learning Portal</span>
          </div>
          <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight relative z-10">
            Sign In Account
          </h2>
          <p className="text-xs text-slate-350 text-slate-300 relative z-10">
            Access schedules, practice sandbox records, and tasks
          </p>
        </div>

        {/* Tab switchers student vs admin */}
        <div className="flex border-b border-slate-100 bg-slate-50/50" id="login-tabs">
          <button
            onClick={() => {
              setActiveTab('student');
              setError('');
            }}
            className={`flex-1 text-center py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer pointer-events-auto ${
              activeTab === 'student'
                ? 'border-[#1763B6] text-[#1763B6] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-login-student"
          >
            Student Login
          </button>
          <button
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
            className={`flex-1 text-center py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer pointer-events-auto ${
              activeTab === 'admin'
                ? 'border-[#1763B6] text-[#1763B6] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-login-admin"
          >
            Admin Access (Staff)
          </button>
        </div>

        {/* Credentials Form Box */}
        <div className="p-6 sm:p-8 space-y-6">
          {!forgotOpen ? (
            <form onSubmit={handleLogin} className="space-y-4" id="form-login-core">
              {error && (
                <div className="text-xs text-red-600 bg-red-50 p-2 text-center rounded border border-red-100 flex items-center gap-1 justify-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Address details */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                  Institutional Email address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. student@vihaan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                    id="input-login-email"
                  />
                </div>
              </div>

              {/* Password credentials layout */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                    Secure Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-[10px] font-semibold text-[#277EDC] hover:underline cursor-pointer pointer-events-auto"
                    id="btn-login-forgot"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                    id="input-login-pass"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer pointer-events-auto"
                    id="btn-toggle-eye"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login CTA trigger */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1763B6] hover:bg-[#277EDC] text-white font-bold py-3 rounded-lg text-xs sm:text-sm shadow hover:shadow-md transition-colors block cursor-pointer pointer-events-auto"
                  id="btn-login-submit"
                >
                  Sign In Portal
                </button>
              </div>
            </form>
          ) : (
            /* Forgot Password view */
            <form onSubmit={handleForgotSubmit} className="space-y-4" id="form-login-forgot">
              <h4 className="font-display font-semibold text-slate-800 text-sm">Recover Password Credentials</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide your registered email address and our database will dispatch a recovery link to guide configurations updates.
              </p>

              {!forgotSuccess ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                      Account Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@vihaan.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                    />
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer pointer-events-auto"
                    >
                      Transmit Recovery Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors cursor-pointer pointer-events-auto"
                    >
                      Retrieve Login
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center space-y-3 bg-green-50 rounded-lg p-4 border border-green-150">
                  <div className="text-emerald-600 font-bold text-xs flex items-center justify-center gap-1.5">
                    <span>Reset Dispatched!</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Schedules and password options have been beamed code-sync to: <strong className="text-slate-800">{resetEmail}</strong>. Check inbox shortly.
                  </p>
                </div>
              )}
            </form>
          )}

          {/* Quick Demo Autofill section for evaluating the working dashboards */}
          {!forgotOpen && (
            <div className="pt-4 border-t border-slate-100 space-y-3" id="autofill-helpers">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-wider">
                Demo Accounts (Click to Autofill)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => autofill('student')}
                  className="bg-slate-50 hover:bg-[#1763B6]/5 border border-slate-250 border-slate-200 hover:border-slate-350 p-2 rounded-lg text-left transition-all text-slate-700 flex flex-col justify-between pointer-events-auto cursor-pointer"
                  id="btn-autofill-student"
                >
                  <span className="font-semibold block text-[10px] text-slate-505 uppercase text-slate-400">Student Demo</span>
                  <span className="font-semibold text-[11px] truncate mt-0.5">student@vihaan.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => autofill('admin')}
                  className="bg-slate-50 hover:bg-[#1763B6]/5 border border-slate-250 border-slate-200 hover:border-slate-350 p-2 rounded-lg text-left transition-all text-slate-700 flex flex-col justify-between pointer-events-auto cursor-pointer"
                  id="btn-autofill-admin"
                >
                  <span className="font-semibold block text-[10px] text-slate-505 uppercase text-slate-400">Admin Demo (Future Support)</span>
                  <span className="font-semibold text-[11px] truncate mt-0.5 font-sans">admin@vihaan.com</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
