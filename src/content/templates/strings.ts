import type { AlgoTemplate } from "@/types/content";

export const strings: AlgoTemplate[] = [
  {
    slug: "kmp",
    name: "KMP (Prefix Function)",
    topic: "Strings",
    complexity: "O(n)",
    description:
      "pi[i] is the length of the longest proper prefix of s[0..i] that is also its suffix. To find a pattern in a text, compute the prefix function of pattern + '#' + text: every position where pi equals the pattern length is a match. Also the tool for periods and borders.",
    exampleProblem: {
      name: "CSES: String Matching",
      url: "https://cses.fi/problemset/task/1753",
      note: "Count occurrences of a pattern in a text. Run the prefix function on pattern + '#' + text and count positions where pi hits the pattern length.",
    },
    code: {
      cpp: `// pi[i] = longest proper prefix of s[0..i] that is also a suffix
vector<int> prefix_function(const string& s) {
    int n = s.size();
    vector<int> pi(n, 0);
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j]) j = pi[j - 1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }
    return pi;
}
// matching: auto pi = prefix_function(pat + "#" + text);
// i is a match end when pi[i] == pat.size()`,
      python: `def prefix_function(s):
    """pi[i] = longest proper prefix of s[:i+1] that is also a suffix"""
    n = len(s)
    pi = [0] * n
    for i in range(1, n):
        j = pi[i - 1]
        while j > 0 and s[i] != s[j]:
            j = pi[j - 1]
        if s[i] == s[j]:
            j += 1
        pi[i] = j
    return pi

# matching: pi = prefix_function(pat + "#" + text)
# i is a match end when pi[i] == len(pat)`,
    },
  },
  {
    slug: "z-algorithm",
    name: "Z Algorithm",
    topic: "Strings",
    complexity: "O(n)",
    description:
      "z[i] is the length of the longest common prefix of s and s[i..]. Same jobs as the prefix function (matching, borders, periods) with a shape some find easier to reason about. For matching, run it on pattern + '#' + text and look for z values equal to the pattern length.",
    exampleProblem: {
      name: "CSES: Finding Borders",
      url: "https://cses.fi/problemset/task/1732",
      note: "A border is a prefix that is also a suffix: position i is a border exactly when i + z[i] equals the string length.",
    },
    code: {
      cpp: `// z[i] = longest common prefix of s and s.substr(i)
vector<int> z_function(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    z[0] = n;
    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i < r) z[i] = min(r - i, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > r) l = i, r = i + z[i];
    }
    return z;
}`,
      python: `def z_function(s):
    """z[i] = longest common prefix of s and s[i:]"""
    n = len(s)
    z = [0] * n
    z[0] = n
    l = r = 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z`,
    },
  },
  {
    slug: "rolling-hash",
    name: "Rolling Hash",
    topic: "Strings",
    complexity: "O(1) per substring hash",
    description:
      "Polynomial hashing with a random base under the Mersenne prime 2^61−1, which survives anti-hash tests that kill fixed-base mod-1e9+7 hashes. Compare any two substrings in O(1). When collisions truly matter, compare with two independent Hash instances.",
    exampleProblem: {
      name: "Codeforces 1200E: Compress Words",
      url: "https://codeforces.com/problemset/problem/1200/E",
      note: "Merge words by the longest overlap of suffix and prefix. Hash both strings and binary-search / scan overlap lengths with O(1) comparisons.",
    },
    code: {
      cpp: `struct Hash {  // random-base polynomial hash mod 2^61 - 1
    static const unsigned long long MOD = (1ULL << 61) - 1;
    static unsigned long long B;
    vector<unsigned long long> h, p;
    static unsigned long long mulmod(unsigned long long a,
                                     unsigned long long b) {
        __uint128_t c = (__uint128_t)a * b;
        unsigned long long r = (unsigned long long)((c >> 61) + (c & MOD));
        return r >= MOD ? r - MOD : r;
    }
    Hash(const string& s) : h(s.size() + 1, 0), p(s.size() + 1, 1) {
        for (size_t i = 0; i < s.size(); i++) {
            h[i + 1] = (mulmod(h[i], B) + s[i]) % MOD;
            p[i + 1] = mulmod(p[i], B);
        }
    }
    unsigned long long get(int l, int r) {  // hash of s[l..r]
        unsigned long long res = h[r + 1] + MOD - mulmod(h[l], p[r + 1 - l]);
        return res >= MOD ? res - MOD : res;
    }
};
unsigned long long Hash::B =
    mt19937_64(chrono::steady_clock::now().time_since_epoch().count())() %
        (Hash::MOD - 512) + 256;`,
      python: `import random

class Hash:  # random-base polynomial hash mod 2^61 - 1
    MOD = (1 << 61) - 1
    B = random.randrange(256, MOD - 256)

    def __init__(self, s):
        n = len(s)
        self.h = [0] * (n + 1)
        self.p = [1] * (n + 1)
        for i, c in enumerate(s):
            self.h[i + 1] = (self.h[i] * self.B + ord(c)) % self.MOD
            self.p[i + 1] = self.p[i] * self.B % self.MOD

    def get(self, l, r):  # hash of s[l..r]
        return (self.h[r + 1] - self.h[l] * self.p[r + 1 - l]) % self.MOD`,
    },
  },
  {
    slug: "trie",
    name: "Trie",
    topic: "Strings",
    complexity: "O(|s|) per operation",
    description:
      "Prefix tree over a fixed alphabet: insert and look up strings in time proportional to their length. The base structure to extend for prefix counting, XOR-maximization (over bits), and DP over dictionaries.",
    exampleProblem: {
      name: "CSES: Word Combinations",
      url: "https://cses.fi/problemset/task/1731",
      note: "Count ways to build a string from dictionary words: DP over positions, where the trie enumerates every dictionary word starting at position i in O(length).",
    },
    code: {
      cpp: `struct Trie {  // lowercase a-z
    vector<array<int, 26>> next;
    vector<int> cnt;  // words ending at this node
    Trie() : next(1), cnt(1, 0) { next[0].fill(-1); }
    void insert(const string& s) {
        int v = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (next[v][c] == -1) {
                next[v][c] = next.size();
                next.push_back({});
                next.back().fill(-1);
                cnt.push_back(0);
            }
            v = next[v][c];
        }
        cnt[v]++;
    }
    int count(const string& s) {  // exact-match count
        int v = 0;
        for (char ch : s) {
            v = next[v][ch - 'a'];
            if (v == -1) return 0;
        }
        return cnt[v];
    }
};`,
      python: `class Trie:
    def __init__(self):
        self.next = [{}]
        self.cnt = [0]  # words ending at this node

    def insert(self, s):
        v = 0
        for c in s:
            if c not in self.next[v]:
                self.next[v][c] = len(self.next)
                self.next.append({})
                self.cnt.append(0)
            v = self.next[v][c]
        self.cnt[v] += 1

    def count(self, s):  # exact-match count
        v = 0
        for c in s:
            if c not in self.next[v]:
                return 0
            v = self.next[v][c]
        return self.cnt[v]`,
    },
  },
  {
    slug: "manacher",
    name: "Manacher",
    topic: "Strings",
    complexity: "O(n)",
    description:
      "All palindromic substrings in linear time: d1[i] is the radius of the longest odd palindrome centered at i, d2[i] the even one between i−1 and i. The longest palindromic substring, palindrome counting, and palindromic prefixes all read straight off these arrays.",
    exampleProblem: {
      name: "CSES: Longest Palindrome",
      url: "https://cses.fi/problemset/task/1111",
      note: "Report the longest palindromic substring: the maximum over 2·d1[i]−1 and 2·d2[i], with the position recovered from the center.",
    },
    code: {
      cpp: `// d1[i] = odd radius at i (>= 1); d2[i] = even radius between i-1 and i
pair<vector<int>, vector<int>> manacher(const string& s) {
    int n = s.size();
    vector<int> d1(n), d2(n);
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = i > r ? 1 : min(d1[l + r - i], r - i + 1);
        while (i - k >= 0 && i + k < n && s[i - k] == s[i + k]) k++;
        d1[i] = k--;
        if (i + k > r) l = i - k, r = i + k;
    }
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = i > r ? 0 : min(d2[l + r - i + 1], r - i + 1);
        while (i - k - 1 >= 0 && i + k < n && s[i - k - 1] == s[i + k]) k++;
        d2[i] = k--;
        if (i + k > r) l = i - k - 1, r = i + k;
    }
    return {d1, d2};
}
// longest palindrome: max over 2 * d1[i] - 1 and 2 * d2[i]`,
      python: `def manacher(s):
    # d1[i] = odd radius at i (>= 1); d2[i] = even radius between i-1 and i
    n = len(s)
    d1 = [0] * n
    l, r = 0, -1
    for i in range(n):
        k = 1 if i > r else min(d1[l + r - i], r - i + 1)
        while i - k >= 0 and i + k < n and s[i - k] == s[i + k]:
            k += 1
        d1[i] = k
        k -= 1
        if i + k > r:
            l, r = i - k, i + k
    d2 = [0] * n
    l, r = 0, -1
    for i in range(n):
        k = 0 if i > r else min(d2[l + r - i + 1], r - i + 1)
        while i - k - 1 >= 0 and i + k < n and s[i - k - 1] == s[i + k]:
            k += 1
        d2[i] = k
        k -= 1
        if i + k > r:
            l, r = i - k - 1, i + k
    return d1, d2

# longest palindrome: max over 2 * d1[i] - 1 and 2 * d2[i]`,
    },
  },
  {
    slug: "aho-corasick",
    name: "Aho-Corasick",
    topic: "Strings",
    complexity: "O(total pattern length + text)",
    description:
      "Match many patterns against one text simultaneously: a trie of the patterns with suffix links, compressed into an automaton where every node has a transition for every letter. Scan the text once; cnt at the current node counts patterns ending at that position.",
    exampleProblem: {
      name: "CSES: Counting Patterns",
      url: "https://cses.fi/problemset/task/2103",
      note: "Count how many times each pattern occurs in the text. Store pattern ids at their trie nodes and aggregate along suffix links.",
    },
    code: {
      cpp: `struct AhoCorasick {  // lowercase a-z
    vector<array<int, 26>> next;
    vector<int> link, cnt;
    AhoCorasick() : next(1), link(1, 0), cnt(1, 0) { next[0].fill(0); }
    int add(const string& s) {  // returns the node of this word
        int v = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (next[v][c] == 0) {
                next[v][c] = next.size();
                next.push_back({});
                next.back().fill(0);
                link.push_back(0);
                cnt.push_back(0);
            }
            v = next[v][c];
        }
        cnt[v]++;
        return v;
    }
    void build() {  // BFS: suffix links + automaton transitions
        queue<int> q;
        for (int c = 0; c < 26; c++)
            if (next[0][c]) q.push(next[0][c]);
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            cnt[v] += cnt[link[v]];  // aggregate along suffix links
            for (int c = 0; c < 26; c++) {
                int u = next[v][c];
                if (!u) {
                    next[v][c] = next[link[v]][c];
                } else {
                    link[u] = next[link[v]][c];
                    q.push(u);
                }
            }
        }
    }
    // scan: v = next[v][ch - 'a'] per char; cnt[v] = matches ending here
};`,
      python: `from collections import deque

class AhoCorasick:  # lowercase a-z
    def __init__(self):
        self.next = [[0] * 26]
        self.link = [0]
        self.cnt = [0]

    def add(self, s):  # returns the node of this word
        v = 0
        for ch in s:
            c = ord(ch) - 97
            if self.next[v][c] == 0:
                self.next[v][c] = len(self.next)
                self.next.append([0] * 26)
                self.link.append(0)
                self.cnt.append(0)
            v = self.next[v][c]
        self.cnt[v] += 1
        return v

    def build(self):  # BFS: suffix links + automaton transitions
        q = deque(u for u in self.next[0] if u)
        while q:
            v = q.popleft()
            self.cnt[v] += self.cnt[self.link[v]]
            for c in range(26):
                u = self.next[v][c]
                if u == 0:
                    self.next[v][c] = self.next[self.link[v]][c]
                else:
                    self.link[u] = self.next[self.link[v]][c]
                    q.append(u)

    # scan: v = next[v][ord(ch) - 97] per char; cnt[v] = matches ending here`,
    },
  },
  {
    slug: "suffix-array",
    name: "Suffix Array + LCP",
    topic: "Strings",
    complexity: "O(n log² n)",
    description:
      "Sort all suffixes by doubling the compared length each round, then compute adjacent longest-common-prefixes with Kasai's algorithm. The pair answers substring search, distinct substring counting, and longest repeated substring. The log² build is plenty for n up to a few hundred thousand.",
    exampleProblem: {
      name: "SPOJ: SARRAY",
      url: "https://www.spoj.com/problems/SARRAY/",
      note: "Output the suffix array itself. Building it is the entire problem.",
    },
    code: {
      cpp: `// sa[i] = start of the i-th smallest suffix
vector<int> suffix_array(const string& s) {
    int n = s.size();
    vector<int> sa(n), rnk(n), tmp(n);
    iota(sa.begin(), sa.end(), 0);
    for (int i = 0; i < n; i++) rnk[i] = s[i];
    for (int k = 1;; k <<= 1) {
        auto cmp = [&](int a, int b) {
            if (rnk[a] != rnk[b]) return rnk[a] < rnk[b];
            int ra = a + k < n ? rnk[a + k] : -1;
            int rb = b + k < n ? rnk[b + k] : -1;
            return ra < rb;
        };
        sort(sa.begin(), sa.end(), cmp);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++)
            tmp[sa[i]] = tmp[sa[i - 1]] + cmp(sa[i - 1], sa[i]);
        rnk = tmp;
        if (rnk[sa[n - 1]] == n - 1) break;
    }
    return sa;
}

// Kasai: lcp[i] = LCP of suffixes sa[i] and sa[i + 1]
vector<int> lcp_array(const string& s, vector<int>& sa) {
    int n = s.size();
    vector<int> rnk(n), lcp(max(0, n - 1));
    for (int i = 0; i < n; i++) rnk[sa[i]] = i;
    for (int i = 0, h = 0; i < n; i++) {
        if (rnk[i] + 1 < n) {
            int j = sa[rnk[i] + 1];
            while (i + h < n && j + h < n && s[i + h] == s[j + h]) h++;
            lcp[rnk[i]] = h;
            if (h) h--;
        } else {
            h = 0;
        }
    }
    return lcp;
}`,
      python: `def suffix_array(s):
    # sa[i] = start of the i-th smallest suffix
    n = len(s)
    sa = list(range(n))
    rnk = [ord(c) for c in s]
    k = 1
    while True:
        def key(i):
            return (rnk[i], rnk[i + k] if i + k < n else -1)
        sa.sort(key=key)
        tmp = [0] * n
        for a, b in zip(sa, sa[1:]):
            tmp[b] = tmp[a] + (key(a) < key(b))
        rnk = tmp
        if rnk[sa[-1]] == n - 1:
            return sa
        k *= 2

def lcp_array(s, sa):
    # Kasai: lcp[i] = LCP of suffixes sa[i] and sa[i + 1]
    n = len(s)
    rnk = [0] * n
    for i, suf in enumerate(sa):
        rnk[suf] = i
    lcp = [0] * max(0, n - 1)
    h = 0
    for i in range(n):
        if rnk[i] + 1 < n:
            j = sa[rnk[i] + 1]
            while i + h < n and j + h < n and s[i + h] == s[j + h]:
                h += 1
            lcp[rnk[i]] = h
            if h:
                h -= 1
        else:
            h = 0
    return lcp`,
    },
  },
];
