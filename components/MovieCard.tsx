import { useRouter } from 'next/router';
import Rated from './Rated';
interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  };
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const router = useRouter();

  return (
    <div 
      className="flex flex-col group cursor-pointer" 
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden rounded-xl shadow-md transition-all duration-500 
        hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-2">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover brightness-95 group-hover:brightness-105 
            transition-all duration-500 scale-100 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        </div>
        {/* Badge de note */}
        <div className="absolute top-3 right-3">
          <Rated movie={movie} />
        </div>
      </div>

      {/* Infos sous l'image */}
      <div className="mt-4 px-1 space-y-1">
        <h3 className="font-semibold text-lg leading-tight line-clamp-1 
          group-hover:text-purple-600 transition-colors duration-300">
          {movie.title}
        </h3>
        <span className="text-sm text-gray-500 font-medium transform origin-left 
          group-hover:scale-105 transition-transform duration-300">
          {new Date(movie.release_date).getFullYear()}
        </span>
      </div>
    </div>
  );
};

export default MovieCard; 