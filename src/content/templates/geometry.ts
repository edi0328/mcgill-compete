import type { AlgoTemplate } from "@/types/content";

export const geometry: AlgoTemplate[] = [
  {
    slug: "convex-hull",
    name: "Convex Hull (Monotone Chain)",
    topic: "Geometry",
    complexity: "O(n log n)",
    description:
      "Convex hull of a point set: sort once, then build the lower and upper chains with a cross-product stack. All integer arithmetic, no floating point, no angle sorting. Returned counter-clockwise with collinear points dropped (change the <= to < to keep them).",
    exampleProblem: {
      name: "CSES: Convex Hull",
      url: "https://cses.fi/problemset/task/2195",
      note: "Output the hull vertices, which is the template verbatim. Watch for duplicate input points.",
    },
    code: {
      cpp: `typedef long long ll;
typedef pair<ll, ll> pt;

ll cross(pt O, pt A, pt B) {
    return (A.first - O.first) * (B.second - O.second) -
           (A.second - O.second) * (B.first - O.first);
}

vector<pt> convex_hull(vector<pt> pts) {  // counter-clockwise
    sort(pts.begin(), pts.end());
    pts.erase(unique(pts.begin(), pts.end()), pts.end());
    if (pts.size() < 3) return pts;
    vector<pt> hull;
    for (int pass = 0; pass < 2; pass++) {  // lower, then upper chain
        size_t start = hull.size();
        for (pt& p : pts) {
            while (hull.size() >= start + 2 &&
                   cross(hull[hull.size() - 2], hull.back(), p) <= 0)
                hull.pop_back();
            hull.push_back(p);
        }
        hull.pop_back();
        reverse(pts.begin(), pts.end());
    }
    return hull;
}`,
      python: `def cross(o, a, b):
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

def convex_hull(pts):  # counter-clockwise
    pts = sorted(set(pts))
    if len(pts) < 3:
        return pts
    hull = []
    for pass_pts in (pts, pts[::-1]):  # lower, then upper chain
        start = len(hull)
        for p in pass_pts:
            while len(hull) >= start + 2 and cross(hull[-2], hull[-1], p) <= 0:
                hull.pop()
            hull.append(p)
        hull.pop()
    return hull`,
    },
  },
  {
    slug: "geometry-primitives",
    name: "Geometry Primitives",
    topic: "Geometry",
    complexity: "O(1) per operation",
    description:
      "The integer building blocks under every geometry problem: cross and dot products, orientation tests, exact segment intersection, and twice the signed polygon area. All long long arithmetic, so nothing here can suffer floating-point error.",
    exampleProblem: {
      name: "CSES: Point in Polygon",
      url: "https://cses.fi/problemset/task/2192",
      note: "Boundary cases fall to seg_intersect / collinearity checks; inside vs outside comes from a ray-crossing count built on these same primitives (see also CSES 2190 and 2191).",
    },
    code: {
      cpp: `typedef long long ll;
struct P {
    ll x, y;
    P operator-(P o) const { return {x - o.x, y - o.y}; }
    ll cross(P o) const { return x * o.y - y * o.x; }
    ll dot(P o) const { return x * o.x + y * o.y; }
};

// > 0: a-b-c turns left; < 0: right; == 0: collinear
ll orient(P a, P b, P c) { return (b - a).cross(c - a); }

int sgn(ll v) { return (v > 0) - (v < 0); }

// do segments a-b and c-d intersect (touching counts)?
bool seg_intersect(P a, P b, P c, P d) {
    ll d1 = orient(c, d, a), d2 = orient(c, d, b);
    ll d3 = orient(a, b, c), d4 = orient(a, b, d);
    if (sgn(d1) != sgn(d2) && sgn(d3) != sgn(d4)) return true;
    auto on = [](P p, P q, P r) {  // r on segment p-q, collinear known
        return min(p.x, q.x) <= r.x && r.x <= max(p.x, q.x) &&
               min(p.y, q.y) <= r.y && r.y <= max(p.y, q.y);
    };
    if (d1 == 0 && on(c, d, a)) return true;
    if (d2 == 0 && on(c, d, b)) return true;
    if (d3 == 0 && on(a, b, c)) return true;
    if (d4 == 0 && on(a, b, d)) return true;
    return false;
}

// twice the signed area (positive if counter-clockwise)
ll area2(vector<P>& poly) {
    ll s = 0;
    int n = poly.size();
    for (int i = 0; i < n; i++) s += poly[i].cross(poly[(i + 1) % n]);
    return s;
}`,
      python: `def sub(a, b):
    return (a[0] - b[0], a[1] - b[1])

def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]

def orient(a, b, c):
    # > 0: a-b-c turns left; < 0: right; == 0: collinear
    return cross(sub(b, a), sub(c, a))

def sgn(v):
    return (v > 0) - (v < 0)

def on_segment(p, q, r):  # r on segment p-q, collinear known
    return (min(p[0], q[0]) <= r[0] <= max(p[0], q[0]) and
            min(p[1], q[1]) <= r[1] <= max(p[1], q[1]))

def seg_intersect(a, b, c, d):  # touching counts
    d1, d2 = orient(c, d, a), orient(c, d, b)
    d3, d4 = orient(a, b, c), orient(a, b, d)
    if sgn(d1) != sgn(d2) and sgn(d3) != sgn(d4):
        return True
    if d1 == 0 and on_segment(c, d, a):
        return True
    if d2 == 0 and on_segment(c, d, b):
        return True
    if d3 == 0 and on_segment(a, b, c):
        return True
    if d4 == 0 and on_segment(a, b, d):
        return True
    return False

def area2(poly):
    # twice the signed area (positive if counter-clockwise)
    n = len(poly)
    return sum(cross(poly[i], poly[(i + 1) % n]) for i in range(n))`,
    },
  },
  {
    slug: "closest-pair",
    name: "Closest Pair of Points",
    topic: "Geometry",
    complexity: "O(n log n)",
    description:
      "Smallest distance between any two of n points, returned SQUARED so everything stays in integers. Both versions lean on the same packing fact: once a best distance d is known, only O(1) already-seen points can sit within d of the current one. The C++ code sweeps left to right keeping a strip of recent points in a set ordered by y; the Python code is the classic divide and conquer with a y-sorted merge (no sorted-set in the stdlib).",
    exampleProblem: {
      name: "CSES: Minimum Euclidean Distance",
      url: "https://cses.fi/problemset/task/2194",
      note: "Asks for the squared distance, which is exactly what the template returns, with no floating point anywhere. 2·10^5 points, so the O(n²) all-pairs scan is out.",
    },
    code: {
      cpp: `typedef long long ll;
// squared distance of the closest pair (sweep, strip ordered by y)
ll closest_pair(vector<pair<ll, ll>> pts) {  // points as (x, y), n >= 2
    sort(pts.begin(), pts.end());
    set<pair<ll, ll>> strip;  // (y, x) of points within d behind the sweep
    ll best = LLONG_MAX;
    size_t left = 0;
    for (auto& [x, y] : pts) {
        ll d = (ll)sqrtl((long double)best) + 1;
        while (left < pts.size() && pts[left].first < x - d) {
            strip.erase({pts[left].second, pts[left].first});
            left++;
        }
        for (auto it = strip.lower_bound({y - d, LLONG_MIN});
             it != strip.end() && it->first <= y + d; ++it) {
            ll dx = it->second - x, dy = it->first - y;
            best = min(best, dx * dx + dy * dy);
        }
        strip.insert({y, x});
    }
    return best;
}`,
      python: `def closest_pair(pts):  # squared distance of the closest pair, n >= 2
    px = sorted(pts)  # by x

    def dist2(a, b):
        return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

    def rec(lo, hi):  # solves px[lo:hi]; returns (best, points sorted by y)
        if hi - lo <= 3:
            band = sorted(px[lo:hi], key=lambda p: p[1])
            best = min((dist2(a, b) for i, a in enumerate(band)
                        for b in band[i + 1:]), default=float("inf"))
            return best, band
        mid = (lo + hi) // 2
        xm = px[mid][0]
        d1, left = rec(lo, mid)
        d2, right = rec(mid, hi)
        best = min(d1, d2)
        merged, i, j = [], 0, 0  # merge halves by y
        while i < len(left) or j < len(right):
            if j == len(right) or (i < len(left) and left[i][1] <= right[j][1]):
                merged.append(left[i]); i += 1
            else:
                merged.append(right[j]); j += 1
        # strip around the split line; each point checks O(1) successors
        strip = [p for p in merged if (p[0] - xm) ** 2 < best]
        for i, a in enumerate(strip):
            for b in strip[i + 1:]:
                if (b[1] - a[1]) ** 2 >= best:
                    break
                best = min(best, dist2(a, b))
        return best, merged

    return rec(0, len(px))[0]`,
    },
  },
];
