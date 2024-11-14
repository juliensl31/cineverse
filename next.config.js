/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  // Désactive le spinner Vercel
  devIndicators: {
    buildActivity: false
  },
  output: 'export',  // Génère des fichiers statiques
  assetPrefix: isProd ? '/cineverse/' : '',
  basePath: isProd ? '/cineverse' : '',
  images: {
    unoptimized: true,  // Nécessaire pour l'export statique
  },
}


module.exports = nextConfig