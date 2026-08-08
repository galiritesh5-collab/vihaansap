import { useState } from 'react';
import { AlertCircle, MailPlus } from 'lucide-react';
import { MentorService } from '../../services/MentorService';

/** This replaces the legacy users.role mentor flow. Student/admin roles remain unchanged. */
export default function RoleManagement() {
  const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const authorize = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try { const result = await MentorService.authorizeEmail(email); setMessage(result.created ? 'Mentor Gmail authorized. Complete the mentor profile and batch assignment in Mentors.' : 'This Gmail is already authorized.'); setEmail(''); }
    catch (err: any) { setError(err.message || 'Unable to authorize mentor Gmail.'); }
    finally { setSaving(false); }
  };
  return <div className="max-w-2xl space-y-6"><div><h2 className="text-2xl font-bold text-slate-800">Role Management</h2><p className="mt-1 text-sm text-slate-500">Authorize a Gmail address for the new mentor portal. This does not alter student or admin roles.</p></div>
    <form onSubmit={authorize} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"><label className="block text-sm font-semibold text-slate-700">Mentor Gmail</label><div className="flex gap-3"><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mentor@gmail.com" className="flex-1 rounded-lg border border-slate-300 px-3 py-2"/><button disabled={saving} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><MailPlus className="w-4 h-4"/>{saving ? 'Authorizing...' : 'Authorize Mentor'}</button></div></form>
    {message && <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</p>}{error && <p className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="w-4 h-4"/>{error}</p>}</div>;
}
