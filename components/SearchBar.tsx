import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export type SearchType = 'movie' | 'tv' | 'person';

interface SearchBarProps {
  onSearch: (query: string, type: SearchType) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('movie');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, searchType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center gap-2">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 rounded-l-full bg-gray-800/50 
            border border-gray-700 focus:border-purple-500 focus:ring-2 
            focus:ring-purple-500 text-white placeholder-gray-400"
          placeholder="Rechercher un film, une série ou un acteur..."
        />
        
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
          className="min-w-[120px] h-12 px-4 bg-gray-800/50 border border-gray-700
            text-white cursor-pointer hover:bg-gray-700/50 transition-colors"
        >
          <option value="movie">Films</option>
          <option value="tv">Séries</option>
          <option value="person">Acteurs</option>
        </select>

        <button 
          type="submit"
          className="h-12 px-6 rounded-r-full bg-purple-600 text-white 
            hover:bg-purple-700 transition-colors disabled:opacity-50 
            disabled:cursor-not-allowed"
          disabled={!searchQuery.trim()}
        >
          Valider
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 