import { Mail } from "lucide-react";
import {
  AnimatedSection,
  Parallax,
  StaggerGrid,
  StaggerItem,
} from "@/components/AnimatedSection";
import { ArrowLink } from "@/components/ArrowLink";
import { EventCard } from "@/components/EventCard";
import { LinkButton } from "@/components/LinkButton";
import { GemCanvas } from "@/components/HeroVisuals";
import { ScrambleText } from "@/components/ScrambleText";
import { DiscordIcon } from "@/components/BrandIcons";
import { Section } from "@/components/Section";
import { site } from "@/content/site";
import { upcomingEvents } from "@/lib/events";

/** The two activities that define the club, always fully visible. */
const coreActivities = [
  {
    title: "Training sessions",
    meta: "weekly · beginner + advanced",
    text: "Weekly beginner and advanced sessions on core algorithms and techniques.",
  },
  {
    title: "Practice contests",
    meta: "every 2–3 weeks · icpc rules",
    text: "Timed contests under ICPC rules, the closest thing to the real event.",
  },
];

const moreActivities = [
  {
    title: "ICPC preparation",
    text: "Team selection, 5-hour simulations, and travel to regionals.",
  },
  {
    title: "Contest reviews",
    text: "Full solution walkthroughs after every contest, easiest to hardest.",
  },
  {
    title: "Beginner onboarding",
    text: "Structured path from your first problem to your first rated contest.",
  },
  {
    title: "Team formation",
    text: "We match you with teammates at your level for ICPC and practice.",
  },
];

export default function Home() {
  const nextEvents = upcomingEvents(3);
  const partnerNumber = nextEvents.length > 0 ? "04" : "03";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-line">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[550px] lg:grid-cols-[1.05fr_0.95fr]">
          <AnimatedSection>
            <ScrambleText
              as="h1"
              text="Compete McGill"
              immediate
              className="font-display text-4xl tracking-tight sm:text-6xl"
            />
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-fg-muted sm:text-base">
              {site.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton href={site.links.discord} variant="primary" external>
                <DiscordIcon width={15} height={15} /> join the discord
              </LinkButton>
              <LinkButton href="/schedule" variant="ghost">
                see this fall&apos;s schedule
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
      <Section number="01" label="who we are" title="About the club">
        <AnimatedSection>
          <div className="max-w-[65ch] space-y-4 border-l-2 border-accent pl-6 text-[16px] leading-relaxed text-fg-muted sm:text-[17px]">
            {site.about.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </AnimatedSection>
      </Section>

      {/* ── Activities ───────────────────────────────────────── */}
      <Section number="02" label="what we do" title="Main activities" tone="surface">
        <StaggerGrid className="grid gap-4 sm:grid-cols-2">
          {coreActivities.map((a) => (
            <StaggerItem key={a.title}>
              <div className="panel h-full p-6">
                <p className="kicker">{a.meta}</p>
                <h3 className="mt-2 text-lg font-semibold">{a.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">
                  {a.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
        <StaggerGrid className="mt-8 grid gap-x-10 sm:grid-cols-2">
          {moreActivities.map((a) => (
            <StaggerItem key={a.title}>
              <div className="border-t border-line py-3.5">
                <h3 className="text-[15px] font-medium">{a.title}</h3>
                <p className="mt-1 text-sm text-fg-muted">{a.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Section>

      {/* ── Next events ──────────────────────────────────────── */}
      {nextEvents.length > 0 && (
        <Section number="03" label="coming soon" title="This fall">
          <StaggerGrid className="max-w-3xl divide-y divide-line border-y border-line">
            {nextEvents.map((event) => (
              <StaggerItem key={event.title}>
                <EventCard event={event} />
              </StaggerItem>
            ))}
          </StaggerGrid>
          <AnimatedSection className="mt-6">
            <ArrowLink href="/schedule">full schedule</ArrowLink>
          </AnimatedSection>
        </Section>
      )}

      {/* ── Partners ──────────────────────────────────────────── */}
      <Section
        number={partnerNumber}
        label="partners"
        title="Partner with us"
        intro="Our contests and training sessions reach McGill's strongest algorithmic problem-solvers. Email us about sponsorship."
        tone="surface"
        flush
      >
        <AnimatedSection>
          <LinkButton
            href={`mailto:${site.sponsorshipEmail}`}
            variant="primary"
            external
          >
            <Mail size={15} /> sponsorship inquiries
          </LinkButton>
        </AnimatedSection>
      </Section>
    </>
  );
}
