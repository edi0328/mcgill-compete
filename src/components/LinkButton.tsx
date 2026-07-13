import { TransitionLink as Link } from "@/components/TransitionLink";
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
  className: extra,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  external?: boolean;
  className?: string;
}) {
  // active:translate-y-px = 1px press nudge — the button "clicks" down like
  // a key. Deliberately instant (transition-colors only), no color state.
  const className = `inline-flex items-center justify-center gap-2 rounded px-4 py-2 font-mono text-[13px] transition-colors active:translate-y-px ${styles[variant]}${extra ? ` ${extra}` : ""}`;
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
