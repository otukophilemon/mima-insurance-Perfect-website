'use client';

import { useState, FormEvent } from 'react';

interface Claim {
  tracking_number: string;
  claim_type: string;
  incident_date: string;
  status: string;
  created_at: string;
  claimant_name: string;
}

// Status progression used for the timeline
const STATUS_STEPS = [
  { key: 'submitted', label: 'Submitted', description: 'Claim received by MIMA' },
  { key: 'under_review', label: 'Under Review', description: 'Being assessed by our team' },
  { key: 'approved', label: 'Approved', description: 'Claim has been approved' },
  { key: 'paid', label: 'Paid', description: 'Payment has been processed' },
];

// Friendly display names for claim types
const CLAIM_TYPE_LABELS: Record<string, string> = {
  fire: 'Fire & Property',
  marine: 'Marine',
  money: 'Money',
  motor: 'Motor',
  'professional-indemnity': 'Professional Indemnity',
  health: 'Health',
  life: 'Life',
  travel: 'Travel',
  agriculture: 'Agriculture',
};

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setClaim(null);

    try {
      const res = await fetch(
        `/api/track?number=${encodeURIComponent(trackingNumber.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to find claim');
      }

      setClaim(data.claim);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const currentStep = claim ? getStepIndex(claim.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#0f172a] text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Track Your Claim</h1>
          <p className="text-gray-300 text-sm md:text-base">
            Enter your tracking number to see the current status of your claim.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. MIMA-79384603"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#dc2626] hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-60 text-sm whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Track Claim'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            Your tracking number was sent to you when your claim was submitted. It
            starts with <span className="font-mono font-semibold">MIMA-</span>
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
            <strong className="font-semibold">Not found: </strong>
            {error}
          </div>
        </div>
      )}

      {/* Result */}
      {claim && (
        <div className="max-w-2xl mx-auto px-4 mt-8 pb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Result header */}
            <div className="bg-gray-50 border-b px-6 py-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </div>
                <div className="font-mono font-semibold text-gray-900">
                  {claim.tracking_number}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Claim Type
                </div>
                <div className="font-medium text-gray-900">
                  {CLAIM_TYPE_LABELS[claim.claim_type] || claim.claim_type}
                </div>
              </div>
            </div>

            {/* Claimant + dates */}
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b text-sm">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Claimant
                </div>
                <div className="font-medium text-gray-900">{claim.claimant_name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Incident Date
                </div>
                <div className="font-medium text-gray-900">
                  {formatDate(claim.incident_date)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Claim Submitted
                </div>
                <div className="font-medium text-gray-900">
                  {formatDate(claim.created_at)}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="px-6 py-6">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-5">
                Progress
              </div>
              <div className="space-y-5">
                {STATUS_STEPS.map((step, idx) => {
                  const isComplete = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  const isFuture = idx > currentStep;

                  return (
                    <div key={step.key} className="flex gap-4">
                      {/* Dot + line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isComplete
                              ? 'bg-green-500 text-white'
                              : isCurrent
                                ? 'bg-[#dc2626] text-white ring-4 ring-red-100'
                                : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {isComplete ? '✓' : idx + 1}
                        </div>
                        {idx < STATUS_STEPS.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 mt-1 ${
                              isComplete ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                            style={{ minHeight: '24px' }}
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div className="pb-2 flex-1">
                        <div
                          className={`font-semibold text-sm ${
                            isFuture ? 'text-gray-400' : 'text-gray-900'
                          }`}
                        >
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 text-xs font-normal bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            isFuture ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special statuses (rejected / etc.) */}
            {!STATUS_STEPS.some((s) => s.key === claim.status) && (
              <div className="px-6 pb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                  <strong className="font-semibold">Status: </strong>
                  {claim.status}
                </div>
              </div>
            )}

            {/* Footer help */}
            <div className="bg-gray-50 border-t px-6 py-4 text-xs text-gray-500">
              Need help? Call us on <span className="font-semibold">+254 754 410 073</span>{' '}
              or email{' '}
              <a href="mailto:info@mimainsure.com" className="text-[#dc2626] hover:underline">
                info@mimainsure.com
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}