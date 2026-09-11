// app/services/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  Check,
  Phone,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SERVICES } from '@/data/services';
import { COMPANY } from '@/data/company';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;
  const relatedServices = SERVICES.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

            {/* Hero */}
      <section className={`relative bg-gradient-to-br ${service.gradient} text-white overflow-hidden`}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${service.image})` }}
        />
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-80`} />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <nav className="text-sm mb-6 text-white/80">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-white">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-semibold">{service.title}</span>
          </nav>

          <div className="flex items-start gap-6 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Icon className="text-white" size={40} />
            </div>
            <div className="flex-1 min-w-[280px]">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href={`/quote?type=${service.id}`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#1e3a8a] hover:bg-gray-100 font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Get a Quote <ArrowRight size={20} />
            </Link>
            <a
              href={`https://wa.me/${COMPANY.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 backdrop-blur hover:bg-white/30 text-white font-semibold rounded-full transition-all border border-white/30"
            >
              <MessageCircle size={20} />
              Ask a Question
            </a>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What's Covered
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {service.description} At MIMA Insurance Brokers, we work with
                leading underwriters to provide you with the best possible
                cover at competitive rates.
              </p>

              {/* Features */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ShieldCheck className={service.accent} size={24} />
                  Key Features
                </h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Check className="text-white" size={14} />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-[#1e3a8a]" size={24} />
                  Why Choose MIMA for {service.title}?
                </h3>
                <div className="space-y-4">
                  {[
                    '20+ years of experience in the Kenyan insurance market',
                    'We negotiate on your behalf — not the insurer\'s',
                    'Personalized risk assessment and advice',
                    'Fast, transparent claims settlement',
                    'Dedicated broker available throughout your policy',
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <Check
                        className="text-[#dc2626] flex-shrink-0 mt-0.5"
                        size={18}
                      />
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Talk to a Broker
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Get expert advice on {service.title.toLowerCase()} tailored to
                  your needs.
                </p>

                <div className="space-y-3">
                  <a
                    href={`tel:${COMPANY.offices[0].phoneLink}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <Phone className="text-[#dc2626]" size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Call us</div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#dc2626] transition">
                        {COMPANY.offices[0].phone}
                      </div>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${COMPANY.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                      <MessageCircle className="text-green-600" size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">WhatsApp</div>
                      <div className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                        Chat now
                      </div>
                    </div>
                  </a>
                </div>

                <Link
                  href={`/quote?type=${service.id}`}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all"
                >
                  Get a Free Quote <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Explore Other Services
            </h2>
            <p className="text-gray-600">
              Discover more insurance products tailored for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedServices.map((rel) => {
              const RelIcon = rel.icon;
              return (
                <Link
                  key={rel.id}
                  href={`/services/${rel.slug}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-100"
                >
                  <div className={`h-1 w-full bg-gradient-to-r ${rel.gradient}`} />
                  <div className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rel.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <RelIcon className="text-white" size={22} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#dc2626] transition">
                      {rel.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {rel.shortDescription}
                    </p>
                    <div className="flex items-center text-[#dc2626] font-semibold text-sm">
                      Learn More
                      <ArrowRight
                        size={14}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Generate static params for all services (performance optimization)
export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}