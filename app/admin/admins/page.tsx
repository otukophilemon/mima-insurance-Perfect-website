// app/admin/admins/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Search,
  Loader2,
  AlertCircle,
  UserPlus,
  Info,
  Crown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
  is_team_member: boolean;
  team_slug: string | null;
  team_title: string | null;
  team_photo: string | null;
  team_display_order: number | null;
  created_at: string;
}

export default function AdminManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [superAdminCount, setSuperAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('/api/admin/admins');
      if (!res.ok) throw new Error('Failed to fetch team members');
      const data = await res.json();
      setTeamMembers(data.admins || []);
      setIsSuperAdmin(data.isSuperAdmin === true);
      setCurrentUserId(data.currentUserId || null);
      setSuperAdminCount(data.superAdminCount || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const updateRole = async (
    userId: string,
    updates: { isAdmin?: boolean; isSuperAdmin?: boolean },
    confirmMessage: string
  ) => {
    if (!isSuperAdmin) {
      alert('Only a super admin can perform this action.');
      return;
    }

    if (!confirm(confirmMessage)) return;

    setUpdating(userId);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      await fetchTeamMembers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const filteredMembers = teamMembers.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.email?.toLowerCase().includes(q) ||
      m.full_name?.toLowerCase().includes(q) ||
      m.phone?.toLowerCase().includes(q) ||
      m.team_title?.toLowerCase().includes(q)
    );
  });

  const adminCount = teamMembers.filter((m) => m.is_admin).length;

  if (loading) return <div className="p-8 text-gray-600">Loading team...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
        <p className="text-sm text-gray-500">
          All MIMA team members with admin access. Currently{' '}
          <span className="font-semibold text-gray-700">{adminCount}</span> admin
          {adminCount !== 1 ? 's' : ''} (
          <span className="font-semibold text-yellow-700">
            {superAdminCount}
          </span>{' '}
          super admin{superAdminCount !== 1 ? 's' : ''}) out of{' '}
          <span className="font-semibold text-gray-700">{teamMembers.length}</span>{' '}
          team member{teamMembers.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Non-super-admin warning */}
      {!isSuperAdmin && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3 text-sm text-blue-900">
          <Info size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong>Read-only view.</strong> Only a super admin can modify roles.
            Contact a super admin to make changes.
          </div>
        </div>
      )}

      {/* Super admin banner */}
      {isSuperAdmin && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 text-sm text-yellow-900">
          <Crown size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong>You are a super admin.</strong> You can promote team members
            to super admin, revoke admin access, or step down — as long as at
            least one super admin remains.
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No team members found.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => {
                const isSelf = member.id === currentUserId;
                const isOnlySuperAdmin =
                  member.is_super_admin && superAdminCount <= 1;
                const canManage = isSuperAdmin && !updating;

                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {member.team_photo ? (
                          <img
                            src={member.team_photo}
                            alt={member.full_name || ''}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {(member.full_name || member.email)
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {member.full_name || 'Unnamed'}
                            {isSelf && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                You
                              </span>
                            )}
                            {member.is_super_admin && (
                              <span title="Super Admin">
                                <Crown size={14} className="text-yellow-500" />
                              </span>
                            )}
                          </div>
                          {member.team_title && (
                            <div className="text-xs text-gray-500">
                              {member.team_title}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{member.email}</div>
                      {member.phone && (
                        <div className="text-xs text-gray-400">{member.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${
                            member.is_admin
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {member.is_admin ? 'Admin' : 'Team Member'}
                        </span>
                        {member.is_super_admin && (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 w-fit">
                            Super Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {/* Super Admin controls */}
                        {!isSuperAdmin ? (
                          <span className="text-xs text-gray-400 italic">
                            Read-only
                          </span>
                        ) : updating === member.id ? (
                          <Loader2 className="animate-spin text-gray-400" size={16} />
                        ) : (
                          <>
                            {/* Super Admin toggle */}
                            {member.is_super_admin ? (
                              <button
                                onClick={() =>
                                  updateRole(
                                    member.id,
                                    { isSuperAdmin: false },
                                    `Remove super admin status from ${
                                      member.full_name || member.email
                                    }?`
                                  )
                                }
                                disabled={isOnlySuperAdmin}
                                title={
                                  isOnlySuperAdmin
                                    ? 'Cannot remove the last super admin'
                                    : 'Remove super admin status'
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-yellow-700 hover:bg-yellow-50 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <ArrowDown size={12} />
                                {isSelf ? 'Step Down' : 'Remove Super'}
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  updateRole(
                                    member.id,
                                    { isSuperAdmin: true },
                                    `Make ${
                                      member.full_name || member.email
                                    } a super admin?`
                                  )
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-yellow-700 hover:bg-yellow-50 rounded-lg transition"
                              >
                                <ArrowUp size={12} />
                                Make Super
                              </button>
                            )}

                            {/* Admin toggle */}
                            {member.is_admin ? (
                              <button
                                onClick={() =>
                                  updateRole(
                                    member.id,
                                    { isAdmin: false },
                                    `Revoke admin access from ${
                                      member.full_name || member.email
                                    }?`
                                  )
                                }
                                disabled={isSelf}
                                title={
                                  isSelf
                                    ? 'You cannot revoke your own admin access'
                                    : 'Revoke admin access'
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Revoke Admin
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  updateRole(
                                    member.id,
                                    { isAdmin: true },
                                    `Grant admin access to ${
                                      member.full_name || member.email
                                    }?`
                                  )
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                Make Admin
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Link to Team Management */}
      <div className="mt-6 text-center">
        <a
          href="/admin/team"
          className="text-sm text-[#1e3a8a] hover:text-[#1e40af] font-semibold inline-flex items-center gap-1"
        >
          <UserPlus size={14} />
          Add or edit team members →
        </a>
      </div>
    </div>
  );
}