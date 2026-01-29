// SPDX-License-Identifier: LicenseRef-Regrada-Proprietary
"use client";

import ThemeToggle from "./ThemeToggle";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full border-t border-(--border-color) px-4 py-6 text-sm text-(--text-muted)">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 text-center">
        <ThemeToggle />
        <span>© {CURRENT_YEAR} Regrada. All rights reserved.</span>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/privacy"
            className="text-(--accent) transition-colors hover:text-(--text-primary)"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-(--accent) transition-colors hover:text-(--text-primary)"
          >
            Terms &amp; Conditions
          </a>
        </div>
      </div>
    </footer>
  );
}
