// app/team/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, User, Award, Briefcase, MessageCircle, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team | Meet MIMA Insurance Brokers',
  description:
    'Meet the experienced insurance professionals at MIMA Insurance Brokers. Our team of certified brokers is dedicated to protecting what matters most to you.',
};

interface Agent {
  id: number;
  slug: string;
  name: string;
  title: string;
  bio: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  photo: string | null;
  specialties: string[];
  experience_years: number | null;
}

async function getAgents(): Promise<Agent[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('agents')
    .select('id, slug, name, title, bio, email, phone, whatsapp, photo, specialties, experience_years')
    .eq('active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }

  return data || [];
}

// Generate initials avatar
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default async function TeamPage() {
  const agents = await getAgents();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-semibold mb-4">
            Our Team
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Meet Your <span className="text-yellow-400">Advisors</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Experienced insurance professionals dedicated to protecting what
            matters most to you and your business.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {agents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Team information coming soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                >
                                    {/* Photo / Avatar */}
                  <div className="relative h-64 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] overflow-hidden flex items-center justify-center">
                    {/* Use initials avatar — replace with real Image when photos are provided */}
                    <div className="text-white text-7xl font-bold tracking-wider">
                      {getInitials(agent.name)}
                    </div>
                    {/* Experience badge */}
                    {agent.experience_years && (
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-semibold text-[#1e3a8a]">
                          <Award size={12} />
                          {agent.experience_years}+ yrs
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-[#dc2626] font-semibold mb-3">
                      {agent.title}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {agent.specialties.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-[#1e3a8a] text-[10px] font-semibold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Bio excerpt */}
                    <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {agent.bio}
                    </p>

                    {/* Quick actions */}
                    <div className="mt-auto space-y-2">
                      <Link
                        href={`/team/${agent.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-full transition"
                      >
                        View Profile
                        <ArrowRight size={14} />
                      </Link>

                      <div className="flex gap-2">
                        {agent.whatsapp && (
                          <a
                            href={`https://wa.me/${agent.whatsapp.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white text-xs font-semibold rounded-full transition"
                          >
                            <MessageCircle size={12} />
                            WhatsApp
                          </a>
                        )}
                        {agent.phone && (
                          <a
                            href={`tel:${agent.phone.replace(/\s/g, '')}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border-2 border-[#dc2626] text-[#dc2626] hover:bg-[#dc2626] hover:text-white text-xs font-semibold rounded-full transition"
                          >
                            <Phone size={12} />
                            Call
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-red-50 text-[#dc2626] rounded-full text-sm font-semibold mb-4">
              Why Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience You Can Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gray-50">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#1e3a8a] flex items-center justify-center mb-4">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Certified Professionals
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every broker at MIMA is fully licensed and certified by the
                Insurance Regulatory Authority (IRA) of Kenya.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#dc2626] flex items-center justify-center mb-4">
                <Briefcase className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Industry Experience
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our team brings decades of combined experience across motor,
                health, business, and life insurance.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-4">
                <User className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Personalized Service
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                You get a dedicated broker who knows your needs and is
                available whenever you need assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Reach out and let one of our advisors find the right coverage for you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            Contact Our Team
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}