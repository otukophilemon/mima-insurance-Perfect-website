// app/admin/claims/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Search,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  X,
  Calendar,
  DollarSign,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

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
  additional_notes: string | null;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted', color: 'bg-blue-50 text-blue-700' },
  { value: 'reviewing', label: 'Reviewing', color: 'bg-yellow-50 text-yellow-700' },
  { value: 'approved', label: 'Approved', color: 'bg-green-50 text-green-700' },
  { value: 'settled', label: 'Settled', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-50 text-red-700' },
];

function getStatusStyle(status: string): string {
  const option = STATUS_OPTIONS.find((o) => o.value === status);
  return option?.color || 'bg-gray-50 text-gray-700';
}

function getStatusLabel(status: string): string {
  const option = STATUS_OPTIONS.find((o) => o.value === status);
  return option?.label || status;
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
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadClaims = async () => {
    try {
      const res = await fetch('/api/admin/claims');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClaims(data.claims || []);
      setFilteredClaims(data.claims || []);
    } catch (error) {
      console.error('Load error:', error);
      setError('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  // Apply search + status filters
  useEffect(() => {
    let filtered = claims;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (claim) =>
          claim.tracking_number.toLowerCase().includes(query) ||
          claim.full_name.toLowerCase().includes(query) ||
          claim.email.toLowerCase().includes(query) ||
          claim.phone.includes(query) ||
          claim.policy_number.toLowerCase().includes(query)
      );
    }

    setFilteredClaims(filtered);
  }, [searchQuery, statusFilter, claims]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/claims/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');

      setMessage({ type: 'success', text: `Status updated to "${getStatusLabel(newStatus)}"` });
      await loadClaims();

      // Refresh the selected claim in modal
      if (selectedClaim && selectedClaim.id === id) {
        setSelectedClaim({ ...selectedClaim, status: newStatus });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this claim? This cannot be undone.')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/claims/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      setMessage({ type: 'success', text: 'Claim deleted' });
      closeModal();
      await loadClaims();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete claim' });
    } finally {
      setDeletingId(null);
    }
  };

  const closeModal = () => {
    setSelectedClaim(null);
  };

  // Compute stats
  const stats = {
    total: claims.length,
    submitted: claims.filter((c) => c.status === 'submitted').length,
    reviewing: claims.filter((c) => c.status === 'reviewing').length,
    settled: claims.filter((c) => c.status === 'settled').length,
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Claims Management
        </h1>
        <p className="text-gray-600">
          Review and process all incoming insurance claims
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#1e3a8a]">
          <div className="flex items-center justify-between mb-1">
            <FileText className="text-[#1e3a8a]" size={22} />
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '—' : stats.total}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">
            Total Claims
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-1">
            <Clock className="text-blue-500" size={22} />
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '—' : stats.submitted}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">
            New
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-1">
            <AlertCircle className="text-yellow-500" size={22} />
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '—' : stats.reviewing}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">
            Reviewing
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-1">
            <CheckCircle className="text-green-500" size={22} />
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '—' : stats.settled}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">
            Settled
          </p>
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
            {message.type === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {message.text}
          </div>
          <button onClick={() => setMessage(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
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

          {/* Status filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                statusFilter === 'all'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({claims.length})
            </button>
            {STATUS_OPTIONS.map((option) => {
              const count = claims.filter((c) => c.status === option.value).length;
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
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-800">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Claims Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-[#1e3a8a]" size={22} />
            All Claims ({filteredClaims.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-[#dc2626] mb-3" size={32} />
            <p className="text-gray-500">Loading claims...</p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-4" size={56} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'No matching claims'
                : 'No claims yet'}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Claims submitted through the website will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Tracking
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Claimant
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Claim Type
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Value
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Filed
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono font-semibold text-gray-900">
                        {claim.tracking_number}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {claim.full_name}
                      </div>
                      <div className="text-xs text-gray-500">{claim.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold capitalize">
                        {claim.claim_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      KES {claim.estimated_value}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                          claim.status
                        )}`}
                      >
                        {getStatusLabel(claim.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {formatDate(claim.created_at)}
                    </td>
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

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">
                  Tracking Number
                </div>
                <div className="text-xl font-mono font-bold text-gray-900">
                  {selectedClaim.tracking_number}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Status Update */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 uppercase mb-3">
                  Update Status
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleUpdateStatus(selectedClaim.id, option.value)
                      }
                      disabled={
                        updatingStatus || selectedClaim.status === option.value
                      }
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                        selectedClaim.status === option.value
                          ? 'bg-[#1e3a8a] text-white cursor-default'
                          : 'bg-white border border-gray-200 hover:border-[#1e3a8a] text-gray-700'
                      } disabled:opacity-60`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Claimant Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase mb-2">
                    Claimant
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold text-gray-900">
                      {selectedClaim.full_name}
                    </div>
                    <a
                      href={`mailto:${selectedClaim.email}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a]"
                    >
                      <Mail size={14} className="text-gray-400" />
                      {selectedClaim.email}
                    </a>
                    <a
                      href={`tel:${selectedClaim.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a]"
                    >
                      <Phone size={14} className="text-gray-400" />
                      {selectedClaim.phone}
                    </a>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase mb-2">
                    Claim Details
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Type: </span>
                      <span className="font-semibold capitalize">
                        {selectedClaim.claim_type}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Policy: </span>
                      <span className="font-mono">
                        {selectedClaim.policy_number}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Incident Date: </span>
                      <span>{formatDate(selectedClaim.incident_date)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Filed: </span>
                      <span>{formatDateTime(selectedClaim.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimated Value */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-xs text-green-700 uppercase font-semibold mb-1">
                  Estimated Value
                </div>
                <div className="text-2xl font-bold text-green-900">
                  KES {selectedClaim.estimated_value}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-2">
                  Incident Description
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedClaim.incident_description}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedClaim.additional_notes && (
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-2">
                    Additional Notes
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedClaim.additional_notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end flex-wrap">
              <a
                href={`mailto:${selectedClaim.email}?subject=Update on Claim ${selectedClaim.tracking_number}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-full transition"
              >
                <Mail size={16} />
                Email Claimant
              </a>
              <a
                href={`tel:${selectedClaim.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition"
              >
                <Phone size={16} />
                Call Claimant
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}