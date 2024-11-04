import type { AppProps } from 'next/app';
import '../styles/globals.css'
import Layout from '../components/layout/Layout';

// Composant principal pour l'application Next.js
function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Conteneur principal
    <Layout>
      {/* Rendu du composant actuel avec ses props */}
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp;
