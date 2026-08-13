import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition> support for the page-settle route transition.
    viewTransition: true,
  },
  async redirects() {
    // Removed pages (Aug 2026): keep old bookmarks/links working.
    // Non-permanent so the URLs can come back if the pages return.
    return [
      { source: "/schedule", destination: "/sponsorship#events", permanent: false },
      { source: "/resources", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
