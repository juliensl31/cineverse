import { useRouter } from 'next/router';
import Link from 'next/link';

// Type pour les props du composant
interface NavigationProps {
    title?: string; // Titre optionnel pour le partage
}

export default function Navigation({ title }: NavigationProps) {
    // Hook Next.js pour la navigation
    const router = useRouter();

    // Fonction pour partager la page actuelle
    const handleShare = async () => {
        if (navigator.share) {
            // Partage natif sur mobile
            try {
                await navigator.share({
                    title: title || 'CineVerse',
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Erreur de partage:', error);
            }
        } else {
            // Copie dans le presse-papier
            await navigator.clipboard.writeText(window.location.href);
            alert('Lien copié dans le presse-papier !');
        }
    };

    return (
        // Barre de navigation fixe en haut
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Bouton Retour - Revient à la page précédente */}
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
                    
                    {/* Lien Accueil - Redirige vers la page d'accueil */}
                    <Link 
                        href="/" 
                        className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl "
                    >
                        {/* Icône maison */}
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-white text-sm font-medium">Accueil</span>
                    </Link>
                </div>

                {/* Bouton Partager - Déclenche la fonction de partage */}
                <button
                    onClick={handleShare}
                    className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl"
                    aria-label="Partager"
                >
                    {/* Icône partage */}
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-white text-sm font-medium">Partager</span>
                </button>
            </div>
        </nav>
    );
} 