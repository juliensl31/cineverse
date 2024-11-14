/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/cineverse',
  images: {
    unoptimized: true,
  },

  // Désactive le spinner Vercel
  devIndicators: {
    buildActivity: false
  },
}

module.exports = nextConfig