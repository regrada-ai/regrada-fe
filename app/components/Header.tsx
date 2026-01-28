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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center shrink-0">
          {mounted && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                resolvedTheme === "dark"
                  ? "/regrada/regrada-banner-light.png"
                  : "/regrada/regrada-banner.png"
              }
              alt="Regrada"
              className="h-8 sm:h-11 md:h-14"
            />
          )}
          {!mounted && (
            <span className="text-xl sm:text-2xl md:text-4xl font-bold text-accent">
              <span className="text-accent">&gt;</span>regrada
            </span>
          )}
        </Link>
        <nav className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <Link
            href="/dashboard"
            className="text-sm sm:text-base text-(--text-secondary) transition-colors hover:text-accent"
          >
            Dashboard
          </Link>
          <Link
            href="/docs"
            className="text-sm sm:text-base text-(--text-secondary) transition-colors hover:text-accent"
          >
            Docs
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center rounded-full border-2 border-(--border-color) transition-all hover:border-accent focus:outline-none focus:ring-2 focus:ring-(--accent)/20 shrink-0">
                {user.profile_picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profile_picture}
                    alt={user.name || "User profile"}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-(--accent-bg) flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-semibold text-accent">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={5}
                className="w-64 bg-(--surface-bg) border-2 border-(--border-color)"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-(--text-primary)">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-(--text-secondary)">
                      {user.email}
                    </p>
                    {user.role && (
                      <p className="text-xs leading-none mt-1">
                        <span className="inline-block rounded-full border-2 border-(--border-color) bg-(--accent-bg) px-2 py-0.5 text-xs uppercase tracking-wider font-medium text-(--text-primary)">
                          {user.role}
                        </span>
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentOrganization && (
                  <>
                    <DropdownMenuLabel className="text-xs uppercase tracking-[0.2em] text-(--text-secondary) font-semibold">
                      Organization
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      disabled
                      className="text-(--text-primary) font-medium"
                    >
                      <span className="text-sm">
                        {currentOrganization.name}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="focus:bg-slate-700! focus:text-white! dark:focus:bg-slate-200! dark:focus:text-slate-900! font-medium"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/api-keys")}
                  className="focus:bg-slate-700! focus:text-white! dark:focus:bg-slate-200! dark:focus:text-slate-900! font-medium"
                >
                  API Keys
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleSignOut}
                  className="font-medium"
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border border-accent bg-(--accent-bg) px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-(--button-hover-text) whitespace-nowrap shrink-0"
            >
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
