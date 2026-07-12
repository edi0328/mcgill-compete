import type { PastMaterial } from "@/types/content";

/**
 * Archive of past session materials — shown on Schedule (session archive)
 * and Resources (club materials). Newest first is a good convention.
 * Omit any link field that doesn't exist for a session.
 */
export const pastMaterials: PastMaterial[] = [
  {
    semester: "Winter 2026",
    week: "Week 10",
    topic: "Dynamic Programming on Trees",
    level: "Advanced",
    slides: "[SLIDES_LINK]",
    problems: "[PROBLEM_SET_LINK]",
    solutions: "[EDITORIAL_LINK]",
  },
  {
    semester: "Winter 2026",
    week: "Week 8",
    topic: "Binary Search & Two Pointers",
    level: "Beginner",
    slides: "[SLIDES_LINK]",
    problems: "[PROBLEM_SET_LINK]",
    recording: "[RECORDING_LINK]",
  },
  {
    semester: "Winter 2026",
    week: "Week 5",
    topic: "Graph Traversal (BFS/DFS)",
    level: "Beginner",
    slides: "[SLIDES_LINK]",
    problems: "[PROBLEM_SET_LINK]",
  },
  {
    semester: "Fall 2025",
    week: "Week 11",
    topic: "Network Flows",
    level: "Advanced",
    slides: "[SLIDES_LINK]",
    solutions: "[EDITORIAL_LINK]",
  },
];
