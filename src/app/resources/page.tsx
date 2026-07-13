import type { Metadata } from "next";
import { TransitionLink as Link } from "@/components/TransitionLink";
import {
  AnimatedSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/AnimatedSection";
import { ArrowLink } from "@/components/ArrowLink";
import { InlineLinks } from "@/components/InlineLinks";
import { MaterialRow } from "@/components/MaterialRow";
import { ResourceCard } from "@/components/ResourceCard";
import { RoadmapList } from "@/components/RoadmapList";
import { Section } from "@/components/Section";
import { SimpleTable } from "@/components/SimpleTable";
import {
  advancedRoadmap,
  beginnerRoadmap,
  externalResources,
  gettingStarted,
  problemSets,
} from "@/content/resources";
import { pastMaterials } from "@/content/pastMaterials";
import { templates } from "@/content/templates";
import { isReal } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Competitive programming resources: getting started, roadmaps, templates, problem sets, and club materials.",
};

export default function ResourcesPage() {
  // Entries future execs haven't filled in yet never reach the page.
  const realProblems = problemSets.filter((p) => isReal(p.name));

  return (
    <>
      <Section
        title="Getting started"
        intro="Four steps from zero to your first contest."
      >
        <RoadmapList steps={gettingStarted} />
      </Section>

      <Section
        tone="surface"
        title="External resources"
        intro="The platforms and references we actually use."
      >
        <StaggerGrid className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {externalResources.map((r) => (
            <StaggerItem key={r.name}>
              <ResourceCard resource={r} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Section>

      <Section
        title="Where to go next"
        intro="Two tracks, depending on where you are. Both assume you solve consistently between sessions."
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
          <div>
            <p className="kicker">
              <span className="text-cf-green">beginner</span> · about one semester
            </p>
            <div className="mt-5">
              <RoadmapList steps={beginnerRoadmap} />
            </div>
          </div>
          <div>
            <p className="kicker">
              <span className="text-cf-red">advanced</span> · past the 1400 wall, up to icpc
            </p>
            <div className="mt-5">
              <RoadmapList steps={advancedRoadmap} />
            </div>
          </div>
        </div>
      </Section>

      <Section
        tone="surface"
        title="Code templates"
        intro="Copy-paste implementations in C++ and Python, each with an explanation and an example problem."
      >
        <StaggerGrid className="flex flex-wrap gap-x-8 gap-y-3">
          {templates.slice(0, 8).map((t) => (
            <StaggerItem key={t.slug}>
              <Link
                href={`/templates/${t.slug}`}
                className="font-mono text-sm text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {t.name}
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
        <AnimatedSection className="mt-6">
          <ArrowLink href="/templates">browse the template library</ArrowLink>
        </AnimatedSection>
      </Section>

      <Section
        title="Problems & session archive"
        intro="Curated problems from past sessions — try them before reading the editorial — plus the slides and materials that go with them."
      >
        {realProblems.length > 0 ? (
          <AnimatedSection>
            <SimpleTable
              headers={["problem", "platform", "topic", "difficulty", "links"]}
              minWidth="640px"
              rows={realProblems.map((p) => [
              <span key="n" className="font-medium">
                {p.name}
              </span>,
              <span key="p" className="font-mono text-[12px] text-fg-muted">
                {p.platform}
              </span>,
              <span key="t" className="text-fg-muted">
                {p.topic}
              </span>,
              <span key="d" className="font-mono text-[12px]">
                {p.difficulty}
              </span>,
              <InlineLinks
                key="l"
                links={[
                  { label: "problem", url: p.link },
                  ...(p.editorialLink
                    ? [{ label: "editorial", url: p.editorialLink }]
                    : []),
                ]}
              />,
              ])}
            />
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            <p className="max-w-[60ch] text-[15px] text-fg-muted">
              The curated problem list is published after each session, starting
              with the semester kickoff.
            </p>
          </AnimatedSection>
        )}
        <AnimatedSection className="mt-10">
          <p className="kicker">past sessions</p>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {pastMaterials.map((m) => (
              <MaterialRow
                key={`${m.semester}-${m.week}-${m.topic}`}
                material={m}
              />
            ))}
          </div>
        </AnimatedSection>
      </Section>
    </>
  );
}
