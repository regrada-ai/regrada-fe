"use client";

import { useTheme } from "next-themes";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactElement,
} from "react";

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS: Array<{
  value: Theme;
  label: string;
  Icon: () => ReactElement;
}> = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: ComputerDesktopIcon },
];

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const isHydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const currentTheme = (isHydrated ? (theme ?? "system") : "system") as Theme;
  const currentOption =
    THEME_OPTIONS.find((option) => option.value === currentTheme) ??
    THEME_OPTIONS[2];
  const CurrentIcon = currentOption.Icon;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--surface-bg) px-3 py-2 text-xs font-semibold text-(--text-secondary) shadow-sm transition-colors hover:text-(--text-primary) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/40"
      >
        <span
          suppressHydrationWarning
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--accent-bg) text-(--accent)"
        >
          <CurrentIcon />
        </span>
        <span suppressHydrationWarning>{currentOption.label}</span>
        <span className="text-(--text-muted)">
          <ChevronDownIcon />
        </span>
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-orientation="vertical"
          className="absolute bottom-full left-1/2 z-10 mb-2 w-40 -translate-x-1/2 rounded-xl border border-(--border-color) bg-(--surface-bg) p-1 shadow-lg"
        >
          {THEME_OPTIONS.map(({ value, label, Icon }) => {
            const isActive = value === currentTheme;
            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/40 ${
                  isActive
                    ? "bg-(--accent-bg) text-(--text-primary)"
                    : "text-(--text-secondary) hover:bg-(--accent-bg) hover:text-(--text-primary)"
                }`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center">
                  <Icon />
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.773-4.227L6.432 6.182M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.75 9.75 0 1 0 21.752 15.002Z"
      />
    </svg>
  );
}

function ComputerDesktopIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25v1.5m6-1.5v1.5m-9-3.75h12a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3Z"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
