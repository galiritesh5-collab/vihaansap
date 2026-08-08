import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBrandingConfig } from '../hooks/useBrandingConfig';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const { signInWithGoogle, loading, currentUser, userRole, studentProfile } = useAuth();
  const { config } = useBrandingConfig();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser && userRole) {
      if (studentProfile?.profileCompleted) {
        navigate('/student/dashboard', { replace: true });
      } else {
        navigate('/student/complete-profile', { replace: true });
      }
    }
  }, [currentUser, userRole, studentProfile, navigate]);

  const handleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(#1763B605_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative z-10 p-8 sm:p-10 space-y-8">

        {/* Logo & Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <img src="/favicon.png" alt="Sri Vihaan Favicon" className="h-16 w-16 object-contain rounded-2xl shadow-md p-1 bg-white border border-slate-100" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm">
            Continue your SAP Learning Journey
          </p>
        </div>

        {/* Sign In Button */}
        <div className="pt-4 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#1763B6] hover:text-[#1763B6] font-semibold py-3.5 px-4 rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          <p className="text-center text-xs text-slate-400 px-2">
            Students sign in securely using their Google account.
          </p>
        </div>

        {/* Footer note - no public admin link */}
        <div className="pt-4 text-center border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            Mentors should sign in at /mentor.
          </p>
        </div>

      </div>
    </div>
  );
}
