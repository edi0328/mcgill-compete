/* eslint-disable @next/next/no-img-element */
import { InlineLinks } from "@/components/InlineLinks";
import type { TeamMember } from "@/types/content";

/** "[EXEC_NAME]" placeholders and real names both reduce to clean initials. */
function initials(name: string): string {
  const words = name
    .replace(/[^a-zA-Z ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "CP";
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-surface p-5">
      <div className="flex items-center gap-4">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="h-14 w-14 rounded-lg border border-line object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-lg border border-line bg-paper-deep font-mono text-base text-fg-muted"
          >
            {initials(member.name)}
          </div>
        )}
        <div>
          <h3 className="font-semibold tracking-tight">{member.name}</h3>
          <p className="font-mono text-[12px] text-accent-soft">{member.role}</p>
        </div>
      </div>

      {(member.programYear || member.bio) && (
        <div className="mt-4 space-y-2">
          {member.programYear && (
            <p className="font-mono text-[12px] text-fg-faint">{member.programYear}</p>
          )}
          {member.bio && <p className="text-sm text-fg-muted">{member.bio}</p>}
        </div>
      )}

      {member.links && member.links.length > 0 && (
        <InlineLinks
          links={member.links.map((l) => ({ label: l.label.toLowerCase(), url: l.url }))}
          className="mt-4 border-t border-line pt-3"
        />
      )}
    </article>
  );
}
