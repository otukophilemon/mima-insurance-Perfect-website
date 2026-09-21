// app/admin/contacts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { filterByDateRange } from '@/lib/dateRange';
import { exportToCSV, formatDateForCSV } from '@/lib/csv';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

type FilterTab = 'all' | 'new' | 'read' | 'replied';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selected, setSelected] = useState<Contact | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts');
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Update status
  const updateStatus = async (id: number, status: Contact['status']) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      setContacts(contacts.map((c) => (c.id === id ? { ...c, status } : c)));
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  // Delete contact
  const deleteContact = async (id: number) => {
    if (!confirm('Delete this contact permanently? This cannot be undone.')) return;

    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      setContacts(contacts.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  // Open contact and auto-mark as read if new
  const openContact = (contact: Contact) => {
    setSelected(contact);
    if (contact.status === 'new') {
      updateStatus(contact.id, 'read');
    }
  };

  // Export to CSV
  const handleExport = () => {
    const rows = filtered.map((c) => ({
      ID: c.id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone || '',
      Subject: c.subject,
      Message: c.message,
      Status: c.status,
      'Received Date': formatDateForCSV(c.created_at),
    }));

    const suffix =
      dateFrom || dateTo
        ? `_${dateFrom || 'start'}_to_${dateTo || 'today'}`
        : `_${new Date().toISOString().slice(0, 10)}`;

    exportToCSV(rows, `mima_contacts${suffix}`);
  };

  // Apply date filter first
  const dateFiltered = filterByDateRange(contacts, 'created_at', dateFrom, dateTo);

  // Then status + search
  const filtered = dateFiltered.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: dateFiltered.length,
    new: dateFiltered.filter((c) => c.status === 'new').length,
    read: dateFiltered.filter((c) => c.status === 'read').length,
    replied: dateFiltered.filter((c) => c.status === 'replied').length,
  };

  const statusBadge = (status: Contact['status']) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-700',
      replied: 'bg-green-100 text-green-800',
    };
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) return <div className="p-8 text-gray-600">Loading contacts...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contact Submissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage messages sent through the contact form.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'new', 'read', 'replied'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab
                ? 'bg-[#dc2626] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Search + Date Range + Export */}
      <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-400 flex-shrink-0" />
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  No contacts match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openContact(contact)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    <div className="text-xs text-gray-500">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {contact.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {statusBadge(contact.status)}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-right text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => deleteContact(contact.id)}
                      disabled={updating === contact.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelected(null)}
          />
          <div className="relative ml-auto w-full max-w-lg bg-white shadow-xl flex flex-col h-full">
            {/* Drawer header */}
            <div className="p-6 border-b flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.subject}</h2>
                <p className="text-sm text-gray-500 mt-1">From {selected.name}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Email</div>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {selected.email}
                  </a>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Phone</div>
                  {selected.phone ? (
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selected.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 uppercase">Received</div>
                  <div className="text-gray-700">
                    {new Date(selected.created_at).toLocaleString('en-GB')}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">Message</div>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase mb-2">Status</div>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'read', 'replied'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={updating === selected.id || selected.status === s}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selected.status === s
                          ? 'bg-[#dc2626] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-60`}
                    >
                      Mark as {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="p-6 border-t flex gap-3">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Reply via Email
              </a>
              <button
                onClick={() => deleteContact(selected.id)}
                disabled={updating === selected.id}
                className="px-4 py-2.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 font-medium text-sm disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}