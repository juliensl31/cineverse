import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {

    // Hook Next.js pour la navigation
    const router = useRouter();
    const isHomePage = router.pathname === '/';
    const { user,userData, logout } = useAuth();
    
    // Fonction de déconnexion
    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
        }
    };

    return (
        // Barre de navigation fixe en haut
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {!isHomePage ? (
                        // Boutons Retour et Accueil pour les pages autres que l'accueil
                        <>
                            <button onClick={() => router.back()}
                                className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl"
                                aria-label="Retour"
                            >
                                {/* Icône flèche retour */}
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="text-white text-sm font-medium">Retour</span>
                            </button>
                            
                            <Link href="/" className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl">
                                {/* Icône maison */}
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="text-white text-sm font-medium">Accueil</span>
                            </Link>

                            {router.pathname.includes('/movies') && (
                                <Link href="/series" className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-white text-sm font-medium">Séries</span>
                                </Link>
                            )}
                            {router.pathname.includes('/series') && (
                                <Link href="/movies" className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                    </svg>
                                    <span className="text-white text-sm font-medium">Films</span>
                                </Link>
                            )}
                        </>
                    ) : (
                        // Liens Films et Séries pour la page d'accueil
                        <>
                            <Link href="/movies" className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                </svg>
                                <span className="text-white text-sm font-medium">Films</span>
                            </Link>
                            <Link href="/series" className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="text-white text-sm font-medium">Séries</span>
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* Nom d'utilisateur */}
                            <button 
                                onClick={() => router.push('/profile')}
                                className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {userData?.username || 'Utilisateur'}
                            </button>
                            
                            {/* Bouton Déconnexion */}
                            <button
                                onClick={handleLogout}
                                className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-white text-sm font-medium">Déconnexion</span>
                            </button>
                        </div>
                    ) : (
                        !router.pathname.includes('/auth') && (
                            <Link href="/auth" className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                                <span className="text-white text-sm font-medium">Connexion</span>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
} 