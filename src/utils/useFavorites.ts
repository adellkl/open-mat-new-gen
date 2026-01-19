import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les sessions favorites
 * Utilise localStorage pour la persistance
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const STORAGE_KEY = 'openmat_favorites';

  // Charger les favoris depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  }, []);

  // Sauvegarder les favoris dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }, [favorites]);

  /**
   * Ajouter ou retirer une session des favoris
   */
  const toggleFavorite = (sessionId: string) => {
    setFavorites(prev => {
      if (prev.includes(sessionId)) {
        return prev.filter(id => id !== sessionId);
      } else {
        return [...prev, sessionId];
      }
    });
  };

  /**
   * Vérifier si une session est dans les favoris
   */
  const isFavorite = (sessionId: string): boolean => {
    return favorites.includes(sessionId);
  };

  /**
   * Effacer tous les favoris
   */
  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
};
