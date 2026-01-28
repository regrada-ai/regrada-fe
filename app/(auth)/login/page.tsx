"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authAPI } from "../../lib/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setSuccess("Email verified successfully! Please sign in.");
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authAPI.signIn(formData.email, formData.password);
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "Google" | "Apple") => {
    // TODO: Implement social login with backend
    setError(`${provider} sign in will be available soon`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome back</h1>
            <p className="mt-2 text-lg text-(--text-secondary)">
              Sign in to your Regrada account
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-(--border-color) bg-(--surface-bg)/90 p-8 shadow-lg">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-(--status-success-border) bg-(--status-success-bg) text-(--status-success)">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Social Sign In Buttons */}
            <Button
              onClick={() => handleSocialSignIn("Google")}
              disabled={loading}
              variant="secondary"
              className="w-full px-5 py-3 font-semibold text-(--text-primary) hover:bg-(--accent-bg)"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={() => handleSocialSignIn("Apple")}
              disabled={loading}
              variant="secondary"
              className="w-full px-5 py-3 font-semibold text-(--text-primary) hover:bg-(--accent-bg)"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-(--border-color)" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-(--surface-bg) px-4 text-(--text-muted)">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-accent hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="default"
                className="w-full px-5 py-3 font-semibold"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-(--text-muted)">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-accent hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-(--page-bg) font-mono">
          <div className="text-(--text-muted)">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
