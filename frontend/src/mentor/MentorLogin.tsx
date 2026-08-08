import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MentorService } from '../services/MentorService';

const denied = 'This Google account is not authorized as a mentor. Please contact the administrator.';

function messageForAuthError(error: any) {
  switch (error?.code) {
    case 'auth/popup-blocked': return 'Google sign-in was blocked by the browser. Allow pop-ups for this site and try again.';
    case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled because the pop-up was closed.';
    case 'auth/cancelled-popup-request': return 'A Google sign-in request is already in progress. Please wait and try again.';
    default: return error?.message || 'Google sign-in failed. Please try again.';
  }
}

export default function MentorLogin() {
  const { currentUser, loading, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const validationInFlight = useRef(false);
  const validatedUid = useRef<string | null>(null);

  useEffect(() => {
    if (!currentUser) { validatedUid.current = null; return; }
    if (loading || validationInFlight.current || validatedUid.current === currentUser.uid) return;
    validationInFlight.current = true;
    validatedUid.current = currentUser.uid;
    setChecking(true); setError('');
    MentorService.validateSession()
      .then(() => navigate('/mentor/dashboard', { replace: true }))
      .catch(async (err) => {
        console.error('[MentorLogin] Mentor authorization failed:', err);
        setError(err?.message || denied);
        await logout();
      })
      .finally(() => { validationInFlight.current = false; setChecking(false); });
  }, [currentUser, loading, logout, navigate]);

  const handleGoogleSignIn = async () => {
    // signInWithPopup must only run from this direct click and only once at a time.
    if (signingIn || checking || currentUser) return;
    setSigningIn(true); setError('');
    try {
      await signInWithGoogle();
      // onAuthStateChanged above performs authorization after Firebase resolves.
    } catch (err: any) {
      console.error('[MentorLogin] Google sign-in failed:', err);
      setError(messageForAuthError(err));
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100 text-center space-y-6">
    <h1 className="text-2xl font-bold text-slate-800">Mentor Portal</h1><p className="text-sm text-slate-500">Sign in with your authorized Google account.</p>
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={checking || signingIn || Boolean(currentUser)} onClick={handleGoogleSignIn} className="w-full rounded-xl bg-[#1763B6] px-4 py-3 font-semibold text-white disabled:opacity-60">{checking ? 'Checking access...' : signingIn ? 'Opening Google...' : 'Continue with Google'}</button>
  </section></main>;
}
