import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/admin',
  assetPrefix: '/admin/',
  images: {
    domains:   ['res.cloudinary.com'] ,

  },
}


export default nextConfig;
