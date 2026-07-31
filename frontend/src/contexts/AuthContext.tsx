import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db as firestoreDb } from '../config/firebase';
import { isAdminEmail } from '../config/adminConfig';
import { MockDB } from '../services/MockDB';
import { FirestoreStudentService } from '../services/FirestoreStudentService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  studentProfile: any | null;
  userRole: 'admin' | 'mentor' | 'student' | null;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'mentor' | 'student' | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Local profile lookup (from MockDB, which is synced with Firestore) ──
  const fetchStudentProfile = (uid: string) => {
    const students = MockDB.getCollection('students');
    const profile = students.find((s: any) => s.uid === uid) || null;
    setStudentProfile(profile);
    return profile;
  };

  const refreshProfile = () => {
    if (currentUser) {
      fetchStudentProfile(currentUser.uid);
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Auth persistence error:', error);
    });

    // ── Defer Firestore real-time listener for the entire students collection ──
    // We only subscribe if the user is authenticated to save initial load bandwidth.
    let unsubFirestore: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      // Must set loading to true while we fetch roles so ProtectedRoutes don't incorrectly block access
      setLoading(true);
      setCurrentUser(user);

      if (user) {
        if (!unsubFirestore) {
          unsubFirestore = FirestoreStudentService.subscribeToAll();
        }
        let role: 'admin' | 'mentor' | 'student' = 'student';

        // ── Fast path: Admin email check (no network needed) ──────────────────
        if (isAdminEmail(user.email)) {
          console.log(`[AuthContext] Admin access granted for ${user.email} (email-based)`);
          role = 'admin';
        } else {
          // ── Backend role lookup for student / mentor ─────────────────────────
          try {
            const token = await user.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/users/me/role`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
              const json = await res.json();
              if (json.success && json.role) {
                role = json.role;
                console.log(`[AuthContext] Role from backend: ${role}`);
              }
            } else {
              console.error(`[AuthContext] Backend returned ${res.status} when fetching role.`);
            }
          } catch (err: any) {
            console.error('[AuthContext] Error fetching role from API:', err);
          }
        }

        setUserRole(role);

        if (role === 'admin') {
          await MockDB.loadAdminData();
        }

        if (role === 'student') {
          // ── Firestore: check/create the student document ──────────────────
          try {
            const existing = await FirestoreStudentService.getStudent(user.uid);

            if (!existing) {
              // First ever login — create a minimal document so the student
              // shows up in the Admin Students list immediately.
              const newStudentData = {
                uid: user.uid,
                name: user.displayName || '',
                email: user.email || '',
                avatar: user.photoURL || '',
                photoURL: user.photoURL || '',
                profileCompleted: false,
                loginMethod: 'Google',
                status: 'Pending',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                loginCount: 1,
              };

              // 1. Save to Firestore
              await FirestoreStudentService.upsertStudent(user.uid, newStudentData);

              // 2. Save to MockDB immediately (hits backend API) so it shows in Admin Students
              const mockStudent = {
                id: user.uid,
                ...newStudentData,
                role: 'Student'
              };
              await MockDB.addItem('students', mockStudent);
            } else {
              // Returning login — update lastLogin in Firestore
              await FirestoreStudentService.recordLogin(user.uid);

              // ALSO update in MockDB (hits backend API) so it is updated in db.json
              const currentStudents = MockDB.getCollection('students') || [];
              const mockStudent = currentStudents.find((s: any) => s.uid === user.uid);
              if (mockStudent) {
                await MockDB.updateItem('students', mockStudent.id, {
                  lastLogin: new Date().toISOString(),
                  loginCount: (mockStudent.loginCount || 0) + 1,
                });
              } else {
                // If somehow missing in MockDB/db.json but exists in Firestore
                const mockStudent = {
                  id: user.uid,
                  ...existing,
                  role: 'Student',
                  lastLogin: new Date().toISOString(),
                  loginCount: (existing.loginCount || 0) + 1,
                };
                await MockDB.addItem('students', mockStudent);
              }
            }
          } catch (err) {
            console.error('[AuthContext] Firestore student sync error:', err);
          }

          // Now fetch from in-memory MockDB (which Firestore listener keeps fresh)
          // Small delay to allow the snapshot listener to update MockDB first
          setTimeout(() => {
            fetchStudentProfile(user.uid);
            setLoading(false);
          }, 500);
        } else {
           // Admin or Mentor role doesn't use studentProfile
           setStudentProfile(null);
           setLoading(false);
        }
      } else {
        // No user signed in
        setStudentProfile(null);
        setUserRole(null);
        setLoading(false);
      }
    });

    // Listen to MockDB changes so the profile updates when Firestore snapshot arrives
    const handleDbUpdate = () => {
      if (auth?.currentUser) {
        fetchStudentProfile(auth.currentUser.uid);
      }
    };
    window.addEventListener('db_updated', handleDbUpdate);

    return () => {
      unsubAuth();
      if (unsubFirestore) {
        unsubFirestore();
      }
      window.removeEventListener('db_updated', handleDbUpdate);
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      alert('Firebase is not configured. Please add your Firebase configuration to the environment variables.');
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const value = {
    currentUser,
    studentProfile,
    userRole,
    loading,
    signInWithGoogle,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <img src="/web-logo.png" alt="Sri Vihaan Logo" className="max-w-[220px] h-auto object-contain mb-8 animate-pulse" />
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#1763b6] rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 mt-4 font-medium tracking-wide">Loading...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
