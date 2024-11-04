import React from 'react';

// Composant qui affiche une note sous forme de cercle progressif
// Prend en paramètre un objet movie contenant vote_average
const Rated = ({ movie }: { movie: { vote_average: number } }) => {
    return (
        <>
            {/* Badge circulaire affichant la note */}
            <div className="relative w-12 h-12">
                {/* SVG contenant deux cercles superposés */}
                <svg className="w-full h-full rotate-[-90deg]">
                    {/* Cercle de fond gris */}
                    <circle
                        cx="24"
                        cy="24"
                        r="20"
                        strokeWidth="3"
                        className="fill-none stroke-gray-700"
                    />
                    {/* Cercle de progression violet */}
                    <circle
                        cx="24"
                        cy="24"
                        r="20"
                        strokeWidth="3"
                        className="fill-none stroke-purple-600"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: `${2 * Math.PI * 20}`,
                            // Calcul de la progression basé sur la note sur 10
                            strokeDashoffset: `${2 * Math.PI * 20 * (1 - movie.vote_average / 10)}`,
                        }}
                    />
                </svg>
                {/* Affichage du pourcentage au centre */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                        {Math.round(movie.vote_average * 10)}%
                    </span>
                </div>
            </div>
        </>
    )
}

export default Rated;