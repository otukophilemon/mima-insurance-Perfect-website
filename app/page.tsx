// app/page.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Services from '@/components/Services';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Trusted <span className="text-yellow-400">Insurance Partner</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Comprehensive insurance solutions designed to protect what matters
            most to you and your business.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/quote"
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
            >
              Get a Quote <ArrowRight size={20} />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white/60 hover:bg-white/10 text-white px-8 py-3 rounded-full font-semibold transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Full Services Section */}
      <Services />

      <Footer />
    </div>
  );
}