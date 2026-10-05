// app/calculators/travel/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plane,
  ArrowLeft,
  ArrowRight,
  Info,
  Calendar,
  Users,
  CheckCircle,
  MessageSquare,
  PhoneCall,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY } from '@/data/company';
import {
  calculateTravelPremium,
  formatKES,
  type TravelDestination,
  type TravelCoverLevel,
  type TravelerAgeGroup,
} from '@/lib/calculators';

const DESTINATIONS: { value: TravelDestination; label: string }[] = [
  { value: 'domestic', label: 'Within Kenya' },
  { value: 'east-africa', label: 'East Africa (EAC)' },
  { value: 'africa', label: 'Africa' },
  { value: 'worldwide-excl-usa', label: 'Worldwide (excl. USA)' },
  { value: 'worldwide-incl-usa', label: 'Worldwide (incl. USA)' },
];

const COVER_LEVELS: { value: TravelCoverLevel; label: string; description: string }[] = [
  { value: 'basic', label: 'Basic', description: 'Essential medical + baggage' },
  { value: 'standard', label: 'Standard', description: 'Most popular choice' },
  { value: 'comprehensive', label: 'Comprehensive', description: 'Full coverage + extras' },
];

const AGE_GROUPS: { value: TravelerAgeGroup; label: string }[] = [
  { value: 'child', label: 'Child (0-17)' },
  { value: 'adult', label: 'Adult (18-64)' },
  { value: 'senior', label: 'Senior (65-75)' },
  { value: 'elderly', label: 'Elderly (76+)' },
];

export default function TravelCalculatorPage() {
  const [destination, setDestination] = useState<TravelDestination>('east-africa');
  const [days, setDays] = useState('10');
  const [coverLevel, setCoverLevel] = useState<TravelCoverLevel>('standard');
  const [ageGroup, setAgeGroup] = useState<TravelerAgeGroup>('adult');
  const [travelerCount, setTravelerCount] = useState('1');

  const daysNum = parseInt(days, 10) || 0;
  const travelersNum = parseInt(travelerCount, 10) || 0;
  const hasData = daysNum >= 1 && travelersNum >= 1;

  const result = hasData
    ? calculateTravelPremium({
        destination,
        days: daysNum,
        coverLevel,
        ageGroup,
        travelerCount: travelersNum,
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft size={16} />
            All Calculators
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Plane className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Travel Insurance <span className="text-yellow-300">Calculator</span>
              </h1>
              <p className="text-emerald-100 text-sm md:text-base mt-1">
                Estimate your travel cover in seconds
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
                  <TrendingUp className="text-emerald-600" size={20} />
                  Your Trip
                </h2>

                <div className="space-y-6">
                  {/* Destination */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin size={14} /> Destination *
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value as TravelDestination)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white"
                    >
                      {DESTINATIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Days + travelers */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar size={14} /> Trip Duration (days) *
                      </label>
                      <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        placeholder="e.g. 10"
                        min="1"
                        max="180"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Users size={14} /> Number of Travelers *
                      </label>
                      <input
                        type="number"
                        value={travelerCount}
                        onChange={(e) => setTravelerCount(e.target.value)}
                        placeholder="e.g. 1"
                        min="1"
                        max="20"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                      />
                      {travelersNum >= 2 && (
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                          ✓ Group discount applied ({travelersNum >= 4 ? '10%' : '5%'})
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Age group */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Traveler Age Group *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {AGE_GROUPS.map((ag) => {
                        const isSelected = ageGroup === ag.value;
                        return (
                          <button
                            key={ag.value}
                            type="button"
                            onClick={() => setAgeGroup(ag.value)}
                            className={`p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {ag.label}
                          </button>
                        );
                      })}
                    </div>
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
                                ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            <div
                              className={`text-sm font-bold mb-1 ${
                                isSelected ? 'text-emerald-700' : 'text-gray-900'
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
                </div>
              </div>
            </div>

            {/* Result sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {result ? (
                  <div className="bg-emerald-600 text-white rounded-3xl shadow-xl p-6 md:p-8">
                    <div className="text-xs uppercase tracking-wider opacity-80 mb-2">
                      Estimated Premium
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-3">
                      {formatKES(result.minPremium)}
                    </div>
                    <div className="text-lg opacity-90">
                      to {formatKES(result.maxPremium)}
                    </div>
                    <div className="text-xs opacity-80 mt-4 pb-3 border-b border-white/20">
                      {result.coverLevelLabel} · {result.travelerCount} traveler
                      {result.travelerCount > 1 ? 's' : ''} · {result.days} days
                    </div>

                    <div className="text-xs mt-3 opacity-90">
                      {result.destinationLabel}
                    </div>

                    <Link
                      href="/quote"
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-700 hover:bg-gray-100 font-semibold rounded-full transition-all shadow-lg"
                    >
                      Get Real Quote
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
                    <Plane className="text-gray-300 mx-auto mb-3" size={48} />
                    <h3 className="font-bold text-gray-700 mb-2">
                      Enter trip details
                    </h3>
                    <p className="text-sm text-gray-500">
                      Fill in the form to see your estimate
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
                        Travel insurance premiums vary by insurer, medical history,
                        and any optional add-ons (like adventure sports). This range
                        reflects typical market pricing.
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
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 transition group"
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                        <PhoneCall className="text-emerald-600" size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">
                          Call
                        </div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600">
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

          {/* What's covered */}
          {result && (
            <div className="mt-14 bg-white rounded-3xl shadow-md p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                What&apos;s covered ({result.coverLevelLabel} Plan)
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Standard benefits on this cover level
              </p>

              <ul className="grid md:grid-cols-2 gap-3">
                {result.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-700 bg-emerald-50 p-3 rounded-xl"
                  >
                    <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500 italic">
                Benefits shown are typical for this cover level in the Kenyan market. Actual
                limits and inclusions vary by insurer.
              </div>
            </div>
          )}

          {/* SEO content */}
          <div className="mt-14 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How travel insurance premiums are calculated
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Travel insurance in Kenya is priced based on <strong>where you&apos;re going</strong>,{' '}
                <strong>how long you&apos;ll be away</strong>, and <strong>what level of cover</strong>{' '}
                you need. Destinations with higher medical costs — like the USA, Canada, and Europe —
                command higher premiums because emergency treatment is expensive there.
              </p>
              <p>
                <strong>Duration</strong> scales the premium linearly: a 20-day trip typically costs
                about twice a 10-day trip. Most insurers offer a minimum trip length of 5 days.
              </p>
              <p>
                <strong>Age matters</strong> for medical cover. Children cost about half an adult&apos;s
                premium, but seniors (65+) often pay 2–3× due to increased medical risk.
              </p>
              <p>
                <strong>Group discounts</strong> apply when you cover multiple travelers: 5% off for
                2–3 people, 10% off for 4 or more.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-14 p-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3">
              Ready to travel covered?
            </h3>
            <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
              Get a firm travel insurance quote from MIMA — we&apos;ll find the best cover
              from Kenya&apos;s top travel insurers.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-700 hover:bg-gray-100 font-semibold rounded-full transition-all shadow-lg"
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