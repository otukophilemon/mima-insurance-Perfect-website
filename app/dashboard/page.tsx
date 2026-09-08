'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertCircle, CheckCircle, Clock, Edit2 } from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  premium: number;
  coverage: string;
}

interface Claim {
  id: string;
  type: string;
  date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  reference: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'policies' | 'claims'>('policies');

  const mockPolicies: Policy[] = [
    {
      id: '1',
      name: 'Auto Insurance - Honda Civic',
      type: 'Auto',
      status: 'active',
      startDate: '2023-01-15',
      endDate: '2026-01-15',
      premium: 1200,
      coverage: 'Comprehensive',
    },
    {
      id: '2',
      name: 'Home Insurance - 123 Main St',
      type: 'Home',
      status: 'active',
      startDate: '2022-06-01',
      endDate: '2025-06-01',
      premium: 1500,
      coverage: 'Full Coverage',
    },
    {
      id: '3',
      name: 'Life Insurance',
      type: 'Life',
      status: 'active',
      startDate: '2020-03-20',
      endDate: '2070-03-20',
      premium: 50,
      coverage: '$500,000',
    },
  ];

  const mockClaims: Claim[] = [
    {
      id: '1',
      type: 'Auto Accident',
      date: '2024-01-10',
      amount: 5000,
      status: 'approved',
      reference: 'CLM-00001',
    },
    {
      id: '2',
      type: 'Medical Expense',
      date: '2024-02-15',
      amount: 2500,
      status: 'pending',
      reference: 'CLM-00002',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'expired':
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'paid':
        return <CheckCircle size={16} className="inline mr-1" />;
      case 'pending':
        return <Clock size={16} className="inline mr-1" />;
      default:
        return <AlertCircle size={16} className="inline mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-blue-900 text-white py-8 border-b-4 border-orange-500">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 w-fit mb-4">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <h1 className="text-4xl font-bold">My Policy Dashboard</h1>
          <p className="text-blue-100 mt-2">Manage your policies and claims in one place</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
          <p className="text-gray-700">You have <strong>3 active policies</strong> and <strong>2 claims</strong> in your account.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b-2 border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-6 py-3 font-semibold border-b-4 transition ${
              activeTab === 'policies'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Policies
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-6 py-3 font-semibold border-b-4 transition ${
              activeTab === 'claims'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📄 Claims
          </button>
        </div>

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-4">
            {mockPolicies.map(policy => (
              <div key={policy.id} className="bg-white border-l-4 border-orange-500 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{policy.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">Policy ID: {policy.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(policy.status)} flex items-center`}>
                    {getStatusIcon(policy.status)}
                    {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Type</p>
                    <p className="font-semibold text-gray-900">{policy.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Coverage</p>
                    <p className="font-semibold text-gray-900">{policy.coverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Annual Premium</p>
                    <p className="font-semibold text-gray-900">${policy.premium}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Expires</p>
                    <p className="font-semibold text-gray-900">{policy.endDate}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold">
                    <FileText size={18} /> View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition font-semibold">
                    <Edit2 size={18} /> Edit Policy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            {mockClaims.map(claim => (
              <div key={claim.id} className="bg-white border-l-4 border-red-500 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{claim.type}</h3>
                    <p className="text-gray-600 text-sm mt-1">Reference: {claim.reference}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(claim.status)} flex items-center`}>
                    {getStatusIcon(claim.status)}
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Claim Date</p>
                    <p className="font-semibold text-gray-900">{claim.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Claim Amount</p>
                    <p className="font-semibold text-gray-900">${claim.amount}</p>
                  </div>
                  <div className="text-right">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold">
                      View Status
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center py-8">
              <Link href="/claim" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">
                <FileText size={20} /> File a New Claim
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}