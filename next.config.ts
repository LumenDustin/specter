import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Capacitor mobile builds
  // Comment this out for Vercel deployment (Vercel handles SSR)
  // output: 'export',

  // Image optimization config
  images: {
    unoptimized: process.env.CAPACITOR_BUILD === 'true',
  },
};

export default nextConfig;
