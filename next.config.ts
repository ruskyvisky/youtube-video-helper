import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/youtube-video-helper' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/youtube-video-helper' : '',
};

export default nextConfig;
