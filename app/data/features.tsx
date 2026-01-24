import { FeatureCardProps } from "../components/FeatureCard";

export const features: FeatureCardProps[] = [
  {
    icon: "🔍",
    title: "Policy-Based Regression Detection",
    description: "Configurable policies to detect behavioral changes:",
    items: [
      "Assertions (min pass rate enforcement)",
      "PII leak detection",
      "Text variance checks (token Jaccard)",
      "Refusal rate monitoring",
      "Latency P95 thresholds",
    ],
    footer: "Define policies as code and enforce them in CI.",
  },
  {
    icon: "🧪",
    title: "YAML Test Cases with Assertions",
    description: "Define test cases with structured inputs and assertions:",
    items: [
      "Chat messages (system, user, assistant, tool)",
      "Structured input (YAML map)",
      "Text assertions (contains, max_chars)",
      "JSON schema validation (parsed, not enforced yet)",
    ],
    codeExample: (
      <div className="rounded-xl border border-(--border-color) bg-(--code-bg) p-4 font-mono text-xs shadow-md">
        <p className="text-(--code-purple)">id:</p>
        <p className="text-(--code-green)"> greeting.hello</p>
        <p className="text-(--code-purple)">request:</p>
        <p className="text-(--code-muted)">
          {"  "}
          <span className="text-(--code-blue)">messages:</span>
        </p>
        <p className="text-(--code-muted)">
          {"    - "}
          <span className="text-(--code-blue)">role:</span>
          <span className="text-(--code-green)"> user</span>
        </p>
        <p className="text-(--code-muted)">
          {"      "}
          <span className="text-(--code-blue)">content:</span>
          <span className="text-(--code-green)"> Say hello</span>
        </p>
        <p className="text-(--code-purple) mt-1">assert:</p>
        <p className="text-(--code-muted)">
          {"  "}
          <span className="text-(--code-blue)">text:</span>
        </p>
        <p className="text-(--code-muted)">
          {"    "}
          <span className="text-(--code-blue)">contains:</span>
          <span className="text-(--code-green)"> [&quot;hello&quot;]</span>
        </p>
      </div>
    ),
    footer: "Cases are portable YAML files stored in your repo.",
  },
  {
    icon: "📊",
    title: "HTTP Proxy Recording (MITM)",
    description: "Forward or reverse proxy to capture LLM API traffic:",
    items: [
      "HTTPS MITM with local CA (regrada ca init)",
      "Records to .regrada/traces/ (JSONL)",
      "Session files with metadata",
      "Redaction presets (PII, secrets)",
    ],
    codeExample: (
      <div className="rounded-xl border border-(--border-color) bg-(--code-bg) p-4 font-mono text-xs shadow-md">
        <p className="text-(--code-muted)">
          <span className="text-(--accent)">$</span> regrada record -- npm test
        </p>
        <p className="text-(--code-green) mt-2">
          ✓ Proxy listening on 127.0.0.1:8080
        </p>
        <p className="text-(--code-green)">✓ Recorded 5 API calls</p>
        <p className="text-(--code-muted) mt-2">Session saved to:</p>
        <p className="text-(--code-muted)">
          .regrada/sessions/20250123-143022.json
        </p>
      </div>
    ),
    footer: "Zero code changes — run your app through the proxy.",
  },
  {
    icon: "🚦",
    title: "CI / CD Enforcement",
    description: "First-class GitHub Actions integration:",
    items: [
      "Automatic PR comments with results",
      "Fails CI on regressions",
      "Detailed test output",
      "Works with any CI system",
    ],
    codeExample: (
      <div className="rounded-xl border border-(--border-color) bg-(--code-bg) p-4 font-mono text-xs shadow-md">
        <p className="text-(--code-blue)">
          - uses:{" "}
          <span className="text-(--code-green)">regrada-ai/regrada@v1</span>
        </p>
        <p className="text-(--code-blue)">
          {"  "}
          with:
        </p>
        <p className="text-(--code-muted)">
          {"    "}
          <span className="text-(--code-blue)">fail-on-regression:</span> true
        </p>
        <p className="text-(--code-muted)">
          {"    "}
          <span className="text-(--code-blue)">comment-on-pr:</span> true
        </p>
        <p className="text-(--code-gray) mt-2"># Blocks merge on regressions</p>
      </div>
    ),
    footer: "AI gets the same release discipline as code.",
  },
  {
    icon: "🔌",
    title: "Model-Agnostic & Vendor-Neutral",
    description: "Automatically detects and captures calls to:",
    items: [
      "OpenAI, Anthropic, Azure OpenAI",
      "Google AI (Gemini), Cohere",
      "Ollama and custom endpoints",
    ],
    footer: "Test any LLM without vendor lock-in.",
  },
  {
    icon: "🧠",
    title: "Baseline Modes (Local & Git)",
    description: "Store and compare baselines flexibly:",
    items: [
      "Local mode: snapshots on filesystem",
      "Git mode: read from git ref (origin/main)",
      "Baselines keyed by case, provider, model, params",
      "Automatic diff reporting",
    ],
    footer: "Version-control your baselines alongside code.",
  },
  {
    icon: "📈",
    title: "Drift & Stability Monitoring",
    description: "Compare traces to detect changes in:",
    items: [
      "LLM call counts",
      "Token usage (input/output)",
      "Tool call patterns",
      "Average latency",
    ],
    codeExample: (
      <div className="rounded-xl border border-(--border-color) bg-(--code-bg) p-4 font-mono text-xs shadow-md">
        <div className="space-y-2">
          <p className="text-(--code-muted)">Baseline vs Current:</p>
          <div className="flex items-center gap-2">
            <span className="text-(--code-muted)">Total Calls:</span>
            <span className="text-(--code-green)">5 → 5</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-(--code-muted)">Total Tokens:</span>
            <span className="text-(--code-amber)">2,847 → 3,102 (+9%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-(--code-muted)">Tools Called:</span>
            <span className="text-(--code-red)">2 → 3 (new: validate)</span>
          </div>
        </div>
      </div>
    ),
    footer: "Know exactly what changed between commits.",
  },
  {
    icon: "🧩",
    title: "Complete CLI Workflow",
    description: "Full workflow from recording to testing:",
    items: [
      "regrada init - Initialize config + example case",
      "regrada record -- <cmd> - Capture LLM API calls",
      "regrada accept - Convert traces to cases + baselines",
      "regrada baseline - Generate baseline snapshots",
      "regrada test - Run cases and enforce policies",
      "regrada ca - Manage local CA for HTTPS MITM",
    ],
    codeExample: (
      <div className="rounded-xl border border-(--border-color) bg-(--code-bg) p-4 font-mono text-sm shadow-md">
        <p className="text-(--code-muted)">
          <span className="text-(--accent)">$</span> regrada init
        </p>
        <p className="text-(--code-muted)">
          <span className="text-(--accent)">$</span> regrada record -- npm test
        </p>
        <p className="text-(--code-muted)">
          <span className="text-(--accent)">$</span> regrada accept
        </p>
        <p className="text-(--code-muted)">
          <span className="text-(--accent)">$</span> regrada test
        </p>
      </div>
    ),
    footer: "Simple, composable commands for any workflow.",
  },
];
