// app/admin/team/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  UserCog,
  Mail,
  Info,
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
  team_bio: string | null;
  team_email: string | null;
  team_phone: string | null;
  team_whatsapp: string | null;
  team_photo: string | null;
  team_specialties: string[];
  team_experience_years: number | null;
  team_certifications: string[];
  team_display_order: number;
  team_active: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  name: '',
  email: '',
  slug: '',
  title: '',
  bio: '',
  phone: '',
  whatsapp: '',
  photo: '',
  specialties: '',
  experience_years: '',
  certifications: '',
  display_order: 0,
  active: true,
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMembers = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMembers(data.agents || []);

      const meRes = await fetch('/api/admin/admins');
      if (meRes.ok) {
        const meData = await meRes.json();
        setIsSuperAdmin(meData.isSuperAdmin === true);
      }
    } catch (error) {
      console.error('Load error:', error);
      setMessage({ type: 'error', text: 'Failed to load team' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
      return;
    }

    if (name === 'name' && !editingId) {
      setFormData({ ...formData, name: value, slug: generateSlug(value) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.full_name || '',
      email: member.email,
      slug: member.team_slug || '',
      title: member.team_title || '',
      bio: member.team_bio || '',
      phone: member.team_phone || member.phone || '',
      whatsapp: member.team_whatsapp || '',
      photo: member.team_photo || '',
      specialties: (member.team_specialties || []).join(', '),
      experience_years: member.team_experience_years?.toString() || '',
      certifications: (member.team_certifications || []).join(', '),
      display_order: member.team_display_order || 0,
      active: member.team_active !== false,
    });
    setEditingId(member.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        slug: formData.slug,
        title: formData.title,
        bio: formData.bio,
        phone: formData.phone || null,
        email_public: formData.email,
        whatsapp: formData.whatsapp || null,
        photo: formData.photo || null,
        specialties: formData.specialties
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        experience_years: formData.experience_years
          ? parseInt(formData.experience_years)
          : null,
        certifications: formData.certifications
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        display_order: formData.display_order,
        active: formData.active,
      };

      const url = editingId ? `/api/admin/team/${editingId}` : '/api/admin/team';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save team member');

      const successMsg = editingId
        ? 'Team member updated successfully!'
        : data.email_sent
          ? 'Team member added! Password reset email sent.'
          : 'Team member added! (Email may need to be re-sent manually)';

      setMessage({ type: 'success', text: successMsg });
      resetForm();
      loadMembers();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to save';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Remove ${name} from the team? Their account will be preserved but they will lose team status.`
      )
    )
      return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMessage({ type: 'success', text: 'Team member removed' });
      loadMembers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-gray-600">
            Manage MIMA team members. Team members are admins with full access.
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setFormData(EMPTY_FORM);
                setEditingId(null);
                setShowForm(true);
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all shadow-lg"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? 'Cancel' : 'Add Team Member'}
          </button>
        )}
      </div>

      {/* Read-only banner for non-super-admins */}
      {!isSuperAdmin && !loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3 text-sm text-blue-900">
          <Info size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong>Read-only view.</strong> Only super admins can add, edit, or
            remove team members. Contact a super admin to make changes.
          </div>
        </div>
      )}

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

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border-t-4 border-[#dc2626]">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {editingId ? 'Edit Team Member' : 'Add New Team Member'}
          </h2>

          {!editingId && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-start gap-2">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                A user account will be created automatically. The team member will
                receive a password reset email to set up their login.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Otuko Philemon"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={14} /> Login Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  disabled={!!editingId}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@mimainsure.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingId
                    ? 'Login email cannot be changed.'
                    : 'Password reset will be sent here'}
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Principal Broker & Founder"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug (URL identifier) *
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="otuko-philemon"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition font-mono text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0116 000 073"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+254116000073"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience_years"
                  min="0"
                  value={formData.experience_years}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="display_order"
                  min="0"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">Lower = appears first</p>
              </div>

              {/* Photo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Photo URL (optional)
                </label>
                <input
                  type="text"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  placeholder="/images/team/agent.jpg"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition font-mono text-sm"
                />
              </div>

              {/* Specialties */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specialties (comma-separated) *
                </label>
                <input
                  type="text"
                  name="specialties"
                  required
                  value={formData.specialties}
                  onChange={handleChange}
                  placeholder="Motor Insurance, Business Insurance, Life Insurance"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              {/* Certifications */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="ACII, Certified Risk Manager"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio *
                </label>
                <textarea
                  name="bio"
                  required
                  rows={5}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="A paragraph about this team member..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                />
              </div>

              {/* Active */}
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Show on public website
                </span>
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
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    {editingId ? 'Update Team Member' : 'Add Team Member'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members list */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="text-[#1e3a8a]" size={22} />
            All Team Members ({members.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-[#dc2626] mb-3" size={32} />
            <p className="text-gray-500">Loading team...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <UserCog className="mx-auto text-gray-300 mb-4" size={56} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              No team members yet
            </h3>
            <p className="text-gray-500 text-sm">
              Click &quot;Add Team Member&quot; to start building your team
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Team Member
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Contact
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Specialties
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {getInitials(member.full_name || member.email)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.full_name || 'Unnamed'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {member.team_title || 'No title'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">{member.email}</div>
                      {member.team_phone && (
                        <div className="text-xs text-gray-400">
                          {member.team_phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(member.team_specialties || [])
                          .slice(0, 2)
                          .map((spec) => (
                            <span
                              key={spec}
                              className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-[#1e3a8a] text-[10px] font-semibold"
                            >
                              {spec}
                            </span>
                          ))}
                        {(member.team_specialties || []).length > 2 && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold">
                            +{(member.team_specialties || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          member.team_active !== false
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {member.team_active !== false ? (
                          <Eye size={12} />
                        ) : (
                          <EyeOff size={12} />
                        )}
                        {member.team_active !== false ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isSuperAdmin ? (
                        <span className="text-xs text-gray-400 italic">
                          Read-only
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          {!member.is_super_admin && (
                            <button
                              onClick={() =>
                                handleDelete(
                                  member.id,
                                  member.full_name || member.email
                                )
                              }
                              disabled={deletingId === member.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#dc2626] hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            >
                              {deletingId === member.id ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              Remove
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Link to Admin Management */}
      <div className="mt-6 text-center">
        <Link
          href="/admin/admins"
          className="text-sm text-[#1e3a8a] hover:text-[#1e40af] font-semibold inline-flex items-center gap-1"
        >
          Manage admin access →
        </Link>
      </div>
    </div>
  );
}