import { useRouter } from 'next/router';
import Rated from './Rated';
import AgeRating from './AgeRating';

// Props pour le composant MovieCard
interface MovieCardProps {
  movie: {
    id: number; // Identifiant unique du film
    title: string; // Titre du film
    poster_path: string; // Chemin de l'affiche du film
    release_date: string; // Date de sortie du film
    vote_average: number; // Note moyenne du film
  };
}

// Carte cliquable affichant les informations d'un film (poster, titre, année, note)
const MovieCard = ({ movie }: MovieCardProps) => {
  const router = useRouter();

  return (
    <div 
      // Conteneur pour la carte du film
      className="flex flex-col group cursor-pointer" 
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      {/* Poster du film avec effets au survol */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md transition-all duration-500 
        hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-2">
        {/* Image du film */}
        {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full object-cover brightness-95 group-hover:brightness-105 
            transition-all duration-500 scale-100 group-hover:scale-110"
          loading="lazy"
        />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-4xl text-white/30">🎬</span>
          </div>
        )}
        {/* Filtre de couleur au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        </div>
        {/* Note du film */}
        <div className="absolute top-3 right-3">
          <Rated movie={movie} />
        </div>
      </div>

      {/* Titre, année de sortie et classification d'âge */}
      <div className="mt-4 px-1">
        {/* Titre */}
        <div className="flex items-center gap-2">
          <h3 className="flex-1 font-semibold text-lg leading-tight line-clamp-1 
            group-hover:text-purple-600 transition-colors duration-300">
            {movie.title}
          </h3>
          {/* Classification d'âge */}
          <div className="flex-shrink-0">
            <AgeRating id={movie.id} type="movie" />
          </div>
        </div>
        {/* Année de sortie */}
        <span className="text-sm text-gray-500 font-medium transform origin-left 
          group-hover:scale-105 transition-transform duration-300 block mt-1">
          {new Date(movie.release_date).getFullYear()}
        </span>
      </div>
    </div>
  );
};

export default MovieCard; 