import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CodeBlock } from "@/components/CodeBlock";
import {
  templateBySlug,
  templates,
  topicTree,
  type TopicNode,
} from "@/content/templates";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

/** Leaf slugs in the order the topic tree presents them — the browse order. */
function flattenLeaves(nodes: TopicNode[]): string[] {
  return nodes.flatMap((node) => [
    ...(node.leaves ?? []),
    ...flattenLeaves(node.children ?? []),
  ]);
}
const browseOrder = flattenLeaves(topicTree);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const template = templateBySlug((await params).slug);
  return {
    title: template ? template.name : "Template",
    description: template?.description,
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const template = templateBySlug((await params).slug);
  if (!template) notFound();

  const index = browseOrder.indexOf(template.slug);
  const prev = index > 0 ? templateBySlug(browseOrder[index - 1]) : undefined;
  const next =
    index >= 0 && index < browseOrder.length - 1
      ? templateBySlug(browseOrder[index + 1])
      : undefined;
  const related = templates.filter(
    (t) => t.topic === template.topic && t.slug !== template.slug,
  );

  // Highlighted at build time (SSG) — zero client-side JS for the colors.
  const shikiOptions = {
    themes: { light: "github-light" as const, dark: "github-dark" as const },
    defaultColor: "light" as const,
  };
  const [cppHtml, pythonHtml] = await Promise.all([
    codeToHtml(template.code.cpp, { lang: "cpp", ...shikiOptions }),
    codeToHtml(template.code.python, { lang: "python", ...shikiOptions }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
      <AnimatedSection>
        <Link
          href="/templates"
          className="font-mono text-[13px] text-fg-muted transition-colors hover:text-accent"
        >
          ← all templates
        </Link>

        <p className="kicker mt-8">
          <span className="text-accent">{"//"}</span>{" "}
          {template.topic.toLowerCase()}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            {template.name}
          </h1>
          <span className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-[12px] text-fg-muted">
            {template.complexity}
          </span>
        </div>

        <p className="mt-4 max-w-[65ch] text-[15px] leading-relaxed text-fg-muted">
          {template.description}
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="mt-8">
        <p className="kicker">{"// use it on"}</p>
        <div className="panel mt-2 px-5 py-4">
          <a
            href={template.exampleProblem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold tracking-tight transition-colors hover:text-accent"
          >
            {template.exampleProblem.name} ↗
          </a>
          <p className="mt-1 text-sm text-fg-muted">{template.exampleProblem.note}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15} className="mt-8">
        <p className="kicker">{"// the code"}</p>
        <div className="mt-2">
          <CodeBlock
            variants={[
              {
                label: `${template.slug}.cpp`,
                code: template.code.cpp,
                html: cppHtml,
              },
              {
                label: `${template.slug}.py`,
                code: template.code.python,
                html: pythonHtml,
              },
            ]}
          />
        </div>
      </AnimatedSection>

      {related.length > 0 && (
        <AnimatedSection className="mt-8">
          <p className="kicker">{`// more ${template.topic.toLowerCase()}`}</p>
          <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-2">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/templates/${t.slug}`}
                className="font-mono text-[13px] text-fg-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection className="mt-12">
        <nav
          aria-label="Template navigation"
          className="grid gap-3 border-t border-line pt-6 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={`/templates/${prev.slug}`}
              className="group rounded-lg border border-line bg-surface px-4 py-3 transition-colors hover:border-fg-faint"
            >
              <span className="kicker">← previous</span>
              <span className="mt-0.5 block font-medium tracking-tight transition-colors group-hover:text-accent">
                {prev.name}
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/templates/${next.slug}`}
              className="group rounded-lg border border-line bg-surface px-4 py-3 text-right transition-colors hover:border-fg-faint"
            >
              <span className="kicker">next →</span>
              <span className="mt-0.5 block font-medium tracking-tight transition-colors group-hover:text-accent">
                {next.name}
              </span>
            </Link>
          )}
        </nav>
      </AnimatedSection>
    </div>
  );
}
