import { EmptyState } from "@/components/EmptyState";
import { DiscordIcon } from "@/components/BrandIcons";
import { site } from "@/content/site";
import { isReal } from "@/lib/placeholders";

/**
 * Renders the Google Calendar iframe when `calendarEmbedUrl` in
 * src/content/site.ts is a real URL. (Future execs: Google Calendar →
 * Settings → your calendar → "Integrate calendar" → copy the iframe src.)
 * Until then, a user-facing note points people at Discord.
 */
export function CalendarEmbed() {
  if (isReal(site.calendarEmbedUrl) && site.calendarEmbedUrl.startsWith("http")) {
    return (
      <div className="overflow-hidden rounded-lg border border-line">
        <iframe
          src={site.calendarEmbedUrl}
          title="Compete McGill Google Calendar"
          className="h-[500px] w-full"
          style={{ filter: "invert(0.9) hue-rotate(180deg)" }}
        />
      </div>
    );
  }
  return (
    <EmptyState
      title="calendar goes live at kickoff"
      cta={
        <>
          <DiscordIcon width={15} height={15} /> get announcements on discord
        </>
      }
      href={site.links.discord}
    >
      The semester calendar is published once the term schedule is locked in.
      Until then, every session and contest is announced on Discord.
    </EmptyState>
  );
}
