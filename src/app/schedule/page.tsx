import type { Metadata } from "next";
import {
  AnimatedSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/AnimatedSection";
import { DiscordIcon } from "@/components/BrandIcons";
import { CalendarEmbed } from "@/components/CalendarEmbed";
import { EmptyState } from "@/components/EmptyState";
import { EventCard } from "@/components/EventCard";
import { MaterialRow } from "@/components/MaterialRow";
import { Section } from "@/components/Section";
import { SimpleTable } from "@/components/SimpleTable";
import { site, weeklyRhythm } from "@/content/site";
import { pastMaterials } from "@/content/pastMaterials";
import { pastEvents, upcomingEvents } from "@/lib/events";
import { realOr } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "Schedule",
  description:
    "Upcoming Compete McGill events, weekly rhythm, and session archive.",
};

export default function SchedulePage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();

  return (
    <>
      <Section
        number="01"
        label="upcoming"
        title="Upcoming events"
        intro="Everything below also lands in the Discord. Announcements there are the source of truth for last-minute room changes."
      >
        {upcoming.length > 0 ? (
          <StaggerGrid className="max-w-3xl divide-y divide-line border-y border-line">
            {upcoming.map((event) => (
              <StaggerItem key={event.title}>
                <EventCard event={event} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        ) : (
          <EmptyState
            title="nothing scheduled yet"
            cta={
              <>
                <DiscordIcon width={15} height={15} /> get announcements on discord
              </>
            }
            href={site.links.discord}
          >
            The next semester&apos;s sessions are posted here once rooms are
            confirmed. New events are always announced on Discord first.
          </EmptyState>
        )}
      </Section>

      <Section
        tone="surface"
        number="02"
        label="calendar"
        title="Club calendar"
        intro="Subscribe to get every session in your own calendar."
      >
        <AnimatedSection>
          <CalendarEmbed />
        </AnimatedSection>
      </Section>

      <Section
        number="03"
        label="rhythm"
        title="A typical week"
        intro="Exact days and rooms are confirmed at the start of each semester."
      >
        <AnimatedSection>
          <SimpleTable
            headers={["day", "time", "activity", "notes"]}
            rows={weeklyRhythm.map((row) => [
              <span key="d" className="font-mono text-[13px]">
                {realOr(row.day, "TBA")}
              </span>,
              <span key="t" className="font-mono text-[13px]">
                {realOr(row.time, "TBA")}
              </span>,
              row.activity,
              <span key="n" className="text-fg-muted">
                {row.note}
              </span>,
            ])}
          />
        </AnimatedSection>
      </Section>

      <Section
        tone="surface"
        number="04"
        label="archive"
        title="Past sessions"
        intro="Slides, problem sets, and recordings from previous semesters."
      >
        <AnimatedSection>
          <div className="divide-y divide-line border-y border-line">
            {pastMaterials.map((m) => (
              <MaterialRow key={`${m.semester}-${m.week}-${m.topic}`} material={m} />
            ))}
          </div>
          {past.length > 0 && (
            <details className="mt-6">
              <summary className="cursor-pointer font-mono text-[13px] text-fg-muted">
                past events ({past.length})
              </summary>
              <div className="mt-2 divide-y divide-line border-t border-line">
                {past.map((event) => (
                  <EventCard
                    key={`${event.date}-${event.title}`}
                    event={event}
                  />
                ))}
              </div>
            </details>
          )}
        </AnimatedSection>
      </Section>
    </>
  );
}
