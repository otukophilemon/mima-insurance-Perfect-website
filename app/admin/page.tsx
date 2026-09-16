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
} from 'lucide-react';

interface Stats {
  totalPolicies: number;
  activePolicies: number;
  totalClients: number;
  expiringSoon: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalPolicies: 0,
    activePolicies: 0,
    totalClients: 0,
    expiringSoon: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/policies');
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        const policies = data.policies || [];
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        const active = policies.filter((p: { status: string }) => p.status === 'active');
        const expiring = active.filter((p: { expiry_date: string }) => {
          const expiry = new Date(p.expiry_date);
          return expiry >= now && expiry <= thirtyDaysFromNow;
        });

        setStats({
          totalPolicies: policies.length,
          activePolicies: active.length,
          totalClients: new Set(policies.map((p: { user_id: string }) => p.user_id)).size,
          expiringSoon: expiring.length,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Overview of MIMA Insurance Brokers policies and clients
        </p>
      </div>

      {/* Quick action */}
      <div className="mb-8">
        <Link
          href="/admin/policies"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all shadow-lg"
        >
          <Plus size={18} />
          Add New Policy
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#1e3a8a]">
          <div className="flex items-center justify-between mb-3">
            <FileText className="text-[#1e3a8a]" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats.totalPolicies}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Policies</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="text-green-500" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats.activePolicies}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Active Policies</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#dc2626]">
          <div className="flex items-center justify-between mb-3">
            <Users className="text-[#dc2626]" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats.totalClients}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Clients</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-3">
            <Clock className="text-orange-500" size={26} />
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '—' : stats.expiringSoon}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Expiring in 30 days</p>
        </div>
      </div>

      {/* Info section */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="text-[#1e3a8a]" size={22} />
          Getting Started
        </h2>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start gap-3">
            <span className="font-bold text-[#dc2626] mt-0.5">1.</span>
            <span>
              Click <strong>Add New Policy</strong> to create a policy for a client.
            </span>
          </p>
          <p className="flex items-start gap-3">
            <span className="font-bold text-[#dc2626] mt-0.5">2.</span>
            <span>
              Enter the client&apos;s email address — they must already have an account.
            </span>
          </p>
          <p className="flex items-start gap-3">
            <span className="font-bold text-[#dc2626] mt-0.5">3.</span>
            <span>
              Once added, the client can log in to their dashboard and see the policy.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
