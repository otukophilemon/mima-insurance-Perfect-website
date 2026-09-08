import Link from 'next/link';
import { ArrowRight, Shield, FileText, Briefcase, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 bg-blue-900/95 backdrop-blur border-b border-blue-700 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">🏢 MIMA Insurance</div>
          <div className="flex gap-8 items-center">
            <Link href="#features" className="text-blue-100 hover:text-white transition">Features</Link>
            <Link href="#quote" className="text-blue-100 hover:text-white transition">Quote</Link>
            <Link href="/claim" className="text-blue-100 hover:text-white transition">Claim</Link>
            <Link href="/dashboard" className="text-blue-100 hover:text-white transition">Dashboard</Link>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition">Contact Us</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Your Trusted Insurance Partner</h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Comprehensive insurance solutions designed to protect what matters most to you and your business.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/quote" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition">
            Get a Quote <ArrowRight size={20} />
          </Link>
          <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Auto Insurance", desc: "Comprehensive coverage for your vehicles" },
              { icon: Briefcase, title: "Business Insurance", desc: "Protect your business with tailored plans" },
              { icon: FileText, title: "Health Insurance", desc: "Complete health coverage for you and family" },
              { icon: BarChart3, title: "Life Insurance", desc: "Secure your family's financial future" },
            ].map((feature, i) => (
              <div key={i} className="p-6 border-l-4 border-orange-500 bg-gray-50 hover:bg-gray-100 transition rounded-lg">
                <feature.icon className="text-orange-500 mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section id="quote" className="bg-gradient-to-r from-blue-900 to-blue-800 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/quote" className="bg-orange-500 hover:bg-orange-600 p-8 rounded-lg transition">
              <Briefcase className="mx-auto mb-4" size={40} />
              <h3 className="font-bold text-xl mb-2">Get a Quote</h3>
              <p className="text-blue-100">Fast, easy quote in minutes</p>
            </Link>
            <Link href="/claim" className="bg-orange-500 hover:bg-orange-600 p-8 rounded-lg transition">
              <FileText className="mx-auto mb-4" size={40} />
              <h3 className="font-bold text-xl mb-2">File a Claim</h3>
              <p className="text-blue-100">Submit and track your claims</p>
            </Link>
            <Link href="/dashboard" className="bg-orange-500 hover:bg-orange-600 p-8 rounded-lg transition">
              <BarChart3 className="mx-auto mb-4" size={40} />
              <h3 className="font-bold text-xl mb-2">Manage Policy</h3>
              <p className="text-blue-100">View and manage your policies</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 MIMA Insurance Brokers. All rights reserved.</p>
          <div className="flex gap-8 justify-center mt-4 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}