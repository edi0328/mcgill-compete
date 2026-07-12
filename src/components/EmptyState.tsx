import type { ReactNode } from "react";
import { LinkButton } from "@/components/LinkButton";

/**
 * What/why/one-action pattern for sections whose content isn't live yet.
 * Never ship a bare "nothing here" — say what will appear, why it's empty,
 * and give exactly one way to stay in the loop (usually Discord).
 */
export function EmptyState({
  title,
  children,
  cta,
  href,
  external = true,
}: {
  /** Short mono label, e.g. "nothing scheduled yet". */
  title: string;
  /** One sentence: what will appear here and why it's empty right now. */
  children: ReactNode;
  cta: ReactNode;
  href: string;
  external?: boolean;
}) {
  return (
    <div className="max-w-3xl rounded-lg border border-dashed border-line bg-surface p-6">
      <p className="kicker">{`// ${title}`}</p>
      <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-fg-muted">
        {children}
      </p>
      <div className="mt-4">
        <LinkButton href={href} external={external}>
          {cta}
        </LinkButton>
      </div>
    </div>
  );
}
