/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactive le spinner Vercel
  devIndicators: {
    buildActivity: false,
    output: 'export',  // Génère des fichiers statiques
    basePath: '/cineverse',  // Nom de votre repo GitHub
  images: {
    unoptimized: true,  // Nécessaire pour l'export statique
  },
  }
}

module.exports = nextConfig