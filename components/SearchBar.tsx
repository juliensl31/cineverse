// Barre de recherche avec suggestions automatiques
// Permet de rechercher des films, séries et acteurs
// Affiche jusqu'à 5 suggestions pendant la saisie
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import Spinner from './UI/Spinner';

// Interface pour les résultats de recherche
// Définit la structure des données retournées par l'API TMDB
interface SearchResult {
  id: number;                                    // ID unique du média
  name?: string;                                 // Nom (pour les acteurs/séries)
  title?: string;                                // Titre (pour les films)
  media_type: 'movie' | 'tv' | 'person';         // Type de média
}

// Props du composant SearchBar
interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  // États locaux pour gérer la recherche et les suggestions
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Fonction de recherche avec debounce pour limiter les appels API
  const debouncedFetch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}&language=fr-FR`
        );
        const data = await response.json();
        setSuggestions(data.results.slice(0, 5));
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      }
    },
    []
  );

  // Application du debounce avec un délai de 300ms
  const debouncedFetchWithDelay = useMemo(
    () => debounce(debouncedFetch, 300),
    [debouncedFetch]
  );

  // Effet pour déclencher la recherche quand la requête change
  useEffect(() => {
    debouncedFetchWithDelay(searchQuery);
    // Nettoyage du debounce lors du démontage du composant
    return () => debouncedFetchWithDelay.cancel();
  }, [searchQuery, debouncedFetchWithDelay]);

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  // Gestion du clic sur une suggestion
  const handleSuggestionClick = async (suggestion: SearchResult) => {
    // Mise à jour de l'interface utilisateur
    const title = suggestion.title || suggestion.name || '';
    setSearchQuery(title);
    onSearch(title);
    setShowSuggestions(false);
    
    // Navigation vers la page détaillée
    try {
      // Détermination de l'URL en fonction du type de média
      const baseUrl = suggestion.media_type === 'movie' ? '/movie' :
                     suggestion.media_type === 'tv' ? '/serie' : 
                     suggestion.media_type === 'person' ? '/artist' : '';
      await router.push(`${baseUrl}/${suggestion.id}`);
    } catch (error) {
      console.error('Erreur de navigation:', error);
    }
  };

  return (
    // Structure du composant
    <div className="relative max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        {/* Formulaire de recherche */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-purple-400" />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="block w-full pl-12 pr-24 py-4 rounded-xl
                bg-gray-900/50
                border border-purple-500/20 
                focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                text-white placeholder-gray-400
                transition-all duration-300 ease-in-out
                group-hover:border-purple-500/30
                shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              placeholder="Rechercher un film, une série ou un acteur..."
            />
            
            <div className="absolute right-2">
              {/* Bouton de recherche */}
              <button 
                type="submit"
                className="h-10 px-4 rounded-lg
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  btn-gradient"
                disabled={!searchQuery.trim()}
              >
                Rechercher
              </button>
            </div>
          </div>
        </form>

        {/* Bouton de réinitialisation */}
        {searchQuery && (
          <button 
            type="button"
            onClick={() => {
              setIsLoading(true);
              setSearchQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
                window.location.reload();
            }}
            disabled={isLoading}
            className="h-[52px] w-[52px] flex items-center justify-center rounded-xl
              bg-gray-900/50 backdrop-blur-sm
              border border-purple-500/20 
              hover:border-purple-500/50 hover:bg-gray-800/50
              text-gray-400 hover:text-white
              transition-all duration-300
              shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            aria-label="Réinitialiser la recherche"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            {isLoading && <Spinner />}
          </button>
        )}
      </div>

      {/* Liste déroulante des suggestions 
          Affichée uniquement si showSuggestions est true et qu'il y a des suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-[60px] mt-2 bg-gray-900/90 backdrop-blur-md 
          border border-purple-500/20 rounded-xl z-50
          shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          {/* Mapping des suggestions pour créer les éléments de la liste */}
          {suggestions.map((suggestion) => (
            <div
              key={`${suggestion.id}-${suggestion.media_type}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-4 hover:bg-purple-500/10 cursor-pointer 
                flex items-center justify-between
                transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
            >
              <span className="text-white font-medium">
                {suggestion.title || suggestion.name}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                {suggestion.media_type === 'movie' ? 'Film' : 
                 suggestion.media_type === 'tv' ? 'Série' : 
                 suggestion.media_type === 'person' ? 'Acteur' : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 