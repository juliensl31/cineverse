import { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import SeoMetadata from '../components/SeoMetadata';
import SerieCard from '../components/SerieCard';
import Spinner from '../components/Spinner';
import SearchBar from '../components/SearchBar';
import Link from 'next/link';

// Interface pour définir la structure d'une série
interface Serie {
  id: number; // Identifiant unique de la série
  name: string; // titre de la série
  poster_path: string; // chemin de l'affiche de la série
  overview: string; // résumé de la série
  first_air_date: string; // date de première diffusion de la série
  vote_average: number; // note moyenne de la série
}

const Series: NextPage = () => {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<{id: number, name: string}[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedGenre');
      return saved ? parseInt(saved) : null;
    }
    return null;
  });
  const [selectedYear, setSelectedYear] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedYear');
      return saved ? parseInt(saved) : null;
    }
    return null;
  });

  // Charge les genres des séries au montage du composant
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    fetchGenres();
  }, []);

  // Fonction pour récupérer les séries selon les filtres
  const fetchSeries = useCallback(async (genre?: number) => {
    if (!page) return;
    
    const isFirstLoad = page === 1;
    isFirstLoad ? setLoading(true) : setIsLoadingMore(true);

    try {
      // Construction de l'URL avec les paramètres de filtrage
      const yearParam = selectedYear ? `&first_air_date_year=${selectedYear}` : '';
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR&include_adult=false${yearParam}${genre ? `&with_genres=${genre}` : ''}&page=${page}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Mise à jour des films selon si c'est un premier chargement ou "charger plus"
      setSeries(prevSeries => 
        isFirstLoad ? data.results : [...prevSeries, ...data.results]
      );
      setTotalPages(data.total_pages);

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [page, selectedYear]);

  // Déclencher la récupération des films quand le genre sélectionné change
  useEffect(() => {
    fetchSeries(selectedGenre || undefined);
  }, [selectedGenre, fetchSeries]);

  // Fonction pour charger plus de séries
  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  // Fonction pour gérer le changement de genre
  const handleGenreChange = (genreId: number | null) => {
    setSeries([]);
    setPage(1);
    setSelectedGenre(genreId);
    if (genreId) {
      localStorage.setItem('selectedGenre', genreId.toString());
    } else {
      localStorage.removeItem('selectedGenre');
    }
  };

  // Fonction pour gérer le changement d'année
  const handleYearChange = (year: number | null) => {
    setSeries([]);
    setPage(1);
    setSelectedYear(year);
    if (year) {
      localStorage.setItem('selectedYear', year.toString());
    } else {
      localStorage.removeItem('selectedYear');
    }
  };

  // Fonction pour réinitialiser les filtres
  const handleReset = () => {
    setSeries([]);
    setPage(1);
    setSelectedGenre(null);
    setSelectedYear(null);
    localStorage.removeItem('selectedGenre');
    localStorage.removeItem('selectedYear');
  };

  // Fonction pour gérer la recherche
  const handleSearch = async (query: string, type: string) => {
    setSeries([]);
    setPage(1);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR&query=${query}`
      );
      const data = await response.json();
      setSeries(data.results);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <>
        {/* Métadonnées SEO */}
      <SeoMetadata 
        title="Séries | CinéVerse"
        description="Découvrez notre catalogue complet de séries"
        image="/movie-icon.png"
      />

      <main className="min-h-screen bg-primary text-white p-8">
        <div className="container mx-auto">
          {/* En-tête de la page */}
          <div className="text-center mb-12">
            <h1 className="relative inline-block">
              <span className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text 
                bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 
                animate-gradient-x tracking-tight leading-tight">
                Catalogue des Séries
              </span>
              
              {/* Ligne décorative */}
              <span className="absolute -bottom-4 left-0 right-0 h-1 
                bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 
                rounded-full blur-sm opacity-80"></span>
            </h1>
            <p className="mt-8 text-lg text-gray-300 max-w-2xl mx-auto">
              Explorez notre sélection de séries et trouvez votre prochaine aventure cinématographique
            </p>
          </div>

            {/* Barre de recherche et filtres */}
            <div className="sticky top-0 z-50 bg-primary mb-8 py-4 ">
                <div className='mb-8'>
              <SearchBar onSearch={(query: string) => handleSearch(query, 'tv')} />
                </div>
       
            <div className="flex justify-center gap-4">

                {/* Lien Accueil - Redirige vers la page d'accueil */}
                <Link href="/" aria-label="Accueil" className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl ">
                    {/* Icône maison */}
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-white text-sm font-medium">Accueil</span>
                </Link>

              {/* Filtre de genre */}
              <select
                value={selectedGenre || ''}
                onChange={(e) => handleGenreChange(e.target.value ? parseInt(e.target.value) : null)}
                className={`px-4 py-2 rounded-xl bg-white/10 text-white ${
                  selectedGenre ? 'btn-gradient' : ''
                }`}
              >
                <option value="">Tous les genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              {/* Filtre d'année */}
              <select
                value={selectedYear || ''}
                onChange={(e) => handleYearChange(e.target.value ? parseInt(e.target.value) : null)}
                className={`px-4 py-2 rounded-xl bg-white/10 text-white ${
                  selectedYear ? 'btn-gradient' : ''
                }`}
              >
                <option value="">Toutes les années</option>
                {Array.from({ length: 150 }, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Bouton de réinitialisation */}
              {(selectedGenre || selectedYear) && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 
                  transition-all duration-300 ease-in-out border border-white/10 hover:border-white/20
                  flex items-center gap-2 hover:scale-105"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Spinner de chargement */}
          {loading ? (
            <Spinner />
          ) : (
            // Grille de films
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {series.map((series) => (
                <SerieCard key={series.id} series={series} />
              ))}
            </div>
          )}

          {/* Bouton "Charger plus" */}
          {!loading && !isLoadingMore && page < totalPages && series.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-3 rounded-xl btn-gradient hover:opacity-90 transition-opacity w-full"
              >
                Charger plus de films
              </button>
            </div>
          )}

          {/* Message si aucun film trouvé */}
          {!loading && series.length === 0 && (
            <div className="text-center mt-8 text-gray-400">
              Aucun film trouvé pour ces critères
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Series;