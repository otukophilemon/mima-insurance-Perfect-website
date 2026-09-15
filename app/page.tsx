import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MIMA Insurance Brokers | Trusted Insurance Partner in Kenya",
  description:
    "Trusted insurance brokerage in Nairobi & Nakuru. Get free quotes for motor, health, business, WIBA, marine, travel, and life insurance.",
};
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Trusted{" "}
            <span className="block text-yellow-400">Insurance Partner</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
            Comprehensive insurance solutions designed to protect what matters
            most to you and your business.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-white text-[#1e3a8a] hover:bg-gray-100 px-10 py-4 rounded-full font-bold transition text-lg shadow-xl transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Full Services Section */}
      <Services />

      <Footer />
    </div>
  );
}