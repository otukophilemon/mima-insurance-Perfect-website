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
      <section
        className="relative text-white bg-cover bg-center flex items-center justify-center py-24 md:py-32"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(30, 58, 138, 0.92), rgba(30, 64, 175, 0.75)), url(/images/hero-bg.jpg)',
        }}
      >
        {/* Preload hero image for better LCP */}
        <link rel="preload" as="image" href="/images/hero-bg.jpg" />
        
        {/* Centered text — vertically & horizontally centered */}
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Trusted{" "}
            <span className="block text-yellow-400">Insurance Partner</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Comprehensive insurance solutions designed to protect what matters
            most to you and your business.
          </p>
        </div>

        {/* Button — absolute bottom-right of the hero */}
        <div className="absolute bottom-8 right-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-white text-[#1e3a8a] hover:bg-gray-100 px-7 py-3 rounded-full font-semibold transition text-base shadow-lg transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      <Footer />
    </div>
  );
}