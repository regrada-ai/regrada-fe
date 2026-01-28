"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI, organizationAPI } from "../../lib/api";
import type { User } from "../../lib/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Link from "next/link";

function InviteAcceptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("token");

  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [inviteInfo, setInviteInfo] = useState<{
    organization_name: string;
    inviter_name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.me();
        setUser(response.user);
      } catch (error) {
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!inviteToken) {
      setError("Invalid invite link");
      setLoading(false);
      return;
    }

    const loadInviteInfo = async () => {
      try {
        const response = await organizationAPI.getInvite(inviteToken);
        setInviteInfo(response);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load invite details",
        );
      } finally {
        setLoading(false);
      }
    };

    loadInviteInfo();
  }, [inviteToken]);

  const handleAcceptInvite = async () => {
    if (!inviteToken) return;

    setAccepting(true);
    setError("");

    try {
      await organizationAPI.acceptInvite(inviteToken);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to accept invite",
      );
    } finally {
      setAccepting(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--page-bg) text-(--text-primary)">
        <div className="text-center">
          <div className="text-2xl font-semibold">Loading...</div>
          <p className="mt-2 text-sm text-(--text-muted)">
            Checking invite details
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md rounded-2xl border border-(--border-color) bg-(--surface-bg)/90 p-6 shadow-lg">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-center text-2xl font-bold">
                Sign in to accept invite
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {inviteInfo && (
                <div className="mb-6 space-y-2 text-center">
                  <p className="text-lg text-(--text-secondary)">
                    You&apos;ve been invited to join
                  </p>
                  <p className="text-xl font-semibold text-(--text-primary)">
                    {inviteInfo.organization_name}
                  </p>
                  <p className="text-sm text-(--text-muted)">
                    by {inviteInfo.inviter_name}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  href={`/login?redirect=/invite/accept?token=${inviteToken}`}
                  className="block w-full rounded-xl border border-(--accent) bg-(--accent-bg) px-5 py-3 text-center font-semibold text-(--accent) transition-all hover:bg-(--accent) hover:text-(--button-hover-text)"
                >
                  Sign In
                </Link>
                <Link
                  href={`/signup?invite_token=${inviteToken}`}
                  className="block w-full rounded-xl border border-(--border-color) bg-(--surface-bg) px-5 py-3 text-center font-semibold text-(--text-secondary) transition-all hover:border-(--accent) hover:text-(--accent)"
                >
                  Create Account
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md rounded-2xl border border-(--border-color) bg-(--surface-bg)/90 p-6 shadow-lg">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-center text-2xl font-bold">
              {success ? "Invite Accepted!" : "Accept Invitation"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="space-y-4 text-center">
                <Alert className="border-[var(--status-success-border)] bg-[var(--status-success-bg)] text-[var(--status-success)]">
                  <AlertDescription>
                    You&apos;ve successfully joined the organization!
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-(--text-muted)">
                  Redirecting to dashboard...
                </p>
              </div>
            ) : inviteInfo ? (
              <div className="space-y-6">
                <div className="space-y-3 text-center">
                  <p className="text-lg text-(--text-secondary)">
                    You&apos;ve been invited to join
                  </p>
                  <p className="text-2xl font-semibold text-(--text-primary)">
                    {inviteInfo.organization_name}
                  </p>
                  <p className="text-sm text-(--text-muted)">
                    by {inviteInfo.inviter_name}
                  </p>
                </div>

                <div className="rounded-xl border border-(--border-color) bg-(--page-bg) p-4">
                  <p className="text-sm text-(--text-secondary)">
                    Accepting as: <strong className="text-(--text-primary)">{user.email}</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleAcceptInvite}
                    disabled={accepting}
                    variant="default"
                    className="w-full px-5 py-3 font-semibold"
                  >
                    {accepting ? "Accepting..." : "Accept Invitation"}
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    variant="outline"
                    className="w-full px-5 py-3 font-semibold"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg text-(--text-secondary)">
                  This invite link is invalid or has expired.
                </p>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="default"
                  className="mt-6 px-5 py-3 font-semibold"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function InviteAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-(--page-bg) font-mono">
          <div className="text-(--text-muted)">Loading...</div>
        </div>
      }
    >
      <InviteAcceptContent />
    </Suspense>
  );
}
