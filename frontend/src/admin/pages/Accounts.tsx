import React, { useState, useMemo } from 'react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import {
  IndianRupee, TrendingUp, Clock, AlertCircle, Plus, Edit2, Trash2,
  CheckCircle, MessageCircle, ChevronDown, ChevronUp, Search, Filter, X,
  Download, FileSpreadsheet, FileText, FileJson
} from 'lucide-react';
import { exportPaymentsExcel, exportPaymentsCSV, exportPaymentsPDF } from '../utils/exportPayments';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Installment {
  id: string;
  amount?: number;
  dueDate: string;
  paidDate?: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  receiptNo?: string;
  notes?: string;
}

interface AccountRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone?: string;
  batchId: string;
  batchName: string;
  courseName: string;
  totalFee: number;
  discount: number;
  netFee: number;
  feePlan: 'Full Payment' | '2 Installments' | '3 Installments' | 'Custom';
  installments: Installment[];
  notes?: string;
  createdAt: string;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function whatsAppLink(phone: string, message: string): string | null {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
  if (cleaned.length === 10) cleaned = `91${cleaned}`;
  if (!/^91[6-9]\d{9}$/.test(cleaned)) return null;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

function buildPaymentReminder(record: AccountRecord, inst: Installment): string {
  return `Dear ${record.studentName}

This is a friendly reminder from
Sri Vihaan SAP Consulting.

Your installment for
${record.courseName}
is pending.

Amount:
₹${(inst.amount || 0).toLocaleString('en-IN')}

Due Date:
${inst.dueDate}

Please complete the payment at your earliest convenience.

For any assistance please contact us.

Thank you.`;
}

function buildPaymentConfirmation(record: AccountRecord, inst: Installment): string {
  return `Dear ${record.studentName}

Thank you.

We have successfully received your payment of
₹${(inst.amount || 0).toLocaleString('en-IN')}
for
${record.courseName}

Your payment has been recorded successfully.

Thank you for choosing
Sri Vihaan SAP Consulting.`;
}


// ─── Installment Badge ────────────────────────────────────────────────────────

function buildPaidWhatsAppMessage(record: AccountRecord, inst: Installment): string {
  const batchSuffix = record.batchName ? ` (${record.batchName})` : '';
  const paidDate = inst.paidDate ? `\n\nPayment date: ${inst.paidDate}` : '';
  return `Congratulations ${record.studentName}! We have successfully received your payment of ₹${(inst.amount || 0).toLocaleString('en-IN')} towards ${record.courseName}${batchSuffix}. Thank you for your payment.${paidDate}\n\n— Sri Vihaan Consulting`;
}

function StatusBadge({ status }: { status: Installment['status'] }) {
  const cfg = {
    Paid:    { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Paid' },
    Pending: { cls: 'bg-amber-50   text-amber-700   border border-amber-200',   label: 'Pending' },
    Overdue: { cls: 'bg-red-50     text-red-700     border border-red-200',     label: 'Overdue' },
  }[status];
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────

function StatsSection({ records }: { records: AccountRecord[] }) {
  const totalRevenue = records.flatMap(r => r.installments || [])
    .filter(i => i.status === 'Paid').reduce((s, i) => s + (i.amount || 0), 0);
  const pending = records.flatMap(r => r.installments || [])
    .filter(i => i.status === 'Pending').reduce((s, i) => s + (i.amount || 0), 0);
  const overdue = records.flatMap(r => r.installments || [])
    .filter(i => i.status === 'Overdue').reduce((s, i) => s + (i.amount || 0), 0);
  const totalFees = records.reduce((s, r) => s + (r.netFee || 0), 0);

  const stats = [
    { label: 'Total Revenue Collected', value: formatINR(totalRevenue), icon: IndianRupee,  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Pending Payments',        value: formatINR(pending),      icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
    { label: 'Overdue Payments',        value: formatINR(overdue),      icon: AlertCircle,  color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100' },
    { label: 'Total Enrolled Fees',     value: formatINR(totalFees),    icon: TrendingUp,   color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className={`bg-white rounded-xl border ${s.border} p-5 flex items-start gap-4`}>
          <div className={`${s.bg} p-2.5 rounded-lg shrink-0`}>
            <s.icon className={`w-5 h-5 ${s.color}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Record Row ───────────────────────────────────────────────────────────────

function RecordRow({ record, onEdit, onDelete }: { record: AccountRecord; onEdit: (r: AccountRecord) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  const paidTotal = (record.installments || []).filter(i => i.status === 'Paid').reduce((s, i) => s + (i.amount || 0), 0);
  const pendingTotal = (record.installments || []).filter(i => i.status !== 'Paid').reduce((s, i) => s + (i.amount || 0), 0);

  const markPaid = (instId: string) => {
    const paidDate = new Date().toISOString().split('T')[0];
    const updated = {
      ...record,
      installments: (record.installments || []).map(i =>
        i.id === instId
          ? { ...i, status: 'Paid' as const, paidDate }
          : i
      ),
    };
    MockDB.updateItem('accounts', record.id, updated);
    
    if (window.confirm("Payment marked as Paid. Send WhatsApp confirmation?")) {
      const inst = updated.installments.find(i => i.id === instId);
      const link = inst && record.studentPhone ? whatsAppLink(record.studentPhone, buildPaymentConfirmation(record, inst)) : null;
      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Row Header */}
      <div className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0">
            {record.studentName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate">{record.studentName}</p>
            <p className="text-xs text-slate-500 truncate">{record.courseName} · {record.batchName}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 shrink-0">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Fee</p>
            <p className="text-sm font-black text-slate-700">{formatINR(record.netFee)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collected</p>
            <p className="text-sm font-black text-emerald-600">{formatINR(paidTotal)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
            <p className={`text-sm font-black ${pendingTotal > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{formatINR(pendingTotal)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={e => { e.stopPropagation(); onEdit(record); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(record.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-2">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${record.netFee > 0 ? (paidTotal / record.netFee) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Expanded Installments */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-2">
          {record.notes && (
            <p className="text-xs text-slate-500 italic mb-3 px-1">📝 {record.notes}</p>
          )}
          <div className="grid gap-2">
            {record.installments.map((inst, idx) => (
              <div key={inst.id} className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{formatINR(inst.amount || 0)}</p>
                    <p className="text-xs text-slate-400">
                      Due: {inst.dueDate}
                      {inst.paidDate ? ` · Paid: ${inst.paidDate}` : ''}
                      {inst.receiptNo ? ` · Rcpt: ${inst.receiptNo}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={inst.status} />
                  {inst.status !== 'Paid' && (
                    <button
                      onClick={() => markPaid(inst.id)}
                      title="Mark as Paid"
                      className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50 rounded-md transition-colors uppercase tracking-wider border border-slate-200 shadow-sm"
                    >
                      <CheckCircle className="w-3 h-3" /> Mark Paid
                    </button>
                  )}
                  {(() => {
                    const link = record.studentPhone ? whatsAppLink(record.studentPhone, inst.status === 'Paid' ? buildPaymentConfirmation(record, inst) : buildPaymentReminder(record, inst)) : null;
                    return link ? (
                      <a href={link} target="_blank" rel="noreferrer" title={inst.status === 'Paid' ? "Send Receipt" : "Send Reminder"} className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors uppercase tracking-wider border border-emerald-200 shadow-sm" onClick={e => e.stopPropagation()}>
                        📱 WhatsApp
                      </a>
                    ) : null;
                  })()}
                </div>
              </div>
            ))}
          </div>
          {record.installments.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-4">No installments defined. Edit record to add them.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function AccountModal({
  record,
  onClose,
}: {
  record: Partial<AccountRecord> | null;
  onClose: () => void;
}) {
  const db = useDB();
  const isNew = !record?.id;

  const [form, setForm] = useState<Partial<AccountRecord>>(
    record ?? {
      feePlan: 'Full Payment',
      installments: [],
      discount: 0,
      netFee: 0,
      totalFee: 0,
    }
  );
  const [instCount, setInstCount] = useState(record?.installments?.length || 1);
  const [formError, setFormError] = useState('');

  const selectedBatch = db.batches.find(b => b.id === form.batchId);
  const enrolledStudents = db.students.filter(s => selectedBatch?.studentIds?.includes(s.id));

  const handleFeeChange = (field: 'totalFee' | 'discount', val: number) => {
    const total = field === 'totalFee' ? val : (form.totalFee || 0);
    const disc  = field === 'discount'  ? val : (form.discount  || 0);
    setForm(f => ({ ...f, [field]: val, netFee: Math.max(0, total - disc) }));
  };

  const handleGenerate = () => {
    const net = form.netFee || 0;
    if (!net || instCount < 1) return;
    const amount = Math.round(net / instCount);
    const insts: Installment[] = Array.from({ length: instCount }, (_, i) => ({
      id: `inst-${Date.now()}-${i}`,
      amount: i === instCount - 1 ? net - amount * (instCount - 1) : amount,
      dueDate: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      status: 'Pending',
    }));
    setForm(f => ({ ...f, installments: insts }));
  };

  const handleSave = () => {
    const installments = form.installments || [];
    const totalFee = Number(form.totalFee);
    const discount = Number(form.discount || 0);
    const netFee = Number(form.netFee);
    const installmentTotal = installments.reduce((sum, installment) => sum + (Number(installment.amount) || 0), 0);
    if (!form.batchId || !form.studentId) return setFormError('Select both a batch and a student.');
    if (!Number.isFinite(totalFee) || totalFee <= 0) return setFormError('Enter a valid total course fee.');
    if (!Number.isFinite(discount) || discount < 0 || discount > totalFee) return setFormError('Discount must be between ₹0 and the total course fee.');
    if (!Number.isFinite(netFee) || netFee <= 0) return setFormError('Net payable must be greater than zero.');
    if (installments.length === 0) return setFormError('Add at least one installment.');
    if (installments.some(installment => !Number.isFinite(Number(installment.amount)) || Number(installment.amount) <= 0 || !installment.dueDate)) return setFormError('Each installment needs a valid positive amount and due date.');
    if (Math.round(installmentTotal * 100) !== Math.round(netFee * 100)) return setFormError(`Installments total ${formatINR(installmentTotal)} but net payable is ${formatINR(netFee)}.`);
    setFormError('');
    const batch = db.batches.find(b => b.id === form.batchId);
    const student = db.students.find(s => s.id === form.studentId);
    const final: AccountRecord = {
      id: form.id || `acc-${Date.now()}`,
      studentId: form.studentId || '',
      studentName: student?.name || form.studentName || '',
      studentPhone: student?.phone || form.studentPhone || '',
      batchId: form.batchId || '',
      batchName: batch?.name || form.batchName || '',
      courseName: batch?.course || form.courseName || '',
      totalFee,
      discount,
      netFee,
      feePlan: form.feePlan || 'Full Payment',
      installments: installments as Installment[],
      notes: form.notes,
      createdAt: form.createdAt || new Date().toISOString().split('T')[0],
    };
    if (isNew) {
      MockDB.addItem('accounts', final);
    } else {
      MockDB.updateItem('accounts', final.id, final);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-800">{isNew ? 'Add Fee Record' : 'Edit Fee Record'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Batch & Student */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-xs">Batch</label>
              <select
                value={form.batchId || ''}
                onChange={e => setForm(f => ({ ...f, batchId: e.target.value, studentId: '', courseName: db.batches.find(b => b.id === e.target.value)?.course || '' }))}
                className="input-field"
              >
                <option value="">— Select Batch —</option>
                {db.batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-xs">Student</label>
              <select
                value={form.studentId || ''}
                onChange={e => {
                  const s = db.students.find(st => st.id === e.target.value);
                  setForm(f => ({ ...f, studentId: e.target.value, studentName: s?.name || '', studentPhone: s?.phone || '' }));
                }}
                className="input-field"
                disabled={!form.batchId}
              >
                <option value="">— Select Student —</option>
                {enrolledStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Fee Section */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-xs">Total Course Fee (₹)</label>
              <input type="number" min={0} value={form.totalFee || ''} onChange={e => handleFeeChange('totalFee', Number(e.target.value))} className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="label-xs">Discount (₹)</label>
              <input type="number" min={0} value={form.discount || ''} onChange={e => handleFeeChange('discount', Number(e.target.value))} className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="label-xs">Net Payable (₹)</label>
              <input type="number" readOnly value={form.netFee || 0} className="input-field bg-slate-50 cursor-not-allowed" />
            </div>
          </div>

          {/* Fee Plan */}
          <div>
            <label className="label-xs">Fee Plan</label>
            <select
              value={form.feePlan || 'Full Payment'}
              onChange={e => {
                const plan = e.target.value as AccountRecord['feePlan'];
                setForm(f => ({ ...f, feePlan: plan }));
                const counts: Record<string, number> = { 'Full Payment': 1, '2 Installments': 2, '3 Installments': 3 };
                if (counts[plan]) setInstCount(counts[plan]);
              }}
              className="input-field"
            >
              <option>Full Payment</option>
              <option>2 Installments</option>
              <option>3 Installments</option>
              <option>Custom</option>
            </select>
          </div>

          {/* Installment Generator */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold text-slate-700">Installments</p>
              <div className="flex items-center gap-2">
                {form.feePlan === 'Custom' && (
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={instCount}
                    onChange={e => setInstCount(Number(e.target.value))}
                    className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-sm text-center focus:outline-none"
                    placeholder="#"
                  />
                )}
                <button type="button" onClick={handleGenerate} className="text-xs font-bold text-indigo-600 hover:underline">
                  Auto-Generate
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {(form.installments || []).map((inst, idx) => (
                <div key={inst.id} className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-1 text-xs font-bold text-slate-400 text-center">{idx + 1}</span>
                  <input
                    type="number"
                    min={0}
                    value={inst.amount ?? ''}
                    onChange={e => {
                      const insts = [...(form.installments || [])];
                      insts[idx] = { ...insts[idx], amount: e.target.value === '' ? undefined : Number(e.target.value) };
                      setForm(f => ({ ...f, installments: insts }));
                    }}
                    className="col-span-3 px-2 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none"
                    placeholder="₹ Amount"
                  />
                  <input
                    type="date"
                    value={inst.dueDate}
                    onChange={e => {
                      const insts = [...(form.installments || [])];
                      insts[idx] = { ...insts[idx], dueDate: e.target.value };
                      setForm(f => ({ ...f, installments: insts }));
                    }}
                    className="col-span-4 px-2 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                  <select
                    value={inst.status}
                    onChange={e => {
                      const insts = [...(form.installments || [])];
                      insts[idx] = { ...insts[idx], status: e.target.value as Installment['status'] };
                      setForm(f => ({ ...f, installments: insts }));
                    }}
                    className="col-span-3 px-2 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                  </select>
                  <button type="button" onClick={() => setForm(f => ({ ...f, installments: (f.installments||[]).filter((_, i) => i !== idx) }))} className="col-span-1 text-red-400 hover:text-red-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, installments: [...(f.installments || []), { id: `inst-${Date.now()}`, amount: undefined, dueDate: new Date().toISOString().split('T')[0], status: 'Pending' }] }))}
                className="text-xs text-indigo-600 font-bold hover:underline mt-1 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Installment
              </button>
            </div>
          </div>

          {formError && <p role="alert" className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>}

          {/* Notes */}
          <div>
            <label className="label-xs">Notes (Optional)</label>
            <textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="input-field" rows={2} placeholder="Any additional notes..." />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
            {isNew ? 'Add Record' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Accounts Page ───────────────────────────────────────────────────────

export default function Accounts() {
  const db = useDB();
  const [modal, setModal] = useState<Partial<AccountRecord> | null | 'new'>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Use existing accounts from DB or empty array
  const accounts: AccountRecord[] = (db as any).accounts || [];

  const filtered = useMemo(() => {
    return accounts.filter(r => {
      const matchSearch = !search || 
        (r.studentName || '').toLowerCase().includes(search.toLowerCase()) || 
        (r.courseName || '').toLowerCase().includes(search.toLowerCase());
      const matchBatch = !filterBatch || r.batchId === filterBatch;
      const matchStatus = !filterStatus || (r.installments && r.installments.some(i => i.status === filterStatus));
      return matchSearch && matchBatch && matchStatus;
    });
  }, [accounts, search, filterBatch, filterStatus]);

  const handleDelete = (id: string) => {
    if (confirm('Delete this fee record?')) {
      MockDB.deleteItem('accounts', id);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Accounts & Payments</h2>
          <p className="text-slate-500 text-sm mt-1">Track student fee records, installments and collections.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Export Payments
            </button>
            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-20 py-2">
                <button onClick={() => { exportPaymentsExcel(filtered); setExportMenuOpen(false); }} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center gap-3">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel (.xlsx)
                </button>
                <button onClick={() => { exportPaymentsPDF(filtered); setExportMenuOpen(false); }} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-red-600" /> PDF Report
                </button>
                <button onClick={() => { exportPaymentsCSV(filtered); setExportMenuOpen(false); }} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center gap-3">
                  <FileJson className="w-4 h-4 text-blue-600" /> CSV Export
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setModal('new')}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Fee Record
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsSection records={accounts} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student or course..."
            className="bg-transparent text-sm w-full outline-none text-slate-700 placeholder-slate-400"
          />
        </div>
        <select
          value={filterBatch}
          onChange={e => setFilterBatch(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-slate-50 focus:outline-none"
        >
          <option value="">All Batches</option>
          {db.batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-slate-50 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
        {(search || filterBatch || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterBatch(''); setFilterStatus(''); }} className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(r => (
            <RecordRow
              key={r.id}
              record={r}
              onEdit={r => setModal(r)}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <IndianRupee className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 text-lg">No Fee Records Found</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                {accounts.length === 0
                  ? 'No fee records yet. Click "Add Fee Record" to get started.'
                  : 'No records match your current filters.'}
              </p>
            </div>
            {accounts.length === 0 && (
              <button onClick={() => setModal('new')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                + Add First Record
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <AccountModal
          record={modal === 'new' ? {} : modal}
          onClose={() => setModal(null)}
        />
      )}

      {/* Inline styles for reuse */}
      <style>{`
        .label-xs { @apply block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5; }
        .input-field { @apply w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30; }
      `}</style>
    </div>
  );
}
