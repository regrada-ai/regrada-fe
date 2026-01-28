"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppTheme } from "../hooks";
import { useOrganization } from "../contexts/OrganizationContext";
import { authAPI } from "../lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
  const router = useRouter();
  const { resolvedTheme, mounted } = useAppTheme();
  const { user, currentOrganization, refreshUser } = useOrganization();

  const handleSignOut = async () => {
    try {
      await authAPI.signOut();
      // Clear user state by refreshing which will fail auth check
      await refreshUser();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-(--border-color) bg-(--page-bg)/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center">
          {mounted && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                resolvedTheme === "dark"
                  ? "/regrada/regrada-banner-light.png"
                  : "/regrada/regrada-banner.png"
              }
              alt="Regrada"
              className="h-8"
            />
          )}
          {!mounted && (
            <span className="text-xl font-bold text-(--accent)">
              <span className="text-(--accent)">&gt;</span>regrada
            </span>
          )}
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-(--text-secondary) transition-colors hover:text-(--accent)"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-(--text-secondary) transition-colors hover:text-(--accent)"
          >
            Dashboard
          </Link>
          <Link
            href="/docs"
            className="text-(--text-secondary) transition-colors hover:text-(--accent)"
          >
            Docs
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center rounded-full border-2 border-(--border-color) transition-all hover:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20">
                {user.profile_picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profile_picture}
                    alt={user.name || "User profile"}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-(--accent-bg) flex items-center justify-center">
                    <span className="text-sm font-semibold text-(--accent)">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-(--text-muted)">
                      {user.email}
                    </p>
                    {user.role && (
                      <p className="text-xs leading-none text-(--text-muted) mt-1">
                        <span className="inline-block rounded-full border border-(--border-color) px-2 py-0.5 text-xs uppercase tracking-wider">
                          {user.role}
                        </span>
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentOrganization && (
                  <>
                    <DropdownMenuLabel className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                      Organization
                    </DropdownMenuLabel>
                    <DropdownMenuItem disabled>
                      <span className="text-sm">
                        {currentOrganization.name}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/api-keys")}>
                  API Keys
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border border-(--accent) bg-(--accent-bg) px-4 py-2 text-sm font-semibold text-(--accent) transition-all hover:bg-(--accent) hover:text-(--button-hover-text)"
            >
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
