// components/Services.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/data/services';

export default function Services() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-red-50 text-[#dc2626] rounded-full text-sm font-semibold mb-4">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comprehensive Insurance Solutions
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We offer a wide range of insurance products designed to protect
            what matters most to you and your business.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
                            <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent flex flex-col"
              >
                {/* Service Image */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-30 group-hover:opacity-10 transition-opacity`}
                  />
                  {/* Icon badge */}
                  <div
                    className={`absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="text-white" size={22} />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#dc2626] transition-colors leading-tight">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {service.shortDescription}
                  </p>

                                   {/* Learn More */}
                  <div className="flex items-center text-[#dc2626] font-semibold text-sm mt-auto pt-2">
                    Learn More
                    <ArrowRight
                      size={14}
                      className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>

                {/* Hover overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`}
                />
              </Link>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            View All Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}