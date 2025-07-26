import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cslplhzfcfvzsivsgrpc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/img/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
