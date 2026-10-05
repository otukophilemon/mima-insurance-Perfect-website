// app/calculators/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Car,
  Heart,
  Plane,
  Calculator,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Insurance Calculators Kenya | Free Premium Estimators | MIMA',
  description:
    'Free online insurance calculators for Kenya. Estimate motor, health, and travel insurance premiums instantly. No signup required.',
  keywords: [
    'insurance calculator Kenya',
    'motor insurance calculator',
    'health insurance estimator',
    'travel insurance calculator',
    'insurance premium calculator Nairobi',
  ],
  openGraph: {
    title: 'Free Insurance Calculators | MIMA Insurance Brokers',
    description:
      'Estimate your insurance premium in seconds. Motor, health, and travel calculators available.',
    type: 'website',
  },
};

const CALCULATORS = [
  {
    href: '/calculators/motor',
    title: 'Motor Insurance Calculator',
    description:
      'Estimate your comprehensive or third-party motor insurance premium. Includes NCD discounts, windscreen cover, and political violence.',
    icon: Car,
    gradient: 'from-blue-500 to-blue-600',
    available: true,
  },
    {
    href: '/calculators/health',
    title: 'Health Insurance Estimator',
    description:
      'Estimate your medical insurance premium. Compare inpatient, comprehensive, and executive cover for individuals or families.',
    icon: Heart,
    gradient: 'from-red-500 to-red-600',
    available: true,
  },
    {
    href: '/calculators/travel',
    title: 'Travel Insurance Calculator',
    description:
      'Estimate travel insurance for your next trip. Covers regional and international destinations, any duration, all ages.',
    icon: Plane,
    gradient: 'from-emerald-500 to-emerald-600',
    available: true,
  },
];

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold mb-6">
            <Sparkles size={14} />
            Free tools · No signup required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Insurance <span className="text-yellow-400">Calculators</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Estimate your insurance premium in seconds. Get instant transparency
            before you talk to a broker.
          </p>
        </div>
      </section>

      {/* Calculator cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CALCULATORS.map((calc) => {
              const Icon = calc.icon;
              const Card = calc.available ? Link : 'div';
              const cardProps = calc.available
                ? { href: calc.href }
                : {};

              return (
                <Card
                  key={calc.href}
                  {...(cardProps as any)}
                  className={`block bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all ${
                    calc.available
                      ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${calc.gradient} flex items-center justify-center mb-4`}
                  >
                    <Icon className="text-white" size={26} />
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {calc.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {calc.description}
                  </p>

                  {calc.available ? (
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#dc2626]">
                      Open calculator
                      <ArrowRight size={14} />
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Coming soon
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Info section */}
          <div className="mt-12 bg-white rounded-2xl shadow-md p-8 border-l-4 border-[#dc2626]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Calculator className="text-[#dc2626]" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  How do these calculators work?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our calculators use the same rate structures that insurance
                  companies in Kenya apply. They provide an{' '}
                  <strong>accurate estimate</strong> — but the final premium
                  depends on the specific insurer, your claims history, and
                  additional underwriting factors. For a firm quote, contact us
                  and we'll shop the market for you.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Want an exact quote? Our brokers will find the best rate for you.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all shadow-lg"
            >
              Get a Real Quote
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}