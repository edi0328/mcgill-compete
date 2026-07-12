"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

/**
 * Small sun/moon button. The site follows the system theme until the user
 * clicks; the choice is stored in localStorage and applied before paint by
 * the inline script in layout.tsx.
 */

type Theme = "light" | "dark" | null;

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    mq.removeEventListener("change", onChange);
  };
}

/** Effective theme: explicit choice on <html> if any, else the system's. */
function getSnapshot(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Unknowable during SSR — render a neutral placeholder until hydrated.
function getServerSnapshot(): Theme {
  return null;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    listeners.forEach((notify) => notify());
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      title="Toggle theme"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:border-accent hover:text-fg focus-visible:border-accent focus-visible:text-fg"
    >
      {theme === "dark" ? (
        <Sun size={15} />
      ) : theme === "light" ? (
        <Moon size={15} />
      ) : (
        <span className="h-[15px] w-[15px]" />
      )}
    </button>
  );
}
