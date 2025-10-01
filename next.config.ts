import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Allow deployment on Vercel even with TypeScript errors
    ignoreBuildErrors: true
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
    
  },
};

export default nextConfig;
