import React from 'react';
import Footer from './Footer';

// Props pour le composant Layout
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      {/* Conteneur principal */}
      <main>{children}</main>
      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default Layout; 