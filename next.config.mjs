/** @type {import('next').NextConfig} */
const nextConfig = {
  
  experimental: {
    // appDir: true,
    // serverExternalPackages: ["@prisma/client", "bcrypt"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**', // Allows any path within the bucket
      },
    ],
  },
};

console.log('Next.js config is loaded')

export default nextConfig;
