// components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { COMPANY } from '@/data/company';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/quote', label: 'Get a Quote' },
  { href: '/claim', label: 'File a Claim' },
  { href: '/contact', label: 'Contact' },
];

const SERVICE_LINKS = [
  { href: '/services/motor-insurance', label: 'Motor Insurance' },
  { href: '/services/fire-and-perils', label: 'Fire & Perils' },
  { href: '/services/medical-insurance', label: 'Medical Insurance' },
  { href: '/services/group-life-personal-accident', label: 'Group Life' },
  { href: '/services/business-interruption', label: 'Business Interruption' },
  { href: '/services/work-injury-benefits', label: 'WIBA' },
];

const SOCIAL_LINKS = [
  { href: COMPANY.social.facebook, label: 'Facebook', short: 'f' },
  { href: COMPANY.social.twitter, label: 'Twitter', short: 'X' },
  { href: COMPANY.social.linkedin, label: 'LinkedIn', short: 'in' },
  { href: COMPANY.social.instagram, label: 'Instagram', short: 'ig' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-14 h-14 bg-white rounded-lg p-1">
                <Image
  src="/images/mima-logo.png"
  alt="MIMA Insurance Brokers"
  fill
  sizes="56px"
  className="object-contain p-1"
/>
              </div>
              <div>
                <div className="font-bold text-white text-lg leading-tight">
                  MIMA Insurance
                </div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest">
                  BROKERS LIMITED
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your trusted insurance partner in Kenya. We provide comprehensive
              insurance and risk mitigation solutions for individuals and
              businesses.
            </p>
            {/* Social Icons (text-based fallback) */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ href, label, short }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#dc2626] flex items-center justify-center transition-colors text-sm font-bold"
                >
                  {short}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#dc2626] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-[#dc2626] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Our Services</h3>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#dc2626] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-[#dc2626] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Offices */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Contact Us</h3>

            <div className="space-y-5">
              {COMPANY.offices.map((office) => (
                <div key={office.city}>
                  <div className="text-[#dc2626] font-semibold text-sm mb-2 flex items-center gap-2">
                    <MapPin size={14} />
                    {office.city} Office
                  </div>
                  <div className="space-y-1.5 text-sm text-gray-400 pl-5">
                    <p>{office.address}</p>
                    <a
                      href={`tel:${office.phoneLink}`}
                      className="flex items-center gap-2 hover:text-[#dc2626] transition"
                    >
                      <Phone size={12} />
                      {office.phone}
                    </a>
                    <a
                      href={`mailto:${office.email}`}
                      className="flex items-center gap-2 hover:text-[#dc2626] transition break-all"
                    >
                      <Mail size={12} />
                      {office.email}
                    </a>
                    <p className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={12} />
                      {office.hours}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-[#dc2626] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-[#dc2626] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}