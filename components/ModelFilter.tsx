import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface Model {
  name: string;
  age: number;
  nationality: string;
  city: string;
  featured: boolean;
  slug?: string;
}

interface ModelFilterProps {
  models: any[];
  onFilter: (filteredModels: any[]) => void;
}

const ModelFilter: React.FC<ModelFilterProps> = ({ models, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');
  const [selectedAgeRange, setSelectedAgeRange] = useState('');
  const [showVIPOnly, setShowVIPOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique nationalities from models
  const nationalities = [...new Set(models.map(model => model.nationality))];

  useEffect(() => {
    let filtered = models;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by nationality
    if (selectedNationality) {
      filtered = filtered.filter(model => model.nationality === selectedNationality);
    }

    // Filter by age range
    if (selectedAgeRange) {
      const [min, max] = selectedAgeRange.split('-').map(Number);
      filtered = filtered.filter(model => model.age >= min && model.age <= max);
    }

    // Filter VIP only
    if (showVIPOnly) {
      filtered = filtered.filter(model => model.featured);
    }

    onFilter(filtered);
  }, [searchTerm, selectedNationality, selectedAgeRange, showVIPOnly, models, onFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedNationality('');
    setSelectedAgeRange('');
    setShowVIPOnly(false);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedNationality,
    selectedAgeRange,
    showVIPOnly
  ].filter(Boolean).length;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre o nacionalidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
          {/* Nationality Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nacionalidad
            </label>
            <select
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">Todas</option>
              {nationalities.map(nationality => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>
          </div>

          {/* Age Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rango de Edad
            </label>
            <select
              value={selectedAgeRange}
              onChange={(e) => setSelectedAgeRange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">Todas</option>
              <option value="18-25">18-25 años</option>
              <option value="26-30">26-30 años</option>
              <option value="31-35">31-35 años</option>
              <option value="36+">36+ años</option>
            </select>
          </div>

          {/* VIP Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría
            </label>
            <button
              onClick={() => setShowVIPOnly(!showVIPOnly)}
              className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                showVIPOnly
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500'
              }`}
            >
              {showVIPOnly ? '✨ Solo VIP' : 'Todas las modelos'}
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-800">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 border border-purple-600/50 rounded-full text-sm text-purple-300">
              <Search className="w-3 h-3" />
              {searchTerm}
            </span>
          )}
          {selectedNationality && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 border border-purple-600/50 rounded-full text-sm text-purple-300">
              {selectedNationality}
            </span>
          )}
          {selectedAgeRange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 border border-purple-600/50 rounded-full text-sm text-purple-300">
              {selectedAgeRange} años
            </span>
          )}
          {showVIPOnly && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 border border-purple-600/50 rounded-full text-sm text-purple-300">
              ✨ VIP
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelFilter;
