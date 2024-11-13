import React from 'react';
import Footer from './Footer';
import Navigation from './Navigation';
import ScrollToTop from '../UI/ScrollToTop';
// Props pour le composant Layout
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
    <div className="h-screen flex flex-col">
      {/* Navigation */}
      <Navigation/>
      {/* Conteneur principal */}
      <main className="flex-1 bg-gradient-to-b from-gray-900 to-black text-white">
        {children}  
        <ScrollToTop/>
      </main>
      {/* Pied de page */}
      <Footer/>
      
    </div>
    </>
  );
};

export default Layout; 