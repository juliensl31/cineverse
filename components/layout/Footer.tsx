import React from 'react';

// Composant de pied de page
const Footer = () => {
  return (
    <footer className="bg-gray-800/50 py-4 z-10">
      <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>
            {/* Copyright */}
            © {new Date().getFullYear()} CineVerse. Tous droits réservés.
          </p>
        </div>
    </footer>
  );
};

export default Footer; 