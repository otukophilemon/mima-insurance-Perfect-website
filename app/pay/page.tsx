// app/pay/page.tsx
import Link from 'next/link';
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Phone,
  ArrowRight,
  Building2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY } from '@/data/company';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pay Your Premium | M-Pesa Payment | MIMA Insurance Brokers',
  description:
    'Pay your insurance premium securely via M-Pesa Paybill. Simple, fast, and reliable payment for all MIMA Insurance Brokers policies.',
};

// UPDATE THIS with MIMA's actual Paybill number
const PAYBILL_NUMBER = '843516'; // Placeholder — replace with MIMA's real Paybill

const STEPS = [
  {
    number: '1',
    title: 'Open M-Pesa Menu',
    description: 'On your phone, open the SIM toolkit and select M-PESA.',
  },
  {
    number: '2',
    title: 'Select Lipa na M-Pesa',
    description: 'Choose "Lipa na M-PESA" from the menu options.',
  },
  {
    number: '3',
    title: 'Choose Pay Bill',
    description: 'Select "Pay Bill" to enter the business number.',
  },
  {
    number: '4',
    title: 'Enter Business Number',
    description: `Enter Paybill number: ${PAYBILL_NUMBER}`,
  },
  {
    number: '5',
    title: 'Enter Account Number',
    description: 'Enter your Policy Number as the account number.',
  },
  {
    number: '6',
    title: 'Enter Amount',
    description: 'Enter the premium amount and confirm with your M-Pesa PIN.',
  },
];

export default function PayPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-semibold mb-6">
            <Smartphone size={14} />
            M-Pesa Payment
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Pay Your <span className="text-yellow-400">Premium</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Quick, secure, and convenient payment via M-Pesa. Pay your
            insurance premium from anywhere in Kenya.
          </p>
        </div>
      </section>

      {/* Paybill Card */}
      <section className="py-12 -mt-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-t-4 border-[#dc2626]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Smartphone className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  MIMA Paybill Number
                </h2>
                <p className="text-gray-600 text-sm">
                  Use this number to pay any MIMA Insurance premium
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Business Number
                </div>
                <div className="text-4xl md:text-5xl font-bold text-[#0f172a] tracking-wider font-mono mb-2">
                  {PAYBILL_NUMBER}
                </div>
                <div className="text-sm text-gray-600">
                  MIMA Insurance Brokers Limited
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="text-[#1e3a8a] flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-900">
                <strong>Important:</strong> Always use your <strong>Policy Number</strong> as
                the account number. This ensures your payment is credited to the
                right policy.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-red-50 text-[#dc2626] rounded-full text-sm font-semibold mb-4">
              Step-by-Step Guide
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Pay via M-Pesa
            </h2>
            <p className="text-lg text-gray-600">
              Follow these simple steps to pay your premium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#1e3a8a] hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Happens After Payment
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-green-50 rounded-2xl border border-green-100">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Instant Confirmation
                </h3>
                <p className="text-gray-700">
                  You'll receive an M-Pesa SMS confirming your payment immediately.
                  Save this message as proof of payment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <Building2 className="text-[#1e3a8a] flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Policy Update (Within 24 Hours)
                </h3>
                <p className="text-gray-700">
                  Our team receives your payment and updates your policy status
                  within 24 hours during business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-red-50 rounded-2xl border border-red-100">
              <AlertCircle className="text-[#dc2626] flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Need Help?
                </h3>
                <p className="text-gray-700 mb-3">
                  If your payment isn't reflected within 24 hours, contact us:
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`tel:${COMPANY.offices[0].phoneLink}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#dc2626] hover:underline"
                  >
                    <Phone size={14} />
                    {COMPANY.offices[0].phone}
                  </a>
                  <span className="text-gray-400">|</span>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#dc2626] hover:underline"
                  >
                    {COMPANY.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't Have a Policy Yet?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Get a free quote and start protecting what matters most.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Get a Free Quote
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/60 hover:bg-white/10 text-white font-semibold rounded-full transition-all"
            >
              Talk to a Broker
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}