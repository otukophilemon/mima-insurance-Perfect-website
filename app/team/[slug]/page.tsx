// app/team/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  Award,
  Briefcase,
  CheckCircle,
  Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

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
  certifications: string[] | null;
  linkedin: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getAgent(slug: string): Promise<Agent | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error || !data) return null;
  return data;
}

async function getOtherAgents(currentSlug: string): Promise<Agent[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from('agents')
    .select('id, slug, name, title, photo, specialties, experience_years')
    .eq('active', true)
    .neq('slug', currentSlug)
    .order('display_order', { ascending: true })
    .limit(3);

  return (data as Agent[]) || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgent(slug);

  if (!agent) {
    return { title: 'Agent Not Found | MIMA Insurance Brokers' };
  }

  return {
    title: `${agent.name} - ${agent.title} | MIMA Insurance Brokers`,
    description: agent.bio.substring(0, 160),
    openGraph: {
      title: `${agent.name} | MIMA Insurance Brokers`,
      description: agent.bio.substring(0, 160),
      images: agent.photo ? [agent.photo] : [],
    },
  };
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default async function AgentProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const agent = await getAgent(slug);

  if (!agent) {
    notFound();
  }

  const otherAgents = await getOtherAgents(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm mb-8 transition"
          >
            <ArrowLeft size={16} />
            Back to Team
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative w-40 h-40 rounded-3xl bg-white/20 backdrop-blur overflow-hidden flex-shrink-0 flex items-center justify-center border-4 border-white/30">
              {agent.photo ? (
                <Image
                  src={agent.photo}
                  alt={agent.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="text-white text-6xl font-bold tracking-wider">
                  {getInitials(agent.name)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold mb-3">
                {agent.name}
              </h1>
              <p className="text-xl text-yellow-400 font-semibold mb-6">
                {agent.title}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                {agent.experience_years && (
                  <div className="flex items-center gap-2">
                    <Award size={20} />
                    <span className="font-semibold">
                      {agent.experience_years}+ years
                    </span>
                  </div>
                )}
                {agent.specialties.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={20} />
                    <span className="font-semibold">
                      {agent.specialties.length} specialties
                    </span>
                  </div>
                )}
              </div>

              {/* Contact buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {agent.whatsapp && (
                  <a
                    href={`https://wa.me/${agent.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                )}
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1e3a8a] hover:bg-gray-100 font-semibold rounded-full transition-all"
                  >
                    <Phone size={18} />
                    Call
                  </a>
                )}
                {agent.email && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur hover:bg-white/20 text-white font-semibold rounded-full transition-all border border-white/20"
                  >
                    <Mail size={18} />
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Bio + Specialties */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <div className="bg-white rounded-3xl shadow-md p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="text-[#1e3a8a]" size={26} />
                  About {agent.name.split(' ')[0]}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {agent.bio}
                </p>
              </div>

              {/* Specialties */}
              {agent.specialties.length > 0 && (
                <div className="bg-white rounded-3xl shadow-md p-8 md:p-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Briefcase className="text-[#dc2626]" size={26} />
                    Areas of Expertise
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agent.specialties.map((spec) => (
                      <div
                        key={spec}
                        className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100"
                      >
                        <CheckCircle
                          className="text-[#dc2626] flex-shrink-0"
                          size={20}
                        />
                        <span className="font-semibold text-gray-900">
                          {spec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {agent.certifications && agent.certifications.length > 0 && (
                <div className="bg-white rounded-3xl shadow-md p-8 md:p-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="text-green-600" size={26} />
                    Professional Certifications
                  </h2>
                  <ul className="space-y-4">
                    {agent.certifications.map((cert) => (
                      <li
                        key={cert}
                        className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100"
                      >
                        <Award
                          className="text-green-600 flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <span className="text-gray-900">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick contact card */}
                <div className="bg-white rounded-3xl shadow-lg p-6 border-t-4 border-[#dc2626]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Get in Touch
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Reach out directly to {agent.name.split(' ')[0]} for
                    personalized advice.
                  </p>

                  <div className="space-y-3">
                    {agent.whatsapp && (
                      <a
                        href={`https://wa.me/${agent.whatsapp.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition group"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <MessageCircle
                            className="text-green-600"
                            size={18}
                          />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">
                            WhatsApp
                          </div>
                          <div className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                            Chat now
                          </div>
                        </div>
                      </a>
                    )}

                    {agent.phone && (
                      <a
                        href={`tel:${agent.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition group"
                      >
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <Phone className="text-[#dc2626]" size={18} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Call</div>
                          <div className="font-semibold text-gray-900 group-hover:text-[#dc2626] transition">
                            {agent.phone}
                          </div>
                        </div>
                      </a>
                    )}

                    {agent.email && (
                      <a
                        href={`mailto:${agent.email}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition group"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Mail className="text-[#1e3a8a]" size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="font-semibold text-gray-900 group-hover:text-[#1e3a8a] transition truncate">
                            {agent.email}
                          </div>
                        </div>
                      </a>
                    )}
                  </div>

                  <Link
                    href="/quote"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition"
                  >
                    Get a Free Quote
                  </Link>
                </div>

                {/* Office locations */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Visit Our Offices
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-[#dc2626] mb-1">
                        Nairobi
                      </div>
                      <p className="text-gray-600">
                        Westlands, Allamano Centre, Waiyaki Way, 7th Floor
                      </p>
                    </div>
                    <div>
                      <div className="font-semibold text-[#dc2626] mb-1">
                        Nakuru
                      </div>
                      <p className="text-gray-600">
                        Oginga Odinga Road, Opposite State House
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other team members */}
          {otherAgents.length > 0 && (
            <div className="mt-20">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Meet More of Our Team
                </h2>
                <p className="text-gray-600">
                  Explore our other experienced advisors
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherAgents.map((other) => (
                  <Link
                    key={other.id}
                    href={`/team/${other.slug}`}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-100"
                  >
                    <div className="h-2 w-full bg-gradient-to-r from-[#1e3a8a] to-[#2563eb]" />
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-lg font-bold">
                            {getInitials(other.name)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-[#dc2626] transition">
                            {other.name}
                          </h3>
                          <p className="text-xs text-[#dc2626] font-semibold">
                            {other.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-[#dc2626] text-sm font-semibold">
                        View Profile
                        <ArrowLeft
                          size={14}
                          className="ml-1 rotate-180 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work With {agent.name.split(' ')[0]}?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Get personalized insurance advice tailored to your needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/60 hover:bg-white/10 text-white font-semibold rounded-full transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}