import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition> support for the page-settle route transition.
    viewTransition: true,
  },
};

export default nextConfig;
