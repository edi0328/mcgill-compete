import type { AlgoTemplate } from "@/types/content";

export const graphs: AlgoTemplate[] = [
  {
    slug: "dijkstra",
    name: "Dijkstra",
    topic: "Shortest Paths",
    complexity: "O(m log n)",
    description:
      "Single-source shortest paths on graphs with non-negative edge weights, using a priority queue with lazy deletion (the `d > dist[u]` skip). For negative weights use Bellman-Ford instead; for unweighted graphs plain BFS is enough.",
    exampleProblem: {
      name: "CSES: Shortest Routes I",
      url: "https://cses.fi/problemset/task/1671",
      note: "The canonical statement: shortest distance from city 1 to every other city, with weights up to 1e9. Note the long long / Python int distances.",
    },
    code: {
      cpp: `// adj[u] = {{v, w}, ...}; returns dist from src (LLONG_MAX = unreachable)
vector<long long> dijkstra(int src, vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<long long> dist(n, LLONG_MAX);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>,
                   greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;  // stale entry
        for (auto [v, w] : adj[u])
            if (d + w < dist[v]) pq.push({dist[v] = d + w, v});
    }
    return dist;
}`,
      python: `import heapq

def dijkstra(src, adj):  # adj[u] = [(v, w), ...]
    n = len(adj)
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:  # stale entry
            continue
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
    },
  },
  {
    slug: "zero-one-bfs",
    name: "0-1 BFS",
    topic: "Shortest Paths",
    complexity: "O(n + m)",
    description:
      "Shortest paths when every edge weighs 0 or 1, using a deque instead of a priority queue: 0-edges go to the front, 1-edges to the back. Linear time, so it beats Dijkstra whenever it applies. Common in grid problems where some moves are free.",
    exampleProblem: {
      name: "Codeforces 1063B: Labyrinth",
      url: "https://codeforces.com/problemset/problem/1063/B",
      note: "Grid walk where up/down moves are free and left/right moves are limited. Model the limited moves as weight-1 edges and 0-1 BFS gives the minimum consumption.",
    },
    code: {
      cpp: `// adj[u] = {{v, w}, ...} with w in {0, 1}
vector<int> zero_one_bfs(int src, vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    deque<int> dq;
    dist[src] = 0;
    dq.push_back(src);
    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();
        for (auto [v, w] : adj[u])
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (w == 0) dq.push_front(v);
                else dq.push_back(v);
            }
    }
    return dist;
}`,
      python: `from collections import deque

def zero_one_bfs(src, adj):  # adj[u] = [(v, w), ...] with w in {0, 1}
    n = len(adj)
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    dq = deque([src])
    while dq:
        u = dq.popleft()
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if w == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)
    return dist`,
    },
  },
  {
    slug: "kruskal",
    name: "Kruskal (MST)",
    topic: "Spanning Trees",
    complexity: "O(m log m)",
    description:
      "Minimum spanning tree: sort edges by weight and add each one that connects two different components. Needs the DSU template (paste it above this). If fewer than n−1 edges get added, the graph is disconnected.",
    exampleProblem: {
      name: "CSES: Road Reparation",
      url: "https://cses.fi/problemset/task/1675",
      note: "Minimum cost to connect all cities, or report impossible. That is the MST cost plus the connectivity check on the last line.",
    },
    code: {
      cpp: `// requires the DSU template; edges as {w, u, v}
long long kruskal(int n, vector<array<long long, 3>>& edges) {
    sort(edges.begin(), edges.end());
    DSU dsu(n);
    long long cost = 0;
    int used = 0;
    for (auto& [w, u, v] : edges)
        if (dsu.unite(u, v)) {
            cost += w;
            used++;
        }
    return used == n - 1 ? cost : -1;  // -1 = graph not connected
}`,
      python: `# requires the DSU template; edges as (w, u, v)
