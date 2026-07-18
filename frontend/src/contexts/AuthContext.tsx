import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db as firestoreDb } from '../config/firebase';
import { MockDB } from '../services/MockDB';
import { FirestoreStudentService } from '../services/FirestoreStudentService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  studentProfile: any | null;
  userRole: 'student' | 'mentor' | null;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'mentor' | null>(null);
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

    // ── Start Firestore real-time listener for the entire students collection ──
    // This keeps MockDB['students'] in sync automatically for all components.
    const unsubFirestore = FirestoreStudentService.subscribeToAll();

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Check if this email belongs to a mentor via direct Firestore query
        // This avoids race conditions where MockDB hasn't finished syncing yet
        let isMentor = false;
        try {
          if (firestoreDb) {
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            const mentorsRef = collection(firestoreDb, 'mentors');
            const q = query(mentorsRef, where('email', '==', user.email));
            const mentorSnapshot = await getDocs(q);
            isMentor = !mentorSnapshot.empty;
          } else {
            // Fallback to MockDB if Firestore isn't initialized
            const mentors = MockDB.getCollection('mentors') || [];
            isMentor = mentors.some((m: any) => m.email === user.email);
          }
        } catch (err) {
          console.error("Error checking mentor status:", err);
        }

        if (isMentor) {
          setUserRole('mentor');
          setLoading(false);
        } else {
          setUserRole('student');

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
      unsubFirestore();
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
      {!loading && children}
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

