/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ignoreBuildErrors: true, // Removed for production safety
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
