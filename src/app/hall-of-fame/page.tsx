import type { Metadata } from "next";
import { StaggerGrid, StaggerItem } from "@/components/AnimatedSection";
import { HallOfFameCard } from "@/components/HallOfFameCard";
import { Section } from "@/components/Section";
import { Timeline } from "@/components/Timeline";
import {
  clubTimeline,
  notableAlumni,
  regionalEntries,
  worldFinalsEntries,
} from "@/content/hallOfFame";

export const metadata: Metadata = {
  title: "Hall of Fame",
  description: "McGill's competitive programming history: ICPC results and club milestones.",
};

function EntryGrid({ entries }: { entries: typeof worldFinalsEntries }) {
  return (
    <StaggerGrid className="grid gap-4 md:grid-cols-2">
      {entries.map((entry) => (
        <StaggerItem key={`${entry.year}-${entry.competition}-${entry.teamName}`}>
          <HallOfFameCard entry={entry} />
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}

export default function HallOfFamePage() {
  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 font-mono text-[13px] text-fg-muted">
          <span className="text-accent-soft">{"// note:"}</span> this page is being
          assembled from official sources. Entries marked{" "}
          <span className="text-accent-soft">TODO: verify</span> are placeholders
          until confirmed. If you competed for McGill and your result is missing,
          email us a source link.
        </div>
      </div>

      <Section
        title="ICPC World Finals"
        intro="McGill teams that reached the world stage."
      >
        <EntryGrid entries={worldFinalsEntries} />
      </Section>

      <Section
        tone="surface"
        title="Regionals & NAC"
        intro="Results from the Northeast North America Regional and the North America Championship."
      >
        <EntryGrid entries={regionalEntries} />
      </Section>

      <Section
        title="Club timeline"
        intro="Milestones in McGill competitive programming."
      >
        <Timeline items={clubTimeline} />
      </Section>

      {notableAlumni.length > 0 && (
        <Section
          title="Notable alumni"
          intro="Listed with their permission."
        >
          <ul className="max-w-2xl space-y-2">
            {notableAlumni.map((a) => (
              <li
                key={a.name}
                className="rounded-lg border border-line bg-surface px-4 py-3 text-sm"
              >
                <span className="font-semibold">{a.name}</span>{" "}
                <span className="text-fg-muted">· {a.note}</span>{" "}
                {a.link && (
                  <a href={a.link} className="font-mono text-[12px] text-cf-blue hover:underline">
                    [link]
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
