"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, organizationAPI } from "../lib/api";
import type { User } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_REGRADA_API_BASE_URL ?? "http://localhost:8080";

export default function InvitePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [invites, setInvites] = useState<
    Array<{
      id: string;
      email: string;
      role: string;
      status: string;
      created_at: string;
      expires_at: string;
    }>
  >([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.me();
        setUser(response.user);
      } catch (error) {
        router.push("/login");
      } finally {
        setUserLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!user?.organization_id) return;

    const loadInvites = async () => {
      try {
        const response = await organizationAPI.listInvites(
          user.organization_id!,
        );
        setInvites(response.invites || []);
      } catch (error) {
        console.error("Failed to load invites:", error);
      }
    };

    loadInvites();
  }, [user?.organization_id]);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setInviteToken(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!user?.organization_id) {
      setError("No organization found");
      return;
    }

    setLoading(true);

    console.log("Creating invite with:", {
      organizationId: user.organization_id,
      email,
      role,
    });

    try {
      const response = await organizationAPI.createInvite(
        user.organization_id,
        email,
        role,
      );
      setInviteToken(response.invite_token);
      setSuccess("Invite created successfully!");
      setEmail("");

      // Reload invites list
      const updatedInvites = await organizationAPI.listInvites(
        user.organization_id,
      );
      setInvites(updatedInvites.invites || []);
    } catch (error) {
      console.error("Invite creation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create invite";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!inviteToken) return;

    const inviteUrl = `${window.location.origin}/invite/accept?token=${inviteToken}`;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setSuccess("Invite link copied to clipboard!");
    } catch (error) {
      setError("Failed to copy invite link");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  return (
    <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Invite Team Members</h1>
            <p className="mt-2 text-lg text-(--text-secondary)">
              Invite colleagues to join your organization
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl border border-(--border-color) bg-(--surface-bg)/90 p-6 shadow-lg">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold">
                  Create Invite
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleCreateInvite} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && !inviteToken && (
                    <Alert className="border-[var(--status-success-border)] bg-[var(--status-success-bg)] text-[var(--status-success)]">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--border-color) bg-(--surface-bg) px-4 py-3 text-sm text-(--text-primary) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="readonly-user">Read-only User</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="default"
                    className="w-full px-5 py-3 font-semibold"
                  >
                    {loading ? "Creating invite..." : "Create Invite"}
                  </Button>
                </form>

                {inviteToken && (
                  <div className="mt-6 rounded-xl border border-(--border-color) bg-(--page-bg) p-4">
                    <div className="mb-2 text-xs uppercase tracking-[0.25em] text-(--text-muted)">
                      Invite Link
                    </div>
                    <p className="break-all rounded-lg bg-(--surface-bg) px-3 py-2 text-sm text-(--text-primary)">
                      {`${window.location.origin}/invite/accept?token=${inviteToken}`}
                    </p>
                    <Button
                      type="button"
                      onClick={handleCopyInviteLink}
                      variant="outline"
                      className="mt-3 w-full"
                    >
                      Copy Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-(--border-color) bg-(--surface-bg)/90 p-6 shadow-lg">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold">
                  Pending Invites
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {invites.length === 0 ? (
                  <div className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4 text-sm text-(--text-muted)">
                    No pending invites
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invites.map((invite) => (
                      <div
                        key={invite.id}
                        className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-(--text-primary)">
                              {invite.email}
                            </p>
                            <p className="mt-1 text-xs text-(--text-muted)">
                              Role: {invite.role}
                            </p>
                            <p className="text-xs text-(--text-muted)">
                              Created: {formatDate(invite.created_at)}
                            </p>
                            <p className="text-xs text-(--text-muted)">
                              Expires: {formatDate(invite.expires_at)}
                            </p>
                          </div>
                          <Badge
                            variant={
                              invite.status === "pending"
                                ? "status-warning"
                                : invite.status === "accepted"
                                  ? "status-success"
                                  : "outline"
                            }
                          >
                            {invite.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
