/** @type {import('next').NextConfig} */
const nextConfig = {  experimental: {
    // appDir: true,
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
  }};

export default nextConfig;
