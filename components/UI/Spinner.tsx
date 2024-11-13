// Spinner animé centré sur l'écran
// Composant de chargement qui affiche un spinner animé
const Spinner = () => {
  return (
    // Conteneur centré qui prend toute la hauteur de l'écran
    <div className="flex justify-center items-center h-screen">
      {/* 
        Cercle de chargement avec animation :
        - animate-spin : rotation continue
        - border-t-2 border-b-2 : bordures supérieure et inférieure uniquement
        - border-purple-500 : couleur violette pour les bordures
      */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
};

export default Spinner; 