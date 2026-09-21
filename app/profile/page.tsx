// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Save,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
  Calendar,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase-browser';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  created_at: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load profile
  useEffect(() => {
    const load = async () => {
      try {
        // Ensure logged in
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?next=/profile');
          return;
        }

        const res = await fetch('/api/client/profile');
        if (!res.ok) throw new Error('Failed to load profile');

        const data = await res.json();
        setProfile(data.profile);
        setFullName(data.profile.full_name || '');
        setPhone(data.profile.phone || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, phone }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setProfile(data.profile);
      setSuccess(true);

      // Clear cached navbar info so it re-fetches
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('mima_user_info');
      }

      // Hide success message after 3s
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '—';

  const hasChanges =
    profile &&
    (fullName.trim() !== (profile.full_name || '') ||
      phone.trim() !== (profile.phone || ''));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
              <p className="text-blue-100 text-sm">
                Update your personal information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-6">
          {/* Account info card */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Account Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-900 break-all font-medium">
                    {profile?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Account Type</p>
                  <p className="text-gray-900 font-medium">
                    {profile?.is_admin ? 'Administrator' : 'Client'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <Calendar className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(profile?.created_at || null)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">
              Your email address cannot be changed from here. Contact support if
              you need to update it.
            </p>
          </div>

          {/* Edit form card */}
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="text-[#1e3a8a]" size={20} />
              Edit Personal Details
            </h2>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-start gap-2">
                <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>Profile updated successfully.</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  minLength={2}
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={14} /> Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +254 754 410 073"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-2">
                  We use this number to contact you about your policies and claims.
                </p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-gray-100">
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-[#dc2626] transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-all shadow-md"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}