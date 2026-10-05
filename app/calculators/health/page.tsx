// app/calculators/health/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  Info,
  Users,
  User,
  Users2,
  CheckCircle,
  XCircle,
  MessageSquare,
  PhoneCall,
  TrendingUp,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY } from '@/data/company';
import {
  calculateHealthPremium,
  formatKES,
  type HealthCoverLevel,
  type FamilySize,
} from '@/lib/calculators';

const COVER_LEVELS: { value: HealthCoverLevel; label: string; description: string }[] = [
  {
    value: 'inpatient',
    label: 'Inpatient Only',
    description: 'Hospital-only cover',
  },
  {
    value: 'comprehensive',
    label: 'Comprehensive',
    description: 'Inpatient + outpatient',
  },
  {
    value: 'executive',
    label: 'Executive',
    description: 'Premium cover with extras',
  },
];

const FAMILY_SIZES: { value: FamilySize; label: string; description: string; icon: any }[] = [
  { value: 'single', label: 'Single', description: '1 adult', icon: User },
  { value: 'couple', label: 'Couple', description: '2 adults', icon: Users },
  { value: 'family', label: 'Family', description: '2 adults + up to 4 children', icon: Users2 },
];

export default function HealthCalculatorPage() {
  const [age, setAge] = useState('');
  const [coverLevel, setCoverLevel] = useState<HealthCoverLevel>('comprehensive');
  const [familySize, setFamilySize] = useState<FamilySize>('single');

  const ageNum = parseInt(age, 10) || 0;
  const result = ageNum >= 18 && ageNum <= 100
    ? calculateHealthPremium({
        age: ageNum,
        coverLevel,
        familySize,
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 text-red-100 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft size={16} />
            All Calculators
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Heart className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Health Insurance <span className="text-yellow-300">Estimator</span>
              </h1>
              <p className="text-red-100 text-sm md:text-base mt-1">
                Get a realistic premium range in seconds
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
                  <TrendingUp className="text-red-600" size={20} />
                  Your Details
                </h2>

                <div className="space-y-6">
                  {/* Age */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age (principal member) *
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 32"
                      min="18"
                      max="100"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition text-lg font-semibold"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Age is the biggest driver of health insurance cost
                    </p>
                  </div>

                  {/* Cover level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Cover Level *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {COVER_LEVELS.map((level) => {
                        const isSelected = coverLevel === level.value;
                        return (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => setCoverLevel(level.value)}
                            className={`text-left p-4 rounded-2xl border-2 transition-all ${
                              isSelected
                                ? 'border-red-500 bg-red-50 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            <div
                              className={`text-sm font-bold mb-1 ${
                                isSelected ? 'text-red-700' : 'text-gray-900'
                              }`}
                            >
                              {level.label}
                            </div>
                            <div className="text-xs text-gray-600">
                              {level.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Family size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Who Needs Cover? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {FAMILY_SIZES.map((size) => {
                        const Icon = size.icon;
                        const isSelected = familySize === size.value;
                        return (
                          <button
                            key={size.value}
                            type="button"
                            onClick={() => setFamilySize(size.value)}
                            className={`text-left p-4 rounded-2xl border-2 transition-all ${
                              isSelected
                                ? 'border-red-500 bg-red-50 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            <Icon
                              size={20}
                              className={`mb-2 ${
                                isSelected ? 'text-red-600' : 'text-gray-500'
                              }`}
                            />
                            <div
                              className={`text-sm font-bold mb-1 ${
                                isSelected ? 'text-red-700' : 'text-gray-900'
                              }`}
                            >
                              {size.label}
                            </div>
                            <div className="text-xs text-gray-600">
                              {size.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Result sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {result ? (
                  <div className="bg-red-600 text-white rounded-3xl shadow-xl p-6 md:p-8">
                    <div className="text-xs uppercase tracking-wider opacity-80 mb-2">
                      Estimated Annual Premium
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-3">
                      {formatKES(result.minPremium)}
                    </div>
                    <div className="text-lg opacity-90">
                      to {formatKES(result.maxPremium)}
                    </div>
                    <div className="text-xs opacity-80 mt-4 pb-3 border-b border-white/20">
                      {result.coverLevelLabel} · {result.familySizeLabel} · Age {result.ageBand}
                    </div>

                    <div className="text-sm mt-3">
                      Typical annual limit:{' '}
                      <strong>{formatKES(result.annualLimit)}</strong>
                    </div>

                    <Link
                      href="/quote"
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 hover:bg-gray-100 font-semibold rounded-full transition-all shadow-lg"
                    >
                      Get Real Quote
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
                    <Heart className="text-gray-300 mx-auto mb-3" size={48} />
                    <h3 className="font-bold text-gray-700 mb-2">
                      Enter your age
                    </h3>
                    <p className="text-sm text-gray-500">
                      Fill in the form to see your estimated premium range
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
                        Estimate range only
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Health insurance in Kenya varies significantly between insurers,
                        hospital tiers, and inclusions. This range reflects typical market
                        pricing — your actual premium will depend on the insurer and specific
                        benefits selected.
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
                        <PhoneCall className="text-red-600" size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">
                          Call
                        </div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-red-600">
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

          {/* Age breakdown table */}
          {result && (
            <div className="mt-14 bg-white rounded-3xl shadow-md p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                How premium changes with age
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Same cover ({result.coverLevelLabel} · {result.familySizeLabel}) at different ages
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Age Band</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Est. Premium (annual)</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.ageBands.map((band) => {
                      const isCurrent = band.band === result.ageBand;
                      return (
                        <tr
                          key={band.band}
                          className={`border-b border-gray-100 ${
                            isCurrent ? 'bg-red-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {band.band}
                            {isCurrent && (
                              <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            {formatKES(band.minMultiplier)} – {formatKES(band.maxMultiplier)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500 hidden md:table-cell">
                            {((band.minMultiplier / result.ageBands[1].minMultiplier) * 100).toFixed(0)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inclusions / Exclusions */}
          {result && (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  Typically Included
                </h3>
                <ul className="space-y-2">
                  {result.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <XCircle className="text-red-600" size={20} />
                  Usually Excluded
                </h3>
                <ul className="space-y-2">
                  {result.exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 p-8 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3">
              Ready to get covered?
            </h3>
            <p className="text-red-100 mb-6 max-w-lg mx-auto">
              Our brokers will compare health insurance options from Kenya&apos;s top insurers
              and find the best plan for you and your family.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 hover:bg-gray-100 font-semibold rounded-full transition-all shadow-lg"
            >
              Get Your Free Quote
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}