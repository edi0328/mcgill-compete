import {
  AnimatedSection,
  Parallax,
  StaggerGrid,
  StaggerItem,
} from "@/components/AnimatedSection";
import { FallEventsList } from "@/components/FallEventsList";
import { LinkButton } from "@/components/LinkButton";
import { GemCanvas } from "@/components/HeroVisuals";
import { ScrambleText } from "@/components/ScrambleText";
import { DiscordIcon } from "@/components/BrandIcons";
import { Section } from "@/components/Section";
import { site } from "@/content/site";

/** The club's public-facing program, distilled from the full event plan. */
const activities = [
  {
    title: "Training",
    text: "Separate beginner and advanced tracks for every skill level.",
  },
  {
    title: "Competitions",
    text: "Warmups, NP-Compete, ICPC qualifiers, and IEEEXtreme.",
  },
  {
    title: "Preparation",
    text: "Mock interviews, team simulations, and post-contest reviews.",
  },
  {
    title: "Community",
    text: "Hackathons, club collaborations, and student-created problems.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-line">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[550px] lg:grid-cols-[1.15fr_0.85fr]">
          <AnimatedSection>
            <ScrambleText
              as="h1"
              text="Compete McGill"
              immediate
              className="-ml-1 font-display text-4xl tracking-tight sm:text-6xl lg:whitespace-nowrap"
            />
            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-fg-muted">
              {site.heroDescription}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <LinkButton
                href={site.links.discord}
                variant="primary"
                external
                className="w-full sm:w-auto"
              >
                <DiscordIcon width={15} height={15} /> join the discord
              </LinkButton>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15} className="flex justify-center lg:justify-end">
            <Parallax offset={24}>
              <GemCanvas />
            </Parallax>
          </AnimatedSection>
        </div>
      </div>

      {/* ── Who we are ───────────────────────────────────────── */}
      <Section title="About the club">
        {/* Primary reading text renders instantly - never behind a reveal. */}
        <div className="max-w-[65ch] space-y-4 border-l-2 border-accent pl-6 text-base leading-relaxed text-fg-muted">
          {site.about.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </Section>

      {/* ── Activities ───────────────────────────────────────── */}
      <Section title="What we do" scramble tone="surface">
        {/* Four concise full-width layers. Every layout interval follows the
            section's 4px spacing grid. */}
        <StaggerGrid className="divide-y divide-line border-y border-line">
          {activities.map((a) => (
            <StaggerItem key={a.title}>
              <div className="py-6 sm:grid sm:grid-cols-[14rem_1fr] sm:items-baseline sm:gap-x-4">
                <h3 className="text-lg font-semibold tracking-tight text-fg">
                  {a.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-fg-muted sm:mt-0">
                  {a.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Section>

      {/* ── This fall ────────────────────────────────────────── */}
      <Section title="This fall">
        <FallEventsList />
      </Section>

      {/* ── Partners ──────────────────────────────────────────── */}
      <Section
        title="Partner with us"
        intro="Our contests and training sessions reach McGill's strongest algorithmic problem-solvers. Tiers, single-event options, and the full prospectus are on the sponsorship page."
        tone="surface"
        flush
      >
        <AnimatedSection>
          <LinkButton href="/sponsorship" variant="primary">
            become a sponsor
          </LinkButton>
        </AnimatedSection>
      </Section>
    </>
  );
}
