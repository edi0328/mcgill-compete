/**
 * Shared content types for the Compete McGill site.
 *
 * Future execs: you normally don't need to touch this file - edit the data
 * files in `src/content/` instead. Only add fields here if a content file
 * needs something new.
 */

export type EventType =
  | "Beginner training"
  | "Advanced training"
  | "Practice contest"
  | "Contest review"
  | "ICPC team practice"
  | "ICPC qualifier"
  | "Club contest"
  | "Social / kickoff"
  | "Mock interviews"
  | "External contest";

export type EventLevel = "Beginner" | "Intermediate" | "Advanced" | "Open to all";

export interface EventLinks {
  slides?: string;
  problems?: string;
  editorial?: string;
  contest?: string;
  rsvp?: string;
  discord?: string;
}

export interface ClubEvent {
  title: string;
  /**
   * ISO date, e.g. "2026-09-15" - used to sort and split upcoming/past.
   * Omit while the date isn't confirmed and set `timing` instead; the event
   * then shows as "coming soon" with the timing string.
   */
  date?: string;
  /** Human schedule shown when `date` is unset, e.g. "october · date tba". */
  timing?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  type: EventType;
  level: EventLevel;
  host?: string;
  description: string;
  links?: EventLinks;
}

export interface TeamMember {
  name: string;
  role: string;
  /** Lower numbers are shown first. */
  order: number;
  /** Path under /public, e.g. "/team/alex.jpg". Omit for the default avatar. */
  photo?: string;
  programYear?: string;
  bio?: string;
  links?: { label: string; url: string }[];
  /** Academic year the member is active, e.g. "2026–2027". */
  activeYear: string;
}

export interface ContactChannel {
  category: string;
  description: string;
  /** Email address or URL. */
  contact: string;
}

export interface ExternalResource {
  name: string;
  url: string;
  description: string;
  tags: string[];
}

export interface RoadmapStep {
  title: string;
  description: string;
  link?: { label: string; url: string };
}

export interface AlgoTemplate {
  /** URL segment, e.g. "dsu" → /templates/dsu */
  slug: string;
  name: string;
  topic: string;
  /** Time complexity, e.g. "O(n log n)". */
  complexity: string;
  description: string;
  /** A problem where this template is the natural tool. */
  exampleProblem: { name: string; url: string; note: string };
  code: { cpp: string; python: string };
}

export interface ProblemEntry {
  name: string;
  platform: string;
  link: string;
  topic: string;
  difficulty: string;
  editorialLink?: string;
}

export interface PastMaterial {
  /** e.g. "Fall 2026" */
  semester: string;
  /** e.g. "Week 3" or "Session 2" */
  week: string;
  topic: string;
  level: EventLevel;
  slides?: string;
  problems?: string;
  solutions?: string;
  recording?: string;
}

export interface HallOfFameEntry {
  year: string;
  competition: string;
  teamName: string;
  members: string[];
  coach?: string;
  placement: string;
  /** How the team qualified, e.g. "Top 3 at ECNA Regional". */
  qualification?: string;
  sourceLink?: string;
  photo?: string;
  /**
   * IMPORTANT: only set to true once the result is confirmed by a public
   * source (ICPC standings page, news article) and sourceLink is filled in.
   * Unverified entries show a "TODO: verify" badge on the site.
   */
  verified: boolean;
}

export interface TimelineItem {
  year: string;
  text: string;
  verified: boolean;
}
