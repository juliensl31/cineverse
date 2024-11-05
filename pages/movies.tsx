import { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import SeoMetadata from '../components/SeoMetadata';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import SearchBar from '../components/SearchBar';

// Ajoutez cette interface au début du fichier, avant le composant Movies
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview?: string;
  release_date: string;
  vote_average: number;
}

const Movies: NextPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<{id: number, name: string}[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    fetchGenres();
  }, []);

  const fetchMovies = useCallback(async (genre?: number) => {
    if (!page) return;
    
    const isFirstLoad = page === 1;
    isFirstLoad ? setLoading(true) : setIsLoadingMore(true);

    try {
      const yearParam = selectedYear ? `&primary_release_year=${selectedYear}` : '';
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR&include_adult=false${yearParam}${genre ? `&with_genres=${genre}` : ''}&page=${page}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      setMovies(prevMovies => 
        isFirstLoad ? data.results : [...prevMovies, ...data.results]
      );
      setTotalPages(data.total_pages);

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [page, selectedYear]);

  useEffect(() => {
    fetchMovies(selectedGenre || undefined);
  }, [selectedGenre, fetchMovies]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handleGenreChange = (genreId: number | null) => {
    setMovies([]);
    setPage(1);
    setSelectedYear(null);
    setSelectedGenre(genreId);
  };

  const handleYearChange = (year: number | null) => {
    setMovies([]);
    setPage(1);
    setSelectedYear(year);
  };

  const handleReset = () => {
    setMovies([]);
    setPage(1);
    setSelectedGenre(null);
    setSelectedYear(null);
  };

  const handleSearch = async (query: string, type: string) => {
    setMovies([]);
    setPage(1);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR&query=${query}`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <>
      <SeoMetadata 
        title="Films | CinéVerse"
        description="Découvrez notre catalogue complet de films"
        image="/movie-icon.png"
      />

      <main className="min-h-screen bg-primary text-white p-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="relative inline-block">
              <span className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text 
                bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 
                animate-gradient-x tracking-tight leading-tight">
                Catalogue des Films
              </span>
              
              {/* Ligne décorative en dessous */}
              <span className="absolute -bottom-4 left-0 right-0 h-1 
                bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 
                rounded-full blur-sm opacity-80"></span>
            </h1>

            {/* Sous-titre optionnel */}
            <p className="mt-8 text-lg text-gray-300 max-w-2xl mx-auto">
              Explorez notre sélection de films et trouvez votre prochaine aventure cinématographique
            </p>
          </div>

            {/* SearchBar */}
            <div className="sticky top-0 z-50 bg-primary py-4">
              <SearchBar onSearch={(query: string) => handleSearch(query, 'movie')} />
            </div>
          
          <div className="mb-8">
            <div className="flex justify-center gap-4">
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

          {loading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}

          {!loading && !isLoadingMore && page < totalPages && movies.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-3 rounded-xl btn-gradient hover:opacity-90 transition-opacity"
              >
                Charger plus de films
              </button>
            </div>
          )}

          {!loading && movies.length === 0 && (
            <div className="text-center mt-8 text-gray-400">
              Aucun film trouvé pour ces critères
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Movies; 