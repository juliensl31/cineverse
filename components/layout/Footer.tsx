import React from 'react';

// Composant de pied de page
const Footer = () => {
  return (
    <footer className="bg-black py-4 pt-10">
      <div className="container mx-auto text-center text-white text-sm">
          <p>
            {/* Copyright */}
            © {new Date().getFullYear()} CineVerse. Tous droits réservés.
          </p>
        </div>
    </footer>
  );
};

export default Footer; 