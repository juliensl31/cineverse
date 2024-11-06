import { useRouter } from 'next/router';
import Rated from './Rated';
import AgeRating from './AgeRating';

// Interface pour les cartes de base
interface BaseCard {
  id: number; // Identifiant unique de l'élément
  name?: string; // Nom de l'élément
  title?: string; // Titre de l'élément
  profile_path?: string | null; // Chemin de l'affiche de l'élément
  poster_path?: string | null; // Chemin de l'affiche de l'élément
  character?: string; // Rôle joué par l'élément
  release_date?: string; // Date de sortie
  first_air_date?: string;
  vote_average?: number;
}

// Interface pour les props du composant
interface ScrollableCardsProps {
  title: string; // Titre de la section
  items: BaseCard[]; // Liste des éléments à afficher
  type: 'movie' | 'tv' | 'person'; // Type de média
  limit?: number; // Nombre maximum d'éléments à afficher
}

// Composant pour les cartes scrollables
const ScrollableCards = ({ title, items, type, limit = 15 }: ScrollableCardsProps) => {
  const router = useRouter();

  // Fonction pour obtenir le chemin de l'affiche
  const getImagePath = (item: BaseCard) => {
    if (type === 'person') return item.profile_path;
    return item.poster_path;
  };

  // Fonction pour obtenir le nom de l'élément
  const getName = (item: BaseCard) => {
    if (type === 'movie') return item.title;
    return item.name;
  };

  // Fonction pour obtenir l'année de sortie
  const getYear = (item: BaseCard) => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  // Fonction pour obtenir le lien vers la page détaillée
  const getLink = (id: number) => {
    switch (type) {
      case 'movie':
        return `/movie/${id}`;
      case 'tv':
        return `/serie/${id}`;
      case 'person':
        return `/artist/${id}`;
    }
  };

  // Fonction pour obtenir l'icône de remplacement
  const getPlaceholderIcon = () => {
    switch (type) {
      case 'movie':
        return '🎬';
      case 'tv':
        return '📺';
      case 'person':
        return '👤';
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>
      
      {/* Conteneur pour les cartes scrollables */}
      <div className="relative">
        <div className="overflow-x-auto pb-6 
                      [&::-webkit-scrollbar]:h-2
                      [&::-webkit-scrollbar-track]:rounded-full
                      [&::-webkit-scrollbar-track]:bg-white/10
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:bg-white/40
                      [&::-webkit-scrollbar-thumb:hover]:bg-white/50">
          <div className="flex gap-6 min-w-max px-1">
            {items.slice(0, limit).map(item => (
              <div
                key={item.id}
                className="w-[180px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                onClick={() => router.push(getLink(item.id))}
              >
                {/* Conteneur pour l'affiche */}
                <div className="aspect-[2/3] relative overflow-hidden">
                  {getImagePath(item) ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${getImagePath(item)}`}
                      alt={getName(item)}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    // Carte de remplacement
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-4xl text-white/30">{getPlaceholderIcon()}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Conteneur pour le titre et le rôle */}
                <div className="p-4">
                  {/* Titre */}
                  <h3 className="text-white font-semibold text-lg truncate">
                    {getName(item)}
                  </h3>
                  {/* Rôle */}
                  {item.character && (
                    <p className="text-white/60 text-sm mt-1 truncate">
                      {item.character}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 mt-2">
                    {/* Année de sortie */}
                    {getYear(item) && (
                      <span className="text-white/50 text-sm">
                        {getYear(item)}
                      </span>
                    )}
                    {/* Note du film ou de la série */}
                    {(type === 'movie' || type === 'tv') && item.vote_average && (
                      <div className="absolute top-3 right-3">
                        <Rated movie={{ vote_average: item.vote_average }} />
                      </div>
                    )}
                    {/* Classification d'âge */}
                    {(type === 'movie' || type === 'tv') && item.id && (
                      <div className="flex-shrink-0">
                        <AgeRating id={item.id} type={type} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Gradient de gauche */}  
        <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[#030014] to-transparent pointer-events-none" />
        {/* Gradient de droite */}
        <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[#030014] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default ScrollableCards; 