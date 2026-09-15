// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  User,
  Mail,
  Phone,
  Shield,
  Plus,
  Clock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase-browser';

interface UserProfile {
  email: string;
  full_name?: string;
  phone?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        setUser({
          email: user.email || '',
          full_name: user.user_metadata?.full_name,
          phone: user.user_metadata?.phone,
        });
      } catch (error) {
        console.error('Failed to load user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayName = user.full_name || user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Welcome back,</p>
                <h1 className="text-3xl font-bold">{displayName}</h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 backdrop-blur text-white font-semibold rounded-full transition-all border border-white/20"
            >
              <LogOut size={18} />
              {loggingOut ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#1e3a8a]">
              <div className="flex items-center justify-between mb-2">
                <Shield className="text-[#1e3a8a]" size={28} />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <p className="text-gray-600 text-sm">Active Policies</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#dc2626]">
              <div className="flex items-center justify-between mb-2">
                <FileText className="text-[#dc2626]" size={28} />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <p className="text-gray-600 text-sm">Active Claims</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-green-500" size={28} />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <p className="text-gray-600 text-sm">Pending Actions</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Policies */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <LayoutDashboard className="text-[#1e3a8a]" size={24} />
                    My Policies
                  </h2>
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold rounded-full transition"
                  >
                    <Plus size={16} />
                    Get a Quote
                  </Link>
                </div>

                {/* Empty state */}
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                  <Shield className="text-gray-300 mx-auto mb-4" size={56} />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    No policies yet
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    You don&apos;t have any active insurance policies with MIMA yet.
                    Get started by requesting a free quote.
                  </p>
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-full transition"
                  >
                    Get Your First Quote
                  </Link>
                </div>
              </div>

              {/* Claims section */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <FileText className="text-[#dc2626]" size={24} />
                  My Claims
                </h2>

                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                  <FileText className="text-gray-300 mx-auto mb-4" size={56} />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    No claims filed
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    You haven&apos;t filed any claims. If you need to file one,
                    our team is here to help.
                  </p>
                  <Link
                    href="/claim"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition"
                  >
                    File a Claim
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Profile */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="text-[#1e3a8a]" size={20} />
                  My Profile
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900 break-all">{user.email}</p>
                    </div>
                  </div>

                  {user.full_name && (
                    <div className="flex items-start gap-3">
                      <User className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="text-sm text-gray-900">{user.full_name}</p>
                      </div>
                    </div>
                  )}

                  {user.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 mt-6 pt-6">
                  <Link
                    href="/contact"
                    className="block w-full text-center px-4 py-2 border-2 border-gray-200 hover:border-[#1e3a8a] hover:text-[#1e3a8a] text-gray-700 font-semibold rounded-full text-sm transition"
                  >
                    Need Help? Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}