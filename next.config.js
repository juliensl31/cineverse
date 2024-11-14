/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  // Désactive le spinner Vercel
  devIndicators: {
    buildActivity: false
  },
  output: 'export',
  assetPrefix: isProd ? '/cineverse/' : '',
  basePath: isProd ? '/cineverse' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig