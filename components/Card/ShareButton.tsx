import React from 'react';

interface ShareButtonProps {
    url: string;
    title: string;
}

const ShareButton = ({ title }: ShareButtonProps) => {

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
        <button
            onClick={handleShare}
            className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl"
            aria-label="Partager"
        >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-white text-sm font-medium">Partager</span>
        </button>
    );
}

export default ShareButton;