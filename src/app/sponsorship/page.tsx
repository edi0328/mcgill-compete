import type { Metadata } from "next";
import { FileText, Mail } from "lucide-react";
import {
  AnimatedSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/AnimatedSection";
import { FallEventsList } from "@/components/FallEventsList";
import { LinkButton } from "@/components/LinkButton";
import { Section } from "@/components/Section";
import { TierTable } from "@/components/TierTable";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Sponsorship",
  description:
    "Sponsor Compete McGill's fall season: the events, tiers, single-event options, and the full prospectus.",
};

/**
 * This page carries the full Fall 2026 prospectus, minus the club intro the
 * home page already covers. Mirrors the PDF - update both together. The
 * event list itself lives in src/content/fallEvents.ts (shared with home).
 */

/** Benefit × tier matrix, same rows and order as the PDF's table. */
const tierBenefits: { benefit: string; tiers: boolean[] }[] = [
  {
    benefit: "Credited at every event: website, slides, openings, social media",
    tiers: [true, true, true, true],
  },
  { benefit: "Logo on event posters and marketing", tiers: [false, true, true, true] },
  { benefit: "Your merchandise distributed at events", tiers: [false, true, true, true] },
  { benefit: "Job postings shared to our Discord", tiers: [false, true, true, true] },
  { benefit: "Host a tech talk or workshop", tiers: [false, false, true, true] },
  { benefit: "Resume book after the events", tiers: [false, false, true, true] },
  { benefit: "Resume book before the events", tiers: [false, false, false, true] },
  {
    benefit: "Title sponsorship of a flagship event. Your team presents the awards",
    tiers: [false, false, false, true],
  },
  {
    benefit: "First option to renew for Winter 2027",
    tiers: [false, false, false, true],
  },
];

const tiers = [
  { name: "bronze", price: "$500" },
  { name: "silver", price: "$1,000" },
  { name: "gold", price: "$2,000" },
  { name: "platinum", price: "$5,000" },
];

const singleEvents = [
  {
    price: "no cost",
    title: "Mock interview partner",
    text: "Send your engineers as interviewers for our online mock interview sessions.",
  },
  {
    price: "$600",
    title: "NP-Compete food sponsor",
    text: "Feed the competitors at our flagship contest, with your branding at the food stations and a thank-you from the stage.",
  },
  {
    price: "$300",
    title: "IEEEXtreme fuel station",
    text: "Food and drinks for McGill's teams through the 24-hour competition.",
  },
  {
    price: "$500",
    title: "FizzBuzzed co-host",
    text: "Co-host the night with us. Prizes are awarded in your name.",
  },
  {
    price: "donation",
    title: "Prize sponsor",
    text: "Tech gear, gift cards, subscriptions, or licenses awarded to contest winners at any event.",
  },
];

export default function SponsorshipPage() {
  return (
    <>
      <Section
        title="Sponsorship"
        intro="Between September and November we run seven events, from weekly training sessions to NP-Compete and two official ICPC contests hosted at McGill. One sponsorship covers all of them."
      >
        <AnimatedSection>
          <p className="max-w-2xl text-base leading-relaxed text-fg-muted">
            Last fall&apos;s NP-Compete drew 190 students on 93 teams, from
            first-years in the beginner track to Codeforces regulars training
            for McGill&apos;s ICPC teams. Almost all study computer science,
            software engineering, or math, and most are looking for internships
            or full-time roles.
          </p>
          <div className="mt-6">
            <LinkButton
              href="/sponsorship-prospectus-fall2026.pdf"
              variant="primary"
              external
            >
              <FileText size={15} /> download pdf
            </LinkButton>
          </div>
        </AnimatedSection>
      </Section>

      <Section tone="surface" title="Why competitive programming?">
        <AnimatedSection>
          <div className="max-w-[65ch] border-l-2 border-accent pl-6 text-base leading-relaxed text-fg-muted">
            <p>
              A contest gives students five hours and problems they have never
              seen before. A solution either passes every test or it fails, so
              there is no room for almost-right code. To score, students have
              to break an unfamiliar problem into pieces, choose an approach
              that will work, and write code that runs correctly the first
              time. Sponsoring us puts your company in front of students who
              practice weekly.
            </p>
          </div>
        </AnimatedSection>
      </Section>

      <Section
        id="events"
        title="Fall 2026 events"
        intro="A sponsorship covers every event below, and sponsors are credited at each one."
      >
        <FallEventsList />
      </Section>

      <Section
        tone="surface"
        title="What are we raising money for?"
      >
        <AnimatedSection>
          <div className="max-w-[65ch] text-base leading-relaxed text-fg-muted">
            <p>
              Participation is free for every event except FizzBuzzed, because
              cost should never keep a student from competing. To make that
              possible, we need to cover food on contest days, prizes,
              printing, and venue costs for the competitions we host on campus.
              All contributions go directly into the events, and donated food,
              prizes, or software licenses are as welcome as cash.
            </p>
          </div>
        </AnimatedSection>
      </Section>

      <Section
        title="Tiers"
        intro="Each tier covers every event and training session this fall. Higher tiers mainly add recruiting access: resumes and time in front of students. Prices are in CAD, and we are happy to build a custom package around any budget."
      >
        <AnimatedSection>
          <TierTable tiers={tiers} rows={tierBenefits} />
          <p className="mt-4 font-mono text-[12px] text-fg-faint">
            Platinum is capped at two sponsors.
          </p>
        </AnimatedSection>
      </Section>

      <Section
        tone="surface"
        title="Single-event sponsorship"
        intro="If a semester package is more than you need, you can back one event instead."
      >
        <StaggerGrid className="divide-y divide-line border-y border-line">
          {singleEvents.map((s) => (
            <StaggerItem key={s.title}>
              <div className="py-5 sm:grid sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-x-4">
                <p className="font-mono text-[13px] text-fg-muted">{s.price}</p>
                <div className="mt-1 sm:mt-0">
                  <h3 className="text-[17px] font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-1 max-w-[65ch] text-base leading-relaxed text-fg-muted">
                    {s.text}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Section>

      <Section
        title="Get in touch"
        intro="Email Edison Thai, co-president and sponsorship lead. To help us respond quickly, include your organization, the tier you have in mind, and whether your support would be money, donated goods, or both."
        flush
      >
        <AnimatedSection>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <LinkButton
              href={`mailto:${site.sponsorshipEmail}`}
              variant="primary"
              external
            >
              <Mail size={15} /> email us
            </LinkButton>
            <span className="font-mono text-[13px] text-fg-muted">
              {site.sponsorshipEmail}
            </span>
          </div>
        </AnimatedSection>
      </Section>
    </>
  );
}
