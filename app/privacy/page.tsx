// app/privacy/page.tsx
import Link from 'next/link';
import { Shield, Lock, Eye, UserCheck, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY } from '@/data/company';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MIMA Insurance Brokers',
  description: 'Learn how MIMA Insurance Brokers collects, uses, and protects your personal information in compliance with the Kenya Data Protection Act, 2019.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 17, 2026';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <Shield className="mx-auto mb-4" size={48} />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-blue-100">
            Your privacy is important to us. Learn how we protect your data.
          </p>
          <p className="text-sm text-blue-200 mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-md p-8 md:p-12 space-y-8">
            {/* Intro */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                MIMA Insurance Brokers Limited ("we", "our", "us") is committed
                to protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website or use our services. This policy is in
                compliance with the <strong>Kenya Data Protection Act, 2019</strong>.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="text-[#1e3a8a]" size={24} />
                1. Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li>Personal identifiers: full name, email address, phone number</li>
                <li>Location information: county, town, or physical address</li>
                <li>Insurance details: policy preferences, coverage needs</li>
                <li>Documents you upload: identification, policy documents</li>
                <li>Communication records: messages, quotes, claims</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="text-[#1e3a8a]" size={24} />
                2. How We Use Your Information
              </h2>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li>To provide insurance quotes and brokerage services</li>
                <li>To process insurance applications and claims</li>
                <li>To communicate with you about your policies</li>
                <li>To comply with legal and regulatory requirements</li>
                <li>To improve our services and website experience</li>
                <li>To send you updates and important notifications</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="text-[#1e3a8a]" size={24} />
                3. How We Protect Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement appropriate technical and organizational measures to
                protect your personal information, including:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li>Encryption of data in transit (SSL/TLS) and at rest</li>
                <li>Role-based access controls to limit who can view your data</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Secure storage with industry-standard cloud providers</li>
                <li>Employee training on data protection best practices</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Sharing Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may share your information with:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li>Insurance underwriters to obtain quotes and process policies</li>
                <li>Regulatory authorities when required by law (IRA Kenya)</li>
                <li>Service providers who assist us (with strict confidentiality agreements)</li>
                <li>Law enforcement when legally required</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We <strong>do not sell</strong> your personal information to third
                parties for marketing purposes.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Your Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Under the Kenya Data Protection Act, you have the right to:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li>Access your personal data we hold</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Object to processing of your data</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with the Office of the Data Protection Commissioner</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Cookies and Analytics
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our website uses cookies and similar technologies to enhance your
                experience and analyze site traffic. We use Google Analytics to
                understand how visitors use our site. You can control cookies
                through your browser settings.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this policy, comply with legal
                obligations, resolve disputes, and enforce agreements. Insurance
                records are typically retained for a minimum of 7 years as
                required by Kenyan insurance regulations.
              </p>
            </div>

            {/* Section 8: Contact */}
            <div className="bg-blue-50 rounded-2xl p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="text-[#1e3a8a]" size={24} />
                8. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or how we handle
                your data, please contact us:
              </p>
              <div className="space-y-2 text-gray-800">
                <p>
                  <strong>Email:</strong>{' '}
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-[#1e3a8a] hover:underline"
                  >
                    {COMPANY.email}
                  </a>
                </p>
                <p>
                  <strong>Nairobi Office:</strong> {COMPANY.offices[0].phone}
                </p>
                <p>
                  <strong>Nakuru Office:</strong> {COMPANY.offices[1].phone}
                </p>
              </div>
            </div>

            {/* Data Protection Officer */}
            <div className="border-t border-gray-200 pt-8 mt-8 text-sm text-gray-600">
              <p>
                For matters relating to data protection, you may also contact the{' '}
                <strong>Office of the Data Protection Commissioner (ODPC)</strong>{' '}
                at <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] hover:underline">www.odpc.go.ke</a>.
              </p>
            </div>

            {/* Back link */}
            <div className="pt-6">
              <Link
                href="/"
                className="text-[#dc2626] hover:text-[#b91c1c] font-semibold transition"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}