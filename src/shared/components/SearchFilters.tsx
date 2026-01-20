import React from 'react';
import { Search, ChevronDown, Heart } from 'lucide-react';
import { SortOption } from '../../utils/sortSessions';

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
    <div className="reveal active bg-white/[0.02] border border-white/10 p-2 mb-12 sm:mb-16 lg:mb-20" data-always-active="true" role="search" aria-label="Recherche et filtres de sessions">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Bouton Favoris */}
        <div className="md:col-span-2 flex items-center justify-center md:border-r border-white/5">
          <button
            onClick={onToggleFavorites}
            className={`w-full h-12 sm:h-14 lg:h-16 text-[10px] font-black uppercase tracking-[0.2em] border-0 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-white/50 focus:outline-none ${
              showOnlyFavorites
                ? 'bg-white/10 text-white'
                : 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.03]'
            }`}
            aria-pressed={showOnlyFavorites}
            aria-label={`${showOnlyFavorites ? 'Afficher toutes les sessions' : 'Afficher uniquement les favoris'}`}
          >
            <Heart className={`h-4 w-4 ${showOnlyFavorites ? 'fill-current' : ''}`} aria-hidden="true" />
            <span className="hidden sm:inline">Favoris</span>
            {favoritesCount > 0 && <span className="ml-1">({favoritesCount})</span>}
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="md:col-span-5 relative md:border-r border-white/5">
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
        
        {/* Filtre Ville */}
        <div className="md:col-span-3 md:border-r border-white/5 relative group">
          <label htmlFor="city-filter" className="sr-only">Filtrer par ville</label>
          <select
            id="city-filter"
            className="w-full h-12 sm:h-14 lg:h-16 bg-transparent text-white/60 group-hover:text-white text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wide sm:tracking-widest px-4 sm:px-8 pr-10 sm:pr-12 outline-none appearance-none cursor-pointer transition-all duration-300 group-hover:bg-white/[0.03] select-custom focus:ring-2 focus:ring-white/30"
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            aria-label="Filtrer les sessions par ville"
          >
            <option value="">TOUTES VILLES</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city.toUpperCase()}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-white/30 group-hover:text-white/60 transition-all duration-300 pointer-events-none group-hover:translate-y-[-40%]" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/0 group-hover:bg-white/20 transition-all duration-300"></div>
        </div>
        
        {/* Filtre Type */}
        <div className="md:col-span-2 relative group">
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
  );
};

export default SearchFilters;
