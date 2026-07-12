import type { HallOfFameEntry, TimelineItem } from "@/types/content";

/**
 * ─────────────────────────────────────────────────────────────────────
 *  HALL OF FAME — READ THIS BEFORE EDITING
 * ─────────────────────────────────────────────────────────────────────
 * Every entry below is a PLACEHOLDER. Do not publish real results until:
 *   1. The result is confirmed by a public source (official ICPC
 *      standings at icpc.global, a news article, etc.)
 *   2. `sourceLink` points to that source.
 *   3. You set `verified: true`.
 * Unverified entries render with a visible "TODO: verify" badge.
 * Never publish member names without their consent.
 */

export const worldFinalsEntries: HallOfFameEntry[] = [
  {
    year: "[YEAR]",
    competition: "ICPC World Finals",
    teamName: "[TEAM_NAME]",
    members: ["[MEMBER_1]", "[MEMBER_2]", "[MEMBER_3]"],
    coach: "[COACH_NAME]",
    placement: "[PLACEMENT]",
    qualification: "[QUALIFICATION_ROUTE]",
    sourceLink: "[SOURCE_LINK]",
    verified: false,
  },
];

export const regionalEntries: HallOfFameEntry[] = [
  {
    year: "[YEAR]",
    competition: "ICPC North America Championship",
    teamName: "[TEAM_NAME]",
    members: ["[MEMBER_1]", "[MEMBER_2]", "[MEMBER_3]"],
    coach: "[COACH_NAME]",
    placement: "[PLACEMENT]",
    qualification: "[QUALIFICATION_ROUTE]",
    sourceLink: "[SOURCE_LINK]",
    verified: false,
  },
  {
    year: "[YEAR]",
    competition: "ICPC Northeast North America Regional",
    teamName: "[TEAM_NAME]",
    members: ["[MEMBER_1]", "[MEMBER_2]", "[MEMBER_3]"],
    placement: "[PLACEMENT]",
    sourceLink: "[SOURCE_LINK]",
    verified: false,
  },
];

export const clubTimeline: TimelineItem[] = [
  { year: "[YEAR]", text: "[Club founded: add the verified founding year.]", verified: false },
  { year: "[YEAR]", text: "[First ICPC regional appearance.]", verified: false },
  { year: "[YEAR]", text: "[Notable milestone: contest hosted, division created, etc.]", verified: false },
];

/**
 * Optional: notable alumni. Leave empty unless the information is public
 * AND the person has approved being listed.
 */
export const notableAlumni: { name: string; note: string; link?: string }[] = [];
