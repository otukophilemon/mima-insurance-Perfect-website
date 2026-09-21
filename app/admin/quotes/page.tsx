// app/admin/quotes/page.tsx
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
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  Ban,
} from 'lucide-react';

interface Quote {
  id: number;
  insurance_type: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  age: string | null;
  details: string | null;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-50 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-50 text-yellow-700' },
  { value: 'converted', label: 'Converted', color: 'bg-green-50 text-green-700' },
  { value: 'declined', label: 'Declined', color: 'bg-red-50 text-red-700' },
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

function formatInsuranceType(type: string): string {
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadQuotes = async () => {
    try {
      const res = await fetch('/api/admin/quotes');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuotes(data.quotes || []);
      setFilteredQuotes(data.quotes || []);
    } catch (error) {
      console.error('Load error:', error);
      setError('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  // Apply search + status filters
  useEffect(() => {
    let filtered = quotes;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (quote) =>
          quote.full_name.toLowerCase().includes(query) ||
          quote.email.toLowerCase().includes(query) ||
          quote.phone.includes(query) ||
          quote.insurance_type.toLowerCase().includes(query) ||
          quote.location.toLowerCase().includes(query)
      );
    }

    setFilteredQuotes(filtered);
  }, [searchQuery, statusFilter, quotes]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');

      setMessage({ type: 'success', text: `Status updated to "${getStatusLabel(newStatus)}"` });
      await loadQuotes();

      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote({ ...selectedQuote, status: newStatus });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this quote? This cannot be undone.')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      setMessage({ type: 'success', text: 'Quote deleted' });
      closeModal();
      await loadQuotes();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete quote' });
    } finally {
      setDeletingId(null);
    }
  };

  const closeModal = () => {
    setSelectedQuote(null);
  };

  const stats = {
    total: quotes.length,
    new: quotes.filter((q) => q.status === 'new' || !q.status).length,
    contacted: quotes.filter((q) => q.status === 'contacted').length,
    converted: quotes.filter((q) => q.status === 'converted').length,
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quote Requests
        </h1>
        <p className="text-gray-600">
          Review and respond to incoming quote requests
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
            Total Quotes
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-1">
            <Clock className="text-blue-500" size={22} />
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '—' : stats.new}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">New</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-1">
            <AlertCircle className="text-yellow-500" size={22} />
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '—' : stats.contacted}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">
            Contacted
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-1">
            <TrendingUp className="text-green-500" size={22} />
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '—' : stats.converted}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase">
            Converted
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
              placeholder="Search by name, email, phone, or type..."
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
              All ({quotes.length})
            </button>
            {STATUS_OPTIONS.map((option) => {
              const count = quotes.filter(
                (q) =>
                  q.status === option.value ||
                  (!q.status && option.value === 'new')
              ).length;
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

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-[#1e3a8a]" size={22} />
            All Quotes ({filteredQuotes.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-[#dc2626] mb-3" size={32} />
            <p className="text-gray-500">Loading quotes...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-4" size={56} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'No matching quotes'
                : 'No quotes yet'}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Quote requests from the website will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Client
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Insurance Type
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Requested
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.full_name}
                      </div>
                      <div className="text-xs text-gray-500">{quote.email}</div>
                      <div className="text-xs text-gray-400">
                        {quote.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                        {formatInsuranceType(quote.insurance_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {quote.location}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          quote.status || 'new'
                        )}`}
                      >
                        {getStatusLabel(quote.status || 'new')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {formatDate(quote.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          disabled={deletingId === quote.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#dc2626] hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          {deletingId === quote.id ? (
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

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">
                  Quote Request #{selectedQuote.id}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedQuote.full_name}
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
                  {STATUS_OPTIONS.map((option) => {
                    const currentStatus = selectedQuote.status || 'new';
                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleUpdateStatus(selectedQuote.id, option.value)
                        }
                        disabled={
                          updatingStatus || currentStatus === option.value
                        }
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                          currentStatus === option.value
                            ? 'bg-[#1e3a8a] text-white cursor-default'
                            : 'bg-white border border-gray-200 hover:border-[#1e3a8a] text-gray-700'
                        } disabled:opacity-60`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase mb-2">
                    Client Contact
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold text-gray-900">
                      {selectedQuote.full_name}
                    </div>
                    <a
                      href={`mailto:${selectedQuote.email}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a]"
                    >
                      <Mail size={14} className="text-gray-400" />
                      {selectedQuote.email}
                    </a>
                    <a
                      href={`tel:${selectedQuote.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a]"
                    >
                      <Phone size={14} className="text-gray-400" />
                      {selectedQuote.phone}
                    </a>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase mb-2">
                    Request Details
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Insurance: </span>
                      <span className="font-semibold">
                        {formatInsuranceType(selectedQuote.insurance_type)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Location: </span>
                      <span>{selectedQuote.location}</span>
                    </div>
                    {selectedQuote.age && (
                      <div>
                        <span className="text-gray-500">Age: </span>
                        <span>{selectedQuote.age}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Requested: </span>
                      <span>{formatDateTime(selectedQuote.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {selectedQuote.details && (
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-2">
                    Additional Details
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedQuote.details}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end flex-wrap">
              <a
                href={`mailto:${selectedQuote.email}?subject=Your ${formatInsuranceType(selectedQuote.insurance_type)} Quote from MIMA`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-full transition"
              >
                <Mail size={16} />
                Email Client
              </a>
              <a
                href={`tel:${selectedQuote.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition"
              >
                <Phone size={16} />
                Call Client
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}