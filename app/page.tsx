'use client';

import { useState } from 'react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      // Call the Lambda function via API Gateway
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/email-signup';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to sign up. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] font-mono text-[color:var(--text-primary)]">
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-6xl font-bold text-[color:var(--text-primary)] md:text-8xl">
          <span className="text-[color:var(--accent)]">&gt;</span>
          regrada
          <span className="animate-blink text-[color:var(--accent)]">_</span>
        </h1>

        <p className="mb-8 text-lg text-[color:var(--text-secondary)] md:text-xl">
          CI for AI behavior — catch regressions before they ship.
        </p>

        <div className="mb-12">
          <p className="text-xl text-[color:var(--text-muted)] uppercase tracking-widest md:text-2xl">
            Coming Soon
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com"
              required
              className="flex-1 border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-3 text-[color:var(--text-primary)] placeholder:text-[color:var(--text-placeholder)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="border border-[var(--accent)] bg-[var(--accent-bg)] px-6 py-3 font-semibold text-[color:var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[color:var(--button-hover-text)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Notify Me'}
            </button>
          </div>
          {isSubmitted && (
            <p className="mt-4 text-sm text-[color:var(--success)]">
              ✓ Thanks! We&apos;ll keep you updated.
            </p>
          )}
          {error && (
            <p className="mt-4 text-sm text-[color:var(--error)]">
              ✗ {error}
            </p>
          )}
        </form>
      </main>
      <footer className="w-full border-t border-[var(--border-color)] px-4 py-6 text-sm text-[color:var(--text-muted)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3">
          <span>© {CURRENT_YEAR} Regrada. All rights reserved.</span>
          <div className="flex gap-4">
            <a
              href="/privacy"
              className="text-[color:var(--accent)] transition-colors hover:text-[color:var(--text-primary)]"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-[color:var(--accent)] transition-colors hover:text-[color:var(--text-primary)]"
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
