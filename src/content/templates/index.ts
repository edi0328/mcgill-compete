import type { AlgoTemplate } from "@/types/content";
import { dataStructures } from "./dataStructures";
import { dp } from "./dp";
import { flowsMatchings } from "./flowsMatchings";
import { geometry } from "./geometry";
import { graphs } from "./graphs";
import { math } from "./math";
import { strings } from "./strings";
import { trees } from "./trees";

/**
 * Algorithm template library, rendered at /templates and /templates/[slug].
 *
 * To add a template: add an entry to the matching topic file in this
 * directory (copy an existing one, pick a unique slug, fill in both
 * languages), then add its slug to a leaf in `topicTree` below. Keep code
 * self-contained so it can be pasted straight into a solution.
 */
export const templates: AlgoTemplate[] = [
  ...dataStructures,
  ...graphs,
  ...flowsMatchings,
  ...trees,
  ...dp,
  ...strings,
  ...math,
  ...geometry,
];

export interface TopicNode {
  name: string;
  /** Sub-topics: expand to drill down. */
  children?: TopicNode[];
  /** Template slugs that are leaves at this node. */
  leaves?: string[];
}

/** The topic tree shown at /templates (CSES-style categories). */
export const topicTree: TopicNode[] = [
  {
    name: "Data Structures",
    children: [
      { name: "Disjoint Sets", leaves: ["dsu"] },
      {
        name: "Range Queries",
        leaves: ["segment-tree", "lazy-segment-tree", "fenwick-tree", "sparse-table"],
      },
      { name: "Offline Queries", leaves: ["mos-algorithm"] },
    ],
  },
  {
    name: "Graph Algorithms",
    children: [
      {
        name: "Shortest Paths",
        leaves: ["dijkstra", "zero-one-bfs", "bellman-ford", "floyd-warshall"],
      },
      { name: "Spanning Trees", leaves: ["kruskal", "prim"] },
      {
        name: "Connectivity",
        leaves: ["scc", "tarjan-scc", "bridges-articulation"],
      },
      { name: "DAGs & Satisfiability", leaves: ["toposort", "two-sat"] },
      { name: "Euler Tours", leaves: ["euler-path"] },
      {
        name: "Matchings & Flows",
        leaves: ["kuhn", "dinic", "mcmf", "hungarian"],
      },
    ],
  },
  {
    name: "Tree Algorithms",
    leaves: ["lca", "hld", "euler-tour", "centroid-decomposition", "tree-isomorphism"],
  },
  {
    name: "Dynamic Programming",
    children: [
      { name: "Classics", leaves: ["lis", "knapsack"] },
      { name: "Bitmask", leaves: ["subsets", "bitmask-dp", "sos-dp"] },
      { name: "Digits & Optimization", leaves: ["digit-dp", "li-chao"] },
    ],
  },
  {
    name: "Strings",
    leaves: [
      "kmp",
      "z-algorithm",
      "manacher",
      "rolling-hash",
      "trie",
      "aho-corasick",
      "suffix-array",
    ],
  },
  {
    name: "Mathematics",
    leaves: [
      "modular-arithmetic",
      "ext-gcd-crt",
      "sieve",
      "combinatorics",
      "matrix-exponentiation",
      "ntt",
    ],
  },
  { name: "Geometry", leaves: ["geometry-primitives", "convex-hull", "closest-pair"] },
];

export function templateBySlug(slug: string): AlgoTemplate | undefined {
  return templates.find((t) => t.slug === slug);
}
