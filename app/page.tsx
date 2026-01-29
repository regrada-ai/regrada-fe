// SPDX-License-Identifier: LicenseRef-Regrada-Proprietary
"use client";

import { useState, useEffect } from "react";
import Carousel from "./components/Carousel";
import FeatureCard from "./components/FeatureCard";
import FlowDiagram from "./components/FlowDiagram";
import Footer from "./components/Footer";
import { features } from "./data/features";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      ".animate-on-scroll, .animate-on-scroll-fade",
    );
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      // Call the Lambda function via API Gateway
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/email-signup";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to sign up. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-10 text-center sm:pt-16">
          <h1 className="mb-4 text-6xl font-bold text-(--text-primary) md:text-8xl">
            <span className="text-(--accent)">&gt;</span>
            regrada
            <span className="animate-blink text-(--accent)">_</span>
          </h1>

          <p className="mt-2 mb-6 max-w-3xl text-2xl font-bold text-(--text-primary) md:text-4xl">
            CI for AI systems
          </p>

          <p className="mb-6 max-w-3xl text-2xl font-bold text-(--text-primary) md:text-4xl">
            Detect behavioral regressions before they hit production.
          </p>

          <p className="mb-4 max-w-3xl text-lg text-(--text-secondary) md:text-xl">
            Regrada captures LLM interactions, runs evaluations against test
            cases, and detects when your AI&apos;s behavior changes between
            commits.
          </p>

          <p className="mb-8 text-lg text-(--accent) md:text-xl">
            Automated testing for non-deterministic AI systems.
          </p>

          {/* Code Example */}
          <div className="mb-12 w-full max-w-2xl">
            <div className="rounded-2xl border border-(--border-color) bg-(--surface-bg) p-6 text-left font-mono text-sm shadow-lg">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="ml-2 text-xs text-(--code-muted)">
                  terminal
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-(--code-muted)">
                  <span className="text-(--accent)">$</span> regrada run --ci
                </p>
                <p className="text-(--code-muted)">Running evaluations...</p>
                <p className="text-(--status-success)">✓ refund_request</p>
                <p className="text-(--status-success)">✓ product_question</p>
                <p className="text-(--status-error)">✗ customer_greeting</p>
                <p className="text-(--status-warning) pl-4">
                  Regression: tool_called check failed
                </p>
                <p className="text-(--status-error) font-bold mt-2">
                  CI failed: 1 regression detected
                </p>
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
                className="flex-1 rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-(--text-primary) placeholder:text-(--text-placeholder) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl border border-(--accent) bg-(--accent-bg) px-6 py-3 font-semibold text-(--accent) transition-all hover:bg-(--accent) hover:text-(--button-hover-text) disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Join Waitlist"}
              </button>
            </div>
            {isSubmitted && (
              <p className="mt-4 text-sm text-(--success)">
                ✓ Thanks! We&apos;ll keep you updated.
              </p>
            )}
            {error && <p className="mt-4 text-sm text-(--error)">✗ {error}</p>}
          </form>
        </section>

        {/* What Regrada Does */}
        <section className="animate-on-scroll border-t border-(--border-color) px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold text-(--text-primary) md:text-5xl">
              What Regrada Does
            </h2>
            <p className="mb-4 text-xl text-(--text-secondary) md:text-2xl">
              LLMs are non-deterministic — they don&apos;t fail loudly, they
              change quietly.
            </p>
            <p className="mb-8 text-xl text-(--text-secondary) md:text-2xl">
              Regrada captures LLM interactions as traces, evaluates them
              against test cases, and catches behavior changes before
              deployment.
            </p>
            <div className="space-y-2 text-left text-lg text-(--text-muted)">
              <p>
                <span className="text-(--accent)">&gt;</span> Capture LLM calls
                with a transparent proxy
              </p>
              <p>
                <span className="text-(--accent)">&gt;</span> Define tests with
                prompts and checks
              </p>
              <p>
                <span className="text-(--accent)">&gt;</span> Compare results
                against baseline to detect regressions
              </p>
            </div>

            {/* Before/After Comparison */}
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-(--card-negative-border) bg-(--card-negative-bg) p-6 shadow-lg">
                <h3 className="mb-4 font-bold text-(--card-negative-text)">
                  Without Regrada
                </h3>
                <div className="space-y-3 text-sm text-(--text-secondary)">
                  <p>✗ Model updates break production</p>
                  <p>✗ Prompt changes cause silent failures</p>
                  <p>✗ No way to catch regressions early</p>
                  <p>✗ Manual testing is slow & incomplete</p>
                </div>
              </div>
              <div className="rounded-2xl border border-(--card-positive-border) bg-(--card-positive-bg) p-6 shadow-lg">
                <h3 className="mb-4 font-bold text-(--card-positive-text)">
                  With Regrada
                </h3>
                <div className="space-y-3 text-sm text-(--text-secondary)">
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
        <section className="animate-on-scroll border-t border-(--border-color) px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-(--text-primary) md:text-5xl">
              Core Features
            </h2>

            {/* Feature Carousel */}
            <Carousel autoPlay={true} interval={7000}>
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </Carousel>
          </div>
        </section>

        {/* How It Works */}
        <section className="animate-on-scroll border-t border-(--border-color) px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-(--text-primary) md:text-5xl">
              How It Works
            </h2>

            <FlowDiagram
              steps={[
                {
                  number: 1,
                  label: "Capture Traces",
                  description:
                    "Run your code with regrada trace to capture LLM interactions via HTTP proxy",
                },
                {
                  number: 2,
                  label: "Define Tests",
                  description:
                    "Write test cases in YAML with prompts and checks (schema, tool calls, content)",
                },
                {
                  number: 3,
                  label: "Run Checks",
                  description:
                    "Run regrada run to evaluate traces against your test suite",
                },
                {
                  number: 4,
                  label: "Compare with Baseline",
                  description:
                    "Compare results with baseline to detect regressions",
                  canFail: true,
                },
              ]}
            />
          </div>
        </section>

        {/* Who It's For */}
        <section className="animate-on-scroll border-t border-(--border-color) px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-(--text-primary) md:text-5xl">
              Who It&apos;s For
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-(--border-color) bg-(--surface-bg) p-6 shadow-md">
                <p className="text-lg text-(--text-secondary)">
                  <span className="text-(--accent)">•</span> AI startups
                  shipping fast
                </p>
              </div>
              <div className="rounded-2xl border border-(--border-color) bg-(--surface-bg) p-6 shadow-md">
                <p className="text-lg text-(--text-secondary)">
                  <span className="text-(--accent)">•</span> Teams running LLMs
                  in production
                </p>
              </div>
              <div className="rounded-2xl border border-(--border-color) bg-(--surface-bg) p-6 shadow-md">
                <p className="text-lg text-(--text-secondary)">
                  <span className="text-(--accent)">•</span> Infra / platform
                  engineers
                </p>
              </div>
              <div className="rounded-2xl border border-(--border-color) bg-(--surface-bg) p-6 shadow-md">
                <p className="text-lg text-(--text-secondary)">
                  <span className="text-(--accent)">•</span> Enterprises with
                  compliance requirements
                </p>
              </div>
            </div>
            <p className="mt-8 text-center text-xl text-(--accent)">
              If AI is part of your critical path, you need Regrada.
            </p>
          </div>
        </section>

        {/* Why Regrada */}
        <section className="animate-on-scroll border-t border-(--border-color) px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-(--text-primary) md:text-5xl">
              Why Regrada
            </h2>
            <div className="space-y-6 text-center">
              <p className="text-xl text-(--text-secondary)">
                <span className="text-(--accent)">•</span> Traditional tests
                can&apos;t catch LLM behavior changes
              </p>
              <p className="text-xl text-(--text-secondary)">
                <span className="text-(--accent)">•</span> Model updates and
                prompt changes need the same rigor as code
              </p>
              <p className="text-xl text-(--text-secondary)">
                <span className="text-(--accent)">•</span> Catching regressions
                in CI is faster and cheaper than debugging in production
              </p>
              <p className="mt-8 text-2xl font-bold text-(--accent)">
                Regrada makes AI systems testable and reliable.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="animate-on-scroll border-t border-(--border-color) px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-(--text-primary) md:text-5xl">
              Test your AI like you test your code.
            </h2>
            <p className="mb-12 text-xl text-(--text-secondary) md:text-2xl">
              Catch behavioral regressions before they reach production.
            </p>
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@email.com"
                  required
                  className="flex-1 rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-(--text-primary) placeholder:text-(--text-placeholder) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl border border-(--accent) bg-(--accent-bg) px-6 py-3 font-semibold text-(--accent) transition-all hover:bg-(--accent) hover:text-(--button-hover-text) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Submitting..." : "Join Waitlist"}
                </button>
              </div>
              {isSubmitted && (
                <p className="mt-4 text-sm text-(--success)">
                  ✓ Thanks! We&apos;ll keep you updated.
                </p>
              )}
              {error && (
                <p className="mt-4 text-sm text-(--error)">✗ {error}</p>
              )}
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
