// app/services/page.tsx
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SERVICES } from '@/data/services';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-semibold mb-4">
            Our Insurance Solutions
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Complete Insurance <span className="text-yellow-400">Coverage</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            From motor and medical to business and life — we offer 10
            comprehensive insurance products tailored to protect what matters
            most to you.
          </p>
        </div>
      </section>

      {/* Quick Nav */}
      <section className="bg-gray-50 border-b border-gray-100 sticky top-[60px] lg:top-[68px] z-40 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {SERVICES.map((service) => (
              <a
                key={service.id}
                href={`#${service.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-[#dc2626] transition whitespace-nowrap"
              >
                {service.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 scroll-mt-32"
                >
                  {/* Gradient header */}
                  <div
                    className={`bg-gradient-to-r ${service.gradient} p-6 flex items-center gap-4`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white" size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {service.title}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                        Key Features
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <Check
                              size={16}
                              className={`${service.accent} flex-shrink-0 mt-0.5`}
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-full transition-all"
                      >
                        Learn More
                        <ArrowRight size={16} />
                      </Link>
                      <Link
                        href={`/quote?type=${service.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold rounded-full transition-all"
                      >
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not Sure Which Insurance You Need?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Our experienced brokers will help you find the right coverage for
            your specific situation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Talk to a Broker
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/60 hover:bg-white/10 text-white font-semibold rounded-full transition-all"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}