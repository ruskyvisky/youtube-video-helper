import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/youtube-video-script-helper' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/youtube-video-script-helper' : '',
};

export default nextConfig;
