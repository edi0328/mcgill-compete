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
  // ── Fall 2026 - mirrors the sponsorship prospectus; update both together ──
  {
    title: "Online Mock Interviews",
    timing: "sept · sign-ups aug 31",
    type: "Mock interviews",
    level: "Open to all",
    description:
      "Practice a technical interview with an industry engineer on a live coding pad, with feedback right after. Free, online, and open to every McGill student.",
  },
  {
    title: "Beginner Training Sessions",
    timing: "weekly · sept–nov",
    type: "Beginner training",
    level: "Beginner",
    description:
      "Core algorithms and problem-solving techniques from the ground up: the fundamentals that show up in technical interviews. No prerequisites beyond one intro programming course.",
  },
  {
    title: "Advanced Training Sessions",
    timing: "weekly · sept–nov",
    type: "Advanced training",
    level: "Advanced",
    description:
      "Harder contest topics for Codeforces regulars: graphs, DP, and data structures, building toward the ICPC.",
  },
  {
    title: "NP-Compete",
    date: "2026-09-26",
    type: "Club contest",
    level: "Open to all",
    description:
      "Our own ICPC-style contest and the biggest event of the fall: teams of three, problems written by our members, a live scoreboard, food, and prizes.",
  },
  {
    title: "ICPC North America Qualifier",
    timing: "oct · date tba",
    type: "ICPC qualifier",
    level: "Open to all",
    description:
      "McGill hosts an official site of the NAQ, the first stage on the road to the ICPC World Finals.",
  },
  {
    title: "IEEEXtreme",
    date: "2026-10-31",
    type: "External contest",
    level: "Open to all",
    description:
      "The IEEE's global 24-hour competition. McGill's teams compete from campus against thousands of teams worldwide.",
  },
  {
    title: "ICPC Northeast NA Regional",
    timing: "nov · date tba",
    type: "ICPC qualifier",
    level: "Advanced",
    description:
      "The stage after the Qualifier. McGill hosts an on-campus site for our teams.",
  },
  {
    title: "FizzBuzzed",
    date: "2026-11-12",
    type: "Club contest",
    level: "Open to all",
    description:
      "Our season-closing contest: teams solve short coding problems between rounds of drinks, with prizes for the winners. Low stakes and very beginner-friendly.",
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
