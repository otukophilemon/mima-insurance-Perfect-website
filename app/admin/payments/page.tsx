// app/admin/payments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  CreditCard,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Wallet,
  TrendingUp,
} from 'lucide-react';

interface Payment {
  id: number;
  user_id: string;
  policy_id: number | null;
  amount: number;
  currency: string;
  method: string;
  reference: string | null;
  status: string;
  paid_at: string;
  notes: string | null;
  user_profiles: { email: string; full_name: string | null } | null;
  policy: { policy_number: string; policy_type: string } | null;
}

const METHODS = ['mpesa', 'bank', 'cash', 'cheque', 'card'];
const STATUSES = ['completed', 'pending', 'failed', 'refunded'];

const EMPTY_FORM = {
  client_email: '',
  policy_id: '',
  amount: '',
  method: 'mpesa',
  reference: '',
  status: 'completed',
  paid_at: new Date().toISOString().slice(0, 10),
  notes: '',
};

function formatKES(amount: number, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-50 text-green-700';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700';
    case 'failed':
      return 'bg-red-50 text-red-700';
    case 'refunded':
      return 'bg-gray-50 text-gray-700';
    default:
      return 'bg-blue-50 text-blue-700';
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPayments(data.payments || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load payments' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payment');

      setMessage({ type: 'success', text: 'Payment recorded successfully!' });
      setFormData(EMPTY_FORM);
      setShowForm(false);
      loadPayments();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this payment record? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMessage({ type: 'success', text: 'Payment deleted' });
      loadPayments();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete payment' });
    } finally {
      setDeletingId(null);
    }
  };

  const totalReceived = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const thisMonth = payments
    .filter((p) => {
      const d = new Date(p.paid_at);
      const now = new Date();
      return (
        p.status === 'completed' &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Records</h1>
          <p className="text-gray-600">Track all client payments and premiums</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all shadow-lg"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'Record Payment'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#1e3a8a]">
          <div className="flex items-center justify-between mb-1">
            <CreditCard className="text-[#1e3a8a]" size={22} />
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '—' : payments.length}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">Total Records</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-1">
            <Wallet className="text-green-500" size={22} />
            <span className="text-xl font-bold text-gray-900">
              {loading ? '—' : formatKES(totalReceived)}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">Total Received</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-1">
            <TrendingUp className="text-orange-500" size={22} />
            <span className="text-xl font-bold text-gray-900">
              {loading ? '—' : formatKES(thisMonth)}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">This Month</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border-t-4 border-[#dc2626]">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Record New Payment</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Email *
                </label>
                <input
                  type="email"
                  name="client_email"
                  required
                  value={formData.client_email}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (KES) *
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 45000"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition bg-white"
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference / M-Pesa Code
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="e.g. QWE123XYZ"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition bg-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  name="paid_at"
                  value={formData.paid_at}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Policy ID (optional)
                </label>
                <input
                  type="number"
                  name="policy_id"
                  value={formData.policy_id}
                  onChange={handleChange}
                  placeholder="Leave blank if not tied to a policy"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional notes for internal use..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-400 text-white font-semibold rounded-full transition-all shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Save Payment
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData(EMPTY_FORM);
                }}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="text-[#1e3a8a]" size={22} />
            All Payments ({payments.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-[#dc2626] mb-3" size={32} />
            <p className="text-gray-500">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="mx-auto text-gray-300 mb-4" size={56} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No payments yet</h3>
            <p className="text-gray-500 text-sm">
              Click &quot;Record Payment&quot; to add the first one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Client</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Method</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Reference</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.user_profiles?.full_name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.user_profiles?.email || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatKES(Number(payment.amount), payment.currency)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">
                      {payment.reference || '—'}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {formatDate(payment.paid_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(payment.id)}
                        disabled={deletingId === payment.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#dc2626] hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        {deletingId === payment.id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}