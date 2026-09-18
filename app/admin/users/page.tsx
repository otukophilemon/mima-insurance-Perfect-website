// app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Shield,
  Loader2,
  AlertCircle,
  X,
  FileText,
  Calendar,
  CheckCircle,
  Eye,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  policy_count: number;
  active_policy_count: number;
}

interface Policy {
  id: number;
  policy_number: string;
  policy_type: string;
  annual_premium: number;
  status: string;
  start_date: string;
  expiry_date: string;
}

interface Claim {
  id: number;
  tracking_number: string;
  claim_type: string;
  status: string;
  created_at: string;
}

function getInitials(name: string | null, email: string): string {
  if (name && name.trim()) {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  return email.substring(0, 2).toUpperCase();
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<{
    user: User;
    policies: Policy[];
    claims: Claim[];
  } | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (error) {
      console.error('Load error:', error);
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        (user.full_name && user.full_name.toLowerCase().includes(query)) ||
        (user.phone && user.phone.includes(query))
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setDetailsLoading(true);
    setUserDetails(null);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUserDetails(data);
    } catch (error) {
      console.error('Load user details error:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Client Management
        </h1>
        <p className="text-gray-600">
          View and manage all registered MIMA clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#1e3a8a]">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-[#1e3a8a]" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : users.length}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Clients</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-green-500" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading
                ? '—'
                : users.filter((u) => u.active_policy_count > 0).length}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">With Active Policies</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#dc2626]">
          <div className="flex items-center justify-between mb-2">
            <FileText className="text-[#dc2626]" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading
                ? '—'
                : users.reduce((sum, u) => sum + u.policy_count, 0)}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Policies</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-2 px-2">
            {filteredUsers.length} result
            {filteredUsers.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-800">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-[#1e3a8a]" size={22} />
            All Clients ({filteredUsers.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2
              className="animate-spin mx-auto text-[#dc2626] mb-3"
              size={32}
            />
            <p className="text-gray-500">Loading clients...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-gray-300 mb-4" size={56} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {searchQuery ? 'No matching clients' : 'No clients yet'}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? 'Try a different search term'
                : 'Client accounts will appear here as they register'}
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
                    Contact
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Policies
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Joined
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Role
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {getInitials(user.full_name, user.email)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {user.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                          <Mail size={12} className="text-gray-400" />
                          <span className="truncate max-w-[200px]">
                            {user.email}
                          </span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone size={12} className="text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-bold text-gray-900">
                          {user.policy_count}
                        </span>
                        {user.active_policy_count > 0 && (
                          <span className="text-gray-500">
                            {' '}
                            ({user.active_policy_count} active)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_admin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-[#dc2626] text-xs font-semibold">
                          <Shield size={12} />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-semibold">
                          Client
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {getInitials(selectedUser.full_name, selectedUser.email)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedUser.full_name || 'No name'}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={closeDetails}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {detailsLoading ? (
                <div className="text-center py-12">
                  <Loader2
                    className="animate-spin mx-auto text-[#dc2626] mb-3"
                    size={32}
                  />
                  <p className="text-gray-500">Loading details...</p>
                </div>
              ) : userDetails ? (
                <>
                  {/* Contact & Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 uppercase mb-2">
                        Contact Information
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span>{userDetails.user.email}</span>
                        </div>
                        {userDetails.user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span>{userDetails.user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span>
                            Joined {formatDate(userDetails.user.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 uppercase mb-2">
                        Account Role
                      </div>
                      {userDetails.user.is_admin ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-[#dc2626] text-sm font-semibold">
                          <Shield size={14} />
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-[#1e3a8a] text-sm font-semibold">
                          Client
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Policies */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="text-[#1e3a8a]" size={20} />
                      Policies ({userDetails.policies.length})
                    </h3>
                    {userDetails.policies.length === 0 ? (
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <p className="text-gray-500 text-sm">No policies yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {userDetails.policies.map((policy) => (
                          <div
                            key={policy.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">
                                {policy.policy_type} Insurance
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {policy.policy_number}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">
                                {formatKES(policy.annual_premium)}
                              </div>
                              <div
                                className={`text-xs font-semibold ${
                                  policy.status === 'active'
                                    ? 'text-green-600'
                                    : 'text-gray-500'
                                }`}
                              >
                                {policy.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Claims */}
                  {userDetails.claims && userDetails.claims.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="text-[#dc2626]" size={20} />
                        Claims ({userDetails.claims.length})
                      </h3>
                      <div className="space-y-2">
                        {userDetails.claims.map((claim) => (
                          <div
                            key={claim.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">
                                {claim.claim_type}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {claim.tracking_number}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(claim.created_at)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Failed to load user details
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end flex-wrap">
              <a
                href={`mailto:${selectedUser.email}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-full transition"
              >
                <Mail size={16} />
                Email Client
              </a>
              {selectedUser.phone && (
                <a
                  href={`tel:${selectedUser.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition"
                >
                  <Phone size={16} />
                  Call Client
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}