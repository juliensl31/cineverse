/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactive le spinner Vercel
  devIndicators: {
    buildActivity: false
  },
  output: 'export',
  basePath:'/cineverse',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig