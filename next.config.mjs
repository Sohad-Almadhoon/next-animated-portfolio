/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Screenshots never render wider than ~1200 CSS px, so there is no point
    // generating (and paying for) 2560/3840 variants.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [64, 96, 128, 192, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
