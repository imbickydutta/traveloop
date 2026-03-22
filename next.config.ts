import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats — browser picks the smallest it supports
    formats: ["image/avif", "image/webp"],

    // Device widths that Next.js will generate optimised variants for
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1280, 1920],

    // Image component widths (fill / fixed sizes)
    imageSizes: [64, 128, 256, 340, 420, 520, 620, 900],

    // Cache optimised images for 7 days
    minimumCacheTTL: 604800,
  },
};

export default nextConfig;
