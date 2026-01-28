"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticatedFetch, authAPI, type User } from "../lib/api";
import { useOrganization } from "../contexts/OrganizationContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import ProjectSelector from "../components/ProjectSelector";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import LatencyChart from "../components/charts/LatencyChart";
import TokenUsageChart from "../components/charts/TokenUsageChart";
import TestResultsChart from "../components/charts/TestResultsChart";
import TraceDetailDialog from "../components/charts/TraceDetailDialog";
import TestRunDetailDialog from "../components/charts/TestRunDetailDialog";
import {
  ApiKeyCreateResponse,
  ApiKeyRecord,
  ApiKeyTier,
  TraceRecord,
  TestRunRecord,
} from "../data/dashboard";
import { Label } from "../components/ui/label";

type DashboardConfig = {
  projectId: string;
};

const CONFIG_STORAGE_KEY = "regrada.dashboard.config";
const DEFAULT_SCOPES = ["traces:write", "tests:write", "projects:read"];

// API base URL from environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_REGRADA_API_BASE_URL ?? "http://localhost:8080";

const envDefaults: DashboardConfig = {
  projectId: process.env.NEXT_PUBLIC_REGRADA_PROJECT_ID ?? "",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("en-US");

type RunStatus = "passed" | "warning" | "failed" | "unknown";

const statusStyles: Record<
  RunStatus,
  {
    label: string;
    variant: "status-success" | "status-warning" | "status-error" | "outline";
  }
> = {
  passed: {
    label: "Passed",
    variant: "status-success",
  },
  warning: {
    label: "Warning",
    variant: "status-warning",
  },
  failed: {
    label: "Failed",
    variant: "status-error",
  },
  unknown: {
    label: "Unknown",
    variant: "outline",
  },
};

const formatDate = (value?: string | null) =>
  value ? dateFormatter.format(new Date(value)) : "--";
const formatNumber = (value: number) => numberFormatter.format(value);
const shortSha = (sha?: string) => (sha ? sha.slice(0, 7) : "--");
const toTimestamp = (value?: string) => (value ? Date.parse(value) : 0);

const resolveStatus = (value?: string): RunStatus => {
  if (value === "passed" || value === "warning" || value === "failed") {
    return value;
  }
  return "unknown";
};

// Removed - using authenticatedFetch from lib/api.ts instead

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    currentOrganizationId,
    loading: userLoading,
  } = useOrganization();
  const [config, setConfig] = useState<DashboardConfig>(envDefaults);
  const [configLoaded, setConfigLoaded] = useState(false);

  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [traces, setTraces] = useState<TraceRecord[]>([]);
  const [testRuns, setTestRuns] = useState<TestRunRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyTier, setNewKeyTier] = useState<ApiKeyTier>("standard");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(DEFAULT_SCOPES);
  const [lastCreatedKey, setLastCreatedKey] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  // Dialog state for detail views
  const [selectedTrace, setSelectedTrace] = useState<TraceRecord | null>(null);
  const [selectedTestRun, setSelectedTestRun] = useState<TestRunRecord | null>(
    null,
  );
  const [traceDialogOpen, setTraceDialogOpen] = useState(false);
  const [testRunDialogOpen, setTestRunDialogOpen] = useState(false);

  const isConfigured = Boolean(
    API_BASE_URL && config.projectId && currentOrganizationId && user,
  );

  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DashboardConfig;
        if (parsed?.projectId) {
          setConfig(parsed);
        }
      } catch (error) {
        console.warn("Failed to read stored dashboard config", error);
        setConfig(envDefaults);
      }
    } else {
      setConfig(envDefaults);
    }
    setConfigLoaded(true);
  }, []);

  useEffect(() => {
    if (!configLoaded) return;
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  }, [config, configLoaded]);

  useEffect(() => {
    if (!copyMessage) return;
    const timeout = window.setTimeout(() => setCopyMessage(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [copyMessage]);

  useEffect(() => {
    if (!configLoaded) return;
    setDataError(null);

    if (!isConfigured) {
      setTraces([]);
      setTestRuns([]);
      setApiKeys([]);
      setDataLoading(false);
      return;
    }

    const controller = new AbortController();
    setDataLoading(true);

    const loadData = async () => {
      try {
        const [tracePayload, testRunPayload, apiKeyPayload] = await Promise.all(
          [
            authenticatedFetch<{ traces: TraceRecord[] }>(
              `${API_BASE_URL}/v1/projects/${config.projectId}/traces`,
              { signal: controller.signal },
            ),
            authenticatedFetch<{ test_runs: TestRunRecord[] }>(
              `${API_BASE_URL}/v1/projects/${config.projectId}/test-runs`,
              { signal: controller.signal },
            ),
            authenticatedFetch<{ api_keys: ApiKeyRecord[] }>(
              `${API_BASE_URL}/v1/api-keys`,
              { signal: controller.signal },
            ),
          ],
        );

        if (!controller.signal.aborted) {
          setTraces(tracePayload.traces ?? []);
          setTestRuns(testRunPayload.test_runs ?? []);
          setApiKeys(apiKeyPayload.api_keys ?? []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setDataError(
            error instanceof Error ? error.message : "Failed to load data",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setDataLoading(false);
        }
      }
    };

    loadData();

    return () => controller.abort();
  }, [config.projectId, configLoaded, isConfigured]);

  const sortedTraces = useMemo(
    () =>
      [...traces].sort(
        (a, b) => toTimestamp(b.timestamp) - toTimestamp(a.timestamp),
      ),
    [traces],
  );

  const sortedTestRuns = useMemo(
    () =>
      [...testRuns].sort(
        (a, b) => toTimestamp(b.timestamp) - toTimestamp(a.timestamp),
      ),
    [testRuns],
  );

  const traceMetrics = useMemo(() => {
    const latencyValues: number[] = [];
    const tokenTotals: number[] = [];
    let totalTokensIn = 0;
    let totalTokensOut = 0;
    let totalLatency = 0;

    sortedTraces.forEach((trace) => {
      const metrics = trace.metrics || {};
      const latency = metrics.latency_ms ?? 0;
      const tokensIn = metrics.tokens_in ?? 0;
      const tokensOut = metrics.tokens_out ?? 0;

      latencyValues.push(latency);
      tokenTotals.push(tokensIn + tokensOut);
      totalTokensIn += tokensIn;
      totalTokensOut += tokensOut;
      totalLatency += latency;
    });

    const latencyMax = latencyValues.length ? Math.max(...latencyValues) : 0;
    const latencyMin = latencyValues.length ? Math.min(...latencyValues) : 0;
    const tokenMax = tokenTotals.length ? Math.max(...tokenTotals) : 0;
    const avgLatency = latencyValues.length
      ? Math.round(totalLatency / latencyValues.length)
      : 0;
    const totalTokens = totalTokensIn + totalTokensOut;

    return {
      latencyValues,
      tokenTotals,
      totalTokensIn,
      totalTokensOut,
      totalTokens,
      avgLatency,
      latencyMax,
      latencyMin,
      tokenMax,
    };
  }, [sortedTraces]);

  const latestRun = sortedTestRuns[0];
  const latestPassRate =
    latestRun && latestRun.total_cases
      ? Math.round((latestRun.passed_cases / latestRun.total_cases) * 100)
      : 0;

  const totalViolations = useMemo(
    () =>
      sortedTestRuns.reduce(
        (sum, run) => sum + (run.violations?.length ?? 0),
        0,
      ),
    [sortedTestRuns],
  );

  const allViolations = useMemo(
    () =>
      sortedTestRuns.flatMap((run) =>
        (run.violations ?? []).map((violation) => ({
          run: run.run_id,
          ...violation,
        })),
      ),
    [sortedTestRuns],
  );

  const connectionLabel = dataLoading
    ? "Syncing"
    : dataError
      ? "Attention"
      : isConfigured
        ? "Connected"
        : "Not configured";
  const connectionVariant = dataLoading
    ? "status-warning"
    : dataError
      ? "status-error"
      : isConfigured
        ? "status-success"
        : ("outline" as const);

  const handleProjectChange = (projectId: string) => {
    setConfig((prev) => ({ ...prev, projectId }));
    setLastCreatedKey(null);
    setCreateError(null);
    setCopyMessage(null);
  };

  const handleCreateKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);

    if (!newKeyName.trim()) return;
    if (!isConfigured) {
      setCreateError("Select a project before creating keys.");
      return;
    }

    setCreateLoading(true);
    try {
      const payload = await authenticatedFetch<ApiKeyCreateResponse>(
        `${API_BASE_URL}/v1/api-keys`,
        {
          method: "POST",
          body: JSON.stringify({
            name: newKeyName.trim(),
            tier: newKeyTier,
            scopes: newKeyScopes.length ? newKeyScopes : DEFAULT_SCOPES,
          }),
        },
      );

      setApiKeys((prev) => [payload.api_key, ...prev]);
      setLastCreatedKey(payload.secret);
      setNewKeyName("");
      setNewKeyScopes(DEFAULT_SCOPES);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Failed to create API key",
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const toggleScope = (scope: string) => {
    setNewKeyScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((item) => item !== scope)
        : [...prev, scope],
    );
  };

  const handleCopy = async (value: string) => {
    if (!navigator.clipboard) {
      setCopyMessage("Clipboard unavailable");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage("Copied");
    } catch (error) {
      console.warn("Failed to copy", error);
      setCopyMessage("Copy failed");
    }
  };

  // Prepare chart data from traces - MUST be before early returns
  const latencyChartData = useMemo(() => {
    return traces
      .slice(0, 10)
      .reverse()
      .map((trace, index) => ({
        timestamp: trace.timestamp,
        latency: trace.metrics.latency_ms || 0,
        label: `T${index + 1}`,
      }));
  }, [traces]);

  const tokenChartData = useMemo(() => {
    return traces
      .slice(0, 10)
      .reverse()
      .map((trace, index) => ({
        timestamp: trace.timestamp,
        tokens:
          (trace.metrics.tokens_in || 0) + (trace.metrics.tokens_out || 0),
        label: `T${index + 1}`,
      }));
  }, [traces]);

  const handleSignOut = async () => {
    try {
      await authAPI.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      router.push("/login");
    }
  };

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--page-bg) text-(--text-primary)">
        <div className="text-center">
          <div className="text-2xl font-semibold">Loading...</div>
          <p className="mt-2 text-sm text-(--text-muted)">
            Checking authentication
          </p>
        </div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-(--border-color) bg-(--surface-bg)/90 p-8 text-center shadow-lg">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome to Regrada</h1>
              <p className="text-lg text-(--text-secondary)">
                Please log in to access your dashboard
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-(--accent) bg-(--accent-bg) px-5 py-2 text-center text-sm font-semibold text-(--accent) transition-all hover:bg-(--accent) hover:text-(--button-hover-text)"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-(--border-color) bg-(--surface-bg) px-5 py-2 text-center text-sm font-semibold text-(--text-secondary) transition-all hover:border-(--accent) hover:text-(--accent)"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
      <Header />

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(47,95,153,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(35,116,74,0.14),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.1),transparent)]" />

        <section className="border-b border-(--border-color) px-4 py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.4em] text-(--text-muted)">
                  Dashboard
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {user?.picture && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.picture}
                        alt={user.name || "User profile"}
                        className="h-8 w-8 rounded-full border border-(--border-color)"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-(--text-primary)">
                        {user?.name}
                      </span>
                      <span className="text-xs text-(--text-muted)">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="secondary"
                    className="px-5 py-2 text-sm font-semibold"
                  >
                    Log Out
                  </Button>
                </div>
              </div>
              <h1 className="text-4xl font-bold md:text-5xl">
                Behavior observability in motion.
              </h1>
              <p className="max-w-2xl text-lg text-(--text-secondary)">
                Track LLM traces, regression signals, and API usage across every
                environment. Align product and infra teams with live evidence
                from regrada-be.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#api-keys"
                  className="rounded-xl border border-(--accent) bg-(--accent-bg) px-5 py-2 text-sm font-semibold text-(--accent) transition-all hover:bg-(--accent) hover:text-(--button-hover-text)"
                >
                  Manage API keys
                </a>
                <a
                  href="#traces"
                  className="rounded-xl border border-(--border-color) bg-(--surface-bg) px-5 py-2 text-sm font-semibold text-(--text-secondary) transition-all hover:border-(--accent) hover:text-(--accent)"
                >
                  View traces
                </a>
                <a
                  href="#test-runs"
                  className="rounded-xl border border-(--border-color) bg-(--surface-bg) px-5 py-2 text-sm font-semibold text-(--text-secondary) transition-all hover:border-(--accent) hover:text-(--accent)"
                >
                  Test results
                </a>
              </div>
            </div>

            <div className="w-full max-w-md space-y-4">
              <Card className="rounded-2xl bg-(--surface-bg)/85 shadow-lg backdrop-blur">
                <CardHeader className="px-6 pt-6 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[0.3em] text-(--text-muted)">
                      Connection
                    </div>
                    <Badge variant={connectionVariant}>{connectionLabel}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="mt-4 space-y-3">
                    {currentOrganizationId && (
                      <ProjectSelector
                        apiBaseUrl={API_BASE_URL}
                        organizationId={currentOrganizationId}
                        selectedProjectId={config.projectId}
                        onProjectChange={handleProjectChange}
                      />
                    )}
                  </div>
                  {dataError && (
                    <p className="mt-3 text-xs text-(--error)">{dataError}</p>
                  )}
                  {isConfigured && !dataError && (
                    <p className="mt-3 text-xs text-(--text-muted)">
                      Pulling data from {API_BASE_URL}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl bg-(--surface-bg)/85 shadow-lg backdrop-blur">
                <CardHeader className="px-6 pt-6 pb-0">
                  <div className="text-xs uppercase tracking-[0.3em] text-(--text-muted)">
                    Live status
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-(--text-muted)">Latest run</span>
                      {latestRun ? (
                        <Badge
                          variant={
                            statusStyles[resolveStatus(latestRun.status)]
                              .variant
                          }
                        >
                          {statusStyles[resolveStatus(latestRun.status)].label}
                        </Badge>
                      ) : (
                        <span className="text-(--text-muted)">No runs</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-(--text-muted)">
                        Policy violations
                      </span>
                      <span className="text-sm font-semibold">
                        {isConfigured ? totalViolations : "--"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-(--text-muted)">Trace volume</span>
                      <span className="text-sm font-semibold">
                        {isConfigured
                          ? `${sortedTraces.length} in last 24h`
                          : "--"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-(--text-muted)">Avg latency</span>
                      <span className="text-sm font-semibold">
                        {isConfigured ? `${traceMetrics.avgLatency} ms` : "--"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="rounded-2xl bg-(--surface-bg)/80 p-5 shadow-sm backdrop-blur">
                <CardContent className="p-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                    Active keys
                  </p>
                  <p className="mt-3 text-3xl font-semibold">
                    {formatNumber(apiKeys.length)}
                  </p>
                  <p className="mt-2 text-sm text-(--text-secondary)">
                    Across {new Set(apiKeys.map((key) => key.tier)).size} tiers
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl bg-(--surface-bg)/80 p-5 shadow-sm backdrop-blur">
                <CardContent className="p-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                    Tokens today
                  </p>
                  <p className="mt-3 text-3xl font-semibold">
                    {formatNumber(traceMetrics.totalTokens)}
                  </p>
                  <p className="mt-2 text-sm text-(--text-secondary)">
                    {formatNumber(traceMetrics.totalTokensIn)} in /{" "}
                    {formatNumber(traceMetrics.totalTokensOut)} out
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl bg-(--surface-bg)/80 p-5 shadow-sm backdrop-blur">
                <CardContent className="p-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                    Avg latency
                  </p>
                  <p className="mt-3 text-3xl font-semibold">
                    {formatNumber(traceMetrics.avgLatency)} ms
                  </p>
                  <p className="mt-2 text-sm text-(--text-secondary)">
                    P95 tracking available in traces
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl bg-(--surface-bg)/80 p-5 shadow-sm backdrop-blur">
                <CardContent className="p-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                    Latest pass rate
                  </p>
                  <p className="mt-3 text-3xl font-semibold">
                    {latestPassRate}%
                  </p>
                  <p className="mt-2 text-sm text-(--text-secondary)">
                    {latestRun ? latestRun.total_cases : 0} cases evaluated
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="api-keys" className="px-4 py-12">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                API key management
              </h2>
              <p className="mt-2 max-w-3xl text-lg text-(--text-secondary)">
                Issue scoped keys for CI, staging, or partner integrations. Keys
                are now backed by regrada-be and returned once on creation.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                <CardContent className="p-0">
                  <form onSubmit={handleCreateKey} className="space-y-4">
                    <div>
                      <Label className="text-sm text-(--text-secondary)">
                        Key name
                      </Label>
                      <Input
                        value={newKeyName}
                        onChange={(event) => setNewKeyName(event.target.value)}
                        placeholder="e.g. Production CI"
                        className="mt-2"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm text-(--text-secondary)">
                          Tier
                        </label>
                        <select
                          value={newKeyTier}
                          onChange={(event) =>
                            setNewKeyTier(event.target.value as ApiKeyTier)
                          }
                          className="mt-2 w-full rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-sm text-(--text-primary) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
                        >
                          <option value="standard">Standard</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-(--text-secondary)">
                          Default scopes
                        </label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {DEFAULT_SCOPES.map((scope) => (
                            <Button
                              key={scope}
                              type="button"
                              onClick={() => toggleScope(scope)}
                              variant={
                                newKeyScopes.includes(scope)
                                  ? "default"
                                  : "outline"
                              }
                              className="rounded-full px-3 py-1 text-xs h-auto"
                            >
                              {scope}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={!isConfigured || createLoading}
                      variant="default"
                      className="w-full px-5 py-3 text-sm font-semibold"
                    >
                      {createLoading ? "Generating..." : "Generate API key"}
                    </Button>
                  </form>

                  {!isConfigured && (
                    <p className="mt-4 text-sm text-(--text-muted)">
                      Select a project to enable key creation.
                    </p>
                  )}

                  {createError && (
                    <p className="mt-4 text-sm text-(--error)">{createError}</p>
                  )}

                  {lastCreatedKey && (
                    <div className="mt-6 rounded-xl border border-(--border-color) bg-(--page-bg) p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-(--text-muted)">
                        New key created
                        <Button
                          type="button"
                          onClick={() => setLastCreatedKey(null)}
                          variant="ghost"
                          className="h-auto p-0 text-xs text-(--text-secondary)"
                        >
                          Hide
                        </Button>
                      </div>
                      <p className="mt-3 break-all rounded-lg bg-(--surface-bg) px-3 py-2 text-sm text-(--text-primary)">
                        {lastCreatedKey}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-(--text-muted)">
                        <Button
                          type="button"
                          onClick={() => handleCopy(lastCreatedKey)}
                          variant="outline"
                          className="rounded-full px-3 py-1 text-xs h-auto"
                        >
                          Copy key
                        </Button>
                        {copyMessage && (
                          <span className="text-(--accent)">{copyMessage}</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      Active keys
                    </CardTitle>
                    <span className="rounded-full border border-(--border-color) px-3 py-1 text-xs text-(--text-muted)">
                      {apiKeys.length} total
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="mt-4">
                    {!isConfigured ? (
                      <div className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4 text-sm text-(--text-muted)">
                        Connect to load active API keys.
                      </div>
                    ) : dataLoading ? (
                      <div className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4 text-sm text-(--text-muted)">
                        Loading API keys...
                      </div>
                    ) : apiKeys.length === 0 ? (
                      <div className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4 text-sm text-(--text-muted)">
                        No API keys found yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                            <tr>
                              <th className="pb-3 pr-4">Name</th>
                              <th className="pb-3 pr-4">Prefix</th>
                              <th className="pb-3 pr-4">Tier</th>
                              <th className="pb-3 pr-4">Scopes</th>
                              <th className="pb-3">Last used</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-(--text-secondary)">
                            {apiKeys.map((key) => (
                              <tr
                                key={key.id}
                                className="border-t border-(--border-color)"
                              >
                                <td className="py-3 pr-4 font-semibold text-(--text-primary)">
                                  {key.name}
                                </td>
                                <td className="py-3 pr-4 text-(--text-muted)">
                                  {key.key_prefix}...
                                </td>
                                <td className="py-3 pr-4">
                                  <span className="rounded-full border border-(--border-color) px-3 py-1 text-xs uppercase tracking-widest text-(--text-muted)">
                                    {key.tier}
                                  </span>
                                </td>
                                <td className="py-3 pr-4">
                                  <div className="flex flex-wrap gap-2">
                                    {key.scopes.map((scope) => (
                                      <span
                                        key={scope}
                                        className="rounded-full border border-(--border-color) px-2 py-1 text-xs text-(--text-muted)"
                                      >
                                        {scope}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3">
                                  <span className="text-(--text-muted)">
                                    {formatDate(key.last_used_at)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="traces" className="px-4 py-12">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Trace visualization
              </h2>
              <p className="mt-2 max-w-3xl text-lg text-(--text-secondary)">
                Compare latency and token usage across the latest traces.
                Signals are aligned to the trace payloads emitted by regrada-be.
              </p>
            </div>

            {!isConfigured ? (
              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6">
                <CardContent className="p-0 text-sm text-(--text-muted)">
                  Configure your API connection to load trace data.
                </CardContent>
              </Card>
            ) : dataLoading ? (
              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6">
                <CardContent className="p-0 text-sm text-(--text-muted)">
                  Loading traces...
                </CardContent>
              </Card>
            ) : sortedTraces.length === 0 ? (
              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6">
                <CardContent className="p-0 text-sm text-(--text-muted)">
                  No traces available yet for this project.
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                  <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">
                          Latency trend
                        </CardTitle>
                        <span className="text-xs text-(--text-muted)">
                          {sortedTraces.length} samples
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <LatencyChart data={latencyChartData} />
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">
                          Token usage
                        </CardTitle>
                        <span className="text-xs text-(--text-muted)">
                          Inbound vs outbound
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <TokenUsageChart data={tokenChartData} />
                    </CardContent>
                  </Card>
                </div>

                <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                  <CardHeader className="p-0 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        Recent traces
                      </CardTitle>
                      <span className="text-xs text-(--text-muted)">
                        Latest {sortedTraces.length} entries
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                          <tr>
                            <th className="pb-3 pr-4">Trace</th>
                            <th className="pb-3 pr-4">Model</th>
                            <th className="pb-3 pr-4">Latency</th>
                            <th className="pb-3 pr-4">Tokens</th>
                            <th className="pb-3 pr-4">Env</th>
                            <th className="pb-3">Tags</th>
                          </tr>
                        </thead>
                        <tbody className="text-(--text-secondary)">
                          {sortedTraces.map((trace) => (
                            <tr
                              key={trace.trace_id}
                              className="border-t border-(--border-color) cursor-pointer hover:bg-(--accent-bg) transition-colors"
                              onClick={() => {
                                setSelectedTrace(trace);
                                setTraceDialogOpen(true);
                              }}
                            >
                              <td className="py-3 pr-4 font-semibold text-(--text-primary)">
                                {trace.trace_id.slice(0, 12)}...
                                <div className="text-xs text-(--text-muted)">
                                  {formatDate(trace.timestamp)}
                                </div>
                              </td>
                              <td className="py-3 pr-4">
                                <div className="text-sm text-(--text-primary)">
                                  {trace.model}
                                </div>
                                <div className="text-xs text-(--text-muted)">
                                  {trace.provider}
                                </div>
                              </td>
                              <td className="py-3 pr-4">
                                {trace.metrics?.latency_ms ?? 0} ms
                              </td>
                              <td className="py-3 pr-4 text-xs text-(--text-muted)">
                                {formatNumber(trace.metrics?.tokens_in ?? 0)} in
                                / {formatNumber(trace.metrics?.tokens_out ?? 0)}{" "}
                                out
                              </td>
                              <td className="py-3 pr-4 text-xs text-(--text-muted)">
                                {trace.environment ?? "--"}
                                <div className="text-xs text-(--text-muted)">
                                  {shortSha(trace.git_sha)}
                                </div>
                              </td>
                              <td className="py-3">
                                <div className="flex flex-wrap gap-2">
                                  {(trace.tags ?? []).length === 0 ? (
                                    <span className="text-xs text-(--text-muted)">
                                      --
                                    </span>
                                  ) : (
                                    trace.tags?.map((tag) => (
                                      <span
                                        key={tag}
                                        className="rounded-full border border-(--border-color) px-2 py-1 text-xs text-(--text-muted)"
                                      >
                                        {tag}
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </section>

        <section id="test-runs" className="px-4 py-12">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Test run results
              </h2>
              <p className="mt-2 max-w-3xl text-lg text-(--text-secondary)">
                Follow pass rates, warnings, and policy regressions from recent
                baselines. Each run mirrors the case metrics captured by the
                regrada CLI.
              </p>
            </div>

            {!isConfigured ? (
              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6">
                <CardContent className="p-0 text-sm text-(--text-muted)">
                  Configure your API connection to load test runs.
                </CardContent>
              </Card>
            ) : dataLoading ? (
              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6">
                <CardContent className="p-0 text-sm text-(--text-muted)">
                  Loading test runs...
                </CardContent>
              </Card>
            ) : sortedTestRuns.length === 0 ? (
              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6">
                <CardContent className="p-0 text-sm text-(--text-muted)">
                  No test runs available yet for this project.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                  <CardHeader className="p-0 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        Recent runs
                      </CardTitle>
                      <span className="text-xs text-(--text-muted)">
                        {sortedTestRuns.length} runs
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="mt-4 space-y-4">
                      {sortedTestRuns.map((run) => {
                        const status = statusStyles[resolveStatus(run.status)];
                        const totalCases = run.total_cases || 0;
                        const passPercent = totalCases
                          ? Math.round((run.passed_cases / totalCases) * 100)
                          : 0;
                        const warnPercent = totalCases
                          ? Math.round((run.warned_cases / totalCases) * 100)
                          : 0;
                        const failPercent = totalCases
                          ? Math.round((run.failed_cases / totalCases) * 100)
                          : 0;

                        return (
                          <div
                            key={run.run_id}
                            className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4 cursor-pointer hover:border-(--accent) transition-colors"
                            onClick={() => {
                              setSelectedTestRun(run);
                              setTestRunDialogOpen(true);
                            }}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-(--text-primary)">
                                  {run.run_id.slice(0, 14)}...
                                </p>
                                <p className="text-xs text-(--text-muted)">
                                  {formatDate(run.timestamp)} ·{" "}
                                  {shortSha(run.git_sha)} ·{" "}
                                  {run.git_branch ?? "--"}
                                </p>
                              </div>
                              <Badge variant={status.variant}>
                                {status.label}
                              </Badge>
                            </div>
                            <div className="mt-4 flex items-center gap-4">
                              <div className="flex-1">
                                <div className="flex h-2 overflow-hidden rounded-full bg-(--surface-bg)">
                                  <span
                                    className="bg-(--status-success)"
                                    style={{ width: `${passPercent}%` }}
                                  />
                                  <span
                                    className="bg-(--status-warning)"
                                    style={{ width: `${warnPercent}%` }}
                                  />
                                  <span
                                    className="bg-(--status-error)"
                                    style={{ width: `${failPercent}%` }}
                                  />
                                </div>
                              </div>
                              <div className="text-xs text-(--text-muted)">
                                {passPercent}% pass
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-(--text-muted)">
                              <span>{run.total_cases} total</span>
                              <span>{run.passed_cases} passed</span>
                              <span>{run.warned_cases} warned</span>
                              <span>{run.failed_cases} failed</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-lg font-semibold">
                      Policy violations
                    </CardTitle>
                    <p className="mt-2 text-sm text-(--text-secondary)">
                      Ordered by severity with direct policy identifiers from
                      regrada-be.
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="mt-4 space-y-3">
                      {allViolations.length === 0 ? (
                        <div className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4 text-sm text-(--text-muted)">
                          No active violations. All policies are within
                          guardrails.
                        </div>
                      ) : (
                        allViolations.map((violation, index) => (
                          <div
                            key={`${violation.policy_id}-${index}`}
                            className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4"
                          >
                            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                              <span>{violation.policy_id}</span>
                              <span>{violation.severity}</span>
                            </div>
                            <p className="mt-3 text-sm text-(--text-primary)">
                              {violation.message}
                            </p>
                            <p className="mt-2 text-xs text-(--text-muted)">
                              Triggered in {violation.run.slice(0, 12)}...
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Detail View Dialogs */}
      <TraceDetailDialog
        trace={selectedTrace}
        open={traceDialogOpen}
        onOpenChange={setTraceDialogOpen}
      />
      <TestRunDetailDialog
        testRun={selectedTestRun}
        open={testRunDialogOpen}
        onOpenChange={setTestRunDialogOpen}
      />
    </div>
  );
}
