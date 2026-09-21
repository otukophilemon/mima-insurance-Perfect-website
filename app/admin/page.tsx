// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Users,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Inbox,
  Activity,
} from 'lucide-react';

interface ActivityItem {
  type: 'claim' | 'quote' | 'contact';
  id: number;
  title: string;
  subtitle: string;
  status: string;
  created_at: string;
}

interface Stats {
  policies: { total: number; active: number; expiringSoon: number };
  clients: { total: number };
  claims: { total: number; new: number; reviewing: number };
  quotes: { total: number; new: number };
  contacts: { total: number; unread: number };
  activity: ActivityItem[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const formatRelative = (dateStr: string) => {
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now.getTime() - then.getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return then.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  const getActivityLink = (item: ActivityItem) => {
    if (item.type === 'claim') return `/admin/claims`;
    if (item.type === 'quote') return `/admin/quotes`;
    return `/admin/contacts`;
  };

  const getActivityIcon = (item: ActivityItem) => {
    if (item.type === 'claim') return <FileText size={14} />;
    if (item.type === 'quote') return <TrendingUp size={14} />;
    return <Mail size={14} />;
  };

  const getActivityColor = (item: ActivityItem) => {
    if (item.type === 'claim') return 'bg-red-50 text-red-600';
    if (item.type === 'quote') return 'bg-blue-50 text-blue-600';
    return 'bg-purple-50 text-purple-600';
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'submitted' || s === 'new')
      return 'bg-blue-50 text-blue-700';
    if (s === 'under_review' || s === 'reviewing')
      return 'bg-yellow-50 text-yellow-700';
    if (s === 'approved' || s === 'converted' || s === 'replied')
      return 'bg-green-50 text-green-700';
    if (s === 'paid') return 'bg-emerald-50 text-emerald-700';
    if (s === 'rejected' || s === 'declined')
      return 'bg-red-50 text-red-700';
    return 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Real-time overview of MIMA Insurance Brokers
        </p>
      </div>

      {/* Quick actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/admin/policies"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all shadow-lg"
        >
          <Plus size={18} />
          Add New Policy
        </Link>
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-full transition-all shadow-lg"
        >
          <TrendingUp size={18} />
          View Quotes
        </Link>
        <Link
          href="/admin/claims"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white font-semibold rounded-full transition-all"
        >
          <FileText size={18} />
          View Claims
        </Link>
      </div>

      {/* Stats grid — Row 1: Core business */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#1e3a8a]">
          <div className="flex items-center justify-between mb-3">
            <FileText className="text-[#1e3a8a]" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats?.policies.total ?? 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Policies</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="text-green-500" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats?.policies.active ?? 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Active Policies</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#dc2626]">
          <div className="flex items-center justify-between mb-3">
            <Users className="text-[#dc2626]" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats?.clients.total ?? 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Clients</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-3">
            <Clock className="text-orange-500" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats?.policies.expiringSoon ?? 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Expiring in 30 days</p>
        </div>
      </div>

      {/* Stats grid — Row 2: Activity counts (clickable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link
          href="/admin/claims"
          className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <AlertCircle className="text-red-500" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats?.claims.new ?? 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">
            New Claims{' '}
            <span className="text-xs text-gray-400">
              · {stats?.claims.total ?? 0} total
            </span>
          </p>
        </Link>

        <Link
          href="/admin/quotes"
          className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="text-blue-500" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats?.quotes.new ?? 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">
            New Quotes{' '}
            <span className="text-xs text-gray-400">
              · {stats?.quotes.total ?? 0} total
            </span>
          </p>
        </Link>

        <Link
          href="/admin/contacts"
          className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <Inbox className="text-purple-500" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats?.contacts.unread ?? 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">
            Unread Messages{' '}
            <span className="text-xs text-gray-400">
              · {stats?.contacts.total ?? 0} total
            </span>
          </p>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-[#1e3a8a]" size={22} />
            Recent Activity
          </h2>
          <span className="text-xs text-gray-500">
            Last {stats?.activity.length ?? 0} events
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            Loading activity...
          </div>
        ) : !stats?.activity || stats.activity.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 text-sm">
              No activity yet. New claims, quotes, and messages will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {stats.activity.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={getActivityLink(item)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(item)}`}
                  >
                    {getActivityIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(item.status)}`}
                    >
                      {item.status?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatRelative(item.created_at)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}