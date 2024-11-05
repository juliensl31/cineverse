import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Spinner from '../../components/Spinner';
import { FaInstagram, FaTwitter, FaTiktok, FaYoutube, FaGlobe } from 'react-icons/fa';
import Rated from '../../components/Rated';

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
  id: number;
  name: string;
  profile_path: string | null;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  external_ids: {
    instagram_id: string | null;
    twitter_id: string | null;
    tiktok_id: string | null;
    youtube_id: string | null;
  };
  homepage: string | null;
  gender: number; // 1 pour Femme, 2 pour Homme
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  character: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  character: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
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

        setArtist(artistData);
        setMovies(moviesData.cast.slice(0, 15));
        setTvShows(tvData.cast.slice(0, 15));
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-primary">
        <Spinner />
      </div>
    );
  }

  if (!artist) {
    return <div className="text-center text-white">Artiste non trouvé</div>;
  }

  return (
    <>
      <Head>
        <title>{`${artist.name} | CinéVerse`}</title>
        <meta name="description" content={`Découvrez la biographie et la filmographie de ${artist.name}`} />
      </Head>

      <main className="min-h-screen bg-[#030014]">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête de l'artiste */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Colonne gauche : Photo et réseaux sociaux */}
            <div className="w-full md:w-1/4">
              {/* Photo */}
              {artist.profile_path ? (
                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${artist.profile_path}`}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
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

                {/* Genre */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <span className="text-white/50 text-sm block">Genre</span>
                  <span className="text-white font-medium">
                    {artist.gender === 1 ? 'Femme' : artist.gender === 2 ? 'Homme' : 'Non spécifié'}
                  </span>
                </div>

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

                {/* Âge */}
                {artist.birthday && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <span className="text-white/50 text-sm block">Âge</span>
                    <span className="text-white font-medium">
                      {calculateAge(artist.birthday, artist.deathday)}
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
              </div>

              {/* Biographie */}
              {artist.biography && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-4 text-white">
                    Biographie
                  </h2>
                  <p className="text-white/80 leading-relaxed whitespace-pre-line">
                    {artist.biography}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Films */}
          
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white mb-8">Films</h2>
              <div className="overflow-x-auto pb-6 
                            [&::-webkit-scrollbar]:h-2
                            [&::-webkit-scrollbar-track]:rounded-full
                            [&::-webkit-scrollbar-track]:bg-white/10
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-white/40
                            [&::-webkit-scrollbar-thumb:hover]:bg-white/50">
                <div className="flex gap-6 min-w-max px-1">
                    {movies.slice(0, 10).map(film => (
                        <div
                            key={film.id}
                            className="w-[200px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                            onClick={() => router.push(`/movie/${film.id}`)}
                        >
                            <div className="aspect-[2/3] relative overflow-hidden">
                                {film.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                                        alt={film.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <span className="text-4xl text-white/30">🎬</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-4">
                                <h3 className="text-white font-semibold text-lg truncate">
                                    {film.title}
                                </h3>
                                <div className="absolute top-3 right-3">
                                    <Rated movie={film} />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-white/50 text-sm">
                                        {new Date(film.release_date).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          

          {/* Séries TV */}
          {tvShows.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white mb-8">Séries TV</h2>
              <div className="overflow-x-auto pb-6 
                            [&::-webkit-scrollbar]:h-2
                            [&::-webkit-scrollbar-track]:rounded-full
                            [&::-webkit-scrollbar-track]:bg-white/10
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-white/40
                            [&::-webkit-scrollbar-thumb:hover]:bg-white/50">
                <div className="flex gap-6 min-w-max px-1">
                    {tvShows.map(show => (
                        <div
                            key={show.id}
                            className="w-[200px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                            onClick={() => router.push(`/tv/${show.id}`)}
                        >
                            <div className="aspect-[2/3] relative overflow-hidden">
                                {show.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                        alt={show.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <span className="text-4xl text-white/30">📺</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-4">
                                <h3 className="text-white font-semibold text-lg truncate">
                                    {show.name}
                                </h3>
                                <div className="absolute top-3 right-3">
                                    <Rated movie={show} />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-white/50 text-sm">
                                        {show.first_air_date && new Date(show.first_air_date).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[#030014] to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[#030014] to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ArtistPage; 