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

/*
 * Navigation helpers. The tree is the single source of truth for hierarchy —
 * `template.topic` is a loose display field that mixes levels (and doesn't
 * always match tree node names), so breadcrumbs, related links, and
 * prev/next must all derive from `topicTree` via these helpers.
 */

/** Sidebar-safe projection of the tree: names and slugs only, never code. */
export interface NavLeaf {
  slug: string;
  name: string;
}
export interface NavGroup {
  name: string;
  children?: NavGroup[];
  leaves?: NavLeaf[];
}

function toNav(node: TopicNode): NavGroup {
  return {
    name: node.name,
    children: node.children?.map(toNav),
    leaves: node.leaves?.map((slug) => ({
      slug,
      name: templateBySlug(slug)?.name ?? slug,
    })),
  };
}
export const sidebarNav: NavGroup[] = topicTree.map(toNav);

/** Ancestor chain of tree nodes containing the slug, top-level topic first. */
export function pathForSlug(slug: string): TopicNode[] {
  const walk = (node: TopicNode, trail: TopicNode[]): TopicNode[] | null => {
    const here = [...trail, node];
    if (node.leaves?.includes(slug)) return here;
    for (const child of node.children ?? []) {
      const found = walk(child, here);
      if (found) return found;
    }
    return null;
  };
  for (const root of topicTree) {
    const found = walk(root, []);
    if (found) return found;
  }
  return [];
}

/** Leaf slugs in the order the tree presents them. */
export function flattenLeaves(nodes: TopicNode[]): string[] {
  return nodes.flatMap((node) => [
    ...(node.leaves ?? []),
    ...flattenLeaves(node.children ?? []),
  ]);
}

/** The top-level topic containing the slug and its leaf order — the
 *  prev/next browse scope (no cross-topic bleed). */
export function topicScopeForSlug(
  slug: string,
): { topic: TopicNode; order: string[] } | undefined {
  const topic = pathForSlug(slug)[0];
  if (!topic) return undefined;
  return { topic, order: flattenLeaves([topic]) };
}

/** Deepest tree group holding the slug (the subtopic when one exists) —
 *  the scope for "more …" related links. */
export function siblingGroupForSlug(
  slug: string,
): { name: string; slugs: string[] } | undefined {
  const path = pathForSlug(slug);
  const group = path[path.length - 1];
  if (!group) return undefined;
  return {
    name: group.name,
    slugs: (group.leaves ?? []).filter((s) => s !== slug),
  };
}
