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

          <p className="mb-8 text-lg text-[color:var(--accent)] md:text-xl">
            Run in your CI. Fail the build if behavior drifts.
          </p>

          {/* Code Example */}
          <div className="mb-12 w-full max-w-2xl">
            <div className="rounded border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 text-left font-mono text-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="ml-2 text-xs text-[color:var(--text-muted)]">terminal</span>
              </div>
              <div className="space-y-1">
                <p className="text-[color:var(--text-muted)]">
                  <span className="text-[color:var(--accent)]">$</span> regrada test
                </p>
                <p className="text-[color:var(--text-muted)]">Running AI behavior tests...</p>
                <p className="text-green-400">✓ customer_support_flow</p>
                <p className="text-green-400">✓ structured_output_format</p>
                <p className="text-red-400">✗ tool_calling_sequence</p>
                <p className="text-yellow-400 pl-4">Regression detected: function call order changed</p>
                <p className="text-red-400 font-bold mt-2">Build failed: 1 regression detected</p>
              </div>
            </div>
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

            {/* Before/After Comparison */}
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded border border-red-500/30 bg-red-950/20 p-6">
                <h3 className="mb-4 font-bold text-red-400">Without Regrada</h3>
                <div className="space-y-3 text-sm text-[color:var(--text-muted)]">
                  <p>✗ Model updates break production</p>
                  <p>✗ Prompt changes cause silent failures</p>
                  <p>✗ No way to catch regressions early</p>
                  <p>✗ Manual testing is slow & incomplete</p>
                </div>
              </div>
              <div className="rounded border border-green-500/30 bg-green-950/20 p-6">
                <h3 className="mb-4 font-bold text-green-400">With Regrada</h3>
                <div className="space-y-3 text-sm text-[color:var(--text-muted)]">
                  <p>✓ Regressions caught in CI</p>
                  <p>✓ Every change is validated</p>
                  <p>✓ Automated behavioral testing</p>
                  <p>✓ Ship with confidence</p>
                </div>
              </div>
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
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-[color:var(--accent)]">
                    🔍
                  </div>
                  <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                    Behavioral Regression Detection
                  </h3>
                </div>
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
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-[color:var(--accent)]">
                    🧪
                  </div>
                  <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                    Scenario-Based Testing for AI
                  </h3>
                </div>
                <p className="text-[color:var(--text-secondary)]">Define real prompts and flows as tests:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> Multi-turn conversations</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Tool-calling sequences</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Edge cases & adversarial inputs</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Golden responses & invariants</li>
                </ul>
                <div className="rounded border border-[var(--border-color)] bg-black/30 p-4 font-mono text-xs">
                  <p className="text-purple-400">test</p>
                  <p className="text-[color:var(--text-muted)]">  .scenario(<span className="text-green-400">&quot;support_refund&quot;</span>)</p>
                  <p className="text-[color:var(--text-muted)]">  .prompt(<span className="text-green-400">&quot;I want a refund&quot;</span>)</p>
                  <p className="text-[color:var(--text-muted)]">  .expect.toolCalled(<span className="text-green-400">&quot;check_order&quot;</span>)</p>
                  <p className="text-[color:var(--text-muted)]">  .expect.tone(<span className="text-green-400">&quot;helpful&quot;</span>)</p>
                </div>
                <p className="text-[color:var(--text-secondary)]">
                  AI tests that behave like production.
                </p>
              </div>

              {/* Deterministic Diffing */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-[color:var(--accent)]">
                    📊
                  </div>
                  <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                    Deterministic Diffing for Non-Deterministic Systems
                  </h3>
                </div>
                <p className="text-[color:var(--text-secondary)]">Regrada normalizes LLM output into comparable traces:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> Semantic diffs</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Structural diffs</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Tolerance thresholds</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Custom scoring rules</li>
                </ul>
                <div className="rounded border border-[var(--border-color)] bg-black/30 p-4 font-mono text-xs">
                  <p className="text-[color:var(--text-muted)]">Baseline:</p>
                  <p className="text-green-400 pl-2">+ Called: search_products</p>
                  <p className="text-green-400 pl-2">+ Called: add_to_cart</p>
                  <p className="text-[color:var(--text-muted)]">Current:</p>
                  <p className="text-green-400 pl-2">+ Called: search_products</p>
                  <p className="text-red-400 pl-2">- Called: check_inventory</p>
                  <p className="text-yellow-400 mt-2">⚠ Tool sequence changed</p>
                </div>
                <p className="text-[color:var(--text-secondary)]">
                  No more eyeballing prompt changes.
                </p>
              </div>

              {/* CI/CD Enforcement */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-[color:var(--accent)]">
                    🚦
                  </div>
                  <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                    CI / CD Enforcement
                  </h3>
                </div>
                <p className="text-[color:var(--text-secondary)]">Run Regrada in:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> GitHub Actions</li>
                  <li><span className="text-[color:var(--accent)]">•</span> GitLab CI</li>
                  <li><span className="text-[color:var(--accent)]">•</span> CircleCI</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Jenkins</li>
                </ul>
                <div className="rounded border border-[var(--border-color)] bg-black/30 p-4 font-mono text-xs">
                  <p className="text-blue-400">- name: <span className="text-green-400">Regrada AI Tests</span></p>
                  <p className="text-blue-400">  run: <span className="text-[color:var(--text-muted)]">npx regrada test</span></p>
                  <p className="text-gray-500 mt-2"># Blocks merge if AI behavior changed</p>
                </div>
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
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-[color:var(--accent)]">
                    🔌
                  </div>
                  <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                    Model-Agnostic & Vendor-Neutral
                  </h3>
                </div>
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
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-[color:var(--accent)]">
                    🧠
                  </div>
                  <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                    Prompt & Policy Guardrails
                  </h3>
                </div>
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
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-[color:var(--accent)]">
                    📈
                  </div>
                  <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                    Drift & Stability Monitoring
                  </h3>
                </div>
                <p className="text-[color:var(--text-secondary)]">Track behavior over time:</p>
                <ul className="space-y-2 text-[color:var(--text-muted)]">
                  <li><span className="text-[color:var(--accent)]">•</span> Output variance</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Response entropy</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Tool-call frequency</li>
                  <li><span className="text-[color:var(--accent)]">•</span> Latency distributions</li>
                </ul>
                <div className="rounded border border-[var(--border-color)] bg-black/30 p-4 font-mono text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[color:var(--text-muted)]">Stability Score:</span>
                      <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                        <div className="h-full bg-green-500" style={{width: '87%'}}></div>
                      </div>
                      <span className="text-green-400">87%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[color:var(--text-muted)]">Avg Latency:</span>
                      <span className="text-blue-400">1.2s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[color:var(--text-muted)]">Tool Usage:</span>
                      <span className="text-yellow-400">↑ 12%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[color:var(--text-secondary)]">
                  See instability before users do.
                </p>
              </div>

              {/* SDK & CLI */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-[color:var(--accent)]">
                    🧩
                  </div>
                  <h3 className="text-2xl font-bold text-[color:var(--accent)]">
                    Lightweight SDK & CLI
                  </h3>
                </div>
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

            {/* Visual Flow */}
            <div className="mb-12 rounded border border-[var(--border-color)] bg-[var(--surface-bg)] p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 text-center">
                  <div className="mx-auto mb-2 h-16 w-16 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]/10 flex items-center justify-center text-2xl font-bold text-[color:var(--accent)]">1</div>
                  <p className="text-sm text-[color:var(--text-muted)]">Define Tests</p>
                </div>
                <div className="hidden md:block text-[color:var(--accent)] text-2xl">→</div>
                <div className="flex-1 text-center">
                  <div className="mx-auto mb-2 h-16 w-16 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]/10 flex items-center justify-center text-2xl font-bold text-[color:var(--accent)]">2</div>
                  <p className="text-sm text-[color:var(--text-muted)]">Run in CI</p>
                </div>
                <div className="hidden md:block text-[color:var(--accent)] text-2xl">→</div>
                <div className="flex-1 text-center">
                  <div className="mx-auto mb-2 h-16 w-16 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]/10 flex items-center justify-center text-2xl font-bold text-[color:var(--accent)]">3</div>
                  <p className="text-sm text-[color:var(--text-muted)]">Compare</p>
                </div>
                <div className="hidden md:block text-[color:var(--accent)] text-2xl">→</div>
                <div className="flex-1 text-center">
                  <div className="mx-auto mb-2 h-16 w-16 rounded-full border-2 border-green-500 bg-green-500/10 flex items-center justify-center text-2xl font-bold text-green-400">✓</div>
                  <p className="text-sm text-[color:var(--text-muted)]">Pass/Fail</p>
                </div>
              </div>
            </div>

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
