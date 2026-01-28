"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "../../contexts/OrganizationContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoadingScreen from "../../components/LoadingScreen";
import { Card, CardContent } from "../../components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useOrganization();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

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
          <div className="mx-auto max-w-7xl">
            <Card className="rounded-2xl bg-(--surface-bg)/90 p-12 shadow-sm text-center">
              <CardContent className="p-0">
                <h1 className="text-5xl font-bold text-(--text-primary)">
                  DASHBOARD GOES HERE
                </h1>
                <p className="mt-4 text-lg text-(--text-secondary)">
                  This is a placeholder for the dashboard content
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
