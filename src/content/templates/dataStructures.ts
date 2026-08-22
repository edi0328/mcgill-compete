import type { AlgoTemplate } from "@/types/content";

export const dataStructures: AlgoTemplate[] = [
  {
    slug: "dsu",
    name: "DSU (Union-Find)",
    topic: "Data Structures",
    complexity: "O(α(n)) per operation",
    description:
      "Maintains a collection of disjoint sets under two operations: find which set an element belongs to, and merge two sets. With path compression and union by size both are effectively constant time. The standard structure for connectivity, Kruskal's MST, and grouping problems.",
    exampleProblem: {
      name: "CSES: Road Construction",
      url: "https://cses.fi/problemset/task/1676",
      note: "After each added road, report the number of connected components and the size of the largest one. That is exactly what unite() and the size array maintain.",
    },
    code: {
      cpp: `struct DSU {
    vector<int> parent, size;
    DSU(int n) : parent(n), size(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        while (parent[x] != x) x = parent[x] = parent[parent[x]];
        return x;
    }
    bool unite(int a, int b) {  // returns false if already connected
        a = find(a), b = find(b);
        if (a == b) return false;
        if (size[a] < size[b]) swap(a, b);
        parent[b] = a;
        size[a] += size[b];
        return true;
    }
};`,
      python: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def unite(self, a, b):  # returns False if already connected
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        if self.size[a] < self.size[b]:
            a, b = b, a
        self.parent[b] = a
        self.size[a] += self.size[b]
        return True`,
    },
  },
  {
    slug: "segment-tree",
    name: "Segment Tree",
    topic: "Range Queries",
    complexity: "O(log n) per query",
    description:
      "Point updates and range queries over any associative operation (min, max, sum, gcd, ...). This is the compact iterative (bottom-up) version, with O(n) construction from an initial array. Swap the combine lines to change the operation. Reach for it when a Fenwick tree isn't enough (min/max, non-invertible operations).",
    exampleProblem: {
      name: "CSES: Dynamic Range Minimum Queries",
      url: "https://cses.fi/problemset/task/1649",
      note: "Point assignments mixed with range-minimum queries. Replace the + combine with min and it's done.",
    },
    code: {
      cpp: `struct SegTree {  // point update, range query on [l, r)
    int n;
    vector<long long> t;
    SegTree(int n) : n(n), t(2 * n, 0) {}
    SegTree(const vector<long long>& a) : n(a.size()), t(2 * a.size()) {
        copy(a.begin(), a.end(), t.begin() + n);
        for (int i = n - 1; i > 0; i--)
            t[i] = t[2 * i] + t[2 * i + 1];  // combine
    }
    void update(int i, long long v) {  // set a[i] = v
        for (t[i += n] = v; i > 1; i >>= 1)
            t[i >> 1] = t[i] + t[i ^ 1];  // combine
    }
    long long query(int l, int r) {  // fold over [l, r)
        long long res = 0;  // identity of the combine
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if (l & 1) res += t[l++];
            if (r & 1) res += t[--r];
        }
        return res;
    }
};`,
      python: `class SegTree:  # point update, range query on [l, r)
    def __init__(self, a):  # a = initial list, or an int n for all zeros
        if isinstance(a, int):
            a = [0] * a
        self.n = n = len(a)
        self.t = t = [0] * n + list(a)
        for i in range(n - 1, 0, -1):
            t[i] = t[2 * i] + t[2 * i + 1]  # combine

    def update(self, i, v):  # set a[i] = v
        i += self.n
        self.t[i] = v
        while i > 1:
            i //= 2
            self.t[i] = self.t[2 * i] + self.t[2 * i + 1]  # combine

    def query(self, l, r):  # fold over [l, r)
        res = 0
        l += self.n
        r += self.n
        while l < r:
            if l & 1:
                res += self.t[l]
                l += 1
            if r & 1:
                r -= 1
                res += self.t[r]
            l //= 2
            r //= 2
        return res`,
    },
  },
  {
    slug: "lazy-segment-tree",
    name: "Lazy Segment Tree",
    topic: "Range Queries",
    complexity: "O(log n) per operation",
    description:
      "Segment tree with lazy propagation: range updates and range queries, both logarithmic. This version does range add + range sum. To change it, adjust apply() (how an update hits a node) and the two combine lines. The recursive structure is the part worth memorizing.",
    exampleProblem: {
      name: "CSES: Range Update Queries",
      url: "https://cses.fi/problemset/task/1651",
      note: "Range add, point read. A point read is query(i, i), so the template applies directly.",
    },
    code: {
      cpp: `struct LazySegTree {  // range add, range sum on [l, r]
    int n;
    vector<long long> t, lz;
    LazySegTree(int n) : n(n), t(4 * n, 0), lz(4 * n, 0) {}
    void apply(int x, int l, int r, long long v) {
        t[x] += v * (r - l + 1);
        lz[x] += v;
    }
    void push(int x, int l, int r) {
        if (lz[x] == 0) return;
        int m = (l + r) / 2;
        apply(2 * x, l, m, lz[x]);
        apply(2 * x + 1, m + 1, r, lz[x]);
        lz[x] = 0;
    }
    void update(int x, int l, int r, int ql, int qr, long long v) {
        if (qr < l || r < ql) return;
        if (ql <= l && r <= qr) return apply(x, l, r, v);
        push(x, l, r);
        int m = (l + r) / 2;
        update(2 * x, l, m, ql, qr, v);
        update(2 * x + 1, m + 1, r, ql, qr, v);
        t[x] = t[2 * x] + t[2 * x + 1];
    }
    long long query(int x, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return t[x];
        push(x, l, r);
        int m = (l + r) / 2;
        return query(2 * x, l, m, ql, qr) +
               query(2 * x + 1, m + 1, r, ql, qr);
    }
    void update(int l, int r, long long v) { update(1, 0, n - 1, l, r, v); }
    long long query(int l, int r) { return query(1, 0, n - 1, l, r); }
};`,
      python: `import sys
sys.setrecursionlimit(1 << 20)

class LazySegTree:  # range add, range sum on [l, r]
    def __init__(self, n):
        self.n = n
        self.t = [0] * (4 * n)
        self.lz = [0] * (4 * n)

    def _apply(self, x, l, r, v):
        self.t[x] += v * (r - l + 1)
        self.lz[x] += v

    def _push(self, x, l, r):
        if self.lz[x]:
            m = (l + r) // 2
            self._apply(2 * x, l, m, self.lz[x])
            self._apply(2 * x + 1, m + 1, r, self.lz[x])
            self.lz[x] = 0

    def update(self, ql, qr, v, x=1, l=0, r=None):
        if r is None:
            r = self.n - 1
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            return self._apply(x, l, r, v)
        self._push(x, l, r)
        m = (l + r) // 2
        self.update(ql, qr, v, 2 * x, l, m)
        self.update(ql, qr, v, 2 * x + 1, m + 1, r)
        self.t[x] = self.t[2 * x] + self.t[2 * x + 1]

    def query(self, ql, qr, x=1, l=0, r=None):
        if r is None:
            r = self.n - 1
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return self.t[x]
        self._push(x, l, r)
        m = (l + r) // 2
        return (self.query(ql, qr, 2 * x, l, m) +
                self.query(ql, qr, 2 * x + 1, m + 1, r))`,
    },
  },
  {
    slug: "fenwick-tree",
    name: "Fenwick Tree (BIT)",
    topic: "Range Queries",
    complexity: "O(log n) per operation",
    description:
      "Prefix sums with point updates in logarithmic time, in a quarter of the code of a segment tree. Only works for invertible operations (sums, XOR), but when it applies it's shorter and harder to get wrong. Also the standard tool for counting inversions.",
    exampleProblem: {
      name: "CSES: Dynamic Range Sum Queries",
      url: "https://cses.fi/problemset/task/1648",
      note: "Point updates plus range sums: answer [l, r] as sum(r) − sum(l−1).",
    },
    code: {
      cpp: `struct Fenwick {  // 1-indexed
    int n;
    vector<long long> bit;
    Fenwick(int n) : n(n), bit(n + 1, 0) {}
    void add(int i, long long d) {  // a[i] += d
        for (; i <= n; i += i & -i) bit[i] += d;
    }
    long long sum(int i) {  // a[1] + ... + a[i]
        long long s = 0;
        for (; i > 0; i -= i & -i) s += bit[i];
        return s;
    }
    long long sum(int l, int r) { return sum(r) - sum(l - 1); }
};`,
      python: `class Fenwick:  # 1-indexed
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, d):  # a[i] += d
        while i <= self.n:
            self.bit[i] += d
            i += i & -i

    def sum(self, i):  # a[1] + ... + a[i]
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

    def range_sum(self, l, r):
        return self.sum(r) - self.sum(l - 1)`,
    },
  },
  {
    slug: "sparse-table",
    name: "Sparse Table",
    topic: "Range Queries",
    complexity: "O(1) query, O(n log n) build",
    description:
      "Constant-time range queries for idempotent operations (min, max, gcd) on a static array. No updates. When the array never changes, this beats a segment tree on both speed and code size.",
    exampleProblem: {
      name: "CSES: Static Range Minimum Queries",
      url: "https://cses.fi/problemset/task/1647",
      note: "Range minimums on a fixed array, exactly what the table answers in O(1) each.",
    },
    code: {
      cpp: `struct SparseTable {  // min; works for any idempotent op
    vector<vector<long long>> t;
    SparseTable(const vector<long long>& a) {
        int n = a.size(), K = __lg(n) + 1;
        t.assign(K, a);
        for (int j = 1; j < K; j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                t[j][i] = min(t[j - 1][i], t[j - 1][i + (1 << (j - 1))]);
    }
    long long query(int l, int r) {  // min on [l, r]
        int j = __lg(r - l + 1);
        return min(t[j][l], t[j][r - (1 << j) + 1]);
    }
};`,
      python: `class SparseTable:  # min; works for any idempotent op
    def __init__(self, a):
        n = len(a)
        self.t = [list(a)]
        j = 1
        while (1 << j) <= n:
            prev = self.t[-1]
            half = 1 << (j - 1)
            self.t.append([min(prev[i], prev[i + half])
                           for i in range(n - (1 << j) + 1)])
            j += 1

    def query(self, l, r):  # min on [l, r]
        j = (r - l + 1).bit_length() - 1
        return min(self.t[j][l], self.t[j][r - (1 << j) + 1])`,
    },
  },
  {
    slug: "mos-algorithm",
    name: "Mo's Algorithm",
    topic: "Offline Queries",
    complexity: "O((n + q)·√n)",
    description:
      "Answers offline range queries by sorting them in block order and moving the [l, r] window one element at a time. Works whenever add(x) and remove(x) are cheap. This version counts distinct values per query; customize add/remove for other statistics.",
    exampleProblem: {
      name: "SPOJ: DQUERY",
      url: "https://www.spoj.com/problems/DQUERY/",
      note: "Number of distinct values in each queried range, the textbook Mo's application (and what this template computes as written).",
    },
    code: {
      cpp: `// offline range queries; example: distinct values in [l, r]
vector<int> mo(vector<int>& a, vector<array<int, 2>>& queries) {
    int n = a.size(), q = queries.size();
    int B = max(1, (int)(n / sqrt(q + 1.0)));
    vector<int> order(q), ans(q);
    iota(order.begin(), order.end(), 0);
    sort(order.begin(), order.end(), [&](int i, int j) {
        int bi = queries[i][0] / B, bj = queries[j][0] / B;
        if (bi != bj) return bi < bj;
        return (bi & 1) ? queries[i][1] > queries[j][1]
                        : queries[i][1] < queries[j][1];
    });
    vector<int> cnt(*max_element(a.begin(), a.end()) + 1, 0);
    int cur = 0, l = 0, r = -1;
    auto add = [&](int i) { if (cnt[a[i]]++ == 0) cur++; };
    auto rem = [&](int i) { if (--cnt[a[i]] == 0) cur--; };
    for (int qi : order) {
        auto [ql, qr] = queries[qi];
        while (l > ql) add(--l);
        while (r < qr) add(++r);
        while (l < ql) rem(l++);
        while (r > qr) rem(r--);
        ans[qi] = cur;
    }
    return ans;
}`,
      python: `from math import sqrt

def mo(a, queries):  # example: distinct values in [l, r]
    n, q = len(a), len(queries)
    B = max(1, int(n / sqrt(q + 1)))
    order = sorted(
        range(q),
        key=lambda i: (queries[i][0] // B,
                       queries[i][1] if (queries[i][0] // B) % 2 == 0
                       else -queries[i][1]))
    cnt = {}
    cur = 0
    l, r = 0, -1
    ans = [0] * q

    def add(i):
        nonlocal cur
        cnt[a[i]] = cnt.get(a[i], 0) + 1
        if cnt[a[i]] == 1:
            cur += 1

    def rem(i):
        nonlocal cur
        cnt[a[i]] -= 1
        if cnt[a[i]] == 0:
            cur -= 1

    for qi in order:
        ql, qr = queries[qi]
        while l > ql:
            l -= 1
            add(l)
        while r < qr:
            r += 1
            add(r)
        while l < ql:
            rem(l)
            l += 1
        while r > qr:
            rem(r)
            r -= 1
        ans[qi] = cur
    return ans`,
    },
  },
];
