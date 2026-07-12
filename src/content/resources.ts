import type {
  ExternalResource,
  ProblemEntry,
  RoadmapStep,
} from "@/types/content";

/**
 * Everything on the Resources page. External links are real public sites;
 * club-specific links ([...]) are placeholders until real material exists.
 */

export const gettingStarted: RoadmapStep[] = [
  {
    title: "Join the Discord",
    description:
      "All announcements, problem discussion, and help live there. Say hi in #introductions.",
  },
  {
    title: "Make a Codeforces account",
    description:
      "It's the main platform we use for contests and practice. Add yourself to the club's friends list so we can find you.",
    link: { label: "codeforces.com", url: "https://codeforces.com" },
  },
  {
    title: "Come to a beginner training session",
    description:
      "No prerequisites beyond one intro programming course. Check the schedule for the next one.",
    link: { label: "See schedule", url: "/schedule" },
  },
  {
    title: "Solve your first problems",
    description:
      "Start with the CSES Problem Set introductory section or Codeforces problems rated 800–1000.",
    link: { label: "CSES Problem Set", url: "https://cses.fi/problemset/" },
  },
];

export const externalResources: ExternalResource[] = [
  {
    name: "Codeforces",
    url: "https://codeforces.com",
    description: "The main competitive programming platform, with rated contests every few days.",
    tags: ["contests", "practice"],
  },
  {
    name: "AtCoder",
    url: "https://atcoder.jp",
    description: "Japanese contest platform with famously clean problems. Beginner contests weekly.",
    tags: ["contests", "practice"],
  },
  {
    name: "Kattis",
    url: "https://open.kattis.com",
    description: "Problem archive used by many ICPC regionals. Good judge for team practice.",
    tags: ["practice", "icpc"],
  },
  {
    name: "CSES Problem Set",
    url: "https://cses.fi/problemset/",
    description: "300 curated problems covering every core topic. The best structured practice list.",
    tags: ["practice", "roadmap"],
  },
  {
    name: "USACO Guide",
    url: "https://usaco.guide",
    description: "Free structured syllabus from bronze to advanced, with problems per topic.",
    tags: ["learning", "roadmap"],
  },
  {
    name: "CP-Algorithms",
    url: "https://cp-algorithms.com",
    description: "The reference for algorithm write-ups: concise theory plus implementation.",
    tags: ["reference"],
  },
  {
    name: "ICPC Past Problems",
    url: "https://icpc.global/worldfinals/problems",
    description: "Official archive of ICPC World Finals problem sets.",
    tags: ["icpc", "practice"],
  },
];

export const beginnerRoadmap: RoadmapStep[] = [
  {
    title: "Foundations",
    description:
      "One programming language (we recommend C++), big-O basics, arrays, strings, sorting. Solve ~30 problems rated ≤1000.",
  },
  {
    title: "Core toolkit",
    description:
      "Binary search, prefix sums, two pointers, sets/maps, basic recursion. CSES 'Sorting and Searching' section.",
  },
  {
    title: "First rated contests",
    description:
      "Do every Codeforces Div. 3/4 you can. Upsolve at least one problem you missed per contest. That's where the learning is.",
  },
  {
    title: "Graphs & DP",
    description:
      "BFS/DFS, shortest paths, and classic dynamic programming. This is the wall. Training sessions exist to get you over it.",
  },
];

export const advancedRoadmap: RoadmapStep[] = [
  {
    title: "Rating 1400–1800",
    description:
      "Segment trees, DSU, combinatorics, number theory, harder DP. Upsolve Div. 2 D/E consistently.",
  },
  {
    title: "Rating 1800+",
    description:
      "Flows, advanced data structures, geometry, string algorithms (Z, KMP, hashing, suffix structures).",
  },
  {
    title: "ICPC preparation",
    description:
      "Team practice on 5-hour regional sets, printed-reference discipline, and role specialization. Join the ICPC practice sessions.",
  },
  {
    title: "Virtual contests",
    description:
      "Weekly virtuals of past regionals/World Finals with your team. Review every problem you didn't solve in-contest.",
  },
];

export const problemSets: ProblemEntry[] = [
  {
    name: "[PROBLEM_NAME]",
    platform: "Codeforces",
    link: "[PROBLEM_LINK]",
    topic: "Binary search",
    difficulty: "1200",
    editorialLink: "[EDITORIAL_LINK]",
  },
  {
    name: "[PROBLEM_NAME]",
    platform: "CSES",
    link: "[PROBLEM_LINK]",
    topic: "Dynamic programming",
    difficulty: "Intermediate",
  },
  {
    name: "[PROBLEM_NAME]",
    platform: "Kattis",
    link: "[PROBLEM_LINK]",
    topic: "Graphs",
    difficulty: "Hard",
    editorialLink: "[EDITORIAL_LINK]",
  },
];
