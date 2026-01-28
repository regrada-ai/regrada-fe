"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "../../lib/api";
import { useOrganization } from "../../contexts/OrganizationContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoadingScreen from "../../components/LoadingScreen";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  ApiKeyCreateResponse,
  ApiKeyRecord,
  ApiKeyTier,
} from "../../data/dashboard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_REGRADA_API_BASE_URL ?? "http://localhost:8080";

const DEFAULT_SCOPES = ["traces:write", "tests:write", "projects:read"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatDate = (value?: string | null) =>
  value ? dateFormatter.format(new Date(value)) : "--";

export default function ApiKeysPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useOrganization();
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyTier, setNewKeyTier] = useState<ApiKeyTier>("standard");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(DEFAULT_SCOPES);
  const [lastCreatedKey, setLastCreatedKey] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!copyMessage) return;
    const timeout = window.setTimeout(() => setCopyMessage(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [copyMessage]);

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    setDataLoading(true);
    setDataError(null);

    const loadData = async () => {
      try {
        const apiKeyPayload = await authenticatedFetch<{
          api_keys: ApiKeyRecord[];
        }>(`${API_BASE_URL}/v1/api-keys`, { signal: controller.signal });

        if (!controller.signal.aborted) {
          setApiKeys(apiKeyPayload.api_keys ?? []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setDataError(
            error instanceof Error ? error.message : "Failed to load API keys",
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
  }, [user]);

  const handleCreateKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);

    if (!newKeyName.trim()) return;

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

  // Show loading state while checking authentication
  if (userLoading) {
    return <LoadingScreen />;
  }

  // Return null while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
      <Header />

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(47,95,153,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(35,116,74,0.14),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.1),transparent)]" />

        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">API Keys</h1>
              <p className="mt-2 text-lg text-(--text-secondary)">
                Manage API keys for your organization. Keys are used to
                authenticate requests to the Regrada API.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Create New API Key
                  </CardTitle>
                  <CardDescription>
                    Issue scoped keys for CI, staging, or partner integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <form onSubmit={handleCreateKey} className="space-y-4">
                    <div>
                      <Label
                        htmlFor="keyName"
                        className="text-sm text-(--text-secondary)"
                      >
                        Key name
                      </Label>
                      <Input
                        id="keyName"
                        value={newKeyName}
                        onChange={(event) => setNewKeyName(event.target.value)}
                        placeholder="e.g. Production CI"
                        className="mt-2"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="keyTier"
                          className="text-sm text-(--text-secondary)"
                        >
                          Tier
                        </Label>
                        <select
                          id="keyTier"
                          value={newKeyTier}
                          onChange={(event) =>
                            setNewKeyTier(event.target.value as ApiKeyTier)
                          }
                          className="mt-2 w-full rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-sm text-(--text-primary) focus:border-accent focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
                        >
                          <option value="standard">Standard</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm text-(--text-secondary)">
                          Default scopes
                        </Label>
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
                              className="h-auto rounded-full px-3 py-1 text-xs"
                            >
                              {scope}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={createLoading}
                      variant="default"
                      className="w-full px-5 py-3 text-sm font-semibold"
                    >
                      {createLoading ? "Generating..." : "Generate API key"}
                    </Button>
                  </form>

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
                          className="h-auto rounded-full px-3 py-1 text-xs"
                        >
                          Copy key
                        </Button>
                        {copyMessage && (
                          <span className="text-accent">{copyMessage}</span>
                        )}
                      </div>
                      <p className="mt-3 text-xs text-(--text-muted)">
                        Make sure to copy your API key now. You won&apos;t be
                        able to see it again!
                      </p>
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
                    <Badge variant="outline" className="text-xs">
                      {apiKeys.length} total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="mt-4">
                    {dataLoading ? (
                      <div className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4 text-sm text-(--text-muted)">
                        Loading API keys...
                      </div>
                    ) : dataError ? (
                      <div className="rounded-xl border border-(--error) bg-(--error)/10 p-4 text-sm text-(--error)">
                        {dataError}
                      </div>
                    ) : apiKeys.length === 0 ? (
                      <div className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4 text-sm text-(--text-muted)">
                        No API keys found yet. Create one to get started.
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
      </main>

      <Footer />
    </div>
  );
}
