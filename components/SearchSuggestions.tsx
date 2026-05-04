import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';

interface SearchSuggestionsProps {
  searchTerm: string;
  onSuggestionSelect: (suggestion: string) => void;
  models: any[];
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ 
  searchTerm, 
  onSuggestionSelect, 
  models 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Trending searches based on popular models and services
  const trendingSearches = [
    'Kimberly colombiana',
    'escort rusa Valencia',
    'modelo VIP eventos',
    'Girlfriend Experience',
    'cenas de negocios',
    'masajes eróticos',
    'escort española discreta',
    'modelo latina Valencia',
    'viajes internacionales',
    'acompañamiento ejecutivo'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    // Generate suggestions based on models and trending searches
    const modelSuggestions = models
      .filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(model => model.name)
      .slice(0, 3);

    const trendingMatches = trendingSearches.filter(search =>
      search.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 2);

    const allSuggestions = [...modelSuggestions, ...trendingMatches];
    setSuggestions(allSuggestions);
    setShowSuggestions(allSuggestions.length > 0);
  }, [searchTerm, models]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
    
    // Add to recent searches
    const updatedRecent = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
  };

  const displaySuggestions = searchTerm.length < 2 && recentSearches.length > 0 
    ? recentSearches.slice(0, 3)
    : suggestions;

  if (!showSuggestions && (searchTerm.length >= 2 || recentSearches.length === 0)) {
    return null;
  }

  return (
    <div ref={wrapperRef} className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
      {searchTerm.length < 2 && recentSearches.length > 0 && (
        <div className="px-3 py-2 border-b border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
            <Clock size={12} />
            <span>Búsquedas recientes</span>
          </div>
        </div>
      )}
      
      {searchTerm.length >= 2 && suggestions.length === 0 && (
        <div className="px-3 py-2 border-b border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
            <TrendingUp size={12} />
            <span>Tendencias</span>
          </div>
        </div>
      )}

      <div className="max-h-60 overflow-y-auto">
        {displaySuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="w-full px-3 py-2 text-left hover:bg-gray-800 transition-colors flex items-center gap-3 group"
          >
            <Search size={14} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
            <span className="text-white group-hover:text-purple-300 transition-colors">
              {suggestion}
            </span>
          </button>
        ))}
        
        {searchTerm.length >= 2 && suggestions.length === 0 && (
          trendingSearches.slice(0, 5).map((trending, index) => (
            <button
              key={`trending-${index}`}
              onClick={() => handleSuggestionClick(trending)}
              className="w-full px-3 py-2 text-left hover:bg-gray-800 transition-colors flex items-center gap-3 group"
            >
              <TrendingUp size={14} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span className="text-white group-hover:text-purple-300 transition-colors">
                {trending}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;
