/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/cineverse',
        permanent: true,
      },
    ];
  },
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