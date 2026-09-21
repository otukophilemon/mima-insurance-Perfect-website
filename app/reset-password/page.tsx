// app/reset-password/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  CheckCircle,
  AlertCircle,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase-browser';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // On mount, exchange the code (if any) for a session
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();

      // Newer Supabase: link has ?code=xxx — exchange it
      const code = searchParams.get('code');
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError('This reset link is invalid or has expired.');
          setChecking(false);
          return;
        }
      }

      // Older Supabase: link has token in URL hash — handled automatically.
      // Either way, verify we now have a session.
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('This reset link is invalid or has expired.');
        setChecking(false);
        return;
      }

      setValidSession(true);
      setChecking(false);
    };

    init();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      // Give user 2 seconds to see success, then send them to login
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking session
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="max-w-md mx-auto px-6">
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Verifying your reset link...</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="max-w-md mx-auto px-6">
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Password updated!
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                Redirecting you to login...
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Invalid or expired link
  if (!validSession) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="max-w-md mx-auto px-6">
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
                <AlertCircle className="text-red-600" size={40} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Link expired
              </h1>
              <p className="text-gray-600 text-sm mb-6">
                {error || 'This password reset link is no longer valid.'}
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-full transition"
              >
                Request a new link
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="py-16">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <KeyRound className="text-[#1e3a8a]" size={28} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Set New Password
              </h1>
              <p className="text-gray-600 text-sm">
                Choose a strong password you&apos;ll remember
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
                  <Lock size={14} /> New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock size={14} /> Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#1e3a8a] hover:bg-[#1e40af] disabled:bg-gray-400 disabled:cursor-wait text-white font-semibold rounded-full transition-all shadow-lg"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}