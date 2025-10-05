import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",

  // Security & caching headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Vary",
            value:
              "RSC, Next-Router-State, Next-Router-Prefetch, Accept-Encoding",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self';",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // Remote images from Strapi
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },

  // Redis cache handler in production (built via `npm run build:cache`)
  ...(process.env.NODE_ENV === "production"
    ? {
        cacheHandler: path.resolve(
          __dirname,
          ".cache-handler/cache-handler.js"
        ),
        cacheMaxMemorySize: 0,
      }
    : {}),
};

export default nextConfig;
