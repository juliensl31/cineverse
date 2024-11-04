import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Spinner from '../../components/Spinner';
import Rated from '../../components/Rated';
import Navigation from '../../components/Navigation';
import Head from 'next/head';

//Interface décrivant la structure des données d'un film
 interface MovieDetails {
    id: number;              // Identifiant unique du film
    title: string;           // Titre du film
    overview: string;        // Synopsis
    backdrop_path: string;   // Chemin de l'image de fond
    poster_path: string;     // Chemin de l'affiche
    release_date: string;    // Date de sortie
    runtime: number;         // Durée en minutes
    vote_average: number;    // Note moyenne
    genres: {               // Liste des genres
        id: number;          // Identifiant unique du genre
        name: string;        // Nom du genre   
    }[];
    budget: number;          // Budget du film
    revenue: number;         // Recettes du film
    videos: {               // Vidéos associées (bandes-annonces, etc.)
        results: {          // Liste de vidéos
            key: string;      // Clé de la vidéo
            type: string;     // Type de la vidéo
            site: string;     // Site hébergeant la vidéo
        }[];
    };
    credits: {             // Distribution et équipe
        cast: Array<{      // Acteurs
            id: number;     // Identifiant unique de l'acteur
            name: string;   // Nom de l'acteur
            character: string; // Rôle joué
            profile_path: string | null; // Chemin de l'affiche de l'acteur
            order: number; // Ordre d'affichage
            popularity: number; // Popularité de l'acteur
        }>;
        crew: Array<{      // Équipe technique
            id: number;     // Identifiant unique de l'équipier
            name: string;   // Nom de l'équipier
            job: string;    // Fonction dans l'équipe
            department: string; // Département
            profile_path: string | null; // Chemin de l'affiche de l'équipier
            popularity: number; // Popularité de l'équipier
        }>;
    };
    recommendations: {     // Films recommandés
        results: Array<{     // Liste de films recommandés
            id: number;       // Identifiant unique du film recommandé
            title: string;   // Titre du film recommandé
            poster_path: string | null; // Chemin de l'affiche du film recommandé
            vote_average: number; // Note moyenne du film recommandé
            release_date: string; // Date de sortie du film recommandé
        }>;
    };
}

