import type { AlgoTemplate } from "@/types/content";

export const trees: AlgoTemplate[] = [
  {
    slug: "lca",
    name: "LCA (Binary Lifting)",
    topic: "Tree Algorithms",
    complexity: "O(log n) per query",
    description:
      "Lowest common ancestor with binary lifting: up[j][v] is the 2^j-th ancestor of v, built in O(n log n), queried in O(log n). Also gives k-th ancestor and tree distances. Built iteratively, so deep trees are safe.",
    exampleProblem: {
      name: "CSES: Company Queries II",
      url: "https://cses.fi/problemset/task/1688",
      note: "Answer q lowest-common-boss queries on an employee tree. Build once, answer each query with lca(u, v).",
    },
    code: {
      cpp: `struct LCA {
    int LOG;
    vector<int> depth;
    vector<vector<int>> up;
    LCA(vector<vector<int>>& adj, int root = 0) {
        int n = adj.size();
        LOG = 1;
        while ((1 << LOG) < n) LOG++;
        depth.assign(n, 0);
        vector<int> parent(n, root);
        vector<bool> seen(n, false);
        vector<int> st = {root};  // iterative DFS
        seen[root] = true;
        while (!st.empty()) {
            int u = st.back();
            st.pop_back();
            for (int v : adj[u])
                if (!seen[v]) {
                    seen[v] = true;
                    parent[v] = u;
                    depth[v] = depth[u] + 1;
                    st.push_back(v);
                }
        }
        up.assign(LOG + 1, parent);
        for (int j = 1; j <= LOG; j++)
            for (int v = 0; v < n; v++)
                up[j][v] = up[j - 1][up[j - 1][v]];
    }
    int lca(int u, int v) {
        if (depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];
        for (int j = 0; diff; j++, diff >>= 1)
            if (diff & 1) u = up[j][u];
        if (u == v) return u;
        for (int j = LOG; j >= 0; j--)
            if (up[j][u] != up[j][v]) {
                u = up[j][u];
                v = up[j][v];
            }
        return up[0][u];
    }
    int dist(int u, int v) {
        return depth[u] + depth[v] - 2 * depth[lca(u, v)];
    }
};`,
      python: `class LCA:
    def __init__(self, adj, root=0):
        n = len(adj)
        self.LOG = max(1, (n - 1).bit_length())
        self.depth = [0] * n
        parent = [root] * n
        seen = [False] * n
        seen[root] = True
        st = [root]  # iterative DFS
        while st:
            u = st.pop()
            for v in adj[u]:
                if not seen[v]:
                    seen[v] = True
                    parent[v] = u
                    self.depth[v] = self.depth[u] + 1
                    st.append(v)
        self.up = [parent]
        for j in range(1, self.LOG + 1):
            prev = self.up[-1]
            self.up.append([prev[prev[v]] for v in range(n)])

    def lca(self, u, v):
        if self.depth[u] < self.depth[v]:
            u, v = v, u
        diff = self.depth[u] - self.depth[v]
        j = 0
        while diff:
            if diff & 1:
                u = self.up[j][u]
            diff >>= 1
            j += 1
        if u == v:
            return u
        for j in range(self.LOG, -1, -1):
            if self.up[j][u] != self.up[j][v]:
                u = self.up[j][u]
                v = self.up[j][v]
        return self.up[0][u]

    def dist(self, u, v):
        return self.depth[u] + self.depth[v] - 2 * self.depth[self.lca(u, v)]`,
    },
  },
  {
    slug: "hld",
    name: "Heavy-Light Decomposition",
    topic: "Tree Algorithms",
    complexity: "O(log² n) per path query",
    description:
      "Splits a tree into chains so that any root-to-node path crosses O(log n) of them, mapping each chain to a contiguous range of positions. Layer a segment tree over those positions and you can query or update values along any u–v path. The heavyweight tool for path queries on trees.",
    exampleProblem: {
      name: "CSES: Path Queries II",
      url: "https://cses.fi/problemset/task/2134",
      note: "Point updates and maximum on the path between two nodes: put node values at pos[u] in a max segment tree and fold it over each (l, r) range the decomposition yields.",
    },
    code: {
      cpp: `// Pair with a segment tree over pos[] (e.g. max). Path values live at
// pos[u]. Recursive DFS: raise the stack limit or rewrite iteratively
// for n ~ 2e5 on judges with small stacks.
struct HLD {
    int n, timer = 0;
    vector<vector<int>> adj;
    vector<int> parent, depth, heavy, head, pos;
    HLD(vector<vector<int>>& g)
        : n(g.size()), adj(g), parent(n, -1), depth(n),
          heavy(n, -1), head(n), pos(n) {
        dfs(0);
        decompose(0, 0);
    }
    int dfs(int u) {
        int size = 1, maxSub = 0;
        for (int v : adj[u])
            if (v != parent[u]) {
                parent[v] = u, depth[v] = depth[u] + 1;
                int sub = dfs(v);
                size += sub;
                if (sub > maxSub) maxSub = sub, heavy[u] = v;
            }
        return size;
    }
    void decompose(int u, int h) {
        head[u] = h, pos[u] = timer++;
        if (heavy[u] != -1) decompose(heavy[u], h);  // chain continues
        for (int v : adj[u])
            if (v != parent[u] && v != heavy[u]) decompose(v, v);
    }
    // calls op(l, r) for O(log n) ranges covering the u-v path
    template <class F>
    void processPath(int u, int v, F op) {
        for (; head[u] != head[v]; v = parent[head[v]]) {
            if (depth[head[u]] > depth[head[v]]) swap(u, v);
            op(pos[head[v]], pos[v]);
        }
        if (depth[u] > depth[v]) swap(u, v);
        op(pos[u], pos[v]);
    }
};`,
      python: `class HLD:
    """Pair with a segment tree over pos[] (e.g. max). Iterative, so deep
    trees are safe without touching the recursion limit."""

    def __init__(self, adj, root=0):
        n = len(adj)
        self.parent = [-1] * n
        self.depth = [0] * n
        self.heavy = [-1] * n
        self.head = [0] * n
        self.pos = [0] * n
        size = [1] * n
        order = []
        stack = [root]
        while stack:  # DFS preorder
            u = stack.pop()
            order.append(u)
            for v in adj[u]:
                if v != self.parent[u]:
                    self.parent[v] = u
                    self.depth[v] = self.depth[u] + 1
                    stack.append(v)
        for u in reversed(order):  # subtree sizes, heavy children
            for v in adj[u]:
                if v != self.parent[u]:
                    size[u] += size[v]
                    if self.heavy[u] == -1 or size[v] > size[self.heavy[u]]:
                        self.heavy[u] = v
        timer = 0
        for u in order:  # number each heavy chain contiguously
            if self.parent[u] == -1 or self.heavy[self.parent[u]] != u:
                h = u
                while h != -1:
                    self.head[h] = u
                    self.pos[h] = timer
                    timer += 1
                    h = self.heavy[h]

    def path_ranges(self, u, v):
        """Yields O(log n) (l, r) ranges covering the u-v path."""
        while self.head[u] != self.head[v]:
            if self.depth[self.head[u]] < self.depth[self.head[v]]:
                u, v = v, u
            yield (self.pos[self.head[u]], self.pos[u])
            u = self.parent[self.head[u]]
        if self.depth[u] > self.depth[v]:
            u, v = v, u
        yield (self.pos[u], self.pos[v])`,
    },
  },
  {
    slug: "euler-tour",
    name: "Euler Tour (Subtree Flattening)",
    topic: "Tree Algorithms",
    complexity: "O(n) build",
    description:
      "Number the vertices by DFS entry time so every subtree becomes the contiguous range [tin[u], tout[u]). Subtree queries and updates then reduce to range queries on a Fenwick or segment tree over that order. Iterative, so deep trees are safe.",
    exampleProblem: {
      name: "CSES: Subtree Queries",
      url: "https://cses.fi/problemset/task/1137",
      note: "Point updates plus subtree sums: place values at tin[u] in a Fenwick tree and sum the range [tin[u], tout[u]).",
    },
    code: {
      cpp: `// subtree of u = positions [tin[u], tout[u]) in the visit order
struct EulerTour {
    vector<int> tin, tout, order;
    int timer = 0;
    EulerTour(vector<vector<int>>& adj, int root = 0)
        : tin(adj.size()), tout(adj.size()) {
        vector<pair<int, int>> st = {{root, -1}};
        while (!st.empty()) {
            auto [u, p] = st.back();
            st.pop_back();
            if (u < 0) {  // exit event
                tout[~u] = timer;
                continue;
            }
            tin[u] = timer++;
            order.push_back(u);
            st.push_back({~u, 0});
            for (int v : adj[u])
                if (v != p) st.push_back({v, u});
        }
    }
};`,
      python: `class EulerTour:
    # subtree of u = positions [tin[u], tout[u]) in the visit order
    def __init__(self, adj, root=0):
        n = len(adj)
        self.tin = [0] * n
        self.tout = [0] * n
        self.order = []
        timer = 0
        st = [(root, -1)]
        while st:
            u, p = st.pop()
            if u < 0:  # exit event
                self.tout[~u] = timer
                continue
            self.tin[u] = timer
            timer += 1
            self.order.append(u)
            st.append((~u, 0))
            for v in adj[u]:
                if v != p:
                    st.append((v, u))`,
    },
  },
  {
    slug: "centroid-decomposition",
    name: "Centroid Decomposition",
    topic: "Tree Algorithms",
    complexity: "O(n log n) build",
    description:
      "Recursively remove the centroid (the vertex whose largest remaining component is smallest), producing a centroid tree of depth O(log n). Any path in the original tree passes through the centroid ancestor of its endpoints, so path-counting problems decompose into per-centroid work.",
    exampleProblem: {
      name: "CSES: Fixed-Length Paths I",
      url: "https://cses.fi/problemset/task/2080",
      note: "Count paths of exactly length k: at each centroid, combine depth counts across child branches, then recurse into the pieces.",
    },
    code: {
      cpp: `// par[u] = parent of u in the centroid tree (-1 for the root).
// Do your per-centroid counting inside build(), before the recursion.
struct CentroidDecomp {
    vector<vector<int>> adj;
    vector<int> par, sz;
    vector<bool> removed;
    CentroidDecomp(vector<vector<int>>& g)
        : adj(g), par(g.size(), -1), sz(g.size()), removed(g.size(), false) {
        build(0, -1);
    }
    int calc_size(int u, int p) {
        sz[u] = 1;
        for (int v : adj[u])
            if (v != p && !removed[v]) sz[u] += calc_size(v, u);
        return sz[u];
    }
    int find_centroid(int u, int p, int treeSize) {
        for (int v : adj[u])
            if (v != p && !removed[v] && sz[v] * 2 > treeSize)
                return find_centroid(v, u, treeSize);
        return u;
    }
    void build(int u, int p) {
        int c = find_centroid(u, -1, calc_size(u, -1));
        removed[c] = true;
        par[c] = p;
        // per-centroid work goes here (BFS/DFS the remaining component)
        for (int v : adj[c])
            if (!removed[v]) build(v, c);
    }
};`,
      python: `import sys
sys.setrecursionlimit(1 << 20)

class CentroidDecomp:
    """par[u] = parent of u in the centroid tree (-1 for the root).
    Do your per-centroid counting inside build(), before the recursion."""

    def __init__(self, adj):
        n = len(adj)
        self.adj = adj
        self.par = [-1] * n
        self.sz = [0] * n
        self.removed = [False] * n
        self.build(0, -1)

    def calc_size(self, u, p):
        self.sz[u] = 1
        for v in self.adj[u]:
            if v != p and not self.removed[v]:
                self.sz[u] += self.calc_size(v, u)
        return self.sz[u]

    def find_centroid(self, u, p, tree_size):
        for v in self.adj[u]:
            if v != p and not self.removed[v] and self.sz[v] * 2 > tree_size:
                return self.find_centroid(v, u, tree_size)
        return u

    def build(self, u, p):
        c = self.find_centroid(u, -1, self.calc_size(u, -1))
        self.removed[c] = True
        self.par[c] = p
        # per-centroid work goes here (BFS/DFS the remaining component)
        for v in self.adj[c]:
            if not self.removed[v]:
                self.build(v, c)`,
    },
  },
  {
    slug: "tree-isomorphism",
    name: "Tree Isomorphism (AHU)",
    topic: "Tree Algorithms",
    complexity: "O(n log n)",
    description:
      "Canonical ids for rooted trees: a node's id is determined by the sorted multiset of its children's ids, interned in a map. Two rooted trees are isomorphic exactly when their root ids match. For unrooted trees, root each tree at its center(s) and compare the resulting id sets.",
    exampleProblem: {
      name: "CSES: Tree Isomorphism I",
      url: "https://cses.fi/problemset/task/1700",
      note: "Decide whether two rooted trees are isomorphic: compute tree_id of both roots against a shared canon map and compare.",
    },
    code: {
      cpp: `// share one canon map across all trees being compared
map<vector<int>, int> canon;

int tree_id(int u, int p, vector<vector<int>>& adj) {
    vector<int> childIds;
    for (int v : adj[u])
        if (v != p) childIds.push_back(tree_id(v, u, adj));
    sort(childIds.begin(), childIds.end());
    auto it = canon.find(childIds);
    if (it == canon.end())
        it = canon.emplace(childIds, (int)canon.size()).first;
    return it->second;
}

// unrooted trees: root at the center(s) (1 or 2 middle vertices)
vector<int> tree_centers(vector<vector<int>>& adj) {
    int n = adj.size(), left = n;
    vector<int> deg(n);
    vector<bool> removed(n, false);
    queue<int> q;
    for (int u = 0; u < n; u++) {
        deg[u] = adj[u].size();
        if (deg[u] <= 1) q.push(u);
    }
    while (left > 2) {
        int layer = q.size();
        left -= layer;
        while (layer--) {
            int u = q.front(); q.pop();
            removed[u] = true;
            for (int v : adj[u])
                if (!removed[v] && --deg[v] == 1) q.push(v);
        }
    }
    vector<int> centers;
    while (!q.empty()) { centers.push_back(q.front()); q.pop(); }
    return centers;
}
// isomorphic (unrooted) iff the sorted center-id lists are equal`,
      python: `import sys
from collections import deque
sys.setrecursionlimit(1 << 20)

def tree_id(u, p, adj, canon):
    # share one canon dict across all trees being compared
    ids = sorted(tree_id(v, u, adj, canon) for v in adj[u] if v != p)
    key = tuple(ids)
    if key not in canon:
        canon[key] = len(canon)
    return canon[key]

def tree_centers(adj):
    # unrooted trees: root at the center(s) (1 or 2 middle vertices)
    n = len(adj)
    deg = [len(a) for a in adj]
    removed = [False] * n
    q = deque(u for u in range(n) if deg[u] <= 1)
    left = n
    while left > 2:
        layer = len(q)
        left -= layer
        for _ in range(layer):
            u = q.popleft()
            removed[u] = True
            for v in adj[u]:
                if not removed[v]:
                    deg[v] -= 1
                    if deg[v] == 1:
                        q.append(v)
    return list(q)

# isomorphic (unrooted) iff the sorted center-id lists are equal`,
    },
  },
];
