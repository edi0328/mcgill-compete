import type { AlgoTemplate } from "@/types/content";

export const dp: AlgoTemplate[] = [
  {
    slug: "lis",
    name: "LIS (Patience Trick)",
    topic: "Dynamic Programming",
    complexity: "O(n log n)",
    description:
      "Longest strictly increasing subsequence. tails[k] holds the smallest possible last element of an increasing subsequence of length k+1; each new element replaces the first tail that is >= it (binary search), or extends the array. The tails array is always sorted, which is what makes the binary search valid, but note it is NOT itself the subsequence. Use lower_bound for strictly increasing, upper_bound to allow ties.",
    exampleProblem: {
      name: "CSES: Increasing Subsequence",
      url: "https://cses.fi/problemset/task/1145",
      note: "The template verbatim: read the array, print lis(a). n is 2·10^5, so the O(n²) table DP would time out.",
    },
    code: {
      cpp: `int lis(vector<int>& a) {
    vector<int> tails;  // tails[k] = smallest tail of an LIS of length k+1
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}

// to recover one LIS, also record for each element the length it achieved,
// then walk backwards taking the first element with length L, L-1, ...`,
      python: `from bisect import bisect_left

def lis(a):
    tails = []  # tails[k] = smallest tail of an LIS of length k+1
    for x in a:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)

# to recover one LIS, also record for each element the length it achieved,
# then walk backwards taking the first element with length L, L-1, ...`,
    },
  },
  {
    slug: "knapsack",
    name: "0/1 Knapsack",
    topic: "Dynamic Programming",
    complexity: "O(n·W)",
    description:
      "Pick a subset of items with weights and values so total weight stays within W and value is maximal. One 1-D array suffices: iterate weights DOWNWARDS so each item is used at most once; iterating upwards silently turns it into the unbounded knapsack (items reusable), which is the single most common knapsack bug. The same loop shape covers subset-sum (dp of booleans) and counting variants (dp of counts).",
    exampleProblem: {
      name: "CSES: Book Shop",
      url: "https://cses.fi/problemset/task/1158",
      note: "Prices are weights, pages are values, x is the capacity. Straight 0/1 knapsack: if you get double the expected pages, you iterated upwards.",
    },
    code: {
      cpp: `// weights w[i], values v[i], capacity W
long long knapsack(vector<int>& w, vector<int>& v, int W) {
    vector<long long> dp(W + 1, 0);  // dp[c] = best value with capacity c
    for (int i = 0; i < (int)w.size(); i++)
        for (int c = W; c >= w[i]; c--)      // downwards: each item once
            dp[c] = max(dp[c], dp[c - w[i]] + v[i]);
    return dp[W];
}
// unbounded variant (unlimited copies): loop c upwards instead.`,
      python: `def knapsack(w, v, W):
    dp = [0] * (W + 1)  # dp[c] = best value with capacity c
    for wi, vi in zip(w, v):
        for c in range(W, wi - 1, -1):  # downwards: each item once
            dp[c] = max(dp[c], dp[c - wi] + vi)
    return dp[W]

# unbounded variant (unlimited copies): loop c upwards instead.`,
    },
  },
  {
    slug: "subsets",
    name: "Enumerating Subsets & Submasks",
    topic: "Dynamic Programming",
    complexity: "O(2^n), submasks O(3^n) total",
    description:
      "The bit tricks every mask problem is built on: iterate all 2^n subsets of n items, test/set/clear single bits, and, the one people forget, enumerate all submasks of a given mask in O(3^n) total over all masks with the s = (s-1) & m loop. For n up to ~20, brute force over subsets is often the intended solution, not a fallback.",
    exampleProblem: {
      name: "CSES: Apple Division",
      url: "https://cses.fi/problemset/task/1623",
      note: "n <= 20 apples split into two groups: try every subset as group one and take the best difference. 2^20 subsets is about a million, comfortably fast.",
    },
    code: {
      cpp: `// all subsets of n items
for (int mask = 0; mask < (1 << n); mask++) {
    for (int i = 0; i < n; i++)
        if (mask >> i & 1) { /* item i is in this subset */ }
}

// all submasks of m (skips the empty set; O(3^n) over all m)
for (int s = m; s; s = (s - 1) & m) { /* use submask s */ }

// common one-liners
int cnt = __builtin_popcount(mask);   // number of set bits
int low = mask & -mask;               // lowest set bit
bool has = mask >> i & 1;             // is bit i set?
int with_i = mask | (1 << i), without_i = mask & ~(1 << i);`,
      python: `# all subsets of n items
for mask in range(1 << n):
    for i in range(n):
        if mask >> i & 1:
            pass  # item i is in this subset

# all submasks of m (skips the empty set; O(3^n) over all m)
s = m
while s:
    # use submask s
    s = (s - 1) & m

# common one-liners
cnt = bin(mask).count("1")       # number of set bits
low = mask & -mask               # lowest set bit
has = mask >> i & 1              # is bit i set?
with_i, without_i = mask | (1 << i), mask & ~(1 << i)`,
    },
  },
  {
    slug: "bitmask-dp",
    name: "Bitmask DP (Hamiltonian Paths)",
    topic: "Dynamic Programming",
    complexity: "O(2^n · n²)",
    description:
      "DP over subsets: dp[mask][v] = number of ways (or best cost) to visit exactly the vertices in mask and stand at v. Transitions extend the path by one unvisited vertex. This is the TSP pattern; it works whenever 'which elements are used' matters but their order can be compressed away. n tops out around 20 (2^20 masks); if n is 40, that is a meet-in-the-middle hint instead.",
    exampleProblem: {
      name: "CSES: Hamiltonian Flights",
      url: "https://cses.fi/problemset/task/1690",
      note: "Count routes visiting every city exactly once from city 1 to city n: the template with counting transitions, mod 10^9+7. Force the path to start at 0 and only count masks ending at n-1 with all bits set.",
    },
    code: {
      cpp: `const long long MOD = 1e9 + 7;

// count Hamiltonian paths 0 -> n-1; adj[u] = list of v with edge u->v
long long count_paths(int n, vector<vector<int>>& adj) {
    vector<vector<long long>> dp(1 << n, vector<long long>(n, 0));
    dp[1][0] = 1;  // start: only vertex 0 visited, standing at 0
    for (int mask = 1; mask < (1 << n); mask++)
        for (int u = 0; u < n; u++) {
            if (!dp[mask][u] || !(mask >> u & 1)) continue;
            for (int v : adj[u]) {
                if (mask >> v & 1) continue;  // already visited
                dp[mask | (1 << v)][v] = (dp[mask | (1 << v)][v] + dp[mask][u]) % MOD;
            }
        }
    return dp[(1 << n) - 1][n - 1];
}
// min-cost version (TSP): swap counting for
// dp[nm][v] = min(dp[nm][v], dp[mask][u] + cost[u][v])`,
      python: `MOD = 10**9 + 7

def count_paths(n, adj):  # count Hamiltonian paths 0 -> n-1
    dp = [[0] * n for _ in range(1 << n)]
    dp[1][0] = 1  # start: only vertex 0 visited, standing at 0
    for mask in range(1, 1 << n):
        for u in range(n):
            if not dp[mask][u] or not (mask >> u & 1):
                continue
            for v in adj[u]:
                if mask >> v & 1:  # already visited
                    continue
                nm = mask | (1 << v)
                dp[nm][v] = (dp[nm][v] + dp[mask][u]) % MOD
    return dp[(1 << n) - 1][n - 1]

# min-cost version (TSP): swap counting for
# dp[nm][v] = min(dp[nm][v], dp[mask][u] + cost[u][v])`,
    },
  },
  {
    slug: "sos-dp",
    name: "SOS DP (Sum over Subsets)",
    topic: "Dynamic Programming",
    complexity: "O(2^n · n)",
    description:
      "For every mask, accumulate f over all of its submasks, in O(2^n·n) instead of the naive O(3^n) or O(4^n). One bit position per round: after round i, dp[m] has summed everything reachable by clearing bits among the first i. Flip the direction of the inner update to get sum over supermasks. This is the tool behind 'count pairs with x & y == 0' style problems.",
    exampleProblem: {
      name: "Codeforces 165E: Compatible Numbers",
      url: "https://codeforces.com/problemset/problem/165/E",
      note: "For each a[i], find any a[j] with a[i] & a[j] == 0: store each value at its own mask, run SOS over the complement, and each query is a lookup. Max over submasks instead of sum; the recurrence is identical.",
    },
    code: {
      cpp: `// dp[m] starts as f[m]; ends as sum of f over all submasks of m
vector<long long> sos(vector<long long> dp, int n) {  // 2^n entries
    for (int i = 0; i < n; i++)
        for (int m = 0; m < (1 << n); m++)
            if (m >> i & 1) dp[m] += dp[m ^ (1 << i)];
    return dp;
}
// sum over SUPERmasks: if bit i is 0, dp[m] += dp[m | (1 << i)]
// max/min over submasks: replace += with max=/min=`,
      python: `def sos(f, n):  # f has 2^n entries
    dp = f[:]  # dp[m] ends as sum of f over all submasks of m
    for i in range(n):
        for m in range(1 << n):
            if m >> i & 1:
                dp[m] += dp[m ^ (1 << i)]
    return dp

# sum over SUPERmasks: if bit i is 0, dp[m] += dp[m | (1 << i)]
# max/min over submasks: replace += with max()/min()`,
    },
  },
  {
    slug: "digit-dp",
    name: "Digit DP",
    topic: "Dynamic Programming",
    complexity: "O(digits · states · 10)",
    description:
      "Count numbers in [0, N] with some digit property by building N digit by digit. The two universal state flags: tight (are we still glued to N's prefix, so the next digit is capped?) and started (have we placed a nonzero digit yet, so leading zeros don't pollute the property?). Answer queries on [a, b] as solve(b) - solve(a-1). The property itself rides along as extra state; here it is the previous digit.",
    exampleProblem: {
      name: "CSES: Counting Numbers",
      url: "https://cses.fi/problemset/task/2220",
      note: "Count numbers in [a,b] with no two adjacent equal digits. Exactly this template; a can be 0, so handle solve(-1) = 0 rather than subtracting blindly.",
    },
    code: {
      cpp: `// count x in [0, n] with no two equal adjacent digits
long long solve(long long n) {
    if (n < 0) return 0;
    string s = to_string(n);
    int L = s.size();
    // memo[pos][prev] for the free (not tight, started) states only
    vector<vector<long long>> memo(L, vector<long long>(11, -1));
    auto rec = [&](auto&& self, int pos, int prev, bool tight, bool started) -> long long {
        if (pos == L) return 1;
        if (!tight && memo[pos][prev + 1] != -1 && started)
            return memo[pos][prev + 1];
        long long res = 0;
        int hi = tight ? s[pos] - '0' : 9;
        for (int d = 0; d <= hi; d++) {
            if (started && d == prev) continue;
            res += self(self, pos + 1, (started || d) ? d : -1,
                        tight && d == hi, started || d);
        }
        if (!tight && started) memo[pos][prev + 1] = res;
        return res;
    };
    return rec(rec, 0, -1, true, false);
}
// answer for [a, b]: solve(b) - solve(a - 1)`,
      python: `from functools import lru_cache

def solve(n):  # count x in [0, n] with no two equal adjacent digits
    if n < 0:
        return 0
    s = str(n)

    @lru_cache(maxsize=None)
    def rec(pos, prev, tight, started):
        if pos == len(s):
            return 1
        res = 0
        hi = int(s[pos]) if tight else 9
        for d in range(hi + 1):
            if started and d == prev:
                continue
            res += rec(pos + 1, d if (started or d) else -1,
                       tight and d == hi, started or d > 0)
        return res

    ans = rec(0, -1, True, False)
    rec.cache_clear()
    return ans

# answer for [a, b]: solve(b) - solve(a - 1)`,
    },
  },
  {
    slug: "li-chao",
    name: "Li Chao Tree (CHT)",
    topic: "Dynamic Programming",
    complexity: "O(log C) per line / query",
    description:
      "Maintain a set of lines y = kx + m and answer 'minimum y at x' queries: the convex hull trick without any monotonicity requirements on slopes or queries. Each tree node keeps the line that wins at its segment's midpoint; inserting recurses into the half where the loser might still win. This is what turns dp[i] = min over j of (dp[j] + k[j]·x[i] + m[j]) from O(n²) into O(n log C).",
    exampleProblem: {
      name: "Codeforces 319C: Kalila and Dimna in the Logging Industry",
      url: "https://codeforces.com/problemset/problem/319/C",
      note: "dp[i] = min over j of (dp[j] + b[j]·a[i]): insert line (b[j], dp[j]) after computing each dp[j], query at a[i]. The canonical CHT-as-DP-speedup problem.",
    },
    code: {
      cpp: `typedef long long ll;
struct LiChao {  // minimum at integer x in [lo, hi); sparse, big domains OK
    ll lo, hi;
    unordered_map<ll, pair<ll, ll>> line;  // heap node -> line (k, m)
    LiChao(ll lo, ll hi) : lo(lo), hi(hi) {}
    ll val(pair<ll, ll> f, ll x) { return f.first * x + f.second; }
    void add(ll k, ll m) {
        pair<ll, ll> nw = {k, m};
        ll v = 1, l = lo, r = hi;
        while (true) {
            if (!line.count(v)) { line[v] = nw; return; }
            ll mid = l + (r - l) / 2;  // floor, safe for negative x
            if (val(nw, mid) < val(line[v], mid)) swap(nw, line[v]);
            if (r - l == 1) return;
            if (val(nw, l) < val(line[v], l)) { v = 2 * v; r = mid; }
            else if (val(nw, r - 1) < val(line[v], r - 1)) { v = 2 * v + 1; l = mid; }
            else return;  // loser is beaten everywhere here
        }
    }
    ll query(ll x) {
        ll v = 1, l = lo, r = hi, res = LLONG_MAX;
        while (true) {
            if (line.count(v)) res = min(res, val(line[v], x));
            if (r - l == 1) return res;
            ll mid = l + (r - l) / 2;  // floor, safe for negative x
            if (x < mid) { v = 2 * v; r = mid; }
            else { v = 2 * v + 1; l = mid; }
        }
    }
};
// careful: k*x + m must fit in long long at the domain edges`,
      python: `INF = float("inf")

class LiChao:  # minimum at integer x in [lo, hi)
    def __init__(self, lo, hi):
        self.lo, self.hi = lo, hi
        self.line = {}  # node index -> (k, m); sparse, no allocation upfront

    def _at(self, v, x):
        if v not in self.line:
            return INF
        k, m = self.line[v]
        return k * x + m

    def add(self, k, m):
        v, l, r = 1, self.lo, self.hi
        while True:
            mid = (l + r) // 2
            if k * mid + m < self._at(v, mid):
                self.line[v], (k, m) = (k, m), self.line.get(v, (0, INF))
            if (k, m) == (0, INF) or r - l == 1:
                return
            if k * l + m < self._at(v, l):
                v, r = 2 * v, mid
            elif k * (r - 1) + m < self._at(v, r - 1):
                v, l = 2 * v + 1, mid
            else:
                return

    def query(self, x):
        v, l, r = 1, self.lo, self.hi
        res = self._at(v, x)
        while r - l > 1:
            mid = (l + r) // 2
            if x < mid:
                v, r = 2 * v, mid
            else:
                v, l = 2 * v + 1, mid
            res = min(res, self._at(v, x))
        return res`,
    },
  },
];
