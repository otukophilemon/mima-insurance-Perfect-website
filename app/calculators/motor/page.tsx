// app/calculators/motor/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  ArrowLeft,
  ArrowRight,
  Info,
  TrendingUp,
  ShieldCheck,
  MessageSquare,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY } from '@/data/company';
import {
  MOTOR_RATES,
  calculateMotorPremium,
  formatKES,
  formatPercent,
} from '@/lib/calculators';

export default function MotorCalculatorPage() {
  const [vehicleValue, setVehicleValue] = useState('');
  const [vehicleAge, setVehicleAge] = useState('');
  const [vehicleType, setVehicleType] = useState<
    'private' | 'commercial' | 'psv' | 'motorcycle'
  >('private');
  const [ncdPercent, setNcdPercent] = useState(0);
  const [thirdPartyOnly, setThirdPartyOnly] = useState(false);
  const [includeWindscreen, setIncludeWindscreen] = useState(false);
  const [includeExcessProtector, setIncludeExcessProtector] = useState(false);
  const [includePoliticalViolence, setIncludePoliticalViolence] = useState(false);

  const value = parseFloat(vehicleValue) || 0;
  const age = parseFloat(vehicleAge) || 0;

  const result =
    value > 0
      ? calculateMotorPremium({
          vehicleValue: value,
          vehicleAge: age,
          vehicleType,
          ncdPercent,
          thirdPartyOnly,
          includeWindscreen,
          includeExcessProtector,
          includePoliticalViolence,
        })
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft size={16} />
            All Calculators
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Car className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Motor Insurance <span className="text-yellow-400">Calculator</span>
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                Estimate your premium in seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-[#1e3a8a]" size={20} />
                  Vehicle Details
                </h2>

                <div className="space-y-5">
                  {/* Vehicle Value */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vehicle Value (KES) *
                    </label>
                    <input
                      type="number"
                      value={vehicleValue}
                      onChange={(e) => setVehicleValue(e.target.value)}
                      placeholder="e.g. 1500000"
                      min="0"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition text-lg font-semibold"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the current market value of your vehicle
                    </p>
                  </div>

                  {/* Age + Type */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vehicle Age (years) *
                      </label>
                      <input
                        type="number"
                        value={vehicleAge}
                        onChange={(e) => setVehicleAge(e.target.value)}
                        placeholder="e.g. 3"
                        min="0"
                        max="50"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vehicle Type *
                      </label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value as any)}
                        disabled={thirdPartyOnly}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="private">Private Car</option>
                        <option value="commercial">Commercial Vehicle</option>
                        <option value="psv">PSV (Matatu / Taxi)</option>
                        <option value="motorcycle">Motorcycle</option>
                      </select>
                    </div>
                  </div>

                  {/* NCD */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      No Claim Discount (NCD)
                    </label>
                    <select
                      value={ncdPercent}
                      onChange={(e) => setNcdPercent(parseFloat(e.target.value))}
                      disabled={thirdPartyOnly}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      {MOTOR_RATES.ncdOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      If you haven&apos;t claimed in previous years, you may be
                      eligible for a discount
                    </p>
                  </div>

                  {/* Add-ons */}
                  <div className="pt-2 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 mt-3">
                      Cover Options
                    </h3>
                    <div className="space-y-3">
                      <CheckOption
                        label="Third-Party Only (skip comprehensive)"
                        subLabel="Basic cover for damage to others"
                        checked={thirdPartyOnly}
                        onChange={setThirdPartyOnly}
                      />
                      {!thirdPartyOnly && (
                        <>
                          <CheckOption
                            label="Windscreen Cover"
                            subLabel="+KES 15,000 flat"
                            checked={includeWindscreen}
                            onChange={setIncludeWindscreen}
                          />
                          <CheckOption
                            label="Excess Protector"
                            subLabel="+KES 5,000 flat"
                            checked={includeExcessProtector}
                            onChange={setIncludeExcessProtector}
                          />
                          <CheckOption
                            label="Political Violence & Terrorism"
                            subLabel="+0.25% of vehicle value"
                            checked={includePoliticalViolence}
                            onChange={setIncludePoliticalViolence}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Result sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {/* Result card */}
                {result ? (
                  <div className="bg-[#1e3a8a] text-white rounded-3xl shadow-xl p-6 md:p-8">
                    <div className="text-xs uppercase tracking-wider opacity-80 mb-2">
                      Estimated Premium
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-1">
                      {formatKES(result.totalPremium)}
                    </div>
                    <div className="text-xs opacity-80 mb-6">
                      Per year · {thirdPartyOnly ? 'Third-Party Only' : 'Comprehensive'}
                    </div>

                    {!thirdPartyOnly && (
                      <>
                        <div className="text-xs opacity-80 mb-2 pb-2 border-b border-white/20">
                          Effective Rate: {formatPercent(result.effectiveRate)}
                        </div>

                        <div className="space-y-2 text-sm">
                          <Row
                            label="Base Premium"
                            value={formatKES(result.basePremium)}
                          />
                          {result.ncdDiscount > 0 && (
                            <Row
                              label="NCD Discount"
                              value={`− ${formatKES(result.ncdDiscount)}`}
                              highlight="green"
                            />
                          )}
                          {result.addonWindscreen > 0 && (
                            <Row
                              label="Windscreen"
                              value={`+ ${formatKES(result.addonWindscreen)}`}
                            />
                          )}
                          {result.addonExcessProtector > 0 && (
                            <Row
                              label="Excess Protector"
                              value={`+ ${formatKES(result.addonExcessProtector)}`}
                            />
                          )}
                          {result.addonPoliticalViolence > 0 && (
                            <Row
                              label="Political Violence"
                              value={`+ ${formatKES(result.addonPoliticalViolence)}`}
                            />
                          )}
                          <div className="pt-2 border-t border-white/20 space-y-2">
                            <Row
                              label="Training Levy (0.2%)"
                              value={formatKES(result.trainingLevy)}
                              small
                            />
                            <Row
                              label="PHCF (0.2%)"
                              value={formatKES(result.phcf)}
                              small
                            />
                            <Row
                              label="IRA Levy (0.15%)"
                              value={formatKES(result.iraLevy)}
                              small
                            />
                            <Row
                              label="Stamp Duty"
                              value={formatKES(result.stampDuty)}
                              small
                            />
                          </div>
                        </div>

                        {result.isBelowMinimum && (
                          <div className="mt-4 p-3 bg-yellow-400/20 border border-yellow-300/40 rounded-lg text-xs">
                            <strong>Note:</strong> Premium was below the KES
                            15,000 industry minimum, so we&apos;ve applied the
                            minimum.
                          </div>
                        )}
                      </>
                    )}

                    {/* CTA */}
                    <Link
                      href="/quote"
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all shadow-lg"
                    >
                      Get Real Quote
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
                    <Car className="text-gray-300 mx-auto mb-3" size={48} />
                    <h3 className="font-bold text-gray-700 mb-2">
                      Enter vehicle details
                    </h3>
                    <p className="text-sm text-gray-500">
                      Fill in the form on the left to see your estimated premium
                    </p>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-orange-400">
                  <div className="flex items-start gap-3">
                    <Info
                      className="text-orange-500 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">
                        Estimate only
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        This is a general estimate based on industry-standard
                        rates. Final premium depends on the specific insurer,
                        your claims history, and underwriting factors.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Help card */}
                <div className="bg-white rounded-2xl shadow-md p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Need help?
                  </h3>
                  <div className="space-y-2">
                    <a
                      href={`tel:${COMPANY.offices[0].phoneLink}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition group"
                    >
                      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                        <PhoneCall className="text-[#dc2626]" size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">
                          Call
                        </div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-[#dc2626]">
                          {COMPANY.offices[0].phone}
                        </div>
                      </div>
                    </a>
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp.replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition group"
                    >
                      <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                        <MessageSquare className="text-green-600" size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">
                          WhatsApp
                        </div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-green-600">
                          Chat now
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO content below the fold */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How motor insurance premiums are calculated in Kenya
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-4">
              <p>
                Motor insurance premiums in Kenya are calculated based on
                several factors, the most important being your{' '}
                <strong>vehicle&apos;s current market value</strong>. Insurance
                companies apply a{' '}
                <strong>base rate</strong> to this value — typically between{' '}
                <strong>3.5% and 5% for private cars</strong>, higher for
                commercial vehicles and PSVs.
              </p>
              <p>
                Additional loadings apply for <strong>vehicle age</strong>{' '}
                (older vehicles cost slightly more to insure), and{' '}
                <strong>no-claim discounts (NCD)</strong> reward drivers who
                haven&apos;t filed claims — up to 20% off your premium.
              </p>
              <p>
                On top of the base premium, insurers add{' '}
                <strong>government levies</strong>: the Training Levy (0.2%),
                Policy Holders Compensation Fund (0.2%), IRA Levy (0.15%), and
                Stamp Duty (KES 40). These fund industry oversight and the
                compensation fund that protects policyholders if an insurer
                fails.
              </p>
              <h3 className="text-lg font-bold text-gray-900 mt-6">
                What this calculator covers
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Comprehensive and Third-Party Only cover</li>
                <li>Private, commercial, PSV, and motorcycle rates</li>
                <li>Vehicle age loadings</li>
                <li>No Claim Discounts up to 20%</li>
                <li>Optional windscreen, excess protector, and political violence cover</li>
                <li>All government levies and stamp duty</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-10 p-8 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-3xl text-white text-center">
              <h3 className="text-2xl font-bold mb-3">
                Ready to get insured?
              </h3>
              <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                Let our brokers find you the best rate from Kenya&apos;s top insurers.
                Free consultation, no obligation.
              </p>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all shadow-lg"
              >
                Get Your Free Quote
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ============================================
// Helper components
// ============================================

function CheckOption({
  label,
  subLabel,
  checked,
  onChange,
}: {
  label: string;
  subLabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition border border-gray-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded accent-[#1e3a8a]"
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {subLabel && (
          <div className="text-xs text-gray-500 mt-0.5">{subLabel}</div>
        )}
      </div>
    </label>
  );
}

function Row({
  label,
  value,
  small,
  highlight,
}: {
  label: string;
  value: string;
  small?: boolean;
  highlight?: 'green';
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`opacity-80 ${small ? 'text-xs' : ''}`}>{label}</span>
      <span
        className={`font-semibold ${small ? 'text-xs' : ''} ${
          highlight === 'green' ? 'text-green-300' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}