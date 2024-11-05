import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Spinner from '../../components/Spinner';
import Rated from '../../components/Rated';
import Navigation from '../../components/Navigation';
import SeoMetadata from '../../components/SeoMetadata';
import ScrollableCards from '../../components/ScrollableCards';

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
            <SeoMetadata 
                title={movie.title}
                description={movie.overview}
                image={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            />

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
                                                <div 
                                                    key={member.id} 
                                                    className='text-gray-300 cursor-pointer hover:text-white transition-colors'
                                                    onClick={() => router.push(`/artist/${member.id}`)}
                                                >
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
                        <ScrollableCards 
                            title="Distribution" 
                            items={movie.credits.cast} 
                            type="person" 
                        />

                        {/* Recommandations */}
                        <ScrollableCards 
                            title="Recommandations" 
                            items={movie.recommendations.results} 
                            type="movie" 
                        />
                    </div>
                </div>
            </main>
        </>
    );
} 