import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les favoris (maintenant redirigé vers useLikes)
 * Gardé pour compatibilité - utilise localStorage uniquement
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('openmat_likes');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = useCallback((sessionId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId];
      localStorage.setItem('openmat_likes', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((sessionId: string): boolean => {
    return favorites.includes(sessionId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length
  };
};
