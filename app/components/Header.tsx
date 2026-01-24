"use client";

import Link from "next/link";
import { useAppTheme } from "../hooks";

export default function Header() {
  const { resolvedTheme, mounted } = useAppTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-(--border-color) bg-(--page-bg)/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center">
          {mounted && (
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
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-(--text-secondary) transition-colors hover:text-(--accent)"
          >
            Home
          </Link>
          <Link
            href="/docs"
            className="text-(--text-secondary) transition-colors hover:text-(--accent)"
          >
            Docs
          </Link>
        </nav>
      </div>
    </header>
  );
}
