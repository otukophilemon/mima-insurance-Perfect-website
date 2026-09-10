// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Building2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY } from '@/data/company';

const SUBJECTS = [
  'General Inquiry',
  'Motor Insurance Quote',
  'Health Insurance Quote',
  'Business Insurance Quote',
  'File a Claim',
  'Policy Support',
  'Other',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SUBJECTS[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire up to backend (Supabase / API route)
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-semibold mb-4">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            We're Here to <span className="text-yellow-400">Help You</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Reach out to us for quotes, claims, or any questions. Our team
            responds within 24 hours.
          </p>
        </div>
      </section>

      {/* Quick Contact Methods */}
      <section className="py-12 -mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href={`tel:${COMPANY.offices[0].phoneLink}`}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-t-4 border-[#dc2626] text-center group"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4 group-hover:bg-[#dc2626] transition-colors">
                <Phone className="text-[#dc2626] group-hover:text-white transition-colors" size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Call Us</h3>
              <p className="text-gray-600 text-sm">{COMPANY.offices[0].phone}</p>
              <p className="text-gray-500 text-xs mt-1">{COMPANY.offices[1].phone}</p>
            </a>

            <a
              href={`https://wa.me/${COMPANY.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-t-4 border-green-500 text-center group"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                <MessageCircle className="text-green-600 group-hover:text-white transition-colors" size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">WhatsApp</h3>
              <p className="text-gray-600 text-sm">Chat with us instantly</p>
              <p className="text-gray-500 text-xs mt-1">Mon - Fri, 8am - 5pm</p>
            </a>

            <a
              href={`mailto:${COMPANY.email}`}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-t-4 border-[#1e3a8a] text-center group"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-[#1e3a8a] transition-colors">
                <Mail className="text-[#1e3a8a] group-hover:text-white transition-colors" size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Email Us</h3>
              <p className="text-gray-600 text-sm break-all">{COMPANY.email}</p>
              <p className="text-gray-500 text-xs mt-1">Reply within 24 hours</p>
            </a>
          </div>
        </div>
      </section>

      {/* Form + Offices */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <span className="text-[#dc2626] font-semibold text-sm uppercase tracking-wide">
                Send Us a Message
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
                How Can We Help?
              </h2>

              {submitted ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center">
                  <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-green-700">
                    Thank you for contacting MIMA Insurance Brokers. Our team
                    will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="0712 345 678"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition bg-white"
                    >
                      {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all transform hover:scale-[1.02] shadow-lg"
                  >
                    Send Message
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>

            {/* Offices */}
            <div>
              <span className="text-[#dc2626] font-semibold text-sm uppercase tracking-wide">
                Visit Our Offices
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
                Find Us in Kenya
              </h2>

              <div className="space-y-6">
                {COMPANY.offices.map((office) => (
                  <div
                    key={office.city}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#1e3a8a] flex items-center justify-center">
                        <Building2 className="text-white" size={22} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {office.city} Office
                        </h3>
                        {office.isPrimary && (
                          <span className="text-xs font-semibold text-[#dc2626]">
                            HEAD OFFICE
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-[#1e3a8a] mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-gray-700 text-sm">{office.address}</span>
                      </div>
                      <a
                        href={`tel:${office.phoneLink}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-[#dc2626] transition text-sm"
                      >
                        <Phone className="text-[#1e3a8a] flex-shrink-0" size={18} />
                        <span>{office.phone}</span>
                      </a>
                      <a
                        href={`mailto:${office.email}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-[#dc2626] transition break-all text-sm"
                      >
                        <Mail className="text-[#1e3a8a] flex-shrink-0" size={18} />
                        <span>{office.email}</span>
                      </a>
                      <div className="flex items-center gap-3 text-gray-500 text-sm">
                        <Clock className="text-[#1e3a8a] flex-shrink-0" size={18} />
                        <span>{office.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${COMPANY.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all shadow-lg"
                >
                  <MessageCircle size={20} />
                  Chat with Us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}