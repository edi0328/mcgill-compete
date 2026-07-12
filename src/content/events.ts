import type { ClubEvent } from "@/types/content";

/**
 * All club events, upcoming and past. The site splits them automatically:
 * events without a `date` show as "coming soon" (set `timing` to say when
 * roughly); once a date is confirmed, add `date`/`startTime`/`endTime`/
 * `location` and the card switches to the full dated layout.
 *
 * `type` and `level` must be one of the values in src/types/content.ts.
 */
export const events: ClubEvent[] = [
  {
    title: "Kickoff & Info Session",
    timing: "sept · date tba",
    type: "Social / kickoff",
    level: "Open to all",
    description:
      "What the club does, how the semester is structured, and how to join a training group. There will be pizza.",
  },
  {
    title: "Beginner Training Sessions",
    timing: "weekly · from sept",
    type: "Beginner training",
    level: "Beginner",
    description:
      "Core algorithms and problem-solving techniques from the ground up. No prerequisites beyond one intro programming course.",
  },
  {
    title: "Advanced Training Sessions",
    timing: "weekly · from sept",
    type: "Advanced training",
    level: "Advanced",
    description:
      "Harder topics for Codeforces Div. 1/2 regulars — graphs, DP, data structures — building toward ICPC.",
  },
  {
    title: "NP Compete",
    timing: "oct · date tba",
    type: "ICPC qualifier",
    level: "Open to all",
    description:
      "Our ICPC qualifying contest: the results decide who represents McGill at the regionals. Anyone can enter.",
  },
  {
    title: "FizzBuzz 6.0",
    timing: "tba",
    type: "Club contest",
    level: "Open to all",
    description:
      "The sixth edition of Compete McGill's own contest, open to everyone at McGill. Details announced on Discord.",
  },
  // ── Past events (kept for the archive) ──────────────────────────────
  {
    title: "Winter Wrap-up & Contest Review",
    date: "2026-04-02",
    startTime: "18:00",
    endTime: "19:30",
    location: "[ROOM, BUILDING]",
    type: "Contest review",
    level: "Open to all",
    host: "[EXEC_NAME]",
    description:
      "Review of the winter practice contest and semester retrospective.",
    links: {
      editorial: "[EDITORIAL_LINK]",
    },
  },
];
