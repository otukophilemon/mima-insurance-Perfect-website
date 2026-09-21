// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase-browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;
      setSent(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="py-16">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            {sent ? (
              // Success state
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <CheckCircle className="text-green-600" size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  Check your email
                </h1>
                <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                  We&apos;ve sent a password reset link to{' '}
                  <span className="font-semibold text-gray-900">{email}</span>.
                  Click the link in the email to set a new password.
                </p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 text-left mb-6">
                  <strong className="block mb-1">Didn&apos;t get the email?</strong>
                  Check your spam folder. If it&apos;s still missing, wait a minute
                  and try again.
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-[#1e3a8a] hover:text-[#dc2626] font-semibold transition"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </Link>
              </div>
            ) : (
              // Form state
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Mail className="text-[#1e3a8a]" size={28} />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Enter your email and we&apos;ll send you a reset link
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail size={14} /> Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#1e3a8a] hover:bg-[#1e40af] disabled:bg-gray-400 disabled:cursor-wait text-white font-semibold rounded-full transition-all shadow-lg"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#dc2626] transition"
                  >
                    <ArrowLeft size={14} />
                    Back to login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}