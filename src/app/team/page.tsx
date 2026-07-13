import type { Metadata } from "next";
import { StaggerGrid, StaggerItem } from "@/components/AnimatedSection";
import { Section } from "@/components/Section";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { site } from "@/content/site";
import { contactChannels, facultyAdvisor, teamMembers } from "@/content/team";

export const metadata: Metadata = {
  title: "Team",
  description: "The executive team behind Compete McGill and how to reach us.",
};

export default function TeamPage() {
  const sorted = [...teamMembers].sort((a, b) => a.order - b.order);
  const activeYear = sorted[0]?.activeYear;

  return (
    <>
      <Section
        title="The team"
        intro={`${site.shortDescription} The ${activeYear} executive team runs the trainings and contests.`}
      >
        <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((member) => (
            <StaggerItem key={`${member.role}-${member.name}-${member.order}`}>
              <TeamMemberCard member={member} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Section>

      {facultyAdvisor && (
        <Section title="Faculty advisor" tone="surface">
          <div className="max-w-sm">
            <TeamMemberCard member={facultyAdvisor} />
          </div>
        </Section>
      )}

      <Section
        title="Get in touch"
        intro="Pick whichever channel fits."
      >
        <StaggerGrid className="grid gap-4 sm:grid-cols-2">
          {contactChannels.map((c) => (
            <StaggerItem key={c.category}>
              <div className="h-full rounded-lg border border-line bg-surface p-5">
                <h3 className="font-semibold tracking-tight">{c.category}</h3>
                <p className="mt-2 text-sm text-fg-muted">{c.description}</p>
                <a
                  href={c.contact.includes("@") ? `mailto:${c.contact}` : c.contact}
                  className="mt-3 inline-block font-mono text-[13px] text-cf-blue hover:underline"
                >
                  {c.contact}
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Section>
    </>
  );
}
