import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  allowedDevOrigins: ["*"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
