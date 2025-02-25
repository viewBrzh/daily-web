import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

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
