import { useState, useEffect } from 'react';

interface AgeRatingProps {
  id: number;
  type: 'movie' | 'tv';
}

interface ReleaseData {
  results: Array<{
    iso_3166_1: string;
    release_dates?: Array<{
      certification: string;
    }>;
    rating?: string;
  }>;
}

const AgeRating = ({ id, type }: AgeRatingProps) => {
  const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const endpoint = type === 'movie' 
          ? `https://api.themoviedb.org/3/movie/${id}/release_dates`
          : `https://api.themoviedb.org/3/tv/${id}/content_ratings`;
        
        const response = await fetch(
          `${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();
        setReleaseData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la classification:', error);
      }
    };

    if (id) {
      fetchRating();
    }
  }, [id, type]);

  const getRating = () => {
    if (!releaseData?.results?.length) return 'NR';

    // Chercher la classification française
    const frenchResult = releaseData.results.find(r => r.iso_3166_1 === 'FR');
    if (type === 'movie' && frenchResult?.release_dates?.[0]?.certification) {
      return frenchResult.release_dates[0].certification;
    }
    if (type === 'tv' && frenchResult?.rating) {
      return frenchResult.rating;
    }

    // Chercher la première classification disponible
    const firstValidResult = releaseData.results.find(result => 
      type === 'movie' 
        ? result.release_dates?.[0]?.certification
        : result.rating
    );

    if (type === 'movie' && firstValidResult?.release_dates?.[0]?.certification) {
      return firstValidResult.release_dates[0].certification;
    }
    if (type === 'tv' && firstValidResult?.rating) {
      return firstValidResult.rating;
    }

    return 'NR';
  };

  const rating = getRating();

  const getRatingInfo = (rating: string): { label: string | null, colorClass: string } => {
    switch (rating.toUpperCase()) {
      case 'U':
      case 'G':
      case 'TV-G':
      case 'NR':
      case '10':
      case 'ALL':
        return {
          label: 'Tous publics',
          colorClass: 'bg-emerald-400/10 text-emerald-400'
        };

      case '12':
      case 'PG':
      case 'PG-12':
      case 'TV-PG':
        return {
          label: '-12',
          colorClass: 'bg-amber-400/10 text-amber-400'
        };

      case '14':
      case '16':
      case 'TV-14':
      case 'R':
        return {
          label: '-16',
          colorClass: 'bg-orange-400/10 text-orange-400'
        };

      case '18':
      case 'NC-17':
      case 'TV-MA':
      case 'X':
        return {
          label: '-18',
          colorClass: 'bg-rose-400/10 text-rose-400'
        };

      default:
        return {
          label: null,
          colorClass: ''
        };
    }
  };

  const ratingInfo = getRatingInfo(rating);
  const isTousPublics = ratingInfo.label === 'Tous publics';

  return (
    <div className={`
      inline-flex items-center justify-center font-semibold text-sm rounded-full
      ${isTousPublics ? 'px-3 h-8' : 'w-10 h-10'}
      ${ratingInfo.colorClass}
    `}>
      {ratingInfo.label}
    </div>
  );
};

export default AgeRating;