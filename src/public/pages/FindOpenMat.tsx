
import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, ArrowUpRight, Map as MapIcon, List, Loader2, ChevronDown, Heart, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OpenMatSession } from '../../types';
import { db } from '../../database/db';
import SEO from '../../shared/components/SEO';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import SessionCard from '../../shared/components/SessionCard';
import SearchFilters from '../../shared/components/SearchFilters';
import { useLikes } from '../../utils/useLikes';
import { sortSessions, SortOption } from '../../utils/sortSessions';
import { filterActiveSessions } from '../../utils/sessionFilters';

const FindOpenMat: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<OpenMatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hook useLikes unifié pour gérer les favoris
  const { 
    toggleLike, 
    isLiked, 
    getLikeCount, 
    loadMultipleLikeCounts,
    loading: likesLoading,
    likesCount 
  } = useLikes();

  // Auto-scroll en haut au chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const parseDates = (value?: string | null | any) => {
    if (!value) {
      return [];
    }
    // Si c'est déjà un tableau, le retourner
    if (Array.isArray(value)) {
      return value.map(v => String(v).trim()).filter(Boolean);
    }
    // Si c'est une chaîne de caractères
    if (typeof value === 'string') {
      return value
        .split('|')
        .map((date) => date.trim())
        .filter(Boolean);
    }
    // Si c'est un autre type (Date, number, etc.), le convertir en chaîne
    return [String(value).trim()].filter(Boolean);
  };

  const formatDateLabel = (value: string) => {
    // Ne pas formatter les dates récurrentes
    if (value === 'RÉCURRENT' || value === '2099-12-31') {
      return value;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('fr-FR');
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await db.getSessions('approved');
      // Filtrer uniquement les sessions actives (non expirées)
      const activeSessions = filterActiveSessions(data);
      setSessions(activeSessions);
      
      // Charger les compteurs de likes pour toutes les sessions
      const sessionIds = activeSessions.map(s => s.id);
      await loadMultipleLikeCounts(sessionIds);
    } catch (err) {
      console.error("Erreur de chargement:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Impossible de charger les sessions. Veuillez vérifier votre connexion et réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSessions = useMemo(() => {
    let filtered = sessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           session.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === '' || session.city === selectedCity;
      const matchesType = selectedType === 'Tous' || session.type === selectedType;
      const matchesFavorites = !showOnlyFavorites || isLiked(session.id);
      return matchesSearch && matchesCity && matchesType && matchesFavorites;
    });
    
    // Appliquer le tri
    return sortSessions(filtered, sortBy);
  }, [searchTerm, selectedCity, selectedType, sessions, sortBy, showOnlyFavorites, isLiked]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement des sessions" />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <ErrorMessage
          title="Erreur de chargement"
          message={error}
          onRetry={loadData}
          variant="error"
        />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Explorer +100 Sessions Open Mat JJB & Luta Livre en France | Gratuit"
        description="🥋 Trouvez des sessions Open Mat de JJB et Luta Livre près de chez vous. Recherche par ville (Paris, Lyon, Marseille, Toulouse...), horaires et niveau. Base de données actualisée quotidiennement. Débutants bienvenus."
        keywords="explorer open mat, sessions jjb france, luta livre sessions, trouver open mat, jiu jitsu près de moi, grappling france, open mat paris, open mat lyon, open mat marseille, open mat toulouse, open mat bordeaux, club jjb france, rolling jjb, sparring jjb, entraînement jjb gratuit"
        type="website"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <header className="mb-12 sm:mb-16 lg:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-12">
          <div className="reveal active" data-always-active="true">
            <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.4em] sm:tracking-[0.5em] text-white/30 uppercase mb-3 sm:mb-4">Base de données Live</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase">EXPLORER</h1>
        </div>
        <div className="reveal active text-left md:text-right md:hidden" data-always-active="true">
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tighter">{filteredSessions.length}</p>
          <p className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-white/30 uppercase">SESSIONS VÉRIFIÉES</p>
        </div>
        <div className="reveal active text-right hidden md:block" data-always-active="true" style={{ transitionDelay: '100ms' }}>
          <p className="text-5xl font-bold text-white tracking-tighter">{filteredSessions.length}</p>
          <p className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">SESSIONS VÉRIFIÉES</p>
        </div>
      </header>

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
        favoritesCount={likesCount}
        cities={Array.from(new Set(sessions.map(s => s.city)))}
      />

      {/* Liste des sessions */}
      <div className="grid grid-cols-1 gap-1" role="list" aria-label="Sessions Open Mat disponibles">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isFavorite={isLiked(session.id)}
              onToggleFavorite={toggleLike}
              parseDates={parseDates}
              formatDateLabel={formatDateLabel}
              likeCount={getLikeCount(session.id)}
            />
          ))
        ) : (
          <div className="py-24 sm:py-32 lg:py-40 text-center border border-white/5 bg-white/[0.01] reveal active" data-always-active="true">
            <p className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase mb-4">
              {sessions.length === 0 
                ? "Aucune session disponible pour le moment" 
                : "Aucun résultat correspondant à vos critères"}
            </p>
            {sessions.length === 0 && (
              <p className="text-[9px] font-medium tracking-[0.2em] text-white/30 uppercase mt-4">
                Les sessions seront affichées ici une fois validées
              </p>
            )}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default FindOpenMat;