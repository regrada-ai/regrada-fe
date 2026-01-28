"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: "-80px 0px -80% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "installation", label: "Installation" },
    { id: "quick-start", label: "Quick Start" },
    { id: "core-concepts", label: "Core Concepts" },
    { id: "cli-commands", label: "CLI Commands" },
    { id: "configuration", label: "Configuration" },
    { id: "case-format", label: "Case Format" },
    { id: "policies", label: "Policies" },
    { id: "recording", label: "Recording Workflow" },
    { id: "baselines", label: "Baselines in Git" },
    { id: "github-action", label: "GitHub Action" },
    { id: "exit-codes", label: "Exit Codes" },
    { id: "troubleshooting", label: "Troubleshooting" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary) overflow-x-hidden">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-(--border-color) p-6 lg:block">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                  activeSection === section.id
                    ? "bg-(--accent-bg) text-accent font-semibold"
                    : "text-(--text-secondary) hover:text-accent hover:bg-(--surface-bg)"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 overflow-x-hidden">
          <div className="mx-auto max-w-4xl overflow-x-hidden">
            {/* Overview */}
            <section id="overview" className="mb-16">
              <h1 className="mb-6 text-4xl font-bold text-(--text-primary) md:text-5xl">
                Regrada Documentation
              </h1>
              <p className="mb-4 text-xl text-(--text-secondary)">
                <strong>CI gate for LLM behavior</strong> — record real model
                traffic, turn it into test cases, and block regressions in CI.
              </p>
              <div className="space-y-3 text-lg text-(--text-secondary)">
                <p>
                  <span className="text-accent">&gt;</span> Records LLM API
                  calls via an HTTP proxy (
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    regrada record
                  </code>
                  )
                </p>
                <p>
                  <span className="text-accent">&gt;</span> Converts recorded
                  traces into portable YAML cases + baseline snapshots (
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    regrada accept
                  </code>
                  )
                </p>
                <p>
                  <span className="text-accent">&gt;</span> Runs cases
                  repeatedly, diffs vs baselines, and enforces configurable
                  policies (
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    regrada test
                  </code>
                  )
                </p>
                <p>
                  <span className="text-accent">&gt;</span> Produces CI-friendly
                  reports (stdout summary, Markdown, JUnit) and a GitHub Action
                </p>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Installation
              </h2>

              <h3 className="mb-3 text-xl font-semibold text-accent">
                macOS / Linux
              </h3>
              <div className="mb-6 rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm overflow-x-auto">
                <code className="text-(--code-muted) whitespace-nowrap">
                  curl -fsSL https://regrada.com/install.sh | sh
                </code>
              </div>
              <p className="mb-6 text-(--text-secondary)">
                The installer downloads a prebuilt binary and installs it to{" "}
                <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                  ~/.local/bin/regrada
                </code>
                . If{" "}
                <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                  regrada
                </code>{" "}
                isn&apos;t found, add{" "}
                <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                  ~/.local/bin
                </code>{" "}
                to your PATH.
              </p>

              <h3 className="mb-3 text-xl font-semibold text-accent">
                Windows
              </h3>
              <p className="mb-6 text-(--text-secondary)">
                The installer targets macOS/Linux. On Windows, run Regrada via
                WSL.
              </p>

              <h3 className="mb-3 text-xl font-semibold text-accent">
                Build from source
              </h3>
              <div className="mb-4 rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm overflow-x-auto">
                <code className="block text-(--code-muted) whitespace-nowrap">
                  mkdir -p bin
                </code>
                <code className="block text-(--code-muted) whitespace-nowrap">
                  go build -o ./bin/regrada .
                </code>
                <code className="block text-(--code-muted) whitespace-nowrap">
                  ./bin/regrada version
                </code>
              </div>
            </section>

            {/* Quick Start */}
            <section id="quick-start" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Quick Start (Local)
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-accent">
                    1. Initialize config + example case
                  </h3>
                  <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <code className="text-(--code-muted)">regrada init</code>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-accent">
                    2. Configure a provider (OpenAI)
                  </h3>
                  <div className="mb-3 rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <code className="text-(--code-muted)">
                      export OPENAI_API_KEY=&quot;...&quot;
                    </code>
                  </div>
                  <p className="mb-2 text-(--text-secondary)">
                    Edit{" "}
                    <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                      regrada.yml
                    </code>
                    :
                  </p>
                  <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <pre className="text-(--code-muted)">
                      {`providers:
  default: openai
  openai:
    model: gpt-4o-mini`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-accent">
                    3. Set baseline mode to local
                  </h3>
                  <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <pre className="text-(--code-muted)">
                      {`baseline:
  mode: local`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-accent">
                    4. Generate baselines and run tests
                  </h3>
                  <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <code className="block text-(--code-muted)">
                      regrada baseline
                    </code>
                    <code className="block text-(--code-muted)">
                      regrada test
                    </code>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Concepts */}
            <section id="core-concepts" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Core Concepts
              </h2>

              <div className="space-y-6">
                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    Cases
                  </h3>
                  <p className="text-(--text-secondary)">
                    A <strong>case</strong> is a YAML file (default:{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      regrada/cases/**/*.yml
                    </code>
                    ) containing a prompt (chat messages or structured input)
                    plus optional assertions.
                  </p>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    Assertions vs Policies
                  </h3>
                  <ul className="list-inside list-disc space-y-2 text-(--text-secondary)">
                    <li>
                      <strong>Case assertions</strong> (
                      <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                        assert:
                      </code>{" "}
                      in a case file) mark individual runs as pass/fail and feed
                      metrics like{" "}
                      <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                        pass_rate
                      </code>
                      .
                    </li>
                    <li>
                      <strong>Policies</strong> (
                      <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                        policies:
                      </code>{" "}
                      in{" "}
                      <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                        regrada.yml
                      </code>
                      ) decide what counts as a <em>warning</em> or{" "}
                      <em>error</em> in CI.
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    Baselines
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    A <strong>baseline</strong> is a stored snapshot (golden
                    output + aggregate metrics) used for regression checks.
                  </p>
                  <p className="mb-3 text-(--text-secondary)">
                    Regrada stores baselines under the snapshot directory
                    (default:{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      .regrada/snapshots/
                    </code>
                    ), keyed by:
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-(--text-secondary)">
                    <li>Case ID</li>
                    <li>Provider + model</li>
                    <li>Sampling params (temperature/top_p/max tokens/stop)</li>
                    <li>System prompt content</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* CLI Commands */}
            <section id="cli-commands" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                CLI Commands
              </h2>

              <div className="space-y-6">
                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    regrada init
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Creates{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      regrada.yml
                    </code>
                    , an example case, and runtime directories.
                  </p>
                  <div className="rounded-lg border border-(--border-color) bg-(--page-bg) p-3 font-mono text-sm">
                    <code className="text-(--code-muted)">regrada init</code>
                  </div>
                  <p className="mt-3 text-sm text-(--text-muted)">
                    Flags:{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      --path
                    </code>
                    ,{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      --force
                    </code>
                    ,{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      --non-interactive
                    </code>
                  </p>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    regrada record
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Starts an HTTP proxy to capture LLM traffic (default:
                    forward proxy with HTTPS MITM).
                  </p>
                  <div className="rounded-lg border border-(--border-color) bg-(--page-bg) p-3 font-mono text-sm">
                    <code className="block text-(--code-muted)">
                      regrada record
                    </code>
                    <code className="block text-(--code-muted)">
                      regrada record -- python app.py
                    </code>
                    <code className="block text-(--code-muted)">
                      regrada record -- npm test
                    </code>
                  </div>
                  <p className="mt-3 text-sm text-(--text-muted)">
                    Recorded traces are written to{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      .regrada/traces/
                    </code>{" "}
                    (JSONL) and sessions to{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      .regrada/sessions/
                    </code>
                    .
                  </p>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    regrada accept
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Converts traces from the latest (or specified) session into
                    cases and baselines.
                  </p>
                  <div className="rounded-lg border border-(--border-color) bg-(--page-bg) p-3 font-mono text-sm">
                    <code className="block text-(--code-muted)">
                      regrada accept
                    </code>
                    <code className="block text-(--code-muted)">
                      regrada accept --session
                      .regrada/sessions/20250101-120000.json
                    </code>
                  </div>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    regrada baseline
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Runs all discovered cases once and writes baseline
                    snapshots.
                  </p>
                  <div className="rounded-lg border border-(--border-color) bg-(--page-bg) p-3 font-mono text-sm">
                    <code className="text-(--code-muted)">
                      regrada baseline
                    </code>
                  </div>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    regrada test
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Runs cases, diffs against baselines, evaluates policies, and
                    writes reports.
                  </p>
                  <div className="rounded-lg border border-(--border-color) bg-(--page-bg) p-3 font-mono text-sm">
                    <code className="text-(--code-muted)">regrada test</code>
                  </div>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    regrada ca
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Manages the local Root CA required for forward-proxy HTTPS
                    interception.
                  </p>
                  <div className="rounded-lg border border-(--border-color) bg-(--page-bg) p-3 font-mono text-sm">
                    <code className="block text-(--code-muted)">
                      regrada ca init
                    </code>
                    <code className="block text-(--code-muted)">
                      regrada ca install
                    </code>
                    <code className="block text-(--code-muted)">
                      regrada ca status
                    </code>
                    <code className="block text-(--code-muted)">
                      regrada ca uninstall
                    </code>
                  </div>
                </div>
              </div>
            </section>

            {/* Configuration */}
            <section id="configuration" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Configuration (regrada.yml)
              </h2>

              <p className="mb-4 text-(--text-secondary)">
                Minimal working config for OpenAI:
              </p>
              <div className="mb-8 rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                <pre className="text-(--code-muted)">
                  {`version: 1

providers:
  default: openai
  openai:
    model: gpt-4o-mini

baseline:
  mode: local

policies:
  - id: assertions
    severity: error
    check:
      type: assertions
      min_pass_rate: 1.0`}
                </pre>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    Providers
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Implemented today:
                  </p>
                  <ul className="mb-3 list-inside list-disc text-(--text-secondary)">
                    <li>
                      <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                        openai
                      </code>{" "}
                      (Chat Completions)
                    </li>
                    <li>
                      <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                        mock
                      </code>{" "}
                      (returns &quot;mock response&quot;)
                    </li>
                  </ul>
                  <p className="text-(--text-secondary)">
                    Scaffolded but not implemented:{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      anthropic
                    </code>
                    ,{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      azure_openai
                    </code>
                    ,{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      bedrock
                    </code>
                  </p>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    Case Discovery
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Defaults (can be overridden under{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      cases:
                    </code>
                    ):
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-(--text-secondary)">
                    <li>
                      Roots:{" "}
                      <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                        [&quot;regrada/cases&quot;]
                      </code>
                    </li>
                    <li>
                      Include globs:{" "}
                      <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                        [&quot;**/*.yml&quot;, &quot;**/*.yaml&quot;]
                      </code>
                    </li>
                    <li>
                      Exclude globs:{" "}
                      <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                        [&quot;**/README.*&quot;]
                      </code>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    Baseline Modes
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Git baseline config (recommended for CI):
                  </p>
                  <div className="rounded-lg border border-(--border-color) bg-(--page-bg) p-3 font-mono text-sm">
                    <pre className="text-(--code-muted)">
                      {`baseline:
  mode: git
  git:
    ref: origin/main
    snapshot_dir: .regrada/snapshots`}
                    </pre>
                  </div>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-3 text-xl font-semibold text-accent">
                    Reports
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    Enable JUnit output for CI:
                  </p>
                  <div className="rounded-lg border border-(--border-color) bg-(--page-bg) p-3 font-mono text-sm">
                    <pre className="text-(--code-muted)">
                      {`report:
  format: [summary, markdown, junit]
  junit:
    path: .regrada/junit.xml`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Case Format */}
            <section id="case-format" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Case Format
              </h2>

              <p className="mb-4 text-(--text-secondary)">
                Example test case (
                <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                  regrada/cases/**/*.yml
                </code>
                ):
              </p>
              <div className="mb-6 rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                <pre className="text-(--code-muted)">
                  {`id: greeting.hello
tags: [smoke]

request:
  messages:
    - role: system
      content: You are a concise assistant.
    - role: user
      content: Say hello and ask for a name.
  params:
    temperature: 0.2
    top_p: 1.0

assert:
  text:
    contains: ["hello"]
    max_chars: 120`}
                </pre>
              </div>

              <div className="space-y-3 text-(--text-secondary)">
                <p>
                  <span className="text-accent">&gt;</span>{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    request
                  </code>{" "}
                  must specify <strong>either</strong>{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    messages
                  </code>{" "}
                  <strong>or</strong>{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    input
                  </code>{" "}
                  (a YAML map)
                </p>
                <p>
                  <span className="text-accent">&gt;</span> Roles must be{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    system
                  </code>
                  ,{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    user
                  </code>
                  ,{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    assistant
                  </code>
                  , or{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    tool
                  </code>
                </p>
                <p>
                  <span className="text-accent">&gt;</span>{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    assert.json.schema
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    assert.json.path
                  </code>{" "}
                  are parsed/validated but <strong>not enforced yet</strong> by
                  the runner
                </p>
              </div>
            </section>

            {/* Policies */}
            <section id="policies" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Policies
              </h2>

              <p className="mb-4 text-(--text-secondary)">
                Policies are how you turn runs/diffs into CI gates. Common
                setup:
              </p>
              <div className="mb-8 rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                <pre className="text-(--code-muted)">
                  {`policies:
  - id: assertions
    severity: error
    check:
      type: assertions
      min_pass_rate: 1.0

  - id: no_pii
    severity: error
    check:
      type: pii_leak
      detector: pii_strict
      max_incidents: 0

  - id: stable_text
    severity: warn
    check:
      type: variance
      metric: token_jaccard
      max_p95: 0.35`}
                </pre>
              </div>

              <h3 className="mb-4 text-xl font-semibold text-accent">
                Supported Policy Types
              </h3>
              <div className="space-y-3 text-sm text-(--text-secondary)">
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    assertions
                  </code>{" "}
                  — validates case-level assertions pass rate
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    json_valid
                  </code>{" "}
                  — ensures JSON output validity
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    text_contains
                  </code>{" "}
                  — pattern matching (required phrases)
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    text_not_contains
                  </code>{" "}
                  — negative pattern matching
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    pii_leak
                  </code>{" "}
                  — detects PII leakage with configurable detectors
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    variance
                  </code>{" "}
                  — controls output stability (token Jaccard similarity)
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    refusal_rate
                  </code>{" "}
                  — monitors model refusal behavior
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    latency
                  </code>{" "}
                  — P95 latency thresholds
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    json_schema
                  </code>{" "}
                  — schema validation (scaffolded, not implemented yet)
                </p>
              </div>
            </section>

            {/* Recording Workflow */}
            <section id="recording" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Recording Workflow
              </h2>

              <h3 className="mb-4 text-xl font-semibold text-accent">
                Forward Proxy (Recommended)
              </h3>
              <div className="mb-6 space-y-4">
                <div>
                  <p className="mb-2 text-(--text-secondary)">
                    1. Generate and trust the local CA:
                  </p>
                  <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <code className="block text-(--code-muted)">
                      regrada ca init
                    </code>
                    <code className="block text-(--code-muted)">
                      regrada ca install
                    </code>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-(--text-secondary)">
                    2. Run your app/tests through the proxy:
                  </p>
                  <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <code className="text-(--code-muted)">
                      regrada record -- ./run-my-tests.sh
                    </code>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-(--text-secondary)">
                    3. Convert the latest session into cases + baselines:
                  </p>
                  <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <code className="text-(--code-muted)">regrada accept</code>
                  </div>
                </div>
              </div>

              <h3 className="mb-4 text-xl font-semibold text-accent">
                Reverse Proxy (No MITM)
              </h3>
              <p className="text-(--text-secondary)">
                Set{" "}
                <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                  capture.proxy.mode: reverse
                </code>{" "}
                and point your LLM base URL at the proxy. This mode does not
                require installing the CA, but your application must be
                configurable to talk to the proxy instead of the upstream API.
              </p>
            </section>

            {/* Baselines in Git */}
            <section id="baselines" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Baselines in Git (Recommended for CI)
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-accent">
                    1. Version-control your snapshot directory
                  </h3>
                  <p className="mb-3 text-(--text-secondary)">
                    By default,{" "}
                    <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                      regrada init
                    </code>{" "}
                    adds{" "}
                    <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                      .regrada/
                    </code>{" "}
                    to{" "}
                    <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                      .gitignore
                    </code>
                    . Un-ignore the snapshots directory:
                  </p>
                  <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <pre className="text-(--code-muted)">
                      {`.regrada/*
!.regrada/snapshots/
!.regrada/snapshots/**`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-accent">
                    2. Generate and commit snapshots on your baseline branch
                  </h3>
                  <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                    <code className="block text-(--code-muted)">
                      regrada baseline
                    </code>
                    <code className="block text-(--code-muted)">
                      git add .regrada/snapshots regrada/cases regrada.yml
                    </code>
                    <code className="block text-(--code-muted)">
                      git commit -m &quot;Update Regrada baselines&quot;
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-accent">
                    3. In PR branches/CI, run tests with git mode
                  </h3>
                  <p className="text-(--text-secondary)">
                    Use{" "}
                    <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                      baseline.mode: git
                    </code>{" "}
                    and{" "}
                    <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                      baseline.git.ref: origin/main
                    </code>
                    .
                  </p>
                </div>
              </div>
            </section>

            {/* GitHub Action */}
            <section id="github-action" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                GitHub Action
              </h2>

              <p className="mb-4 text-(--text-secondary)">
                Example workflow configuration:
              </p>
              <div className="mb-6 rounded-xl border border-(--border-color) bg-(--surface-bg) p-4 font-mono text-sm">
                <pre className="text-(--code-muted)">
                  {`name: Regrada
on:
  pull_request:

jobs:
  regrada:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # required for baseline.mode=git

      - uses: regrada-ai/regrada@v1
        with:
          config: regrada.yml
          comment-on-pr: true
          working-directory: .`}
                </pre>
              </div>

              <h3 className="mb-4 text-xl font-semibold text-accent">
                Action Inputs
              </h3>
              <div className="mb-6 overflow-x-auto rounded-xl border border-(--border-color)">
                <table className="w-full text-sm">
                  <thead className="border-b border-(--border-color) bg-(--surface-bg)">
                    <tr>
                      <th className="px-4 py-3 text-left text-accent">Input</th>
                      <th className="px-4 py-3 text-left text-accent">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-accent">
                        Default
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--border-color)">
                    <tr className="bg-(--surface-bg)">
                      <td className="px-4 py-3 font-mono text-accent">
                        config
                      </td>
                      <td className="px-4 py-3 text-(--text-secondary)">
                        Path to regrada.yml/regrada.yaml
                      </td>
                      <td className="px-4 py-3 text-(--text-secondary)">
                        regrada.yml
                      </td>
                    </tr>
                    <tr className="bg-(--surface-bg)">
                      <td className="px-4 py-3 font-mono text-accent">
                        comment-on-pr
                      </td>
                      <td className="px-4 py-3 text-(--text-secondary)">
                        Post .regrada/report.md as a PR comment
                      </td>
                      <td className="px-4 py-3 text-(--text-secondary)">
                        true
                      </td>
                    </tr>
                    <tr className="bg-(--surface-bg)">
                      <td className="px-4 py-3 font-mono text-accent">
                        working-directory
                      </td>
                      <td className="px-4 py-3 text-(--text-secondary)">
                        Directory to run regrada test in
                      </td>
                      <td className="px-4 py-3 text-(--text-secondary)">.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 text-xl font-semibold text-accent">
                Action Outputs
              </h3>
              <div className="space-y-2 text-(--text-secondary)">
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    total
                  </code>{" "}
                  — Total number of cases
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    passed
                  </code>{" "}
                  — Number of passed cases
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    warned
                  </code>{" "}
                  — Number of warned cases
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    failed
                  </code>{" "}
                  — Number of failed cases
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    result
                  </code>{" "}
                  —{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    success
                  </code>
                  ,{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    warning
                  </code>
                  , or{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    failure
                  </code>
                </p>
              </div>
            </section>

            {/* Exit Codes */}
            <section id="exit-codes" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Exit Codes
              </h2>

              <p className="mb-4 text-(--text-secondary)">
                <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                  regrada test
                </code>{" "}
                uses exit codes to help CI distinguish failure modes:
              </p>
              <div className="space-y-3 text-(--text-secondary)">
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    0
                  </code>{" "}
                  — No failing policy violations
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    1
                  </code>{" "}
                  — Internal error (provider/report/etc.)
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    2
                  </code>{" "}
                  — Policy violations (as configured by{" "}
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    ci.fail_on
                  </code>
                  )
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    3
                  </code>{" "}
                  — Invalid config / no cases discovered
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    4
                  </code>{" "}
                  — Missing baseline snapshot
                </p>
                <p>
                  <code className="rounded bg-(--surface-bg) px-2 py-1 text-accent">
                    5
                  </code>{" "}
                  — Evaluation error (provider call failed, timeout, etc.)
                </p>
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-(--text-primary)">
                Troubleshooting
              </h2>

              <div className="space-y-6">
                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-2 text-lg font-semibold text-(--status-error)">
                    &quot;config not found&quot;
                  </h3>
                  <p className="text-(--text-secondary)">
                    Create{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      regrada.yml
                    </code>{" "}
                    by running{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      regrada init
                    </code>{" "}
                    or pass{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      --config
                    </code>{" "}
                    to specify a different path.
                  </p>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-2 text-lg font-semibold text-(--status-error)">
                    Exit code 4 / baseline missing
                  </h3>
                  <p className="text-(--text-secondary)">
                    Run{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      regrada baseline
                    </code>{" "}
                    on your baseline ref and commit snapshots. Ensure CI fetches{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      baseline.git.ref
                    </code>
                    .
                  </p>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-2 text-lg font-semibold text-(--status-error)">
                    OpenAI auth errors
                  </h3>
                  <p className="text-(--text-secondary)">
                    Set{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      OPENAI_API_KEY
                    </code>{" "}
                    or configure{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      providers.openai.api_key
                    </code>{" "}
                    in{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      regrada.yml
                    </code>
                    .
                  </p>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--surface-bg) p-6">
                  <h3 className="mb-2 text-lg font-semibold text-(--status-error)">
                    Recording HTTPS fails
                  </h3>
                  <p className="text-(--text-secondary)">
                    Run{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      regrada ca init
                    </code>{" "}
                    +{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      regrada ca install
                    </code>
                    , and confirm{" "}
                    <code className="rounded bg-(--page-bg) px-2 py-1 text-accent">
                      capture.proxy.allow_hosts
                    </code>{" "}
                    includes your provider host.
                  </p>
                </div>
              </div>
            </section>

            {/* Back to Top */}
            <div className="mt-16 border-t border-(--border-color) pt-8 text-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="rounded-xl border border-accent bg-(--accent-bg) px-6 py-3 font-semibold text-accent transition-all hover:bg-accent hover:text-(--button-hover-text)"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
