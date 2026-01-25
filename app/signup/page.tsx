"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'confirm'>('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.signUp(formData.email, formData.password, formData.name);
      setStep('confirm');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.confirmSignUp(formData.email, confirmCode);
      router.push('/login?verified=true');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'Google' | 'Apple') => {
    // TODO: Implement social login with backend
    setError(`${provider} sign in will be available soon`);
  };

  if (step === 'confirm') {
    return (
      <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold">Check your email</h1>
              <p className="mt-2 text-lg text-(--text-secondary)">
                We sent a verification code to <strong>{formData.email}</strong>
              </p>
            </div>

            <form onSubmit={handleConfirm} className="mt-8 space-y-6 rounded-2xl border border-(--border-color) bg-(--surface-bg)/90 p-8 shadow-lg">
              {error && (
                <div className="rounded-xl border border-(--error) bg-(--status-error-bg) p-4 text-sm text-(--error)">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-(--text-secondary)">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  required
                  value={confirmCode}
                  onChange={(e) => setConfirmCode(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-(--text-primary) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
                  placeholder="Enter 6-digit code"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl border border-(--accent) bg-(--accent-bg) px-5 py-3 font-semibold text-(--accent) transition-all hover:bg-(--accent) hover:text-(--button-hover-text) disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="text-center text-sm text-(--text-muted)">
                Didn&apos;t receive a code?{' '}
                <button type="button" className="text-(--accent) hover:underline">
                  Resend
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Create your account</h1>
            <p className="mt-2 text-lg text-(--text-secondary)">
              Start tracking your AI behavior today
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-(--border-color) bg-(--surface-bg)/90 p-8 shadow-lg">
            {/* Social Sign In Buttons */}
            <button
              onClick={() => handleSocialSignIn('Google')}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-(--border-color) bg-(--surface-bg) px-5 py-3 font-semibold text-(--text-primary) transition-all hover:border-(--accent) hover:bg-(--accent-bg) disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialSignIn('Apple')}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-(--border-color) bg-(--surface-bg) px-5 py-3 font-semibold text-(--text-primary) transition-all hover:border-(--accent) hover:bg-(--accent-bg) disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-(--border-color)" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-(--surface-bg) px-4 text-(--text-muted)">Or continue with email</span>
              </div>
            </div>

            {/* Email Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-(--error) bg-(--status-error-bg) p-4 text-sm text-(--error)">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-(--text-secondary)">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-(--text-primary) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-(--text-secondary)">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-(--text-primary) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-(--text-secondary)">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-(--text-primary) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-(--text-muted)">At least 8 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-(--text-secondary)">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-(--text-primary) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl border border-(--accent) bg-(--accent-bg) px-5 py-3 font-semibold text-(--accent) transition-all hover:bg-(--accent) hover:text-(--button-hover-text) disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center text-sm text-(--text-muted)">
              Already have an account?{' '}
              <Link href="/login" className="text-(--accent) hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-(--text-muted)">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-(--accent) hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-(--accent) hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
