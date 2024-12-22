import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["rickandmortyapi.com"], // Allow images from this domain
  },
};

export default nextConfig;
