/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // Désactive le spinner Vercel
  devIndicators: {
    buildActivity: false
  },
}

module.exports = nextConfig