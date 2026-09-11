// app/about/page.tsx
import Link from 'next/link';
import {
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Users,
  Award,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY } from '@/data/company';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Integrity',
    description:
      'We conduct business with transparency, honesty, and the highest ethical standards.',
  },
  {
    icon: Heart,
    title: 'Client First',
    description:
      'Every decision we make is guided by what is best for our clients and their families.',
  },
  {
    icon: Users,
    title: 'Expertise',
    description:
      'Our team of experienced risk management professionals brings decades of industry knowledge.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We strive for excellence in every interaction, from the first quote to claim settlement.',
  },
];

const MILESTONES = [
  { year: '2005', event: 'MIMA Insurance Brokers founded in Nairobi' },
  { year: '2010', event: 'Expanded operations to Nakuru with a new branch' },
  { year: '2015', event: 'Reached 5,000 active clients across Kenya' },
  { year: '2020', event: 'Launched digital services and online claims' },
  { year: '2024', event: 'Serving over 10,000 clients nationwide' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-semibold mb-4">
            About MIMA Insurance Brokers
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Protecting What <span className="text-yellow-400">Matters Most</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {COMPANY.description}
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0f172a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {COMPANY.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold text-[#dc2626] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
              <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
                <img
                  src="/images/about-team.jpg"
                  alt="MIMA Insurance Brokers Team"
                  className="w-full h-64 object-cover"
                />
              </div>
              <span className="text-[#dc2626] font-semibold text-sm uppercase tracking-wide">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
                Two Decades of Trusted Insurance Expertise
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2005, MIMA Insurance Brokers Limited has grown to
                  become one of Kenya's most trusted insurance brokerage firms.
                  With offices in Nairobi and Nakuru, we serve individuals,
                  families, and businesses across the country.
                </p>
                <p>
                  As licensed insurance brokers, we work on behalf of our
                  clients — not the insurance companies. This means we always
                  negotiate the best possible cover, premiums, and terms to
                  protect your interests.
                </p>
                <p>
                  Our team of experienced risk management professionals is
                  dedicated to helping you navigate the complex world of
                  insurance with confidence and peace of mind.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                Talk to Our Team
              </Link>
            </div>

            {/* Milestones */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-[#dc2626]" size={24} />
                Our Journey
              </h3>
              <div className="space-y-6">
                {MILESTONES.map((milestone, i) => (
                  <div key={milestone.year} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="flex-1 pt-3">
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-[#dc2626]">
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <Target className="text-[#dc2626]" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To provide comprehensive, innovative, and affordable insurance
                solutions that protect our clients' personal and business
                interests, empowering them to face the future with confidence.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-[#1e3a8a]">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Eye className="text-[#1e3a8a]" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading insurance brokerage firm in Kenya, recognized
                for excellence, integrity, and our unwavering commitment to
                client satisfaction and risk management innovation.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <span className="text-[#dc2626] font-semibold text-sm uppercase tracking-wide">
              Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              What Drives Us Every Day
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center mb-4">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#dc2626] font-semibold text-sm uppercase tracking-wide">
              Visit Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Our Offices
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {COMPANY.offices.map((office) => (
              <div
                key={office.city}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#dc2626] flex items-center justify-center">
                    <MapPin className="text-white" size={22} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {office.city} Office
                  </h3>
                </div>
                                {office.city === 'Nairobi' && (
                  <div className="rounded-xl overflow-hidden mb-4">
                    <img
                      src="/images/office-nairobi.jpg"
                      alt="Nairobi Office"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-[#1e3a8a] mt-1 flex-shrink-0" size={18} />
                    <span className="text-gray-700">{office.address}</span>
                  </div>

                  <a
                    href={`tel:${office.phoneLink}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#dc2626] transition"
                  >
                    <Phone className="text-[#1e3a8a] flex-shrink-0" size={18} />
                    <span>{office.phone}</span>
                  </a>

                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#dc2626] transition break-all"
                  >
                    <Mail className="text-[#1e3a8a] flex-shrink-0" size={18} />
                    <span>{office.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Protect What Matters Most?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Get a free quote today and let our experts find the right coverage
            for you.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            Get Your Free Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}