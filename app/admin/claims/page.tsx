// app/admin/claims/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Search,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import { filterByDateRange } from '@/lib/dateRange';
import { exportToCSV, formatDateForCSV } from '@/lib/csv';

interface Claim {
  id: number;
  tracking_number: string;
  claim_type: string;
  incident_date: string;
  incident_description: string;
  estimated_value: string;
  full_name: string;
  email: string;
  phone: string;
  policy_number: string;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Reviewing' },
  { value: 'approved', label: 'Approved' },
  { value: 'paid', label: 'Settled' },
  { value: 'rejected', label: 'Rejected' },
];

function getStatusStyle(status: string): string {
  const s = status?.toLowerCase().replace(/\s+/g, '_');
  switch (s) {
    case 'submitted':
      return 'bg-blue-50 text-blue-700';
    case 'under_review':
    case 'reviewing':
      return 'bg-yellow-50 text-yellow-700';
    case 'approved':
      return 'bg-green-50 text-green-700';
    case 'paid':
      return 'bg-emerald-50 text-emerald-700';
    case 'rejected':
    case 'declined':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadClaims = async () => {
    try {
      const res = await fetch('/api/admin/claims');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClaims(data.claims || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/claims/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      setMessage({ type: 'success', text: `Status updated to "${newStatus}"` });
      await loadClaims();
      if (selectedClaim && selectedClaim.id === id) {
        setSelectedClaim({ ...selectedClaim, status: newStatus });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update status' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this claim? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/claims/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMessage({ type: 'success', text: 'Claim deleted' });
      setSelectedClaim(null);
      await loadClaims();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete claim' });
    } finally {
      setDeletingId(null);
    }
  };

  // Date filter first
  const dateFiltered = filterByDateRange(claims, 'created_at', dateFrom, dateTo);

  // Then status + search
  const filtered = dateFiltered.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.tracking_number.toLowerCase().includes(q) ||
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.claim_type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    const rows = filtered.map((c) => ({
      'Tracking Number': c.tracking_number,
      Claimant: c.full_name,
      Email: c.email,
      Phone: c.phone,
      'Claim Type': c.claim_type,
      'Incident Date': c.incident_date,
      'Estimated Value': c.estimated_value,
      'Policy Number': c.policy_number,
      Status: c.status,
      'Filed On': formatDateForCSV(c.created_at),
      Description: c.incident_description || '',
    }));

    const suffix =
      dateFrom || dateTo
        ? `_${dateFrom || 'start'}_to_${dateTo || 'today'}`
        : `_${new Date().toISOString().slice(0, 10)}`;

    exportToCSV(rows, `mima_claims${suffix}`);
  };

  const stats = {
    total: dateFiltered.length,
    new: dateFiltered.filter((c) => c.status === 'submitted').length,
    reviewing: dateFiltered.filter((c) => c.status === 'under_review' || c.status === 'reviewing').length,
    settled: dateFiltered.filter((c) => c.status === 'paid').length,
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Claims Management</h1>
        <p className="text-gray-600">Review and process all incoming insurance claims</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#1e3a8a]">
          <div className="flex items-center justify-between mb-1">
            <FileText className="text-[#1e3a8a]" size={22} />
            <span className="text-2xl font-bold text-gray-900">{loading ? '—' : stats.total}</span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">Total Claims</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-1">
            <Clock className="text-blue-500" size={22} />
            <span className="text-2xl font-bold text-gray-900">{loading ? '—' : stats.new}</span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">New</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-1">
            <AlertCircle className="text-yellow-500" size={22} />
            <span className="text-2xl font-bold text-gray-900">{loading ? '—' : stats.reviewing}</span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">Reviewing</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-1">
            <CheckCircle className="text-green-500" size={22} />
            <span className="text-2xl font-bold text-gray-900">{loading ? '—' : stats.settled}</span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">Settled</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center justify-between gap-2 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
          <button onClick={() => setMessage(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tracking #, name, email, phone..."
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((option) => {
              const count =
                option.value === 'all'
                  ? dateFiltered.length
                  : dateFiltered.filter((c) => c.status === option.value).length;
              return (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                    statusFilter === option.value
                      ? 'bg-[#1e3a8a] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label} ({count})
                </button>
              );
            })}
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
              title="From date"
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="To date"
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-800">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-[#1e3a8a]" size={22} />
            All Claims ({filtered.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-[#dc2626] mb-3" size={32} />
            <p className="text-gray-500">Loading claims...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-4" size={56} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No matching claims</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Tracking</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Claimant</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Claim Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Value</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Filed</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((claim) => (
                  <tr key={claim.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-xs font-mono text-gray-700">{claim.tracking_number}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{claim.full_name}</div>
                      <div className="text-xs text-gray-500">{claim.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold capitalize">
                        {claim.claim_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      KES {Number(claim.estimated_value || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(claim.status)}`}>
                        {claim.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">{formatDate(claim.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(claim.id)}
                          disabled={deletingId === claim.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#dc2626] hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          {deletingId === claim.id ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">
                  Tracking: {selectedClaim.tracking_number}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedClaim.claim_type.charAt(0).toUpperCase() + selectedClaim.claim_type.slice(1)} Claim
                </div>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Status update */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 uppercase mb-3">Update Status</div>
                <div className="flex flex-wrap gap-2">
                  {['submitted', 'under_review', 'approved', 'paid', 'rejected'].map((s) => {
                    const currentStatus = selectedClaim.status;
                    return (
                      <button
                        key={s}
                        onClick={() => handleUpdateStatus(selectedClaim.id, s)}
                        disabled={updating || currentStatus === s}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition capitalize ${
                          currentStatus === s
                            ? 'bg-[#1e3a8a] text-white cursor-default'
                            : 'bg-white border border-gray-200 hover:border-[#1e3a8a] text-gray-700'
                        } disabled:opacity-60`}
                      >
                        {s.replace(/_/g, ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase mb-2">Claimant</div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold text-gray-900">{selectedClaim.full_name}</div>
                    <a href={`mailto:${selectedClaim.email}`} className="block text-gray-700 hover:text-[#1e3a8a]">{selectedClaim.email}</a>
                    <a href={`tel:${selectedClaim.phone}`} className="block text-gray-700 hover:text-[#1e3a8a]">{selectedClaim.phone}</a>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase mb-2">Claim Details</div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Policy: </span><span className="font-mono">{selectedClaim.policy_number}</span></div>
                    <div><span className="text-gray-500">Incident: </span>{formatDate(selectedClaim.incident_date)}</div>
                    <div><span className="text-gray-500">Value: </span><span className="font-semibold">KES {Number(selectedClaim.estimated_value || 0).toLocaleString()}</span></div>
                    <div><span className="text-gray-500">Filed: </span>{formatDateTime(selectedClaim.created_at)}</div>
                  </div>
                </div>
              </div>

              {selectedClaim.incident_description && (
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Incident Description</div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedClaim.incident_description}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end flex-wrap">
              <a
                href={`mailto:${selectedClaim.email}?subject=Re: Your ${selectedClaim.claim_type} Claim (${selectedClaim.tracking_number})`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-full transition"
              >
                Email Claimant
              </a>
              <a
                href={`tel:${selectedClaim.phone}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition"
              >
                Call Claimant
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}