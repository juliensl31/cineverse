import type { AppProps } from 'next/app';
import '../styles/globals.css'
import Layout from '../components/layout/Layout';
import { AuthProvider } from '../contexts/AuthContext';

// Composant principal pour l'application Next.js
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        {/* Rendu du composant actuel avec ses props */}
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp;
