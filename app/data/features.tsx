import { FeatureCardProps } from "../components/FeatureCard";

export const features: FeatureCardProps[] = [
  {
    icon: "🔍",
    title: "Behavioral Regression Detection",
    description: "Compare current behavior against baseline to detect:",
    items: [
      "Changes in tool/function calls",
      "Model output drift",
      "Response structure violations",
      "Token usage changes",
      "Latency regressions",
    ],
    footer: "Get notified when AI behavior silently changes between commits.",
  },
  {
    icon: "🧪",
    title: "Scenario-Based Testing for AI",
    description: "Write tests in YAML with prompts and checks:",
    items: [
      "Schema validation",
      "Tool call verification",
      "Content matching (exact, contains, similarity)",
      "Custom check types",
    ],
    codeExample: (
      <div className="rounded-xl border border-(--border-color) bg-(--code-bg) p-4 font-mono text-xs shadow-md">
        <p className="text-(--code-purple)">tests:</p>
        <p className="text-(--code-muted)">
          {" "}
          -<span className="text-(--code-blue)"> name:</span>
          <span className="text-(--code-green)"> refund_request</span>
        </p>
        <p className="text-(--code-muted)">
          {"   "}
          <span className="text-(--code-blue)">prompt:</span>
          <span className="text-(--code-green)">
            {" "}
            &quot;I want a refund&quot;
          </span>
        </p>
        <p className="text-(--code-muted)">
          {"   "}
          <span className="text-(--code-blue)">checks:</span>
        </p>
        <p className="text-(--code-muted)">
          {"     - "}
          <span className="text-(--code-green)">
            &quot;tool_called:refund.lookup&quot;
          </span>
        </p>
        <p className="text-(--code-muted)">
          {"     - "}
          <span className="text-(--code-green)">
            &quot;contains:order&quot;
          </span>
        </p>
      </div>
    ),
    footer: "Define expected behavior declaratively.",
  },
  {
    icon: "📊",
    title: "Transparent Trace Capture",
    description: "Regrada uses an HTTP proxy to capture LLM calls:",
    items: [
      "Zero code changes required",
      "Records full request/response",
      "Tracks tokens, latency, tool calls",
      "Saves traces for comparison",
    ],
    codeExample: (
      <div className="rounded-xl border border-(--border-color) bg-(--code-bg) p-4 font-mono text-xs shadow-md">
        <p className="text-(--code-muted)">
          <span className="text-(--accent)">$</span> regrada trace -- npm test
        </p>
        <p className="text-(--code-green) mt-2">
          ✓ Proxy started on localhost:8080
        </p>
        <p className="text-(--code-green)">✓ Captured 3 LLM calls</p>
        <p className="text-(--code-muted)] mt-2">Saved to .regrada/traces/</p>
        <p className="text-(--code-muted)">- Model: gpt-4</p>
        <p className="text-(--code-muted)">- Total tokens: 2,847</p>
        <p className="text-(--code-muted)">- Tools called: 2</p>
      </div>
    ),
    footer: "Run your code normally — Regrada captures everything.",
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
    title: "Comprehensive Check Types",
    description: "Built-in checks for:",
    items: [
      "Schema validation (JSON structure)",
      "Tool call verification",
      "Content matching (exact, contains, any)",
      "Similarity scoring (cosine, Levenshtein)",
    ],
    footer: "Extensible check system for custom requirements.",
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
            <span className="text-(--code-amber)">
              2,847 → 3,102 (+9%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-(--code-muted)">
              Tools Called:
            </span>
            <span className="text-(--code-red)">
              2 → 3 (new: validate)
            </span>
          </div>
        </div>
      </div>
    ),
    footer: "Know exactly what changed between commits.",
  },
  {
    icon: "🧩",
    title: "Lightweight SDK & CLI",
    description: "Simple CLI. Zero dependencies.",
    items: [
      "regrada init - Initialize your project",
      "regrada trace -- <cmd> - Capture LLM calls",
      "regrada run --ci - Run evaluations in CI",
    ],
    codeExample: (
      <div className="rounded-xl border border-(--border-color) bg-(--code-bg) p-4 font-mono text-sm shadow-md">
        <p className="text-(--code-muted)">
          <span className="text-(--accent)">$</span> regrada init
        </p>
        <p className="text-(--code-muted)">
          <span className="text-(--accent)">$</span> regrada trace --
          npm test
        </p>
        <p className="text-(--code-muted)">
          <span className="text-(--accent)">$</span> regrada run --ci
        </p>
      </div>
    ),
    footer: "Works locally and in any CI system.",
  },
];
