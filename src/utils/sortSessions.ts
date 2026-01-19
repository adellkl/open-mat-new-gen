import { OpenMatSession } from '../types';

export type SortOption = 'date-asc' | 'date-desc' | 'city-asc' | 'city-desc' | 'price-asc' | 'price-desc';

/**
 * Fonctions utilitaires pour trier les sessions
 */

/**
 * Trier les sessions selon le critère choisi
 */
export const sortSessions = (sessions: OpenMatSession[], sortBy: SortOption): OpenMatSession[] => {
  const sorted = [...sessions];

  switch (sortBy) {
    case 'date-asc':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    
    case 'date-desc':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    
    case 'city-asc':
      return sorted.sort((a, b) => a.city.localeCompare(b.city, 'fr'));
    
    case 'city-desc':
      return sorted.sort((a, b) => b.city.localeCompare(a.city, 'fr'));
    
    case 'price-asc':
      return sorted.sort((a, b) => {
        // Extraire les nombres du prix (ex: "10€" -> 10)
        const priceA = parseFloat(a.price.replace(/[^\d.-]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^\d.-]/g, '')) || 0;
        return priceA - priceB;
      });
    
    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^\d.-]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^\d.-]/g, '')) || 0;
        return priceB - priceA;
      });
    
    default:
      return sorted;
  }
};

/**
 * Options de tri disponibles avec leurs labels
 */
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date-asc', label: 'Date (Plus proche)' },
  { value: 'date-desc', label: 'Date (Plus lointaine)' },
  { value: 'city-asc', label: 'Ville (A-Z)' },
  { value: 'city-desc', label: 'Ville (Z-A)' },
  { value: 'price-asc', label: 'Prix (Croissant)' },
  { value: 'price-desc', label: 'Prix (Décroissant)' }
];
