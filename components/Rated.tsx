import React from 'react';

const Rated = ({ movie }: { movie: { vote_average: number } }) => {
    return (
        <>
            {/* Badge de note */}
            <div className="relative w-12 h-12">
                {/* Cercle de fond */}
                <svg className="w-full h-full rotate-[-90deg]">
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    strokeWidth="3"
                    className="fill-none stroke-gray-700"
                />
                {/* Cercle de progression */}
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    strokeWidth="3"
                    className="fill-none stroke-purple-600"
                    strokeLinecap="round"
                    style={{
                    strokeDasharray: `${2 * Math.PI * 20}`,
                    strokeDashoffset: `${2 * Math.PI * 20 * (1 - movie.vote_average / 10)}`,
                    }}
                />
                </svg>
                {/* Pourcentage au centre */}
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