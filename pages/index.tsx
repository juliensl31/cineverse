import type { NextPage } from 'next'
import Head from 'next/head'
import Spinner from '../components/Spinner';
import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import SerieCard from '../components/SerieCard';

//Interface pour les données de films reçues de l'API TMDB
interface Movie {
  id: number; // Identifiant unique du film
  title: string; // Titre du film
  poster_path: string; // Chemin de l'affiche du film
  overview: string; // Résumé du film
  release_date: string; // Date de sortie du film
  vote_average: number; // Note moyenne du film
}

// Interface pour les données des séries reçues de l'API TMDB
interface Serie {
  id: number; // Identifiant unique de la série
  name: string; // titre de la série
  poster_path: string; // chemin de l'affiche de la série
  overview: string; // résumé de la série
  first_air_date: string; // date de première diffusion de la série
  vote_average: number; // note moyenne de la série
}

// Type pour le type de recherche
type SearchType = 'movie' | 'tv' | 'person';

// Composant principal de la page d'accueil
const Home: NextPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);

  // Charge les films à l'affiche au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, sciFiFantasyResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR&page=1`),
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&with_genres=10765&page=1`)
        ]);
        // Récupérer les données des films et des séries
        const [moviesData, seriesData] = await Promise.all([
          moviesResponse.json(),
          sciFiFantasyResponse.json()
        ]);
        // Récupérer les 10 premiers films et séries
        setMovies(moviesData.results.slice(0, 10));
        setSeries(seriesData.results.slice(0, 10));
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Fonction pour rechercher des films ou séries
  const handleSearch = async (query: string, type: SearchType) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR&query=${query}&page=1`
      );
      const data = await response.json();
      
      if (type === 'movie') {
        setMovies(data.results.slice(0, 10));
        setSeries([]); // Vider les séries
      } else if (type === 'tv') {
        setSeries(data.results.slice(0, 10));
        setMovies([]); // Vider les films
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SEO et métadonnées */}
      <Head>
        {/* Titre de la page */}
        <title>CinéVerse | Votre univers cinématographique</title>
        {/* Description de la page */}
        <meta name="description" content="Explorez les films populaires, découvrez les dernières sorties et créez votre watchlist personnalisée" />
        {/* Métadonnées OpenGraph */}
        <meta property="og:title" content="CinéVerse | Votre univers cinématographique" />
        <meta property="og:description" content="Explorez les films populaires, découvrez les dernières sorties et créez votre watchlist personnalisée" />
        <meta property="og:image" content="/movie-icon.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CinéVerse" />
        {/* Métadonnées Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="CinéVerse | Votre univers cinématographique" />
        <meta name="twitter:description" content="Explorez les films populaires, découvrez les dernières sorties et créez votre watchlist personnalisée" />
        <meta name="twitter:image" content="/movie-icon.png" />
        {/* Icône de la page */}
        <link rel="icon" href="/movie-icon.png" type="image/png" />
      </Head>
      {/* Conteneur principal */}
      <main className="min-h-screen h-full w-full p-4 bg-primary text-white">
      <div className='container mx-auto px-4 py-12 min-h-screen'>
          {/* Titre et description */}
          <div className="text-center space-y-6 mb-16">
            <h1 className='relative text-6xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 
              animate-gradient-x tracking-tight leading-tight'>
              CinéVerse
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 md:w-40 lg:w-48 h-1.5 
                bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 
                rounded-full blur-sm"></span>
            </h1>
            <p className='text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 font-medium 
              tracking-wide animate-fade-in-up max-w-3xl mx-auto'>
              Explorez l&apos;univers infini du cinéma
            </p>
          </div>
        
      {/* SearchBar */}
      <div className="mt-8 mb-12">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Affiche un spinner pendant le chargement, sinon la grille de films */}
      {loading ? (
        <div className="flex justify-center mt-12">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-16">
          {/* Section Films */}
          <section>
            <h2 className="text-3xl text-center font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 tracking-wide">
              Films à l&apos;affiche
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          {/* Section Séries */}
          <section>
            <h2 className="text-3xl text-center font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 tracking-wide">
              Séries
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {series.map((series) => (
                <SerieCard key={series.id} series={series} />
              ))}
            </div>
          </section>
        </div>
      )}
      </div>
      </main>
    </>
  )
}

export default Home
