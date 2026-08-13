import type { Metadata } from "next";
import { ArticleLink as Link } from "@/components/TransitionLink";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  templateBySlug,
  templates,
  topicTree,
  type TopicNode,
} from "@/content/templates";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Copy-paste implementations of the algorithms that win contests: C++ and Python, each with a problem to test it on.",
};

/** One directory row: name left, complexity right (Swiss-timetable style). */
function LeafRow({ slug }: { slug: string }) {
  const template = templateBySlug(slug);
  if (!template) return null;
  return (
    <Link
      href={`/templates/${slug}`}
      className="group flex items-baseline justify-between gap-4 py-2"
    >
      <span className="text-base font-semibold tracking-tight transition-colors group-hover:text-accent">
        {template.name}
      </span>
      <span className="shrink-0 font-mono text-[12px] text-fg-faint">
        {template.complexity}
      </span>
    </Link>
  );
}

/** A topic and its rows; complexity lives here (reference table), not in
 *  the sidebar (navigation). */
function TopicGroup({ node }: { node: TopicNode }) {
  return (
    <section>
      <h2 className="font-display text-base tracking-tight">{node.name}</h2>
      {node.leaves && (
        <div className="mt-3 divide-y divide-line border-y border-line">
          {node.leaves.map((slug) => (
            <LeafRow key={slug} slug={slug} />
          ))}
        </div>
      )}
      {node.children?.map((child) => (
        <div key={child.name} className="mt-6">
          <p className="font-mono text-[12px] text-fg-faint">
            {child.name.toLowerCase()}
          </p>
          <div className="mt-2 divide-y divide-line border-y border-line">
            {(child.leaves ?? []).map((slug) => (
              <LeafRow key={slug} slug={slug} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default function TemplatesPage() {
  return (
    <div className="max-w-3xl py-10 sm:py-14">
      <AnimatedSection>
        <h1 className="font-display text-2xl tracking-tight sm:text-[32px]">
          Template library
        </h1>
        <p className="mt-3 max-w-2xl text-base text-fg-muted">
          Copy-paste implementations of the algorithms that win contests: C++
          and Python, each with a problem to test it on.
        </p>
      </AnimatedSection>
      <div className="mt-10 space-y-12">
        {topicTree.map((node) => (
          <AnimatedSection key={node.name}>
            <TopicGroup node={node} />
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
