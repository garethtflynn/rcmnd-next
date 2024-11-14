/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Use your Backblaze B2 bucket's hostname // s3.us-east-005.backblazeb2.com
        port: '',
        pathname: '/**', // Allow any path within the bucket
      },
    ],
  },
};

export default nextConfig;
