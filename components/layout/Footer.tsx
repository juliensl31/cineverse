import React from 'react';

// Composant de pied de page
const Footer = () => {
  return (
    <footer className="bg-primary text-white py-6 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            {/* Copyright */}
            © {new Date().getFullYear()} CineVerse. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 