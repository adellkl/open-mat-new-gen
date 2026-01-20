import { useState, useEffect, useCallback } from 'react';
import { db } from '../database/db';

/**
 * Hook personnalisé pour gérer les likes avec synchronisation DB en temps réel
 * Utilise localStorage pour l'ID utilisateur unique et la DB pour la persistance
 */
export const useLikes = () => {
  const [likedSessions, setLikedSessions] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Générer ou récupérer l'ID utilisateur unique
  useEffect(() => {
    const getUserId = () => {
      let id = localStorage.getItem('openmat_user_id');
      if (!id) {
        // Générer un ID unique basé sur timestamp et random
        id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('openmat_user_id', id);
      }
      return id;
    };

    const id = getUserId();
    setUserId(id);
    loadUserLikes(id);
  }, []);

  // Charger les likes de l'utilisateur depuis la DB
  const loadUserLikes = async (uid: string) => {
    try {
      // IMPORTANT: Charger IMMÉDIATEMENT depuis localStorage pour affichage instantané
      const stored = localStorage.getItem('openmat_likes');
      if (stored) {
        setLikedSessions(JSON.parse(stored));
        setLoading(false);
      }
      
      // Puis synchroniser avec la DB en arrière-plan (sans bloquer l'UI)
      const sessions = await db.getUserLikedSessions(uid);
      setLikedSessions(sessions);
      
      // Mettre à jour localStorage avec les données de la DB
      localStorage.setItem('openmat_likes', JSON.stringify(sessions));
    } catch (error) {
      console.error('Erreur lors du chargement des likes:', error);
      // Fallback vers localStorage en cas d'erreur DB
      const stored = localStorage.getItem('openmat_likes');
      if (stored) {
        setLikedSessions(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le compteur de likes d'une session
  const updateLikeCount = useCallback((sessionId: string, count: number) => {
    setLikeCounts(prev => ({
      ...prev,
      [sessionId]: count
    }));
  }, []);

  /**
   * Toggle like avec synchronisation DB en temps réel
   */
  const toggleLike = async (sessionId: string) => {
    if (!userId) return;

    const isCurrentlyLiked = likedSessions.includes(sessionId);
    
    // Optimistic update pour l'UI
    setLikedSessions(prev => {
      if (isCurrentlyLiked) {
        return prev.filter(id => id !== sessionId);
      } else {
        return [...prev, sessionId];
      }
    });

    // Mise à jour optimiste du compteur
    setLikeCounts(prev => ({
      ...prev,
      [sessionId]: (prev[sessionId] || 0) + (isCurrentlyLiked ? -1 : 1)
    }));

    try {
      // Synchroniser avec la DB
      let result;
      if (isCurrentlyLiked) {
        result = await db.removeLike(sessionId, userId);
      } else {
        result = await db.addLike(sessionId, userId);
      }

      if (result.success && result.likes_count !== undefined) {
        // Mettre à jour avec la vraie valeur de la DB
        updateLikeCount(sessionId, result.likes_count);
      } else {
        // Rollback en cas d'erreur
        setLikedSessions(prev => {
          if (isCurrentlyLiked) {
            return [...prev, sessionId];
          } else {
            return prev.filter(id => id !== sessionId);
          }
        });
        
        // Restaurer le compteur
        setLikeCounts(prev => ({
          ...prev,
          [sessionId]: (prev[sessionId] || 0) + (isCurrentlyLiked ? 1 : -1)
        }));
      }

      // Backup dans localStorage
      const newLikes = isCurrentlyLiked 
        ? likedSessions.filter(id => id !== sessionId)
        : [...likedSessions, sessionId];
      localStorage.setItem('openmat_likes', JSON.stringify(newLikes));
    } catch (error) {
      console.error('Erreur lors du toggle like:', error);
      
      // Rollback complet en cas d'erreur
      setLikedSessions(prev => {
        if (isCurrentlyLiked) {
          return [...prev, sessionId];
        } else {
          return prev.filter(id => id !== sessionId);
        }
      });
      
      setLikeCounts(prev => ({
        ...prev,
        [sessionId]: (prev[sessionId] || 0) + (isCurrentlyLiked ? 1 : -1)
      }));
    }
  };

  /**
   * Vérifier si une session est likée
   */
  const isLiked = useCallback((sessionId: string): boolean => {
    return likedSessions.includes(sessionId);
  }, [likedSessions]);

  /**
   * Récupérer le nombre de likes d'une session
   */
  const getLikeCount = useCallback((sessionId: string): number => {
    return likeCounts[sessionId] || 0;
  }, [likeCounts]);

  /**
   * Charger le nombre de likes depuis la DB
   */
  const loadLikeCount = useCallback(async (sessionId: string) => {
    try {
      const count = await db.getLikesCount(sessionId);
      updateLikeCount(sessionId, count);
      return count;
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error);
      return 0;
    }
  }, [updateLikeCount]);

  /**
   * Charger les compteurs de likes pour plusieurs sessions
   */
  const loadMultipleLikeCounts = useCallback(async (sessionIds: string[]) => {
    try {
      const counts: Record<string, number> = {};
      await Promise.all(
        sessionIds.map(async (id) => {
          const count = await db.getLikesCount(id);
          counts[id] = count;
        })
      );
      setLikeCounts(prev => ({ ...prev, ...counts }));
    } catch (error) {
      console.error('Erreur lors du chargement des compteurs:', error);
    }
  }, []);

  return {
    likedSessions,
    likeCounts,
    toggleLike,
    isLiked,
    getLikeCount,
    loadLikeCount,
    loadMultipleLikeCounts,
    loading,
    likesCount: likedSessions.length
  };
};
