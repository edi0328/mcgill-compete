import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Small "see more →" link at the bottom of a section. */
export function ArrowLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 font-mono text-[13px] text-cf-blue hover:underline"
    >
      {children} <ArrowRight size={14} />
    </Link>
  );
}
