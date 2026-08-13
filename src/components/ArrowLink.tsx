import { TransitionLink as Link } from "@/components/TransitionLink";
import { ArrowRight } from "lucide-react";

/** Small "see more →" link at the bottom of a section. */
export function ArrowLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-mono text-[12px] text-accent hover:underline"
    >
      {children} <ArrowRight size={14} />
    </Link>
  );
}
