import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { templateBySlug, type TopicNode } from "@/content/templates";

/**
 * CSES-style expandable topic tree for /templates. Branches open with a
 * click (native <details>); leaves link to the template page.
 */

function LeafLink({ slug }: { slug: string }) {
  const template = templateBySlug(slug);
  if (!template) return null;
  return (
    <Link
      href={`/templates/${template.slug}`}
      className="group flex items-center justify-between gap-4 rounded px-3 py-2.5 transition-colors hover:bg-paper-deep"
    >
      <span>
        <span className="font-medium tracking-tight transition-colors group-hover:text-accent">
          {template.name}
        </span>
        <span className="ml-3 font-mono text-[12px] text-fg-faint">
          {template.complexity}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="font-mono text-fg-faint transition-colors group-hover:text-accent"
      >
        →
      </span>
    </Link>
  );
}

function countLeaves(node: TopicNode): number {
  return (
    (node.leaves?.length ?? 0) +
    (node.children?.reduce((total, child) => total + countLeaves(child), 0) ?? 0)
  );
}

export function TopicTree({
  node,
  depth = 0,
  defaultOpen = false,
}: {
  node: TopicNode;
  depth?: number;
  /** Render the branch expanded on load (used for the first topic). */
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className={depth === 0 ? "panel group/branch" : "group/branch"}
    >
      <summary
        className={`group/summary flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden ${
          depth > 0 ? "rounded transition-colors hover:bg-paper-deep" : ""
        }`}
      >
        <ChevronDown
          size={15}
          aria-hidden="true"
          className="-rotate-90 text-fg-faint transition-transform group-open/branch:rotate-0"
        />
        <span className="flex-1 font-semibold tracking-tight transition-colors group-hover/summary:text-accent">
          {node.name}
        </span>
        <span className="font-mono text-[12px] text-fg-faint">{countLeaves(node)}</span>
      </summary>
      <div
        className={`space-y-1 pb-2 pl-6 pr-2 ${depth === 0 ? "border-t border-line pt-2" : ""}`}
      >
        {node.children?.map((child) => (
          <TopicTree key={child.name} node={child} depth={depth + 1} />
        ))}
        {node.leaves?.map((slug) => <LeafLink key={slug} slug={slug} />)}
      </div>
    </details>
  );
}
