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
  images: {
    unoptimized: true,
  },
  output: 'export',

  // Désactive le spinner Vercel
  devIndicators: {
    buildActivity: false
  },
}

module.exports = nextConfig