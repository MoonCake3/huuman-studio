import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
