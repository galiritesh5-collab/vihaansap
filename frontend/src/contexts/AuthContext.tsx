import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db as firestoreDb } from '../config/firebase';
import { isAdminEmail } from '../config/adminConfig';
import { MockDB } from '../services/MockDB';
import { FirestoreStudentService } from '../services/FirestoreStudentService';
import { FirestoreDBService } from '../services/FirestoreDBService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  studentProfile: any | null;
  userRole: 'admin' | 'mentor' | 'student' | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'mentor' | 'student' | null>(null);
  const [loading, setLoading] = useState(true);

  // Ref to hold the unsubscribe function for the per-student Firestore listener.
  // Using a ref (not state) so updates don't trigger re-renders.
  const unsubStudentSnapshot = useRef<(() => void) | null>(null);

  // ─── Subscribe to the student's own Firestore document (live) ─────────────
  // This is the ONLY mechanism that updates studentProfile after initial load.
  // It replaces the old db_updated → MockDB → fetchStudentProfile chain.
  const subscribeToStudentDoc = (uid: string) => {
    // Clean up any previous listener first
    if (unsubStudentSnapshot.current) {
      unsubStudentSnapshot.current();
      unsubStudentSnapshot.current = null;
    }

    if (!firestoreDb) return;

    const ref = doc(firestoreDb, 'students', uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setStudentProfile({ id: snap.id, ...snap.data() });
        } else {
          // Document was deleted — clear the profile
          setStudentProfile(null);
        }
      },
      (err) => {
        console.error('[AuthContext] Student doc snapshot error:', err);
      }
    );

    unsubStudentSnapshot.current = unsub;
  };

  // ─── refreshProfile: re-fetches from Firestore directly ───────────────────
  // Used by CompleteProfile page after saving profile data.
  // The onSnapshot above will also fire automatically when Firestore updates,
  // so this is just an explicit force-refresh for immediate UI feedback.
  const refreshProfile = async (): Promise<void> => {
    if (!currentUser) return;
    try {
      const profile = await FirestoreStudentService.getStudent(currentUser.uid);
      if (profile) {
        setStudentProfile(profile);
      }
    } catch (err) {
      console.error('[AuthContext] refreshProfile error:', err);
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

    // Track the Firestore collection listener (shared across all collections)
    let unsubFirestore: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);

      if (user) {
        // /mentor uses its own Firestore-backed authorization flow. It must not
        // start the student/MockDB subscriptions or create/check a student record.
        const isMentorPortal = typeof window !== 'undefined' && window.location.pathname.startsWith('/mentor');
        // Start collection-level Firestore listeners (courses, batches, etc.)
        if (!isMentorPortal && !unsubFirestore) {
          FirestoreDBService.subscribeToAll();
        }

        let role: 'admin' | 'mentor' | 'student' = 'student';

        // ── Fast path: Admin email check (no network needed) ──────────────
        if (isAdminEmail(user.email)) {
          console.log(`[AuthContext] Admin access granted for ${user.email} (email-based)`);
          role = 'admin';
        } else {
          // ── Backend role lookup for student / mentor ───────────────────
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

        if (isMentorPortal) {
          if (unsubStudentSnapshot.current) {
            unsubStudentSnapshot.current();
            unsubStudentSnapshot.current = null;
          }
          setStudentProfile(null);
          setLoading(false);
          return;
        }

        if (role === 'admin') {
          await MockDB.loadAdminData();
          // Clean up any leftover student listener from a previous session
          if (unsubStudentSnapshot.current) {
            unsubStudentSnapshot.current();
            unsubStudentSnapshot.current = null;
          }
          setStudentProfile(null);
          setLoading(false);
        } else if (role === 'student') {
          // ── Firestore: check/create the student document ───────────────
          // SECURITY: Only create a student record if the user is already
          // pre-enrolled (exists in Firestore). If not, sign them out gracefully.
          // This prevents arbitrary Google accounts from flooding the student list.
          try {
            const existing = await FirestoreStudentService.getStudent(user.uid);

            if (!existing) {
              // Unknown Google user — not pre-enrolled. Sign them out and notify them.
              console.warn(`[AuthContext] Unrecognised user ${user.email} — not pre-enrolled. Signing out.`);
              await signOut(auth!);
              alert(
                'Access Denied: Your account is not enrolled in this platform.\n\n' +
                'Please contact Sri Vihaan SAP Consulting to get access.\n' +
                'WhatsApp: +91 98765 43210'
              );
              setCurrentUser(null);
              setStudentProfile(null);
              setUserRole(null);
              setLoading(false);
              return;
            } else {
              // Returning student — set profile immediately from the fetched doc
              setStudentProfile(existing);

              // Update lastLogin in the background (non-blocking)
              FirestoreStudentService.recordLogin(user.uid).catch(console.error);
            }
          } catch (err) {
            console.error('[AuthContext] Firestore student sync error:', err);
          }

          // ── Subscribe to live updates for this student's Firestore doc ──
          // This keeps studentProfile in sync if an Admin updates the student's
          // course/batch/status in the Admin portal, without touching MockDB.
          subscribeToStudentDoc(user.uid);

          setLoading(false);
        } else {
          // Mentor role — no studentProfile needed
          if (unsubStudentSnapshot.current) {
            unsubStudentSnapshot.current();
            unsubStudentSnapshot.current = null;
          }
          setStudentProfile(null);
          setLoading(false);
        }
      } else {
        // User signed out — clean up student listener and clear all state
        if (unsubStudentSnapshot.current) {
          unsubStudentSnapshot.current();
          unsubStudentSnapshot.current = null;
        }
        setStudentProfile(null);
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) {
        unsubFirestore();
      }
      // Clean up per-student snapshot listener
      if (unsubStudentSnapshot.current) {
        unsubStudentSnapshot.current();
        unsubStudentSnapshot.current = null;
      }
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