// Composant principal de la page de détail d'un film
export default function MoviePage() {
    // États locaux
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Router Next.js pour la navigation et récupération de l'ID
    const router = useRouter();
    const { id } = router.query;

    // Effectue les appels API nécessaires lors du chargement de la page
    useEffect(() => {
        if (id) {
            setLoading(true);
            // Appels API parallèles pour récupérer toutes les données
            Promise.all([
                // Détails du film
                fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`),
                // Vidéos (bandes-annonces)
                fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`),
                // Distribution et équipe
                fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`),
                // Recommandations
                fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`)
            ])
                .then(([movieRes, videosRes, creditsRes, recommendationsRes]) =>
                    Promise.all([
                        movieRes.json(),
                        videosRes.json(),
                        creditsRes.json(),
                        recommendationsRes.json()
                    ])
                )
                .then(([movieData, videosData, creditsData, recommendationsData]) => {
                    // Fusion des données dans un seul objet
                    setMovie({
                        ...movieData,
                        videos: videosData,
                        credits: creditsData,
                        recommendations: recommendationsData
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Erreur lors du chargement des données :', error);
                    setLoading(false);
                });
        }
    }, [id]);

    // Recherche de la bande-annonce YouTube
    const trailer = movie?.videos?.results.find(
        video => video.type === "Trailer" && video.site === "YouTube"
    );

    // Affichage du loader pendant le chargement
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black">
                <Spinner />
            </div>
        );
    }

    // Protection contre l'absence de données
    if (!movie) return null;

    return (
        <>
            {/* SEO et métadonnées */}
            <Head>
                {/* Titre de la page */}
                <title>{movie.title} - Détails du film</title>
                {/* Description de la page */}
                <meta name="description" content={movie.overview?.slice(0, 155) + '...'} />
                {/* Métadonnées OpenGraph */}
                <meta property="og:title" content={`${movie.title} - Détails du film`} />
                <meta property="og:description" content={movie.overview?.slice(0, 155) + '...'} />
                <meta property="og:image" content={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} />
                <meta property="og:type" content="video.movie" />
                <meta property="og:site_name" content="CinéVerse" />
                {/* Métadonnées Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={movie.title} />
                <meta name="twitter:description" content={movie.overview?.slice(0, 155) + '...'} />
                <meta name="twitter:image" content={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} />
                <meta name="theme-color" content="#000000" />
                {/* Icône de la page */}
                <link rel="icon" href="/movie-icon.png" type="image/png" />
            </Head>

            {/* Barre de navigation */}
            <Navigation />

            {/* Contenu principal */}
            <main className="relative min-h-screen w-full">
                {/* Background dynamique */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 w-screen h-screen">
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt=""
                            className="w-full h-full object-cover animate-fade-in"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                        <div className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%)'
                            }}
                        />
                    </div>
                </div>

                {/* Contenu */}
                <div className="relative z-10 container mx-auto px-12 py-36">
                    <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/10">
                        {/* En-tête */}
                        <div className="flex flex-col md:flex-row gap-8 mb-12">
                            <div className="w-full md:w-80 flex-shrink-0">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="flex-1 text-white">
                                <h1 className="text-4xl md:text-5xl font-bold mb-6">{movie.title}</h1>

                                <div className="flex flex-wrap items-center gap-6 text-lg mb-8">
                                    {/* Badge de note */}
                                    <Rated movie={movie} />
                                    {/* Date de sortie */}
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                    {/* Durée */}
                                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
                                </div>

                                {/* Genres */}
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {movie.genres.map(genre => (
                                        <span
                                            key={genre.id}
                                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Synopsis */}
                                <div className='bg-black/30 p-6 rounded-xl'>
                                    <h2 className='text-xl font-bold mb-3'>Synopsis</h2>
                                    <p className='text-gray-300 leading-relaxed'>{movie.overview}</p>
                                </div>

                                {/* Équipe de réalisation */}
                                <div className='bg-black/30 p-6 rounded-xl mt-6'>
                                    <h2 className='text-xl font-bold mb-3'>Réalisation</h2>
                                    <div className='flex flex-wrap gap-x-6 gap-y-2'>
                                        {movie.credits.crew
                                            .filter(member => ['Director', 'Producer', 'Screenplay'].includes(member.job))
                                            .map(member => (
                                                <div key={member.id} className='text-gray-300'>
                                                    <span className='text-white font-medium'>{member.name}</span>
                                                    <span className='text-gray-400 ml-2'>
                                                        ({member.job === 'Director' ? 'Réalisateur' : 
                                                          member.job === 'Producer' ? 'Producteur' : 
                                                          member.job === 'Screenplay' ? 'Scénariste' : 
                                                          member.job})
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trailer et Infos */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {trailer && (
                                <div className="lg:col-span-2 bg-white/5 rounded-2xl overflow-hidden">
                                    <div className="aspect-video">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${trailer.key}`}
                                            title="Bande-annonce"
                                            className="w-full h-full"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            {/* Informations */}    
                            <div className={`space-y-6 ${!trailer ? 'w-full' : ''}`}>
                                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                                    <h3 className="text-2xl font-semibold text-white mb-6">Informations</h3>
                                    <div className="space-y-6">
                                        {/* Statistiques financières */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-xl">
                                                <div className="text-gray-400 text-sm">Budget</div>
                                                <div className="text-white text-xl font-medium">
                                                    {movie.budget > 0
                                                        ? new Intl.NumberFormat('fr-FR', {
                                                            style: 'currency',
                                                            currency: 'EUR',
                                                            maximumFractionDigits: 0,
                                                            notation: "compact",
                                                            compactDisplay: "long"
                                                        }).format(movie.budget)
                                                        : 'Non communiqué'}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-xl">
                                                <div className="text-gray-400 text-sm">Recettes</div>
                                                <div className="text-white text-xl font-medium">
                                                    {movie.revenue > 0
                                                        ? new Intl.NumberFormat('fr-FR', {
                                                            style: 'currency',
                                                            currency: 'EUR',
                                                            maximumFractionDigits: 0,
                                                            notation: "compact",
                                                            compactDisplay: "long"
                                                        }).format(movie.revenue)
                                                        : 'Non communiqué'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rentabilité */}
                                        {movie.budget > 0 && movie.revenue > 0 && (
                                            <div className="bg-white/5 p-4 rounded-xl">
                                                <div className="text-gray-400 text-sm mb-2">Rentabilité</div>
                                                <div className="flex items-center gap-3">
                                                    <div className={`text-xl font-medium ${movie.revenue > movie.budget ? 'text-green-400' : 'text-red-400'}`}>
                                                        {((movie.revenue - movie.budget) / movie.budget * 100).toFixed(0)}%
                                                    </div>
                                                    <span className="text-gray-400">
                                                        ({movie.revenue > movie.budget ? 'Bénéfice' : 'Perte'})
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Date de sortie détaillée */}
                                        <div className="bg-white/5 p-4 rounded-xl">
                                            <div className="text-gray-400 text-sm mb-2">Date de sortie</div>
                                            <div className="text-white">
                                                {new Date(movie.release_date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        {/* Statut de production */}
                                        <div className="bg-white/5 p-4 rounded-xl">
                                            <div className="text-gray-400 text-sm mb-2">Statut</div>
                                            <div className="inline-flex px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                                                Sorti en salles
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Distribution */}
                        <div className="mt-16">
                            <h2 className="text-3xl font-bold text-white mb-8">Distribution</h2>

                            {/* Acteurs principaux avec défilement horizontal */}
                            <div className="relative">
                                <div className="overflow-x-auto pb-6 
                                                [&::-webkit-scrollbar]:h-2
                                                [&::-webkit-scrollbar-track]:rounded-full
                                                [&::-webkit-scrollbar-track]:bg-white/10
                                                [&::-webkit-scrollbar-thumb]:rounded-full
                                                [&::-webkit-scrollbar-thumb]:bg-white/40
                                                [&::-webkit-scrollbar-thumb:hover]:bg-white/50">
                                    <div className="flex gap-6 min-w-max px-1">
                                        {movie.credits.cast
                                            .slice(0, 15)
                                            .map(actor => (
                                                <div
                                                    key={actor.id}
                                                    className="w-[180px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300"
                                                >
                                                    <div className="aspect-[2/3] relative overflow-hidden">
                                                        {actor.profile_path ? (
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                                                                alt={actor.name}
                                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                                <span className="text-4xl text-white/30">👤</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </div>

                                                    <div className="p-4">
                                                        <h3 className="text-white font-semibold text-lg truncate">
                                                            {actor.name}
                                                        </h3>
                                                        <p className="text-white/60 text-sm mt-1 truncate">
                                                            {actor.character}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[#030014] to-transparent pointer-events-none" />
                                <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[#030014] to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* Recommandations */}
                        <div className="mt-16">
                            <h2 className="text-3xl font-bold text-white mb-8">Recommandations</h2>

                            <div className="overflow-x-auto pb-6 
                                            [&::-webkit-scrollbar]:h-2
                                            [&::-webkit-scrollbar-track]:rounded-full
                                            [&::-webkit-scrollbar-track]:bg-white/10
                                            [&::-webkit-scrollbar-thumb]:rounded-full
                                            [&::-webkit-scrollbar-thumb]:bg-white/40
                                            [&::-webkit-scrollbar-thumb:hover]:bg-white/50">
                                <div className="flex gap-6 min-w-max px-1">
                                    {movie.recommendations.results.slice(0, 10).map(film => (
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
                    </div>
                </div>
            </main>
        </>
    );
} 