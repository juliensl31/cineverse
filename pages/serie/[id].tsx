import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Spinner from '../../components/Spinner';
import Rated from '../../components/Rated';
import Navigation from '../../components/Navigation';
import Head from 'next/head';

//Interface décrivant la structure des données d'une série
interface SerieDetails {
    id: number;              // Identifiant unique de la série
    name: string;           // Nom de la série
    overview: string;        // Synopsis
    backdrop_path: string;   // Chemin de l'image de fond
    poster_path: string;     // Chemin de l'affiche
    first_air_date: string;    // Date de première diffusion
    number_of_episodes: number; // Nombre d'épisodes
    number_of_seasons: number;  // Nombre de saisons
    vote_average: number;    // Note moyenne
    genres: {               // Liste des genres
        id: number;          // Identifiant unique du genre
        name: string;        // Nom du genre   
    }[];
    budget: number;          // Budget de la série
    revenue: number;         // Recettes de la série
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
    recommendations: {     // Séries recommandées
        results: Array<{     // Liste de séries recommandées
            id: number;       // Identifiant unique de la série recommandée
            name: string;   // Nom de la série recommandée
            poster_path: string | null; // Chemin de l'affiche de la série recommandée
            vote_average: number; // Note moyenne de la série recommandée
            first_air_date: string; // Date de première diffusion de la série recommandée
        }>;
    };
}

// Composant principal de la page de détail d'une série
export default function SeriePage() {
    // États locaux
    const [serie, setSerie] = useState<SerieDetails | null>(null);
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
                // Détails de la série
                fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`),
                // Vidéos (bandes-annonces)
                fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`),
                // Distribution et équipe
                fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`),
                // Recommandations
                fetch(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr-FR`)
            ])
                .then(([serieRes, videosRes, creditsRes, recommendationsRes]) =>
                    Promise.all([
                        serieRes.json(),
                        videosRes.json(),
                        creditsRes.json(),
                        recommendationsRes.json()
                    ])
                )
                .then(([serieData, videosData, creditsData, recommendationsData]) => {
                    // Fusion des données dans un seul objet
                    setSerie({
                        ...serieData,
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
    const trailer = serie?.videos?.results.find(
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
    if (!serie) return null;

    return (
        <>
            {/* SEO et métadonnées */}
            <Head>
                {/* Titre de la page */}
                <title>{serie.name} - Détails de la série</title>
                {/* Description de la page */}
                <meta name="description" content={serie.overview?.slice(0, 155) + '...'} />
                {/* Métadonnées OpenGraph */}
                <meta property="og:title" content={`${serie.name} - Détails de la série`} />
                <meta property="og:description" content={serie.overview?.slice(0, 155) + '...'} />
                <meta property="og:image" content={`https://image.tmdb.org/t/p/w1280${serie.backdrop_path}`} />
                <meta property="og:type" content="video.movie" />
                <meta property="og:site_name" content="CinéVerse" />
                {/* Métadonnées Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={serie.name} />
                <meta name="twitter:description" content={serie.overview?.slice(0, 155) + '...'} />
                <meta name="twitter:image" content={`https://image.tmdb.org/t/p/w1280${serie.backdrop_path}`} />
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
                            src={`https://image.tmdb.org/t/p/original${serie.backdrop_path}`}
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
                                    src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
                                    alt={serie.name}
                                    className="w-full rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="flex-1 text-white">
                                <h1 className="text-4xl md:text-5xl font-bold mb-6">{serie.name}</h1>

                                <div className="flex flex-wrap items-center gap-6 text-lg mb-8">
                                    {/* Badge de note */}
                                    <Rated movie={serie} />
                                    {/* Date de première diffusion */}
                                    <span>{new Date(serie.first_air_date).getFullYear()}</span>
                                    {/* Nombre de saisons */}
                                    <span>{serie.number_of_seasons} saisons</span>
                                    {/* Nombre d'épisodes */}
                                    <span>{serie.number_of_episodes} épisodes</span>
                                </div>

                                {/* Genres */}
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {serie.genres.map(genre => (
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
                                    <p className='text-gray-300 leading-relaxed'>{serie.overview}</p>
                                </div>

                                {/* Équipe de réalisation */}
                                <div className='bg-black/30 p-6 rounded-xl mt-6'>
                                    <h2 className='text-xl font-bold mb-3'>Réalisation</h2>
                                    <div className='flex flex-wrap gap-x-6 gap-y-2'>
                                        {serie.credits.crew
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
                        <div className={`grid grid-cols-1 ${trailer ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
                            {trailer && (
                                <div className="lg:col-span-2 bg-white/5 rounded-2xl overflow-hidden">
                                    <div className="aspect-video">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${trailer.key}`}
                                            title={`Bande annonce de ${serie.name}`}
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
                                                    {serie.budget > 0
                                                        ? new Intl.NumberFormat('fr-FR', {
                                                            style: 'currency',
                                                            currency: 'EUR',
                                                            maximumFractionDigits: 0,
                                                            notation: "compact",
                                                            compactDisplay: "long"
                                                        }).format(serie.budget)
                                                        : 'Non communiqué'}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-xl">
                                                <div className="text-gray-400 text-sm">Recettes</div>
                                                <div className="text-white text-xl font-medium">
                                                    {serie.revenue > 0
                                                        ? new Intl.NumberFormat('fr-FR', {
                                                            style: 'currency',
                                                            currency: 'EUR',
                                                            maximumFractionDigits: 0,
                                                            notation: "compact",
                                                            compactDisplay: "long"
                                                        }).format(serie.revenue)
                                                        : 'Non communiqué'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rentabilité */}
                                        {serie.budget > 0 && serie.revenue > 0 && (
                                            <div className="bg-white/5 p-4 rounded-xl">
                                                <div className="text-gray-400 text-sm mb-2">Rentabilité</div>
                                                <div className="flex items-center gap-3">
                                                    <div className={`text-xl font-medium ${serie.revenue > serie.budget ? 'text-green-400' : 'text-red-400'}`}>
                                                        {((serie.revenue - serie.budget) / serie.budget * 100).toFixed(0)}%
                                                    </div>
                                                    <span className="text-gray-400">
                                                        ({serie.revenue > serie.budget ? 'Bénéfice' : 'Perte'})
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Date de première diffusion détaillée */}
                                        <div className="bg-white/5 p-4 rounded-xl">
                                            <div className="text-gray-400 text-sm mb-2">Date de première diffusion</div>
                                            <div className="text-white">
                                                {new Date(serie.first_air_date).toLocaleDateString('fr-FR', {
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
                                                Diffusée en salles
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
                                        {serie.credits.cast
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
                                    {serie.recommendations.results.slice(0, 10).map(serie => (
                                        <div
                                            key={serie.id}
                                            className="w-[200px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                                            onClick={() => router.push(`/serie/${serie.id}`)}
                                        >
                                            <div className="aspect-[2/3] relative overflow-hidden">
                                                {serie.poster_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
                                                        alt={serie.name}
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
                                                    {serie.name}
                                                </h3>
                                                <div className="absolute top-3 right-3">
                                                    <Rated movie={serie} />
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-white/50 text-sm">
                                                        {new Date(serie.first_air_date).getFullYear()}
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