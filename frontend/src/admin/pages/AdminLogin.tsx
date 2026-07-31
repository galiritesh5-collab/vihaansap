import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  
  // Use unified auth
  const { currentUser, userRole, loading, signInWithGoogle } = useAuth();

  // If loading auth state
  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  // If already logged in AND is admin
  if (currentUser && userRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // If already logged in but NOT admin
  if (currentUser && userRole !== 'admin') {
     // User is authenticated but doesn't have the admin role.
     // In a full app, we might provide a "Sign Out" button here so they can switch accounts.
     return (
       <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
         <ShieldCheck className="w-16 h-16 text-red-500 mb-4" />
         <h2 className="text-2xl text-white font-bold text-center mb-2">Access Denied</h2>
         <p className="text-slate-400 text-center max-w-md">
           Your account ({currentUser.email}) does not have administrator privileges.
           Please sign out and sign in with an authorized account.
         </p>
         <Link to="/" className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
           Return Home
         </Link>
       </div>
     );
  }

  const handleGoogleSignIn = async () => {
    setError('');
    setLoadingLocal(true);
    try {
      await signInWithGoogle();
      // AuthContext will handle state updates and redirect via the Navigate check above
    } catch (err: any) {
      console.error("Admin Google Sign-in Error:", err);
      setError(err.message || 'Failed to sign in with Google');
      setLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <img src="/favicon.png" alt="Admin Icon" className="w-16 h-16 object-contain rounded-2xl shadow-lg border border-white/10 p-1 bg-white/5" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-display font-extrabold text-white tracking-tight">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sri Vihaan Consulting Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow-2xl sm:rounded-2xl border border-slate-700 sm:px-10">
            {error && (
              <div className="mb-6 bg-red-500/10 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingLocal}
              className="w-full flex justify-center items-center py-3 px-4 border border-slate-600 rounded-xl shadow-sm text-sm font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 hover:text-white hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed gap-3"
            >
              {loadingLocal ? 'Authenticating...' : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign In with Google
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="mt-4 text-xs text-center text-slate-500">
              Only authorized administrator accounts can access this portal.
            </p>
        </div>
      </div>
    </div>
  );
}
