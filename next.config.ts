import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://defibot-2.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;
