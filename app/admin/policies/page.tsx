// app/admin/policies/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Trash2,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Download,
  Filter,
} from 'lucide-react';
import { filterByDateRange } from '@/lib/dateRange';
import { exportToCSV, formatDateForCSV } from '@/lib/csv';

interface Policy {
  id: number;
  policy_number: string;
  policy_type: string;
  coverage_description: string;
  annual_premium: number;
  start_date: string;
  expiry_date: string;
  status: string;
  user_profiles: { email: string; full_name: string | null } | null;
}

const POLICY_TYPES = [
  'Motor',
  'Medical',
  'Fire',
  'Burglary',
  'Marine',
  'Travel',
  'Money',
  'WIBA',
  'Group Life',
  'Business Interruption',
  'Domestic',
  'Public Liability',
  'Professional Indemnity',
  'Pension',
  'Education',
];

const EMPTY_FORM = {
  client_email: '',
  policy_number: '',
  policy_type: 'Motor',
  coverage_description: '',
  annual_premium: '',
  start_date: '',
  expiry_date: '',
  notes: '',
  from_quote_id: '',
};

function AdminPoliciesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [linkedQuote, setLinkedQuote] = useState<{
    id: number;
    full_name: string;
    insurance_type: string;
  } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadPolicies = async () => {
    try {
      const res = await fetch('/api/admin/policies');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPolicies(data.policies || []);
    } catch (error) {
      console.error('Load error:', error);
      setMessage({ type: 'error', text: 'Failed to load policies' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  // Handle "?from_quote=<id>" pre-fill (Phase 8)
  useEffect(() => {
    const quoteId = searchParams.get('from_quote');
    if (!quoteId) return;

    const prefill = async () => {
      try {
        const res = await fetch(`/api/admin/quotes/${quoteId}`);
        if (!res.ok) throw new Error('Quote not found');
        const data = await res.json();
        const quote = data.quote;

        if (quote.status === 'converted') {
          setMessage({
            type: 'error',
            text: 'This quote has already been converted to a policy.',
          });
          return;
        }

        const normalizedQuote = quote.insurance_type.toLowerCase().replace(/\s|-/g, '');
        const matchedType =
          POLICY_TYPES.find(
            (t) => t.toLowerCase().replace(/\s|-/g, '') === normalizedQuote
          ) || 'Motor';

        setFormData({
          ...EMPTY_FORM,
          client_email: quote.email || '',
          policy_type: matchedType,
          coverage_description: quote.details || '',
          from_quote_id: String(quote.id),
        });

        setLinkedQuote({
          id: quote.id,
          full_name: quote.full_name,
          insurance_type: quote.insurance_type,
        });

        setShowForm(true);

        setMessage({
          type: 'success',
          text: `Pre-filled from quote #${quote.id} (${quote.full_name}). Complete the policy number, premium, and dates.`,
        });
      } catch (err) {
        console.error('Pre-fill error:', err);
        setMessage({
          type: 'error',
          text: 'Could not load the quote to convert.',
        });
      }
    };

    prefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
      const res = await fetch('/api/admin/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create policy');

      if (formData.from_quote_id) {
        try {
          const quoteRes = await fetch(
            `/api/admin/quotes/${formData.from_quote_id}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'converted' }),
            }
          );
          if (!quoteRes.ok) {
            console.warn('Policy created but quote status update failed');
          }
        } catch (quoteErr) {
          console.warn('Quote update error:', quoteErr);
        }
      }

      setMessage({
        type: 'success',
        text: formData.from_quote_id
          ? `Policy created! Quote #${formData.from_quote_id} marked as converted and client notified.`
          : 'Policy created successfully!',
      });
      setFormData(EMPTY_FORM);
      setLinkedQuote(null);
      setShowForm(false);
      loadPolicies();

      if (searchParams.get('from_quote')) {
        router.replace('/admin/policies');
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to create policy';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this policy? This cannot be undone.')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/policies/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMessage({ type: 'success', text: 'Policy deleted' });
      loadPolicies();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setLinkedQuote(null);
    if (searchParams.get('from_quote')) {
      router.replace('/admin/policies');
    }
  };

  const formatKES = (amount: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  // Filter by date range first
  const dateFiltered = filterByDateRange(policies, 'start_date', dateFrom, dateTo);

  // Then status + search
  const filtered = dateFiltered.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.policy_number.toLowerCase().includes(q) ||
        p.policy_type.toLowerCase().includes(q) ||
        (p.user_profiles?.email || '').toLowerCase().includes(q) ||
        (p.user_profiles?.full_name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    const rows = filtered.map((p) => ({
      'Policy Number': p.policy_number,
      'Policy Type': p.policy_type,
      Client: p.user_profiles?.full_name || 'Unknown',
      Email: p.user_profiles?.email || '',
      'Annual Premium': p.annual_premium,
      'Start Date': formatDateForCSV(p.start_date),
      'Expiry Date': formatDateForCSV(p.expiry_date),
      Status: p.status,
      Coverage: p.coverage_description,
    }));

    const suffix =
      dateFrom || dateTo
        ? `_${dateFrom || 'start'}_to_${dateTo || 'today'}`
        : `_${new Date().toISOString().slice(0, 10)}`;

    exportToCSV(rows, `mima_policies${suffix}`);
  };

  const statusCounts = {
    all: dateFiltered.length,
    active: dateFiltered.filter((p) => p.status === 'active').length,
    expired: dateFiltered.filter((p) => p.status === 'expired').length,
    cancelled: dateFiltered.filter((p) => p.status === 'cancelled').length,
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Policy Management</h1>
          <p className="text-gray-600">
            Create and manage insurance policies for MIMA clients
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all shadow-lg"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'Add New Policy'}
        </button>
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
          {message.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {message.text}
        </div>
      )}

      {/* Add / Convert Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border-t-4 border-[#dc2626]">
          {linkedQuote && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-green-900">
                <ArrowRight size={16} className="flex-shrink-0" />
                <span>
                  <strong>Converting quote #{linkedQuote.id}</strong> from{' '}
                  {linkedQuote.full_name} ({linkedQuote.insurance_type})
                </span>
              </div>
              <button
                type="button"
                onClick={handleCancelForm}
                className="text-xs font-semibold text-green-800 hover:underline"
              >
                Cancel conversion
              </button>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {linkedQuote ? 'Convert Quote to Policy' : 'New Policy'}
          </h2>

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
                  Policy Number *
                </label>
                <input
                  type="text"
                  name="policy_number"
                  required
                  value={formData.policy_number}
                  onChange={handleChange}
                  placeholder="e.g. MIMA/MOT/2026/00123"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Policy Type *
                </label>
                <select
                  name="policy_type"
                  required
                  value={formData.policy_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition bg-white"
                >
                  {POLICY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Premium (KES) *
                </label>
                <input
                  type="number"
                  name="annual_premium"
                  required
                  min="0"
                  step="0.01"
                  value={formData.annual_premium}
                  onChange={handleChange}
                  placeholder="e.g. 45000"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  required
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coverage Description *
                </label>
                <textarea
                  name="coverage_description"
                  required
                  rows={3}
                  value={formData.coverage_description}
                  onChange={handleChange}
                  placeholder="Describe what this policy covers..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes
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
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-400 disabled:cursor-wait text-white font-semibold rounded-full transition-all shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    {linkedQuote ? 'Convert to Policy' : 'Create Policy'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by policy #, type, client name, or email..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition text-sm"
          />

          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'expired', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition capitalize ${
                  statusFilter === s
                    ? 'bg-[#1e3a8a] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s} ({statusCounts[s]})
              </button>
            ))}
          </div>
        </div>

        {/* Date range + export */}
        <div className="flex flex-col lg:flex-row gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <Filter size={16} className="text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Start date from"
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Start date to"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear
              </button>
            )}
            <span className="text-xs text-gray-500 italic ml-2">
              (filtered by policy start date)
            </span>
          </div>

          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
          >
            <Download size={16} />
            Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* Policies List */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-[#1e3a8a]" size={22} />
            All Policies ({filtered.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-[#dc2626] mb-3" size={32} />
            <p className="text-gray-500">Loading policies...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-4" size={56} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {searchQuery || statusFilter !== 'all' || dateFrom || dateTo
                ? 'No matching policies'
                : 'No policies yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {searchQuery || statusFilter !== 'all' || dateFrom || dateTo
                ? 'Try adjusting your filters'
                : 'Click "Add New Policy" to create the first one'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Client</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Policy</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Premium</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Expires</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((policy) => (
                  <tr key={policy.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {policy.user_profiles?.full_name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {policy.user_profiles?.email || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {policy.policy_type}
                      </div>
                      <div className="text-xs text-gray-500">
                        {policy.policy_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatKES(policy.annual_premium)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(policy.expiry_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          policy.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : policy.status === 'expired'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        <CheckCircle size={12} />
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(policy.id)}
                        disabled={deletingId === policy.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#dc2626] hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        {deletingId === policy.id ? (
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

export default function AdminPoliciesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <AdminPoliciesPageInner />
    </Suspense>
  );
}