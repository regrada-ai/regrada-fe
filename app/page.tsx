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
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-6xl font-bold text-[color:var(--text-primary)] md:text-8xl">
            <span className="text-[color:var(--accent)]">&gt;</span>
            regrada
            <span className="animate-blink text-[color:var(--accent)]">_</span>
          </h1>

          <p className="mb-6 max-w-3xl text-2xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Stop AI regressions before they reach production.
          </p>

          <p className="mb-4 max-w-3xl text-lg text-[color:var(--text-secondary)] md:text-xl">
            Regrada is CI for LLM-powered systems. Detect behavioral changes, broken assumptions, and silent failures before your AI ships.
          </p>

          <p className="mb-12 text-lg text-[color:var(--accent)] md:text-xl">
            Run in your CI. Fail the build if behavior drifts.
          </p>

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
                {isLoading ? 'Submitting...' : 'Join Waitlist'}
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
        </section>

        {/* What Regrada Does */}
        <section className="border-t border-[var(--border-color)] px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold text-[color:var(--text-primary)] md:text-5xl">
              What Regrada Does
            </h2>
            <p className="mb-4 text-xl text-[color:var(--text-secondary)] md:text-2xl">
              Modern AI apps don&apos;t fail loudly — they change quietly.
            </p>
            <p className="mb-8 text-xl text-[color:var(--text-secondary)] md:text-2xl">
              Regrada makes AI behavior testable, observable, and enforceable.
            </p>
            <div className="space-y-2 text-left text-lg text-[color:var(--text-muted)]">
              <p><span className="text-[color:var(--accent)]">&gt;</span> You define expected behavior.</p>
              <p><span className="text-[color:var(--accent)]">&gt;</span> Regrada checks every change.</p>
              <p><span className="text-[color:var(--accent)]">&gt;</span> If something breaks, it blocks the release.</p>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="border-t border-[var(--border-color)] px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-5xl">
              Core Features
            </h2>

            {/* Feature Grid */}
            <div className="grid gap-12 md:grid-cols-2">
              {/* Behavioral Regression Detection */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                  Behavioral Regression Detection
                </h3>
                <p className="text-[color:var(--text-secondary)]">Detect changes in:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> Model outputs</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Tool usage</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Function calls</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Structured responses</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Latency & failure modes</li>
                </ul>
                <p className="text-[color:var(--text-secondary)]">
                  Catch &quot;it still runs but it&apos;s wrong&quot; bugs automatically.
                </p>
              </div>

              {/* Scenario-Based Testing */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                  Scenario-Based Testing for AI
                </h3>
                <p className="text-[color:var(--text-secondary)]">Define real prompts and flows as tests:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> Multi-turn conversations</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Tool-calling sequences</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Edge cases & adversarial inputs</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Golden responses & invariants</li>
                </ul>
                <p className="text-[color:var(--text-secondary)]">
                  AI tests that behave like production.
                </p>
              </div>

              {/* Deterministic Diffing */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                  Deterministic Diffing for Non-Deterministic Systems
                </h3>
                <p className="text-[color:var(--text-secondary)]">Regrada normalizes LLM output into comparable traces:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> Semantic diffs</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Structural diffs</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Tolerance thresholds</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Custom scoring rules</li>
                </ul>
                <p className="text-[color:var(--text-secondary)]">
                  No more eyeballing prompt changes.
                </p>
              </div>

              {/* CI/CD Enforcement */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                  CI / CD Enforcement
                </h3>
                <p className="text-[color:var(--text-secondary)]">Run Regrada in:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> GitHub Actions</li>
                  <li><span className="text-[color:var(--accent)]">•</span> GitLab CI</li>
                  <li><span className="text-[color:var(--accent)]">•</span> CircleCI</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Jenkins</li>
                </ul>
                <p className="text-[color:var(--text-secondary)]">Fail builds on:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> Behavioral regressions</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Contract violations</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Drift beyond allowed thresholds</li>
                </ul>
                <p className="text-[color:var(--text-secondary)]">
                  AI gets the same release discipline as code.
                </p>
              </div>

              {/* Model-Agnostic */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                  Model-Agnostic & Vendor-Neutral
                </h3>
                <p className="text-[color:var(--text-secondary)]">Works with:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> OpenAI, Anthropic, Gemini</li>
                  <li><span className="text-[color:var(--accent)]">•</span> OSS models (Llama, Mistral, etc.)</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Fine-tuned or hosted models</li>
                </ul>
                <p className="text-[color:var(--text-secondary)]">
                  Swap models without flying blind.
                </p>
              </div>

              {/* Guardrails */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                  Prompt & Policy Guardrails
                </h3>
                <p className="text-[color:var(--text-secondary)]">Enforce:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> Output schemas</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Safety rules</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Tone and style constraints</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Tool-usage policies</li>
                </ul>
                <p className="text-[color:var(--text-secondary)]">
                  If the model violates rules, the build fails.
                </p>
              </div>

              {/* Drift Monitoring */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                  Drift & Stability Monitoring
                </h3>
                <p className="text-[color:var(--text-secondary)]">Track behavior over time:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> Output variance</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Response entropy</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Tool-call frequency</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Latency distributions</li>
                </ul>
                <p className="text-[color:var(--text-secondary)]">
                  See instability before users do.
                </p>
              </div>

              {/* SDK & CLI */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                  Lightweight SDK & CLI
                </h3>
                <div className="rounded border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 font-mono text-sm">
                  <p className="text-[color:var(--text-muted)]"><span className="text-[color:var(--accent)]">$</span> regrada init</p>
                  <p className="text-[color:var(--text-muted)]"><span className="text-[color:var(--accent)]">$</span> regrada test</p>
                  <p className="text-[color:var(--text-muted)]"><span className="text-[color:var(--accent)]">$</span> regrada check</p>
                </div>
                <p className="text-[color:var(--text-secondary)]">
                  Minimal config. No platform lock-in.
                </p>
                <p className="text-[color:var(--text-secondary)]">
                  Works locally and in CI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-[var(--border-color)] px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-5xl">
              How It Works
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-[color:var(--accent)]">1.</span>
                <p className="text-lg text-[color:var(--text-secondary)]">
                  Define expected behavior (tests, invariants, policies)
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-[color:var(--accent)]">2.</span>
                <p className="text-lg text-[color:var(--text-secondary)]">
                  Run Regrada in CI on every change
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-[color:var(--accent)]">3.</span>
                <p className="text-lg text-[color:var(--text-secondary)]">
                  Compare against baseline using semantic + structural checks
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-[color:var(--accent)]">4.</span>
                <p className="text-lg text-[color:var(--text-secondary)]">
                  Block regressions before production
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="border-t border-[var(--border-color)] px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-5xl">
              Who It&apos;s For
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
                <p className="text-lg text-[color:var(--text-secondary)]">
                  <span className="text-[color:var(--accent)]">•</span> AI startups shipping fast
                </p>
              </div>
              <div className="rounded border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
                <p className="text-lg text-[color:var(--text-secondary)]">
                  <span className="text-[color:var(--accent)]">•</span> Teams running LLMs in production
                </p>
              </div>
              <div className="rounded border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
                <p className="text-lg text-[color:var(--text-secondary)]">
                  <span className="text-[color:var(--accent)]">•</span> Infra / platform engineers
                </p>
              </div>
              <div className="rounded border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
                <p className="text-lg text-[color:var(--text-secondary)]">
                  <span className="text-[color:var(--accent)]">•</span> Enterprises with compliance requirements
                </p>
              </div>
            </div>
            <p className="mt-8 text-center text-xl text-[color:var(--accent)]">
              If AI is part of your critical path, you need Regrada.
            </p>
          </div>
        </section>

        {/* Why Regrada */}
        <section className="border-t border-[var(--border-color)] px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-5xl">
              Why Regrada
            </h2>
            <div className="space-y-6 text-center">
              <p className="text-xl text-[color:var(--text-secondary)]">
                <span className="text-[color:var(--accent)]">•</span> LLMs don&apos;t version themselves
              </p>
              <p className="text-xl text-[color:var(--text-secondary)]">
                <span className="text-[color:var(--accent)]">•</span> Prompt changes are code changes
              </p>
              <p className="text-xl text-[color:var(--text-secondary)]">
                <span className="text-[color:var(--accent)]">•</span> Silent regressions are the worst regressions
              </p>
              <p className="mt-8 text-2xl font-bold text-[color:var(--accent)]">
                Regrada turns AI behavior into something you can trust.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[var(--border-color)] px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-[color:var(--text-primary)] md:text-5xl">
              Treat AI behavior like production code.
            </h2>
            <p className="mb-12 text-xl text-[color:var(--text-secondary)] md:text-2xl">
              Start catching regressions today.
            </p>
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
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
                  {isLoading ? 'Submitting...' : 'Join Waitlist'}
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
          </div>
        </section>
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
