/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
    // serverExternalPackages: ["@prisma/client", "bcrypt"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**", // Allows any path within the bucket
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "/**", // Allows any path within the bucket
      },
    ],
  },
  // api: {
  //   bodyParser: {
  //     sizeLimit: "10mb",
  //   },
  //   responseLimit: "10mb",
  // },
};

console.log("Next.js config is loaded");

export default nextConfig;
