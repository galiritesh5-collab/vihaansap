import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, studentProfile, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Profile completion check ONLY applies to student-role users on student routes
  const isStudentRoute = location.pathname.startsWith('/student');
  if (userRole === 'student' && isStudentRoute) {
    // If student hasn't completed their profile, force them to complete it
    if (!studentProfile?.profileCompleted && location.pathname !== '/student/complete-profile') {
      return <Navigate to="/student/complete-profile" replace />;
    }

    // If student has completed profile but tries to go to complete-profile, redirect to dashboard
    if (studentProfile?.profileCompleted && location.pathname === '/student/complete-profile') {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
