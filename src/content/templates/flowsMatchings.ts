import type { AlgoTemplate } from "@/types/content";

export const flowsMatchings: AlgoTemplate[] = [
  {
    slug: "kuhn",
    name: "Bipartite Matching (Kuhn)",
    topic: "Matchings & Flows",
    complexity: "O(V·E)",
    description:
      "Maximum bipartite matching by repeatedly finding augmenting paths. Short and hard to break; fast enough up to a few thousand vertices. For tighter limits, run the Dinic template on the unit-capacity network instead, which gives O(E√V).",
    exampleProblem: {
      name: "CSES: School Dance",
      url: "https://cses.fi/problemset/task/1696",
      note: "Maximum boy-girl pairing given the allowed pairs: build the bipartite graph and read off max_matching() plus the matchL array.",
    },
    code: {
      cpp: `struct Kuhn {  // left part 0..n-1, right part 0..m-1
    int n, m;
    vector<vector<int>> adj;  // adj[u] = right-side neighbours of left u
    vector<int> matchL, matchR;
    vector<bool> used;
    Kuhn(int n, int m) : n(n), m(m), adj(n), matchL(n, -1), matchR(m, -1) {}
    void add_edge(int u, int v) { adj[u].push_back(v); }
    bool try_kuhn(int u) {
        for (int v : adj[u]) {
            if (used[v]) continue;
            used[v] = true;
            if (matchR[v] == -1 || try_kuhn(matchR[v])) {
                matchL[u] = v;
                matchR[v] = u;
                return true;
            }
        }
        return false;
    }
    int max_matching() {
        int res = 0;
        for (int u = 0; u < n; u++) {
            used.assign(m, false);
            if (try_kuhn(u)) res++;
        }
        return res;
    }
};`,
      python: `import sys
sys.setrecursionlimit(1 << 20)

class Kuhn:  # left part 0..n-1, right part 0..m-1
    def __init__(self, n, m):
        self.n = n
        self.m = m
        self.adj = [[] for _ in range(n)]
        self.matchL = [-1] * n
        self.matchR = [-1] * m

    def add_edge(self, u, v):
        self.adj[u].append(v)

    def _try(self, u):
        for v in self.adj[u]:
            if self.used[v]:
                continue
            self.used[v] = True
            if self.matchR[v] == -1 or self._try(self.matchR[v]):
                self.matchL[u] = v
                self.matchR[v] = u
                return True
        return False

    def max_matching(self):
        res = 0
        for u in range(self.n):
            self.used = [False] * self.m
            if self._try(u):
                res += 1
        return res`,
    },
  },
  {
    slug: "dinic",
    name: "Dinic (Max Flow)",
    topic: "Matchings & Flows",
    complexity: "O(V²E), O(E√V) bipartite",
    description:
      "Maximum flow with level-graph BFS plus blocking-flow DFS. The DFS pushes every augmenting path in one pass and prunes dead vertices, which is the standard optimized version. Fast enough for essentially every contest flow problem, and on unit-capacity bipartite graphs it doubles as an O(E√V) matching algorithm. Edges are stored in pairs so edge id^1 is always the reverse edge, and after max_flow the vertices with level != -1 form the source side of a minimum cut.",
    exampleProblem: {
      name: "CSES: Download Speed",
      url: "https://cses.fi/problemset/task/1694",
      note: "Plain maximum flow from node 1 to node n. Build the graph with add_edge and call max_flow.",
    },
    code: {
      cpp: `struct Dinic {
    struct Edge { int to; long long cap; };
    int n;
    vector<Edge> edges;
    vector<vector<int>> g;
    vector<int> level, it;
    Dinic(int n) : n(n), g(n), level(n), it(n) {}
    void add_edge(int u, int v, long long cap) {
        g[u].push_back(edges.size()); edges.push_back({v, cap});
        g[v].push_back(edges.size()); edges.push_back({u, 0});
    }
    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        q.push(s);
        level[s] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int id : g[u])
                if (edges[id].cap > 0 && level[edges[id].to] == -1) {
                    level[edges[id].to] = level[u] + 1;
                    q.push(edges[id].to);
                }
        }
        return level[t] != -1;
    }
    long long dfs(int u, int t, long long f) {  // pushes a blocking flow
        if (u == t || f == 0) return f;
        long long pushed = 0;
        for (int& i = it[u]; i < (int)g[u].size(); i++) {
            int id = g[u][i], v = edges[id].to;
            if (edges[id].cap == 0 || level[v] != level[u] + 1) continue;
            long long d = dfs(v, t, min(f - pushed, edges[id].cap));
            edges[id].cap -= d;
            edges[id ^ 1].cap += d;
            pushed += d;
            if (pushed == f) return pushed;
        }
        if (pushed == 0) level[u] = -1;  // dead end, prune
        return pushed;
    }
    long long max_flow(int s, int t) {
        long long flow = 0;
        while (bfs(s, t)) {
            fill(it.begin(), it.end(), 0);
            flow += dfs(s, t, LLONG_MAX);
        }
        return flow;
        // min cut: vertices with level != -1 are the source side
    }
};`,
      python: `import sys
from collections import deque
sys.setrecursionlimit(1 << 20)

class Dinic:
    def __init__(self, n):
        self.n = n
        self.to = []
        self.cap = []
        self.g = [[] for _ in range(n)]

    def add_edge(self, u, v, cap):
        self.g[u].append(len(self.to)); self.to.append(v); self.cap.append(cap)
        self.g[v].append(len(self.to)); self.to.append(u); self.cap.append(0)

    def _bfs(self, s, t):
        self.level = [-1] * self.n
        self.level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for i in self.g[u]:
                if self.cap[i] > 0 and self.level[self.to[i]] == -1:
                    self.level[self.to[i]] = self.level[u] + 1
                    q.append(self.to[i])
        return self.level[t] != -1

    def _dfs(self, u, t, f):  # pushes a blocking flow
        if u == t or f == 0:
            return f
        pushed = 0
        while self.it[u] < len(self.g[u]):
            i = self.g[u][self.it[u]]
            v = self.to[i]
            if self.cap[i] > 0 and self.level[v] == self.level[u] + 1:
                d = self._dfs(v, t, min(f - pushed, self.cap[i]))
                self.cap[i] -= d
                self.cap[i ^ 1] += d
                pushed += d
                if pushed == f:
                    return pushed
            self.it[u] += 1
        if pushed == 0:
            self.level[u] = -1  # dead end, prune
        return pushed

    def max_flow(self, s, t):
        flow = 0
        while self._bfs(s, t):
            self.it = [0] * self.n
            flow += self._dfs(s, t, float("inf"))
        return flow
        # min cut: vertices with level != -1 are the source side`,
    },
  },
  {
    slug: "mcmf",
    name: "Min-Cost Max-Flow",
    topic: "Matchings & Flows",
    complexity: "O(F·V·E) worst case",
    description:
      "Maximum flow of minimum total cost: repeatedly push along the cheapest augmenting path, found with SPFA since reverse edges carry negative costs. Handles the standard assignment/transport reductions; for pure assignment the Hungarian template is faster.",
    exampleProblem: {
      name: "AtCoder Library Practice E",
      url: "https://atcoder.jp/contests/practice2/tasks/practice2_e",
      note: "A grid pick problem that reduces to min-cost flow with row and column nodes. Build the network and call min_cost_flow.",
    },
    code: {
      cpp: `struct MCMF {
    struct Edge { int to; long long cap, cost; };
    int n;
    vector<Edge> edges;
    vector<vector<int>> g;
    MCMF(int n) : n(n), g(n) {}
    void add_edge(int u, int v, long long cap, long long cost) {
        g[u].push_back(edges.size()); edges.push_back({v, cap, cost});
        g[v].push_back(edges.size()); edges.push_back({u, 0, -cost});
    }
    pair<long long, long long> min_cost_flow(int s, int t) {  // {flow, cost}
        const long long INF = LLONG_MAX / 4;
        long long flow = 0, cost = 0;
        while (true) {
            vector<long long> dist(n, INF);
            vector<int> pe(n, -1);
            vector<bool> inq(n, false);
            deque<int> q = {s};  // SPFA
            dist[s] = 0;
            while (!q.empty()) {
                int u = q.front();
                q.pop_front();
                inq[u] = false;
                for (int id : g[u]) {
                    auto& e = edges[id];
                    if (e.cap > 0 && dist[u] + e.cost < dist[e.to]) {
                        dist[e.to] = dist[u] + e.cost;
                        pe[e.to] = id;
                        if (!inq[e.to]) {
                            inq[e.to] = true;
                            q.push_back(e.to);
                        }
                    }
                }
            }
            if (dist[t] >= INF) break;
            long long push = INF;
            for (int v = t; v != s; v = edges[pe[v] ^ 1].to)
                push = min(push, edges[pe[v]].cap);
            for (int v = t; v != s; v = edges[pe[v] ^ 1].to) {
                edges[pe[v]].cap -= push;
                edges[pe[v] ^ 1].cap += push;
            }
            flow += push;
            cost += push * dist[t];
        }
        return {flow, cost};
    }
};`,
      python: `from collections import deque

class MCMF:
    def __init__(self, n):
        self.n = n
        self.to = []
        self.cap = []
        self.cost = []
        self.g = [[] for _ in range(n)]

    def add_edge(self, u, v, cap, cost):
        self.g[u].append(len(self.to))
        self.to.append(v); self.cap.append(cap); self.cost.append(cost)
        self.g[v].append(len(self.to))
        self.to.append(u); self.cap.append(0); self.cost.append(-cost)

    def min_cost_flow(self, s, t):  # returns (flow, cost)
        INF = float("inf")
        flow = cost = 0
        while True:
            dist = [INF] * self.n
            pe = [-1] * self.n
            inq = [False] * self.n
            dist[s] = 0
            q = deque([s])  # SPFA
            while q:
                u = q.popleft()
                inq[u] = False
                for i in self.g[u]:
                    v = self.to[i]
                    if self.cap[i] > 0 and dist[u] + self.cost[i] < dist[v]:
                        dist[v] = dist[u] + self.cost[i]
                        pe[v] = i
                        if not inq[v]:
                            inq[v] = True
                            q.append(v)
            if dist[t] == INF:
                break
            push = INF
            v = t
            while v != s:
                push = min(push, self.cap[pe[v]])
                v = self.to[pe[v] ^ 1]
            v = t
            while v != s:
                self.cap[pe[v]] -= push
                self.cap[pe[v] ^ 1] += push
                v = self.to[pe[v] ^ 1]
            flow += push
            cost += push * dist[t]
        return flow, cost`,
    },
  },
  {
    slug: "hungarian",
    name: "Hungarian Algorithm",
    topic: "Matchings & Flows",
    complexity: "O(n²m)",
    description:
      "Minimum-cost assignment of n rows to m columns (n ≤ m) with the potentials method. Faster and simpler to use than min-cost flow for pure assignment problems. Everything is 1-indexed; row 0 and column 0 are sentinels. For maximization, negate the costs.",
    exampleProblem: {
      name: "UVa 10746: Crime Wave - The Sequel",
      url: "https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1687",
      note: "Assign police cars to banks at minimum total distance, a direct assignment-problem instance.",
    },
    code: {
      cpp: `// a = cost matrix, 1-indexed: a[1..n][1..m], n <= m
// returns {min cost, assignment} with assignment[i] = column of row i
pair<long long, vector<int>> hungarian(vector<vector<long long>>& a) {
    int n = a.size() - 1, m = a[0].size() - 1;
    const long long INF = LLONG_MAX / 4;
    vector<long long> u(n + 1), v(m + 1), minv(m + 1);
    vector<int> p(m + 1), way(m + 1);
    vector<bool> used(m + 1);
    for (int i = 1; i <= n; i++) {
        p[0] = i;
        int j0 = 0;
        fill(minv.begin(), minv.end(), INF);
        fill(used.begin(), used.end(), false);
        do {
            used[j0] = true;
            int i0 = p[j0], j1 = 0;
            long long delta = INF;
            for (int j = 1; j <= m; j++)
                if (!used[j]) {
                    long long cur = a[i0][j] - u[i0] - v[j];
                    if (cur < minv[j]) minv[j] = cur, way[j] = j0;
                    if (minv[j] < delta) delta = minv[j], j1 = j;
                }
            for (int j = 0; j <= m; j++)
                if (used[j]) u[p[j]] += delta, v[j] -= delta;
                else minv[j] -= delta;
            j0 = j1;
        } while (p[j0] != 0);
        do {  // augment along the found path
            int j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }
    vector<int> assignment(n + 1, 0);
    for (int j = 1; j <= m; j++)
        if (p[j]) assignment[p[j]] = j;
    return {-v[0], assignment};
}`,
      python: `def hungarian(a):
    """a = cost matrix, 1-indexed: a[1..n][1..m], n <= m.
    Returns (min cost, assignment) with assignment[i] = column of row i."""
    n = len(a) - 1
    m = len(a[0]) - 1
    INF = float("inf")
    u = [0] * (n + 1)
    v = [0] * (m + 1)
    p = [0] * (m + 1)
    way = [0] * (m + 1)
    for i in range(1, n + 1):
        p[0] = i
        j0 = 0
        minv = [INF] * (m + 1)
        used = [False] * (m + 1)
        while True:
            used[j0] = True
            i0, j1, delta = p[j0], 0, INF
            for j in range(1, m + 1):
                if not used[j]:
                    cur = a[i0][j] - u[i0] - v[j]
                    if cur < minv[j]:
                        minv[j] = cur
                        way[j] = j0
                    if minv[j] < delta:
                        delta = minv[j]
                        j1 = j
            for j in range(m + 1):
                if used[j]:
                    u[p[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            j0 = j1
            if p[j0] == 0:
                break
        while j0:  # augment along the found path
            j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
    assignment = [0] * (n + 1)
    for j in range(1, m + 1):
        if p[j]:
            assignment[p[j]] = j
    return -v[0], assignment`,
    },
  },
];
