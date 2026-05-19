import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'file.boomrealtys.com',
        port: '', // leave empty if no specific port
        pathname: '/media/**', // allow all images under /media/
      },
    ],
  },
};

export default nextConfig;
