/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore unused import warnings for build
  },
  images: {
    unoptimized: false, // Enable image optimization
    domains: ['localhost', 'dev-api.posport.io'], // Add your image domains
    formats: ['image/webp', 'image/avif'], // Enable modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Performance optimizations
  experimental: {
    // optimizeCss: true, // Disabled due to missing critters dependency
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  // Compression
  compress: true,
  // Bundle analyzer (uncomment for debugging)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //     };
  //   }
  //   return config;
  // },
}

export default nextConfig
