"use client";

import Link from "next/link";
import { useAppTheme } from "../hooks";
import { useOrganization } from "../contexts/OrganizationContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function Header() {
  const { resolvedTheme, mounted } = useAppTheme();
  const {
    user,
    organizations,
    currentOrganizationId,
    setCurrentOrganizationId,
  } = useOrganization();

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
          {user && organizations.length > 1 && (
            <Select
              value={currentOrganizationId || ""}
              onValueChange={setCurrentOrganizationId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {user && (
            <Link
              href="/invite"
              className="rounded-xl border border-(--accent) bg-(--accent-bg) px-4 py-2 text-sm font-semibold text-(--accent) transition-all hover:bg-(--accent) hover:text-(--button-hover-text)"
            >
              Invite
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