def kruskal(n, edges):
    dsu = DSU(n)
    cost = 0
    used = 0
    for w, u, v in sorted(edges):
        if dsu.unite(u, v):
            cost += w
            used += 1
    return cost if used == n - 1 else -1  # -1 = graph not connected`,
    },
  },
  {
    slug: "scc",
    name: "SCC (Kosaraju)",
    topic: "Connectivity",
    complexity: "O(n + m)",
    description:
      "Strongly connected components of a directed graph in two passes: a postorder over the graph, then a sweep over the reverse graph in reverse postorder. Iterative, so deep graphs are safe. Component ids come out in topological order of the condensation, which is usually what the follow-up DP wants.",
    exampleProblem: {
      name: "CSES: Planets and Kingdoms",
      url: "https://cses.fi/problemset/task/1683",
      note: "Label each planet with its kingdom, which is literally the comp[] array this template produces.",
    },
    code: {
      cpp: `struct SCC {  // comp[v] = component id, in topological order
    int n, comps = 0;
    vector<vector<int>> adj, radj;
    vector<int> comp;
    SCC(int n) : n(n), adj(n), radj(n), comp(n, -1) {}
    void add_edge(int u, int v) {
        adj[u].push_back(v);
        radj[v].push_back(u);
    }
    void run() {
        vector<int> order, it(n, 0), st;
        vector<bool> seen(n, false);
        for (int s = 0; s < n; s++) {  // iterative postorder
            if (seen[s]) continue;
            seen[s] = true;
            st.push_back(s);
            while (!st.empty()) {
                int u = st.back();
                if (it[u] < (int)adj[u].size()) {
                    int v = adj[u][it[u]++];
                    if (!seen[v]) { seen[v] = true; st.push_back(v); }
                } else {
                    order.push_back(u);
                    st.pop_back();
                }
            }
        }
        for (int i = n - 1; i >= 0; i--) {  // sweep reverse graph
            if (comp[order[i]] != -1) continue;
            vector<int> q = {order[i]};
            comp[order[i]] = comps;
            while (!q.empty()) {
                int u = q.back();
                q.pop_back();
                for (int v : radj[u])
                    if (comp[v] == -1) { comp[v] = comps; q.push_back(v); }
            }
            comps++;
        }
    }
};`,
      python: `class SCC:  # comp[v] = component id, in topological order
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.radj = [[] for _ in range(n)]
        self.comp = [-1] * n
        self.comps = 0

    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.radj[v].append(u)

    def run(self):
        n = self.n
        order = []
        it = [0] * n
        seen = [False] * n
        for s in range(n):  # iterative postorder
            if seen[s]:
                continue
            seen[s] = True
            st = [s]
            while st:
                u = st[-1]
                if it[u] < len(self.adj[u]):
                    v = self.adj[u][it[u]]
                    it[u] += 1
                    if not seen[v]:
                        seen[v] = True
                        st.append(v)
                else:
                    order.append(u)
                    st.pop()
        for s in reversed(order):  # sweep reverse graph
            if self.comp[s] != -1:
                continue
            self.comp[s] = self.comps
            q = [s]
            while q:
                u = q.pop()
                for v in self.radj[u]:
                    if self.comp[v] == -1:
                        self.comp[v] = self.comps
                        q.append(v)
            self.comps += 1`,
    },
  },
  {
    slug: "bellman-ford",
    name: "Bellman-Ford",
    topic: "Shortest Paths",
    complexity: "O(n·m)",
    description:
      "Single-source shortest paths that tolerates negative edge weights: relax every edge n−1 times. A further improving pass means a negative cycle is reachable. Slower than Dijkstra, so use it only when negatives (or cycle detection) are actually in play.",
    exampleProblem: {
      name: "CSES: High Score",
      url: "https://cses.fi/problemset/task/1673",
      note: "Longest path with possible positive cycles: negate the weights and it becomes shortest path with negative-cycle detection.",
    },
    code: {
      cpp: `// edges {u, v, w}; returns dist, or {} if a negative cycle is reachable
vector<long long> bellman_ford(int n, int src,
                               vector<array<long long, 3>>& edges) {
    const long long INF = LLONG_MAX / 4;
    vector<long long> dist(n, INF);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++)
        for (auto& [u, v, w] : edges)
            if (dist[u] < INF && dist[u] + w < dist[v])
                dist[v] = dist[u] + w;
    for (auto& [u, v, w] : edges)  // n-th pass = negative cycle check
        if (dist[u] < INF && dist[u] + w < dist[v]) return {};
    return dist;
}`,
      python: `def bellman_ford(n, src, edges):  # edges as (u, v, w)
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:  # n-th pass = negative cycle check
        if dist[u] + w < dist[v]:
            return None
    return dist`,
    },
  },
  {
    slug: "floyd-warshall",
    name: "Floyd-Warshall",
    topic: "Shortest Paths",
    complexity: "O(n³)",
    description:
      "All-pairs shortest paths in three nested loops over a distance matrix. Handles negative edges; a negative dist[i][i] afterward means i is on a negative cycle. The n ≤ 500 workhorse, and the base for transitive closure with booleans.",
    exampleProblem: {
      name: "CSES: Shortest Routes II",
      url: "https://cses.fi/problemset/task/1672",
      note: "Many distance queries on a small dense graph. Run once, answer each query from the matrix.",
    },
    code: {
      cpp: `// dist = adjacency matrix: 0 on the diagonal, INF where no edge
const long long INF = LLONG_MAX / 4;
void floyd_warshall(vector<vector<long long>>& dist) {
    int n = dist.size();
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++) {
            if (dist[i][k] >= INF) continue;
            for (int j = 0; j < n; j++)  // guards keep unreachable exactly INF
                if (dist[k][j] < INF && dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
        }
}
// negative cycle through i afterwards: dist[i][i] < 0`,
      python: `def floyd_warshall(dist):
    # dist = adjacency matrix: 0 on the diagonal, INF where no edge
    n = len(dist)
    for k in range(n):
        dk = dist[k]
        for i in range(n):
            di = dist[i]
            dik = di[k]
            for j in range(n):
                if dik + dk[j] < di[j]:
                    di[j] = dik + dk[j]

# negative cycle through i afterwards: dist[i][i] < 0`,
    },
  },
  {
    slug: "prim",
    name: "Prim (MST)",
    topic: "Spanning Trees",
    complexity: "O(m log n)",
    description:
      "Minimum spanning tree grown from a single vertex with a priority queue. Same output as Kruskal; pick Prim when the graph is already in adjacency-list form or when a virtual super-node trick is involved. No DSU needed.",
    exampleProblem: {
      name: "Codeforces 1245D: Shichikuji and Power Grid",
      url: "https://codeforces.com/problemset/problem/1245/D",
      note: "Building a power station is an edge to a virtual node 0; the answer is the MST of the augmented graph, a classic Prim setup.",
    },
    code: {
      cpp: `// adj[u] = {{v, w}, ...}; returns MST cost, or -1 if disconnected
long long prim(vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<bool> in(n, false);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>,
                   greater<>> pq;
    pq.push({0, 0});
    long long cost = 0;
    int taken = 0;
    while (!pq.empty() && taken < n) {
        auto [w, u] = pq.top();
        pq.pop();
        if (in[u]) continue;
        in[u] = true;
        taken++;
        cost += w;
        for (auto [v, wt] : adj[u])
            if (!in[v]) pq.push({wt, v});
    }
    return taken == n ? cost : -1;
}`,
      python: `import heapq

def prim(adj):  # adj[u] = [(v, w), ...]; -1 if disconnected
    n = len(adj)
    in_mst = [False] * n
    pq = [(0, 0)]
    cost = 0
    taken = 0
    while pq and taken < n:
        w, u = heapq.heappop(pq)
        if in_mst[u]:
            continue
        in_mst[u] = True
        taken += 1
        cost += w
        for v, wt in adj[u]:
            if not in_mst[v]:
                heapq.heappush(pq, (wt, v))
    return cost if taken == n else -1`,
    },
  },
  {
    slug: "tarjan-scc",
    name: "SCC (Tarjan)",
    topic: "Connectivity",
    complexity: "O(n + m)",
    description:
      "Strongly connected components in one DFS with lowlink values and an explicit stack. Component ids come out in reverse topological order (the opposite of the Kosaraju template). Recursive: raise the stack limit for large inputs, or use the Kosaraju template, which is iterative.",
    exampleProblem: {
      name: "CSES: Flight Routes Check",
      url: "https://cses.fi/problemset/task/1682",
      note: "All cities mutually reachable means exactly one SCC. Run either SCC template and check comps == 1.",
    },
    code: {
      cpp: `struct TarjanSCC {  // comp ids in reverse topological order
    int n, timer = 0, comps = 0;
    vector<vector<int>> adj;
    vector<int> tin, low, comp, st;
    vector<bool> onstack;
    TarjanSCC(int n)
        : n(n), adj(n), tin(n, -1), low(n), comp(n, -1), onstack(n, false) {}
    void add_edge(int u, int v) { adj[u].push_back(v); }
    void dfs(int u) {
        tin[u] = low[u] = timer++;
        st.push_back(u);
        onstack[u] = true;
        for (int v : adj[u]) {
            if (tin[v] == -1) {
                dfs(v);
                low[u] = min(low[u], low[v]);
            } else if (onstack[v]) {
                low[u] = min(low[u], tin[v]);
            }
        }
        if (low[u] == tin[u]) {  // u is the root of an SCC
            while (true) {
                int v = st.back();
                st.pop_back();
                onstack[v] = false;
                comp[v] = comps;
                if (v == u) break;
            }
            comps++;
        }
    }
    void run() {
        for (int u = 0; u < n; u++)
            if (tin[u] == -1) dfs(u);
    }
};`,
      python: `import sys
sys.setrecursionlimit(1 << 20)

class TarjanSCC:  # comp ids in reverse topological order
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.tin = [-1] * n
        self.low = [0] * n
        self.comp = [-1] * n
        self.onstack = [False] * n
        self.st = []
        self.timer = 0
        self.comps = 0

    def add_edge(self, u, v):
        self.adj[u].append(v)

    def dfs(self, u):
        self.tin[u] = self.low[u] = self.timer
        self.timer += 1
        self.st.append(u)
        self.onstack[u] = True
        for v in self.adj[u]:
            if self.tin[v] == -1:
                self.dfs(v)
                self.low[u] = min(self.low[u], self.low[v])
            elif self.onstack[v]:
                self.low[u] = min(self.low[u], self.tin[v])
        if self.low[u] == self.tin[u]:  # u is the root of an SCC
            while True:
                v = self.st.pop()
                self.onstack[v] = False
                self.comp[v] = self.comps
                if v == u:
                    break
            self.comps += 1

    def run(self):
        for u in range(self.n):
            if self.tin[u] == -1:
                self.dfs(u)`,
    },
  },
  {
    slug: "bridges-articulation",
    name: "Bridges & Articulation Points",
    topic: "Connectivity",
    complexity: "O(n + m)",
    description:
      "One lowlink DFS finds every bridge (edge whose removal disconnects the graph) and articulation point (vertex whose removal does). Track parent edges by id so parallel edges are handled correctly. Recursive: mind the stack limit on large graphs.",
    exampleProblem: {
      name: "CSES: Necessary Roads",
      url: "https://cses.fi/problemset/task/2076",
      note: "The roads whose removal disconnects the network are the bridges, verbatim.",
    },
    code: {
      cpp: `struct Cuts {
    int n, timer = 0;
    vector<vector<pair<int, int>>> adj;  // {to, edge id}
    vector<int> tin, low;
    vector<bool> isArt;
    vector<pair<int, int>> bridges;
    Cuts(int n) : n(n), adj(n), tin(n, -1), low(n), isArt(n, false) {}
    void add_edge(int id, int u, int v) {
        adj[u].push_back({v, id});
        adj[v].push_back({u, id});
    }
    void dfs(int u, int pe) {  // pe = id of the edge we arrived by
        tin[u] = low[u] = timer++;
        int children = 0;
        for (auto [v, id] : adj[u]) {
            if (id == pe) continue;
            if (tin[v] != -1) {
                low[u] = min(low[u], tin[v]);
            } else {
                dfs(v, id);
                low[u] = min(low[u], low[v]);
                if (low[v] > tin[u]) bridges.push_back({u, v});
                if (low[v] >= tin[u] && pe != -1) isArt[u] = true;
                children++;
            }
        }
        if (pe == -1 && children > 1) isArt[u] = true;  // root rule
    }
    void run() {
        for (int u = 0; u < n; u++)
            if (tin[u] == -1) dfs(u, -1);
    }
};`,
      python: `import sys
sys.setrecursionlimit(1 << 20)

class Cuts:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]  # (to, edge id)
        self.tin = [-1] * n
        self.low = [0] * n
        self.is_art = [False] * n
        self.bridges = []
        self.timer = 0

    def add_edge(self, eid, u, v):
        self.adj[u].append((v, eid))
        self.adj[v].append((u, eid))

    def dfs(self, u, pe):  # pe = id of the edge we arrived by
        self.tin[u] = self.low[u] = self.timer
        self.timer += 1
        children = 0
        for v, eid in self.adj[u]:
            if eid == pe:
                continue
            if self.tin[v] != -1:
                self.low[u] = min(self.low[u], self.tin[v])
            else:
                self.dfs(v, eid)
                self.low[u] = min(self.low[u], self.low[v])
                if self.low[v] > self.tin[u]:
                    self.bridges.append((u, v))
                if self.low[v] >= self.tin[u] and pe != -1:
                    self.is_art[u] = True
                children += 1
        if pe == -1 and children > 1:  # root rule
            self.is_art[u] = True

    def run(self):
        for u in range(self.n):
            if self.tin[u] == -1:
                self.dfs(u, -1)`,
    },
  },
  {
    slug: "toposort",
    name: "Topological Sort (Kahn)",
    topic: "DAGs",
    complexity: "O(n + m)",
    description:
      "Order the vertices of a DAG so every edge points forward: repeatedly remove indegree-0 vertices with a queue. If the order comes out short, the graph has a cycle. Swap the queue for a min-heap to get the lexicographically smallest order.",
    exampleProblem: {
      name: "CSES: Course Schedule",
      url: "https://cses.fi/problemset/task/1679",
      note: "Print any valid course order or detect that none exists, which is this function verbatim.",
    },
    code: {
      cpp: `// returns a topological order, or {} if the graph has a cycle
vector<int> toposort(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> indeg(n, 0), order;
    for (auto& nbrs : adj)
        for (int v : nbrs) indeg[v]++;
    queue<int> q;
    for (int u = 0; u < n; u++)
        if (indeg[u] == 0) q.push(u);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (int v : adj[u])
            if (--indeg[v] == 0) q.push(v);
    }
    return (int)order.size() == n ? order : vector<int>{};
}`,
      python: `from collections import deque

def toposort(adj):  # returns order, or None if the graph has a cycle
    n = len(adj)
    indeg = [0] * n
    for nbrs in adj:
        for v in nbrs:
            indeg[v] += 1
    q = deque(u for u in range(n) if indeg[u] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else None`,
    },
  },
  {
    slug: "two-sat",
    name: "2-SAT",
    topic: "DAGs",
    complexity: "O(n + m)",
    description:
      "Satisfiability of clauses with two literals each, via the implication graph: clause (a or b) becomes edges ¬a→b and ¬b→a, then a variable and its negation must land in different SCCs. Needs the SCC (Kosaraju) template pasted above this; its topological component ids make the assignment rule a one-liner.",
    exampleProblem: {
      name: "CSES: Giant Pizza",
      url: "https://cses.fi/problemset/task/1684",
      note: "Each family member gives a clause of two topping literals. Feasibility plus an assignment is exactly what solve() returns.",
    },
    code: {
      cpp: `// requires the SCC (Kosaraju) template
struct TwoSat {
    int n;
    SCC scc;
    TwoSat(int n) : n(n), scc(2 * n) {}  // literal x -> node 2x, !x -> 2x+1
    // add clause (a or b); pass (var, isPositive) for each literal
    void add_clause(int a, bool va, int b, bool vb) {
        scc.add_edge(2 * a + (va ? 1 : 0), 2 * b + (vb ? 0 : 1));  // !a -> b
        scc.add_edge(2 * b + (vb ? 1 : 0), 2 * a + (va ? 0 : 1));  // !b -> a
    }
    // returns an assignment, or {} if unsatisfiable
    vector<bool> solve() {
        scc.run();
        vector<bool> res(n);
        for (int x = 0; x < n; x++) {
            if (scc.comp[2 * x] == scc.comp[2 * x + 1]) return {};
            res[x] = scc.comp[2 * x] > scc.comp[2 * x + 1];
        }
        return res;
    }
};`,
      python: `# requires the SCC (Kosaraju) template
class TwoSat:
    def __init__(self, n):  # literal x -> node 2x, not-x -> 2x+1
        self.n = n
        self.scc = SCC(2 * n)

    # add clause (a or b); pass (var, is_positive) for each literal
    def add_clause(self, a, va, b, vb):
        na = (2 * a + (0 if va else 1)) ^ 1  # node of not-a
        nb = (2 * b + (0 if vb else 1)) ^ 1  # node of not-b
        self.scc.add_edge(na, 2 * b + (0 if vb else 1))  # !a -> b
        self.scc.add_edge(nb, 2 * a + (0 if va else 1))  # !b -> a

    def solve(self):  # returns assignment list, or None if unsatisfiable
        self.scc.run()
        res = [False] * self.n
        for x in range(self.n):
            if self.scc.comp[2 * x] == self.scc.comp[2 * x + 1]:
                return None
            res[x] = self.scc.comp[2 * x] > self.scc.comp[2 * x + 1]
        return res`,
    },
  },
  {
    slug: "euler-path",
    name: "Euler Circuit / Path (Hierholzer)",
    topic: "Graph Algorithms",
    complexity: "O(n + m)",
    description:
      "Walk that uses every EDGE exactly once (contrast Hamiltonian: every vertex, which is NP-hard). A circuit exists in an undirected graph iff every vertex has even degree and all edges sit in one component; a path allows exactly two odd-degree vertices (start and end). Hierholzer builds it in linear time; the per-vertex ptr is what keeps it linear, never rescanning used edges. Both impossibility conditions surface as the two failure returns.",
    exampleProblem: {
      name: "CSES: Mail Delivery",
      url: "https://cses.fi/problemset/task/1691",
      note: "Print an Eulerian circuit from post office 1, or IMPOSSIBLE. The template's two failure returns (odd degree, disconnected edges) are exactly the IMPOSSIBLE cases.",
    },
    code: {
      cpp: `// Eulerian circuit in an undirected graph; edges as {a, b} pairs.
// Returns the vertex sequence (m+1 long), or {} if none exists.
vector<int> euler_circuit(int n, vector<array<int, 2>>& edges, int start = 0) {
    vector<vector<pair<int, int>>> adj(n);  // (neighbor, edge id)
    for (int i = 0; i < (int)edges.size(); i++) {
        adj[edges[i][0]].push_back({edges[i][1], i});
        adj[edges[i][1]].push_back({edges[i][0], i});
    }
    for (int v = 0; v < n; v++)
        if (adj[v].size() % 2) return {};  // odd degree: no circuit
    vector<int> ptr(n, 0), path, st = {start};
    vector<bool> used(edges.size(), false);
    while (!st.empty()) {
        int v = st.back();
        while (ptr[v] < (int)adj[v].size() && used[adj[v][ptr[v]].second]) ptr[v]++;
        if (ptr[v] == (int)adj[v].size()) {
            path.push_back(v);
            st.pop_back();
        } else {
            auto [to, id] = adj[v][ptr[v]];
            used[id] = true;
            st.push_back(to);
        }
    }
    if (path.size() != edges.size() + 1) return {};  // edges disconnected
    return path;
}
// Euler PATH instead: exactly two odd-degree vertices; start at one of them.
// Directed version: need indegree == outdegree everywhere (for a path: one
// vertex with out-in = 1 as start, one with in-out = 1 as end).`,
      python: `def euler_circuit(n, edges, start=0):
    # vertex sequence of an Eulerian circuit (len m+1), or None
    adj = [[] for _ in range(n)]
    for i, (a, b) in enumerate(edges):
        adj[a].append((b, i))
        adj[b].append((a, i))
    if any(len(a) % 2 for a in adj):
        return None  # odd degree: no circuit
    ptr = [0] * n
    used = [False] * len(edges)
    path, st = [], [start]
    while st:
        v = st[-1]
        while ptr[v] < len(adj[v]) and used[adj[v][ptr[v]][1]]:
            ptr[v] += 1
        if ptr[v] == len(adj[v]):
            path.append(v)
            st.pop()
        else:
            to, i = adj[v][ptr[v]]
            used[i] = True
            st.append(to)
    if len(path) != len(edges) + 1:
        return None  # edges disconnected
    return path

# Euler PATH instead: exactly two odd-degree vertices; start at one of them.
# Directed version: need indegree == outdegree everywhere (for a path: one
# vertex with out-in = 1 as start, one with in-out = 1 as end).`,
    },
  },
];
