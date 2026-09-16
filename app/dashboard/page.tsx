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
  Calendar,
  TrendingUp,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase-browser';

interface UserProfile {
  email: string;
  full_name?: string;
  phone?: string;
}

interface Policy {
  id: number;
  policy_number: string;
  policy_type: string;
  coverage_description: string;
  annual_premium: number;
  start_date: string;
  expiry_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
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

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const res = await fetch('/api/client/policies');
        const data = await res.json();
        if (res.ok) {
          setPolicies(data.policies || []);
        } else {
          console.error('Failed to load policies:', data.error);
        }
      } catch (error) {
        console.error('Failed to fetch policies:', error);
      } finally {
        setLoadingPolicies(false);
      }
    };

    if (!loading && user) {
      loadPolicies();
    }
  }, [loading, user]);

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

  const formatKES = (amount: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
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
  const activePolicies = policies.filter((p) => p.status === 'active').length;
  const totalPremium = policies.reduce((sum, p) => sum + p.annual_premium, 0);
  const expiringSoon = policies.filter((p) => {
    const days = getDaysUntilExpiry(p.expiry_date);
    return days >= 0 && days <= 30 && p.status === 'active';
  }).length;

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
                <span className="text-3xl font-bold text-gray-900">
                  {loadingPolicies ? '—' : activePolicies}
                </span>
              </div>
              <p className="text-gray-600 text-sm">Active Policies</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#dc2626]">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-[#dc2626]" size={28} />
                <span className="text-2xl font-bold text-gray-900">
                  {loadingPolicies ? '—' : formatKES(totalPremium)}
                </span>
              </div>
              <p className="text-gray-600 text-sm">Total Annual Premium</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-orange-500" size={28} />
                <span className="text-3xl font-bold text-gray-900">
                  {loadingPolicies ? '—' : expiringSoon}
                </span>
              </div>
              <p className="text-gray-600 text-sm">Expiring in 30 days</p>
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

                {loadingPolicies ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : policies.length === 0 ? (
                  // Empty state
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
                ) : (
                  // Policies list
                  <div className="space-y-4">
                    {policies.map((policy) => {
                      const daysLeft = getDaysUntilExpiry(policy.expiry_date);
                      const isExpiringSoon = daysLeft >= 0 && daysLeft <= 30;

                      return (
                        <div
                          key={policy.id}
                          className="border border-gray-200 rounded-2xl p-6 hover:border-[#1e3a8a] hover:shadow-md transition-all"
                        >
                          {/* Top: Type + Status */}
                          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center">
                                <Shield className="text-white" size={24} />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {policy.policy_type} Insurance
                                </h3>
                                <p className="text-xs text-gray-500 font-mono">
                                  {policy.policy_number}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(policy.status)}`}
                            >
                              {policy.status}
                            </span>
                          </div>

                          {/* Middle: Details grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-100 my-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Annual Premium</p>
                              <p className="font-bold text-gray-900">
                                {formatKES(policy.annual_premium)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Start Date</p>
                              <p className="font-medium text-gray-900 text-sm">
                                {formatDate(policy.start_date)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                              <p className="font-medium text-gray-900 text-sm">
                                {formatDate(policy.expiry_date)}
                              </p>
                            </div>
                          </div>

                          {/* Coverage */}
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Coverage</p>
                            <p className="text-sm text-gray-700">
                              {policy.coverage_description}
                            </p>
                          </div>

                          {/* Expiry warning */}
                          {isExpiringSoon && (
                            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800 mb-4">
                              <Clock size={16} />
                              <span>
                                This policy expires in{' '}
                                <strong>{daysLeft} days</strong>. Contact us for renewal.
                              </span>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar size={14} />
                              Added on {formatDate(policy.created_at)}
                            </div>
                            <Link
                              href="/contact"
                              className="text-sm font-semibold text-[#dc2626] hover:text-[#b91c1c] transition"
                            >
                              Contact Support →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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