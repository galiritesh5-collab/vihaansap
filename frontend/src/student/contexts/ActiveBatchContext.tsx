import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { studentIdentifiers } from '../../utils/recipientTargeting';

type ActiveBatchContextValue = {
  activeBatch: any | null;
  activeBatchId: string | null;
  enrolledBatches: any[];
  setActiveBatchId: (batchId: string) => void;
};

const ActiveBatchContext = createContext<ActiveBatchContextValue | undefined>(undefined);
const storageKey = (student: any) => `student_active_batch_${studentIdentifiers(student)[0] || 'unknown'}`;

export function ActiveBatchProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, studentProfile } = useAuth();
  const db = useDB();
  const student = studentProfile || currentUser;
  const enrolledBatches = useMemo(
    () => (db.batches || []).filter(batch =>
      studentIdentifiers(student).some(id => batch.studentIds?.includes(id))
    ),
    [db.batches, student]
  );
  const [activeBatchId, setActiveBatchIdState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(student));
    const validId = enrolledBatches.some(batch => batch.id === stored) ? stored : enrolledBatches[0]?.id || null;
    setActiveBatchIdState(validId);
    if (validId) localStorage.setItem(storageKey(student), validId);
    else localStorage.removeItem(storageKey(student));
  }, [student?.id, student?.uid, enrolledBatches]);

  const setActiveBatchId = (batchId: string) => {
    if (!enrolledBatches.some(batch => batch.id === batchId)) return;
    localStorage.setItem(storageKey(student), batchId);
    setActiveBatchIdState(batchId);
  };

  const activeBatch = enrolledBatches.find(batch => batch.id === activeBatchId) || null;
  return <ActiveBatchContext.Provider value={{ activeBatch, activeBatchId, enrolledBatches, setActiveBatchId }}>{children}</ActiveBatchContext.Provider>;
}

export function useActiveBatch() {
  const context = useContext(ActiveBatchContext);
  if (!context) throw new Error('useActiveBatch must be used inside ActiveBatchProvider');
  return context;
}
