import React from 'react';
import { Search, ChevronDown, Heart, ArrowUpDown } from 'lucide-react';
import { SortOption, SORT_OPTIONS } from '../../utils/sortSessions';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  cities: string[];
}

/**
 * Composant de filtres de recherche et de tri
 */
const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  showOnlyFavorites,
  onToggleFavorites,
  favoritesCount,
  cities
}) => {
  return (
    <>
      {/* Barre de filtres et de tri */}
      <div className="reveal active mb-8 sm:mb-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between" data-always-active="true">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onToggleFavorites}
            className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] border transition-all flex items-center gap-2 focus:ring-2 focus:ring-white/50 focus:outline-none ${
              showOnlyFavorites
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white/60 border-white/10 hover:text-white hover:border-white/30'
            }`}
            aria-pressed={showOnlyFavorites}
            aria-label={`${showOnlyFavorites ? 'Afficher toutes les sessions' : 'Afficher uniquement les favoris'}`}
          >
            <Heart className={`h-4 w-4 ${showOnlyFavorites ? 'fill-current' : ''}`} aria-hidden="true" />
            <span className="hidden sm:inline">Favoris</span>
            {favoritesCount > 0 && <span className="ml-1">({favoritesCount})</span>}
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ArrowUpDown className="h-4 w-4 text-white/30 hidden sm:block" aria-hidden="true" />
          <label htmlFor="sort-select" className="sr-only">Trier les sessions</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="flex-1 sm:flex-none px-6 py-3 bg-white/[0.02] border border-white/10 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all select-custom focus:ring-2 focus:ring-white/30 focus:outline-none"
            aria-label="Options de tri des sessions"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="reveal active bg-white/[0.02] border border-white/10 p-2 mb-12 sm:mb-16 lg:mb-20" data-always-active="true" role="search" aria-label="Recherche de sessions">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-white/20" aria-hidden="true" />
            <label htmlFor="search-input" className="sr-only">Rechercher par club, ville ou discipline</label>
            <input
              id="search-input"
              type="search"
              placeholder="CLUB, VILLE, DISCIPLINE..."
              className="w-full h-12 sm:h-14 lg:h-16 bg-transparent text-white text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wide sm:tracking-widest px-12 sm:px-16 outline-none focus:ring-2 focus:ring-white/30 transition-shadow"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Rechercher des sessions Open Mat"
            />
          </div>
          
          <div className="md:col-span-3 md:border-l border-white/5 relative group">
            <label htmlFor="city-filter" className="sr-only">Filtrer par ville</label>
            <select
              id="city-filter"
              className="w-full h-12 sm:h-14 lg:h-16 bg-transparent text-white/60 group-hover:text-white text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wide sm:tracking-widest px-4 sm:px-8 pr-10 sm:pr-12 outline-none appearance-none cursor-pointer transition-all duration-300 group-hover:bg-white/[0.03] select-custom focus:ring-2 focus:ring-white/30"
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              aria-label="Filtrer les sessions par ville"
            >
              <option value="">TOUTES LES VILLES</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city.toUpperCase()}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-white/30 group-hover:text-white/60 transition-all duration-300 pointer-events-none group-hover:translate-y-[-40%]" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/0 group-hover:bg-white/20 transition-all duration-300"></div>
          </div>
          
          <div className="md:col-span-3 md:border-l border-white/5 relative group">
            <label htmlFor="type-filter" className="sr-only">Filtrer par discipline</label>
            <select
              id="type-filter"
              className="w-full h-12 sm:h-14 lg:h-16 bg-transparent text-white/60 group-hover:text-white text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wide sm:tracking-widest px-4 sm:px-8 pr-10 sm:pr-12 outline-none appearance-none cursor-pointer transition-all duration-300 group-hover:bg-white/[0.03] select-custom focus:ring-2 focus:ring-white/30"
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              aria-label="Filtrer les sessions par type de discipline"
            >
              <option value="Tous">TOUTES DISCIPLINES</option>
              <option value="JJB">JJB (GI)</option>
              <option value="Luta Livre">LUTA LIVRE (NO-GI)</option>
              <option value="Mixte">MIXTE</option>
            </select>
            <ChevronDown className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-white/30 group-hover:text-white/60 transition-all duration-300 pointer-events-none group-hover:translate-y-[-40%]" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/0 group-hover:bg-white/20 transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
