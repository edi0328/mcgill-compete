import type { AlgoTemplate } from "@/types/content";

export const math: AlgoTemplate[] = [
  {
    slug: "modular-arithmetic",
    name: "Modular Arithmetic",
    topic: "Mathematics",
    complexity: "O(log e) per power/inverse",
    description:
      "Fast exponentiation and modular inverse under a prime modulus, the base layer of counting problems that ask for the answer mod 1e9+7 or 998244353. Division becomes multiplication by the inverse (Fermat's little theorem, prime modulus only).",
    exampleProblem: {
      name: "CSES: Exponentiation",
      url: "https://cses.fi/problemset/task/1095",
      note: "Raw a^b mod 1e9+7 with huge exponents. Binary exponentiation is the entire problem.",
    },
    code: {
      cpp: `const long long MOD = 998244353;  // or 1e9+7

long long power(long long b, long long e, long long mod = MOD) {
    long long r = 1;
    for (b %= mod; e > 0; e >>= 1, b = b * b % mod)
        if (e & 1) r = r * b % mod;
    return r;
}

long long inv(long long a) {  // MOD must be prime
    return power(a, MOD - 2);
}

// usage: (x * inv(y)) % MOD  computes  x / y  (mod MOD)`,
      python: `MOD = 998244353  # or 10**9 + 7

# built-in pow already does binary exponentiation:
#   pow(b, e, MOD)      ->  b^e  (mod MOD)
#   pow(a, -1, MOD)     ->  modular inverse (MOD prime or gcd(a, MOD) = 1)

def inv(a, mod=MOD):
    return pow(a, -1, mod)

# usage: (x * inv(y)) % MOD  computes  x / y  (mod MOD)`,
    },
  },
  {
    slug: "sieve",
    name: "Sieve (Smallest Prime Factor)",
    topic: "Mathematics",
    complexity: "O(n log log n)",
    description:
      "Sieve of Eratosthenes that records each number's smallest prime factor instead of just primality. Same cost, strictly more useful: primality is spf[x] == x, and any x factorizes in O(log x) by repeatedly dividing out spf[x].",
    exampleProblem: {
      name: "CSES: Counting Divisors",
      url: "https://cses.fi/problemset/task/1713",
      note: "Divisor counts for up to 2·10^5 numbers. Factor each one in O(log x) via spf and multiply (exponent + 1) over the factorization.",
    },
    code: {
      cpp: `// spf[x] = smallest prime factor of x (spf[x] == x  <=>  x is prime)
vector<int> sieve(int N) {
    vector<int> spf(N + 1);
    iota(spf.begin(), spf.end(), 0);
    for (int i = 2; (long long)i * i <= N; i++)
        if (spf[i] == i)  // prime
            for (int j = i * i; j <= N; j += i)
                if (spf[j] == j) spf[j] = i;
    return spf;
}

// factorize x in O(log x):
// while (x > 1) { int p = spf[x]; while (x % p == 0) x /= p; ... }`,
      python: `def sieve(N):
    """spf[x] = smallest prime factor of x (spf[x] == x <=> x prime)"""
    spf = list(range(N + 1))
    i = 2
    while i * i <= N:
        if spf[i] == i:  # prime
            for j in range(i * i, N + 1, i):
                if spf[j] == j:
                    spf[j] = i
        i += 1
    return spf

# factorize x in O(log x):
# while x > 1:
#     p = spf[x]
#     while x % p == 0:
#         x //= p`,
    },
  },
  {
    slug: "combinatorics",
    name: "Binomial Coefficients (nCr)",
    topic: "Mathematics",
    complexity: "O(1) per query after O(n) setup",
    description:
      "Precompute factorials and inverse factorials once, then answer any nCr mod a prime in constant time. The inverse factorials come from a single modular inverse plus a backward sweep, so setup is one O(log MOD) power total.",
    exampleProblem: {
      name: "CSES: Binomial Coefficients",
      url: "https://cses.fi/problemset/task/1079",
      note: "Up to 10^5 nCr queries with n up to 10^6. Precompute once, answer each in O(1).",
    },
    code: {
      cpp: `const long long MOD = 998244353;
vector<long long> fact, inv_fact;

long long power(long long b, long long e) {
    long long r = 1;
    for (b %= MOD; e > 0; e >>= 1, b = b * b % MOD)
        if (e & 1) r = r * b % MOD;
    return r;
}

void init_comb(int N) {
    fact.assign(N + 1, 1);
    for (int i = 1; i <= N; i++) fact[i] = fact[i - 1] * i % MOD;
    inv_fact.assign(N + 1, 1);
    inv_fact[N] = power(fact[N], MOD - 2);
    for (int i = N; i >= 1; i--)
        inv_fact[i - 1] = inv_fact[i] * i % MOD;
}

long long C(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fact[n] * inv_fact[r] % MOD * inv_fact[n - r] % MOD;
}`,
      python: `MOD = 998244353

def init_comb(N):
    fact = [1] * (N + 1)
    for i in range(1, N + 1):
        fact[i] = fact[i - 1] * i % MOD
    inv_fact = [1] * (N + 1)
    inv_fact[N] = pow(fact[N], -1, MOD)
    for i in range(N, 0, -1):
        inv_fact[i - 1] = inv_fact[i] * i % MOD
    return fact, inv_fact

def C(n, r, fact, inv_fact):
    if r < 0 or r > n:
        return 0
    return fact[n] * inv_fact[r] % MOD * inv_fact[n - r] % MOD

# exact (non-modular) answers: math.comb(n, r)`,
    },
  },
  {
    slug: "matrix-exponentiation",
    name: "Matrix Exponentiation",
    topic: "Mathematics",
    complexity: "O(k³ log e)",
    description:
      "Raise a k×k matrix to a huge power by binary exponentiation. Turns any fixed linear recurrence (Fibonacci, path counting, linear DP with tiny state) into an O(k³ log n) computation, so n up to 10^18 is fine.",
    exampleProblem: {
      name: "CSES: Fibonacci Numbers",
      url: "https://cses.fi/problemset/task/1722",
      note: "F(n) for n up to 10^18: power the 2×2 matrix [[1,1],[1,0]] to the n-th and read off the corner.",
    },
    code: {
      cpp: `const long long MOD = 998244353;
using Mat = vector<vector<long long>>;

Mat mul(const Mat& A, const Mat& B) {
    int n = A.size(), m = B[0].size(), k = B.size();
    Mat C(n, vector<long long>(m, 0));
    for (int i = 0; i < n; i++)
        for (int t = 0; t < k; t++) {
            if (A[i][t] == 0) continue;
            for (int j = 0; j < m; j++)
                C[i][j] = (C[i][j] + A[i][t] * B[t][j]) % MOD;
        }
    return C;
}

Mat mat_pow(Mat A, long long e) {
    int n = A.size();
    Mat R(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++) R[i][i] = 1;
    for (; e > 0; e >>= 1, A = mul(A, A))
        if (e & 1) R = mul(R, A);
    return R;
}

// Fibonacci: mat_pow({{1,1},{1,0}}, n)[0][1] == F(n)`,
      python: `MOD = 998244353

def mul(A, B):
    n, k, m = len(A), len(B), len(B[0])
    C = [[0] * m for _ in range(n)]
    for i in range(n):
        Ai = A[i]
        Ci = C[i]
        for t in range(k):
            if Ai[t]:
                a = Ai[t]
                Bt = B[t]
                for j in range(m):
                    Ci[j] = (Ci[j] + a * Bt[j]) % MOD
    return C

def mat_pow(A, e):
    n = len(A)
    R = [[int(i == j) for j in range(n)] for i in range(n)]
    while e > 0:
        if e & 1:
            R = mul(R, A)
        A = mul(A, A)
        e >>= 1
    return R

# Fibonacci: mat_pow([[1, 1], [1, 0]], n)[0][1] == F(n)`,
    },
  },
  {
    slug: "ext-gcd-crt",
    name: "Extended GCD & CRT",
    topic: "Mathematics",
    complexity: "O(log min(a, b))",
    description:
      "Extended Euclid finds x, y with ax + by = gcd(a, b), which gives modular inverses for non-prime moduli and solves linear Diophantine equations. CRT combines two congruences x ≡ r1 (mod m1), x ≡ r2 (mod m2) into one, handling non-coprime moduli.",
    exampleProblem: {
      name: "Kattis: Chinese Remainder",
      url: "https://open.kattis.com/problems/chineseremainder",
      note: "Solve the two-congruence system directly with the crt function; huge moduli are why the C++ version multiplies through __int128.",
    },
    code: {
      cpp: `// g = gcd(a, b) and x, y with a*x + b*y = g
long long ext_gcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) {
        x = 1, y = 0;
        return a;
    }
    long long x1, y1, g = ext_gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

// combine x = r1 (mod m1) and x = r2 (mod m2)
// returns {x, lcm}, or {-1, -1} if incompatible
pair<long long, long long> crt(long long r1, long long m1,
                               long long r2, long long m2) {
    long long x, y;
    long long g = ext_gcd(m1, m2, x, y);
    if ((r2 - r1) % g != 0) return {-1, -1};
    long long lcm = m1 / g * m2;
    long long mg = m2 / g;
    long long t = (__int128)((r2 - r1) / g % mg) * (x % mg) % mg;
    if (t < 0) t += mg;
    long long res = (long long)(((__int128)m1 * t + r1) % lcm);
    if (res < 0) res += lcm;
    return {res, lcm};
}`,
      python: `def ext_gcd(a, b):
    """returns (g, x, y) with a*x + b*y = g = gcd(a, b)"""
    if b == 0:
        return a, 1, 0
    g, x1, y1 = ext_gcd(b, a % b)
    return g, y1, x1 - (a // b) * y1

def crt(r1, m1, r2, m2):
    """combine x = r1 (mod m1) and x = r2 (mod m2);
    returns (x, lcm), or None if incompatible"""
    g, x, _ = ext_gcd(m1, m2)
    if (r2 - r1) % g != 0:
        return None
    lcm = m1 // g * m2
    mg = m2 // g
    t = (r2 - r1) // g % mg * x % mg
    return (r1 + m1 * t) % lcm, lcm

# note: Python inverses for coprime moduli are just pow(a, -1, m)`,
    },
  },
  {
    slug: "ntt",
    name: "NTT (Convolution)",
    topic: "Mathematics",
    complexity: "O(n log n)",
    description:
      "Polynomial multiplication under the NTT-friendly prime 998244353 (primitive root 3): FFT over the integers mod p, so there is no floating-point error. Multiplying two polynomials, counting pair sums, and string wildcard matching all reduce to this convolution.",
    exampleProblem: {
      name: "AtCoder Library Practice F",
      url: "https://atcoder.jp/contests/practice2/tasks/practice2_f",
      note: "Convolution of two sequences mod 998244353, which is the multiply function verbatim.",
    },
    code: {
      cpp: `const long long MOD = 998244353, G = 3;  // MOD prime, G primitive root

long long power(long long b, long long e) {
    long long r = 1;
    for (b %= MOD; e > 0; e >>= 1, b = b * b % MOD)
        if (e & 1) r = r * b % MOD;
    return r;
}

void ntt(vector<long long>& a, bool invert) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {  // bit-reversal permutation
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long w = power(G, (MOD - 1) / len);
        if (invert) w = power(w, MOD - 2);
        for (int i = 0; i < n; i += len) {
            long long wn = 1;
            for (int j = 0; j < len / 2; j++) {
                long long u = a[i + j];
                long long v = a[i + j + len / 2] * wn % MOD;
                a[i + j] = (u + v) % MOD;
                a[i + j + len / 2] = (u - v + MOD) % MOD;
                wn = wn * w % MOD;
            }
        }
    }
    if (invert) {
        long long ninv = power(n, MOD - 2);
        for (auto& x : a) x = x * ninv % MOD;
    }
}

vector<long long> multiply(vector<long long> a, vector<long long> b) {
    int res_size = a.size() + b.size() - 1, n = 1;
    while (n < res_size) n <<= 1;
    a.resize(n);
    b.resize(n);
    ntt(a, false);
    ntt(b, false);
    for (int i = 0; i < n; i++) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    a.resize(res_size);
    return a;
}`,
      python: `MOD = 998244353  # prime with primitive root 3
G = 3

def ntt(a, invert):
    n = len(a)
    j = 0
    for i in range(1, n):  # bit-reversal permutation
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    length = 2
    while length <= n:
        w = pow(G, (MOD - 1) // length, MOD)
        if invert:
            w = pow(w, MOD - 2, MOD)
        for i in range(0, n, length):
            wn = 1
            half = length // 2
            for k in range(i, i + half):
                u, v = a[k], a[k + half] * wn % MOD
                a[k] = (u + v) % MOD
                a[k + half] = (u - v) % MOD
                wn = wn * w % MOD
        length <<= 1
    if invert:
        ninv = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * ninv % MOD

def multiply(a, b):
    res_size = len(a) + len(b) - 1
    n = 1
    while n < res_size:
        n <<= 1
    a = a + [0] * (n - len(a))
    b = b + [0] * (n - len(b))
    ntt(a, False)
    ntt(b, False)
    c = [x * y % MOD for x, y in zip(a, b)]
    ntt(c, True)
    return c[:res_size]`,
    },
  },
];
