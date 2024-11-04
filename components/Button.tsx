import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

// Composant Button réutilisable avec support des props HTML natives
// et possibilité d'ajouter des classes CSS personnalisées
export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`
        bg-gradient-to-r from-purple-600 to-pink-600
        text-white text-sm font-medium
        hover:from-purple-700 hover:to-pink-700
        transition-all duration-300 ease-in-out
        shadow-[0_0_15px_rgba(168,85,247,0.25)]
        hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}