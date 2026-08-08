import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MentorRecord, MentorService } from '../services/MentorService';

export function MentorLayout() {
  const { currentUser, logout } = useAuth(); const [mentor, setMentor] = useState<MentorRecord | null>(null); const [error, setError] = useState('');
  useEffect(() => { if (!currentUser) return; let unsubscribe = () => undefined; MentorService.validateSession().then(record => { setMentor(record); unsubscribe = MentorService.subscribeMine(record.email, setMentor, () => setError('denied')); }).catch(() => setError('denied')); return () => unsubscribe(); }, [currentUser]);
  if (!currentUser) return <Navigate to="/mentor" replace />;
  if (error || mentor?.status !== 'active') return <Navigate to="/mentor" replace />;
  if (!mentor) return <div className="min-h-screen flex items-center justify-center">Loading mentor portal...</div>;
  return <main className="min-h-screen bg-slate-50"><header className="bg-slate-900 text-white px-6 py-4 flex justify-between"><Link to="/mentor/dashboard" className="font-bold">Mentor Portal</Link><div className="flex gap-4"><span>{mentor.name || mentor.email}</span><button onClick={() => void logout()}>Sign out</button></div></header><div className="max-w-6xl mx-auto p-6"><Outlet context={mentor} /></div></main>;
}
export function MentorDashboard() {
  const mentor = useOutletContext<MentorRecord>(); const [batches, setBatches] = useState<any[]>([]);
  useEffect(() => { if (mentor) return MentorService.subscribeAssignedBatches(mentor, setBatches, () => undefined); }, [mentor]);
  return <><h1 className="text-2xl font-bold">My Batches</h1><p className="mt-1 text-slate-500">Only administrator-assigned batches are available.</p><div className="grid gap-4 mt-6 md:grid-cols-2">{batches.map(b => <Link key={b.id} to={`/mentor/batches/${b.id}`} className="rounded-xl border bg-white p-5 hover:border-blue-500"><h2 className="font-bold">{b.name}</h2><p className="text-sm text-slate-500">{b.course}</p></Link>)}{!batches.length && <p className="text-slate-500">No batches are assigned to you.</p>}</div></>;
}
export function MentorBatch() {
  const { batchId } = useParams(); const mentor = useOutletContext<MentorRecord>(); const [batch, setBatch] = useState<any>(undefined);
  useEffect(() => { if (mentor && batchId && mentor.assignedBatchIds.includes(batchId)) MentorService.getBatch(batchId).then(setBatch).catch(() => setBatch(null)); else if (mentor) setBatch(null); }, [mentor, batchId]);
  if (batch === undefined) return <p>Loading...</p>; if (!batch) return <Navigate to="/mentor/dashboard" replace />;
  return <><Link to="/mentor/dashboard" className="text-blue-700 text-sm">← My Batches</Link><h1 className="mt-4 text-2xl font-bold">{batch.name}</h1><p className="text-slate-500">{batch.course}</p></>;
}
