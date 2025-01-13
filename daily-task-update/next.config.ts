import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Merging rewrites into nextConfig
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:10080/:path*', // Proxy to your backend server
      },
    ];
  },
};

export default nextConfig;
