import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '31.97.206.165',
        port: '', // leave empty if no specific port
        pathname: '/media/**', // allow all images under /media/
      },
    ],
  },
};

export default nextConfig;
