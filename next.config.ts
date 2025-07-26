import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: process.env.NODE_ENV === 'production', // 开发环境禁用压缩
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // 图片配置 - 允许 Supabase 存储的图片
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cslplhzfcfvzsivsgrpc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // 开发环境配置
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config) => {
      // 开发环境禁用代码压缩
      config.optimization.minimize = false;
      return config;
    },
  }),
};

export default nextConfig;
