// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import Image from 'next/image';
import { Menu, X, Phone, Mail, LogIn, LayoutDashboard } from 'lucide-react';
import { COMPANY } from '@/data/company';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/claim', label: 'Claims' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const router = useRouter();

  // Check auth state on mount and on auth changes
  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
        });
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>

      {/* Main navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 transition-transform group-hover:scale-105">
              <Image
  src="/images/mima-logo.png"
  alt="MIMA Insurance Brokers"
  fill
  sizes="(max-width: 768px) 48px, 56px"
  className="object-contain"
  priority
/>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-[#1e3a8a] leading-tight">
                MIMA Insurance
              </div>
              <div className="text-[10px] text-gray-500 font-semibold tracking-widest">
                BROKERS LIMITED
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-700 hover:text-[#dc2626] font-medium transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#dc2626] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
                    {/* Auth Button — Desktop */}
        {user ? (
          <Link
            href="/dashboard"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold transition-all"
          >
            <LayoutDashboard size={16} />
            <span className="hidden lg:inline">Dashboard</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white font-semibold transition-all"
          >
            <LogIn size={16} />
            <span className="hidden lg:inline">Login</span>
          </Link>
        )}
            
            <Link
              href="/quote"
              className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Get a Quote
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#dc2626] transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 py-4 bg-white border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="py-3 px-4 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#dc2626] font-medium transition"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 my-2" />
                          {/* Auth Button — Mobile */}
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-lg bg-[#1e3a8a] text-white font-semibold flex items-center justify-center gap-2 transition"
              >
                <LayoutDashboard size={18} />
                My Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-lg border-2 border-[#1e3a8a] text-[#1e3a8a] font-semibold flex items-center justify-center gap-2 transition"
              >
                <LogIn size={18} />
                Login / Register
              </Link>
            )}
              <Link
                href="/quote"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white text-center font-semibold transition"
              >
                Get a Quote
              </Link>
              
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}