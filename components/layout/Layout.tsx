import React from 'react';
import Footer from './Footer';
import Navigation from '../Navigation';
// Props pour le composant Layout
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white p-2">
      {/* Navigation */}
      <Navigation/>
      {/* Conteneur principal */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      {/* Pied de page */}
      <Footer/>
      </div>
  );
};

export default Layout; 