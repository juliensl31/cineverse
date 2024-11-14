/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactive le spinner Vercel
  devIndicators: {
    buildActivity: false
  },
  basePath: '/cineverse',
}

module.exports = nextConfig