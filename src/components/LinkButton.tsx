import Link from "next/link";
import type { ReactNode } from "react";

const styles = {
  primary:
    "border border-accent bg-accent text-white hover:border-accent-soft hover:bg-accent-soft",
  // Opaque surface so backdrop patterns (hero grid) don't bleed through.
  ghost:
    "border border-line bg-surface text-fg-muted hover:border-fg-faint hover:text-fg",
};

export function LinkButton({
  href,
  children,
  variant = "ghost",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  external?: boolean;
}) {
  const className = `inline-flex items-center gap-2 rounded px-4 py-2 font-mono text-[13px] transition-colors ${styles[variant]}`;
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
