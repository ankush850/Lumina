import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8999/api/:path*",
      },
      {
        source: "/download/:path*",
        destination: "http://127.0.0.1:8999/download/:path*",
      },
      {
        source: "/health",
        destination: "http://127.0.0.1:8999/health",
      },
    ];
  },
};

export default nextConfig;
