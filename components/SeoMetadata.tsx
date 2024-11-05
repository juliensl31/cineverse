import React from 'react';
import Head from 'next/head';

// Interface pour les props du composant
interface SeoMetadataProps {
    title: string; // Titre de la page
    description: string; // Description de la page
    image: string; // Image de la page
}
// Composant pour les métadonnées SEO
export default function SeoMetadata({ title, description, image }: SeoMetadataProps) {
    const formattedDescription = description?.slice(0, 155) + '...';
    const fullTitle = `${title} | CinéVerse`;

    return (
        <Head>
            {/* Titre de la page */}
            <title>{fullTitle}</title>
            {/* Description de la page */}
            <meta name="description" content={formattedDescription} />
            {/* Métadonnées OpenGraph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={formattedDescription} />
            <meta property="og:image" content={image} />
            {/* Métadonnées Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={image} />
        </Head>
    );
} 