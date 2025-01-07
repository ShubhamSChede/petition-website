import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable client-side navigation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
