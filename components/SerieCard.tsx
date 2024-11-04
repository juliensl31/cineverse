import React from 'react';
import { useRouter } from 'next/router';
import Rated from './Rated';

interface SeriesProps {
  series: {
    id: number;
    name: string;
    poster_path: string;
    vote_average: number;
    first_air_date: string;
  };
}

const SeriesCard = ({ series }: SeriesProps) => {
    const router = useRouter();
    
    return (
        <div 
          // Conteneur pour la carte du film
          className="flex flex-col group cursor-pointer" 
          onClick={() => router.push(`/serie/${series.id}`)}
        >
          {/* Poster du film avec effets au survol */}
          <div className="relative overflow-hidden rounded-xl shadow-md transition-all duration-500 
            hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-2">
            {/* Image du film */}
            <img
           src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
          alt={series.name}
              className="w-full aspect-[2/3] object-cover brightness-95 group-hover:brightness-105 
                transition-all duration-500 scale-100 group-hover:scale-110"
              loading="lazy"
            />
            {/* Filtre de couleur au survol */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            {/* Note de la série */}
            <div className="absolute top-3 right-3">
              <Rated movie={series} />
            </div>
          </div>
    
          {/* Titre et année de sortie */}
          <div className="mt-4 px-1 space-y-1">
            <h3 className="font-semibold text-lg leading-tight line-clamp-1 
              group-hover:text-purple-600 transition-colors duration-300">
              {series.name}
            </h3>
            {/* Année de sortie */}
            <span className="text-sm text-gray-500 font-medium transform origin-left 
              group-hover:scale-105 transition-transform duration-300">
              {new Date(series.first_air_date).getFullYear()}
            </span>
          </div>
        </div>
      );
    };

export default SeriesCard; 