import type { ContactChannel, TeamMember } from "@/types/content";

/**
 * Executive team. Members are shown sorted by `order` (ascending).
 * All entries are placeholders — replace with real execs (with their consent
 * for any photo/bio/links you publish).
 */
export const teamMembers: TeamMember[] = [
  {
    name: "[EXEC_NAME]",
    role: "President",
    order: 1,
    programYear: "[PROGRAM, YEAR]",
    bio: "[SHORT_BIO]",
    links: [{ label: "Codeforces", url: "[PROFILE_LINK]" }],
    activeYear: "2026–2027",
  },
  {
    name: "[EXEC_NAME]",
    role: "Beginner Training Lead",
    order: 2,
    programYear: "[PROGRAM, YEAR]",
    bio: "[SHORT_BIO]",
    activeYear: "2026–2027",
  },
  {
    name: "[EXEC_NAME]",
    role: "Advanced Training Lead",
    order: 3,
    programYear: "[PROGRAM, YEAR]",
    bio: "[SHORT_BIO]",
    activeYear: "2026–2027",
  },
  {
    name: "[EXEC_NAME]",
    role: "Events / Operations Lead",
    order: 4,
    activeYear: "2026–2027",
  },
  {
    name: "[EXEC_NAME]",
    role: "Sponsorship & Finance Lead",
    order: 5,
    activeYear: "2026–2027",
  },
  {
    name: "[EXEC_NAME]",
    role: "Design / Brand Lead",
    order: 6,
    activeYear: "2026–2027",
  },
];

/** Set to null if there is no faculty advisor. */
export const facultyAdvisor: TeamMember | null = {
  name: "[ADVISOR_NAME]",
  role: "Faculty Advisor",
  order: 0,
  programYear: "[DEPARTMENT]",
  activeYear: "2026–2027",
};

export const contactChannels: ContactChannel[] = [
  {
    category: "General questions",
    description: "Anything about the club, joining, or events.",
    contact: "[CLUB_EMAIL]",
  },
  {
    category: "Sponsorship",
    description: "Partnerships, prizes, and recruiting events.",
    contact: "[SPONSORSHIP_EMAIL]",
  },
  {
    category: "ICPC / team formation",
    description: "Team selection, eligibility, and regional logistics.",
    contact: "[ICPC_CONTACT]",
  },
  {
    category: "Training / resources",
    description: "Session content, problem sets, and study advice.",
    contact: "[TRAINING_CONTACT]",
  },
];
