// app/terms/page.tsx
import Link from 'next/link';
import { FileText, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY } from '@/data/company';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | MIMA Insurance Brokers',
  description: 'Read the terms and conditions governing the use of MIMA Insurance Brokers website and services.',
};

export default function TermsPage() {
  const lastUpdated = 'September 17, 2026';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <FileText className="mx-auto mb-4" size={48} />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-blue-100">
            Please read these terms carefully before using our website.
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
                Welcome to the MIMA Insurance Brokers Limited website. By
                accessing or using our website and services, you agree to be
                bound by these Terms of Service ("Terms"). If you do not agree
                with any part of these Terms, please do not use our website.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. About MIMA Insurance Brokers
              </h2>
              <p className="text-gray-700 leading-relaxed">
                MIMA Insurance Brokers Limited is a licensed insurance brokerage
                firm regulated by the <strong>Insurance Regulatory Authority (IRA) of Kenya</strong>.
                We act as intermediaries between clients and insurance
                underwriters, providing advice, obtaining quotes, and facilitating
                insurance transactions.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Use of Website
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                By using our website, you agree to:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li>Provide accurate, current, and complete information</li>
                <li>Use the website only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not interfere with the proper functioning of the website</li>
                <li>Not use automated systems to scrape or harvest data</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Insurance Services
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>Quotes:</strong> All quotes provided are estimates based
                on the information you provide. Final premiums are subject to
                underwriter approval and may vary based on additional
                information or risk assessment.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>Policies:</strong> All insurance policies are governed
                by the terms and conditions of the specific insurance
                underwriter issuing the policy. MIMA acts as your broker and
                advocate in all matters.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Claims:</strong> Claims are handled by the issuing
                insurance company. MIMA assists and advocates for clients
                throughout the claims process.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Client Responsibilities
              </h2>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li>Disclose all material facts relevant to insurance applications</li>
                <li>Pay premiums as agreed in the policy schedule</li>
                <li>Report claims promptly as per policy terms</li>
                <li>Read and understand policy documents provided</li>
                <li>Notify us of any changes affecting your coverage</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                All content on this website, including text, graphics, logos,
                images, and software, is the property of MIMA Insurance Brokers
                Limited or its content suppliers and is protected by Kenyan and
                international copyright laws. You may not reproduce, distribute,
                or create derivative works without our written permission.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                While we strive to provide accurate and timely information, MIMA
                Insurance Brokers Limited makes no warranties regarding the
                completeness or accuracy of website content. We shall not be
                liable for any indirect, incidental, or consequential damages
                arising from your use of this website. Liability for insurance
                matters is governed by the applicable policy terms and Kenyan
                insurance law.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your use of our website is also governed by our{' '}
                <Link
                  href="/privacy"
                  className="text-[#1e3a8a] hover:underline font-semibold"
                >
                  Privacy Policy
                </Link>
                , which explains how we collect, use, and protect your personal
                information.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Third-Party Links
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites. We are
                not responsible for the content, privacy practices, or terms of
                those sites. Accessing third-party sites is at your own risk.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Modifications to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes
                take effect immediately upon posting to the website. Continued
                use of the website after changes constitutes acceptance of the
                new Terms.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of the Republic of Kenya. Any disputes arising
                from these Terms shall be subject to the exclusive jurisdiction
                of the courts of Kenya.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 rounded-2xl p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="text-[#1e3a8a]" size={24} />
                11. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about these Terms of Service:
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