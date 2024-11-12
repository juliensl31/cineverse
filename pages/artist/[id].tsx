import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SeoMetadata from '../../components/SeoMetadata';
import Spinner from '../../components/Spinner';
import { FaInstagram, FaTwitter, FaTiktok, FaYoutube, FaGlobe } from 'react-icons/fa';
import ScrollableCards from '../../components/ScrollableCards';
import WikipediaExtract from '../../components/WikipediaExtract';

// Ajouter cette fonction utilitaire en haut du fichier
const calculateAge = (birthday: string, deathday: string | null): string => {
  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : new Date();
  const age = Math.floor((end.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  return deathday ? `${age} ans (décédé)` : `${age} ans`;
};

// Fonction de traduction
const translateDepartment = (department: string): string => {
  const translations: { [key: string]: string } = {
    'Acting': 'Acteur/Actrice',
    'Directing': 'Réalisation',
    'Production': 'Production',
    'Writing': 'Scénario',
    'Sound': 'Son',
    'Camera': 'Caméra',
    'Editing': 'Montage',
    'Art': 'Direction artistique',
    'Costume & Make-Up': 'Costume et Maquillage',
    'Crew': 'Équipe technique',
    'Visual Effects': 'Effets visuels',
    'Lighting': 'Éclairage',
    'Creator': 'Créateur/Créatrice'
  };

  return translations[department] || department;
};

// Interfaces pour les données
interface Artist {
  id: number; // Identifiant unique de l'artiste
  name: string; // Nom de l'artiste
  profile_path: string | null; // Chemin de l'affiche de l'artiste
  biography: string; // Biographie de l'artiste
  birthday: string | null; // Date de naissance de l'artiste
  deathday: string | null; // Date de décès de l'artiste
  place_of_birth: string | null; // Lieu de naissance de l'artiste
  known_for_department: string;
  external_ids: {
    instagram_id: string | null; // Identifiant Instagram de l'artiste
    twitter_id: string | null; // Identifiant Twitter de l'artiste
    tiktok_id: string | null; // Identifiant TikTok de l'artiste
    youtube_id: string | null; // Identifiant YouTube de l'artiste
  };
  homepage: string | null;
  gender: number; // 1 pour Femme, 2 pour Homme
}

interface Movie {
  id: number; // Identifiant unique du film
  title: string; // Titre du film
  poster_path: string; // Chemin de l'affiche du film
  character: string; // Rôle joué par l'artiste
  release_date: string; // Date de sortie du film
  vote_average: number; // Note moyenne du film
  overview: string; // Résumé du film
}

interface TVShow {
  id: number; // Identifiant unique de la série
  name: string; // Titre de la série
  poster_path: string; // Chemin de l'affiche de la série
  character: string; // Rôle joué par l'artiste
  first_air_date: string; // Date de première diffusion de la série
  vote_average: number; // Note moyenne de la série
  overview: string; // Résumé de la série
}

const ArtistPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [artist, setArtist] = useState<Artist | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!id) return;
      
      try {
        const [artistResponse, moviesResponse, tvResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR&append_to_response=external_ids`),
          fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`),
          fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`)
        ]);

        const [artistData, moviesData, tvData] = await Promise.all([
          artistResponse.json(),
          moviesResponse.json(),
          tvResponse.json()
        ]);

        // Tri des films et séries TV par popularité
        setArtist(artistData);
        const sortedMovies = moviesData.cast
          .sort((a: Movie, b: Movie) => b.vote_average - a.vote_average)
          .slice(0, 15);
        setMovies(sortedMovies);
        const sortedTvShows = tvData.cast
          .sort((a: TVShow, b: TVShow) => b.vote_average - a.vote_average)
          .slice(0, 15);
        setTvShows(sortedTvShows);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    // Charge les données de l'artiste
    fetchArtistData();
  }, [id]);

  // Si les données sont en cours de chargement, afficher un spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-primary">
        <Spinner />
      </div>
    );
  }

  // Si l'artiste n'est pas trouvé, afficher un message
  if (!artist) {
    return <div className="text-center text-white">Artiste non trouvé</div>;
  }

  return (
    <>
      {/* Métadonnées SEO */}
      <SeoMetadata 
        title={artist.name}
        description={artist.biography}
        image={`https://image.tmdb.org/t/p/w1280${artist.profile_path}`}
      />
      <main>
        <div className="relative z-10 container mx-auto px-12 py-36">
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/10">

          {/* En-tête de l'artiste */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Colonne gauche : Photo et réseaux sociaux */}
            <div className="w-full md:w-1/4">
              {/* Photo */}
              {artist.profile_path ? (
                <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
                    {artist.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${artist.profile_path}`}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gray-800 flex items-center justify-center">
                      <span className="text-4xl text-white/30">👤</span>
                    </div>
                  )}
                </div>
              ) : (
                // Si l'artiste n'a pas de photo, afficher un placeholder
                <div className="aspect-[2/3] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center">
                  <span className="text-4xl text-white/30">👤</span>
                </div>
              )}

              {/* Réseaux sociaux */}
                {(artist.external_ids.instagram_id || 
                artist.external_ids.twitter_id || 
                artist.external_ids.tiktok_id || 
                artist.external_ids.youtube_id || 
                artist.homepage) && (
                // Si l'artiste a au moins un réseau social ou un site officiel, afficher les boutons
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {artist.external_ids.instagram_id && (
                    <a
                      href={`https://instagram.com/${artist.external_ids.instagram_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gradient p-3 rounded-lg"
                      title="Instagram"
                    >
                      <FaInstagram className="w-5 h-5" />
                    </a>
                  )}
                  {artist.external_ids.twitter_id && (
                    <a
                      href={`https://twitter.com/${artist.external_ids.twitter_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gradient p-3 rounded-lg"
                      title="Twitter"
                    >
                      <FaTwitter className="w-5 h-5" />
                    </a>
                  )}
                  {artist.external_ids.tiktok_id && (
                    <a
                      href={`https://tiktok.com/@${artist.external_ids.tiktok_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gradient p-3 rounded-lg"
                      title="TikTok"
                    >
                      <FaTiktok className="w-5 h-5" />
                    </a>
                  )}
                  {artist.external_ids.youtube_id && (
                    <a
                      href={`https://youtube.com/channel/${artist.external_ids.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gradient p-3 rounded-lg"
                      title="YouTube"
                    >
                      <FaYoutube className="w-5 h-5" />
                    </a>
                  )}
                  {artist.homepage && (
                    <a
                      href={artist.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gradient p-3 rounded-lg"
                      title="Site officiel"
                    >
                      <FaGlobe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Colonne droite : Informations et biographie */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                {artist.name}
              </h1>

              {/* Informations en vignettes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {/* Métier */}
                {artist.known_for_department && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <span className="text-white/50 text-sm block">Profession</span>
                    <span className="text-white font-medium">
                      {translateDepartment(artist.known_for_department)}
                    </span>
                  </div>
                )}

                {/* Date de naissance */}
                {artist.birthday && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <span className="text-white/50 text-sm block">Date de naissance</span>
                    <span className="text-white font-medium">
                      {new Date(artist.birthday).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Lieu de naissance */}
                {artist.place_of_birth && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <span className="text-white/50 text-sm block">Lieu de naissance</span>
                    <span className="text-white font-medium">{artist.place_of_birth}</span>
                </div>
                )}

                {/* Genre */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <span className="text-white/50 text-sm block">Genre</span>
                  <span className="text-white font-medium">
                    {artist.gender === 1 ? 'Femme' : artist.gender === 2 ? 'Homme' : 'Non spécifié'}
                  </span>
                </div>

                {/* Date de décès */}
                {artist.deathday && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <span className="text-white/50 text-sm block">Date de décès</span>
                    <span className="text-white font-medium">
                    {new Date(artist.deathday).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                    </span>
                </div>
                )}

                {/* Âge */}
                {artist.birthday && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <span className="text-white/50 text-sm block">Âge</span>
                    <span className="text-white font-medium">
                      {calculateAge(artist.birthday, artist.deathday)}
                    </span>
                  </div>
                )}
              </div>

              {/* Biographie */}
              <WikipediaExtract 
                title={artist.name}
                fallbackDescription={artist.biography}
                type="artist"
              />
            </div>
          </div>

          {/* Films */}
          <ScrollableCards 
            title="Films" 
            items={movies} 
            type="movie" 
          />

          {/* Séries TV */}
          <ScrollableCards 
            title="Séries TV" 
            items={tvShows} 
            type="tv" 
          />
          </div>
        </div>
      </main>
    </>
  );
};

export default ArtistPage; 