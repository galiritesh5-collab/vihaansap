import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MentorService } from '../services/MentorService';

const denied = 'This Google account is not authorized as a mentor. Please contact the administrator.';

export default function MentorLogin() {
  const { currentUser, loading, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate(); const [error, setError] = useState(''); const [checking, setChecking] = useState(false);
  const validate = async () => {
    setChecking(true); setError('');
    try { await MentorService.validateSession(); navigate('/mentor/dashboard', { replace: true }); }
    catch { setError(denied); await logout(); }
    finally { setChecking(false); }
  };
  useEffect(() => { if (currentUser && !loading) void validate(); }, [currentUser, loading]);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100 text-center space-y-6">
    <h1 className="text-2xl font-bold text-slate-800">Mentor Portal</h1><p className="text-sm text-slate-500">Sign in with your authorized Google account.</p>
    {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={checking} onClick={() => void signInWithGoogle()} className="w-full rounded-xl bg-[#1763B6] px-4 py-3 font-semibold text-white disabled:opacity-60">{checking ? 'Checking access...' : 'Continue with Google'}</button>
  </section></main>;
}
