// app/admin/audit-log/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Shield,
  Search,
  Loader2,
  AlertCircle,
  FileText,
  TrendingUp,
  CreditCard,
  Mail,
  User,
  Trash2,
  RefreshCw,
  Filter,
  Download,
} from 'lucide-react';
import { filterByDateRange } from '@/lib/dateRange';
import { exportToCSV, formatDateForCSV } from '@/lib/csv';

interface AuditLog {
  id: number;
  admin_id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, any> | null;
  created_at: string;
}

const ENTITY_ICONS: Record<string, any> = {
  claim: FileText,
  quote: TrendingUp,
  policy: Shield,
  payment: CreditCard,
  contact: Mail,
  admin: User,
  blog_post: FileText,
  team_member: User,
};

const ENTITY_COLORS: Record<string, string> = {
  claim: 'bg-red-50 text-red-600',
  quote: 'bg-blue-50 text-blue-600',
  policy: 'bg-indigo-50 text-indigo-600',
  payment: 'bg-green-50 text-green-600',
  contact: 'bg-purple-50 text-purple-600',
  admin: 'bg-orange-50 text-orange-600',
  blog_post: 'bg-gray-50 text-gray-600',
  team_member: 'bg-gray-50 text-gray-600',
};

function formatAction(action: string): string {
  return action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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

function formatRelative(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-log');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load audit log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Date filter first
  const dateFiltered = filterByDateRange(logs, 'created_at', dateFrom, dateTo);

  // Then entity + search
  const filtered = dateFiltered.filter((log) => {
    if (entityFilter !== 'all' && log.entity_type !== entityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        log.admin_email.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entity_type.toLowerCase().includes(q) ||
        (log.entity_id || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    const rows = filtered.map((log) => ({
      ID: log.id,
      'When': formatDateForCSV(log.created_at),
      Admin: log.admin_email,
      Action: formatAction(log.action),
      Entity: log.entity_type,
      'Entity ID': log.entity_id || '',
      Details: log.details ? JSON.stringify(log.details) : '',
    }));

    const suffix =
      dateFrom || dateTo
        ? `_${dateFrom || 'start'}_to_${dateTo || 'today'}`
        : `_${new Date().toISOString().slice(0, 10)}`;

    exportToCSV(rows, `mima_audit_log${suffix}`);
  };

  // Compute entity counts
  const entityCounts: Record<string, number> = { all: dateFiltered.length };
  for (const log of dateFiltered) {
    entityCounts[log.entity_type] = (entityCounts[log.entity_type] || 0) + 1;
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Shield className="text-[#1e3a8a]" size={28} />
            Audit Log
          </h1>
          <p className="text-gray-600">
            Every admin action, tracked and timestamped
          </p>
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-[#1e3a8a] rounded-lg text-sm font-semibold text-gray-700 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-800">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by admin, action, or entity..."
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
            />
          </div>

          {/* Entity filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setEntityFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                entityFilter === 'all'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({entityCounts.all || 0})
            </button>
            {Object.entries(ENTITY_ICONS).map(([entity]) => {
              const count = entityCounts[entity] || 0;
              if (count === 0 && entityFilter !== entity) return null;
              return (
                <button
                  key={entity}
                  onClick={() => setEntityFilter(entity)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition capitalize ${
                    entityFilter === entity
                      ? 'bg-[#1e3a8a] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {entity} ({count})
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
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Logs list */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Activity ({filtered.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-[#1e3a8a] mb-3" size={32} />
            <p className="text-gray-500">Loading audit log...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="mx-auto text-gray-300 mb-4" size={56} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No activity found</h3>
            <p className="text-gray-500 text-sm">
              {search || entityFilter !== 'all' || dateFrom || dateTo
                ? 'Try adjusting your filters'
                : 'Admin actions will appear here as they happen'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((log) => {
              const Icon = ENTITY_ICONS[log.entity_type] || FileText;
              const color =
                ENTITY_COLORS[log.entity_type] || 'bg-gray-50 text-gray-600';
              const isExpanded = expandedId === log.id;

              return (
                <li key={log.id}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 transition flex items-center gap-4"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {formatAction(log.action)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {log.admin_email}
                        {log.entity_id && (
                          <>
                            {' · '}
                            <span className="font-mono">
                              #{log.entity_id}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatRelative(log.created_at)}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                      <div className="py-3 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Exact time:</span>
                          <span className="font-mono text-gray-700">
                            {formatDateTime(log.created_at)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Admin:</span>
                          <span className="text-gray-700">{log.admin_email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Entity:</span>
                          <span className="text-gray-700 capitalize">
                            {log.entity_type}
                            {log.entity_id && ` #${log.entity_id}`}
                          </span>
                        </div>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div>
                            <span className="text-gray-500 block mb-1">Details:</span>
                            <pre className="bg-white border border-gray-200 rounded-lg p-3 text-[11px] text-gray-700 overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}