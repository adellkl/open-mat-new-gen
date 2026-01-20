import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { OpenMatSession } from '../../types';
import LazyImage from './LazyImage';
import { isRecurring, getRecurrenceDay } from '../../utils/sessionFilters';

interface SessionCardProps {
  session: OpenMatSession;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  parseDates: (value?: string | null | any) => string[];
  formatDateLabel: (value: string) => string;
  likeCount?: number;
}

/**
 * Composant carte de session réutilisable
 * Affiche les informations d'une session Open Mat
 */
const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isFavorite,
  onToggleFavorite,
  parseDates,
  formatDateLabel,
  likeCount = 0
}) => {
  const navigate = useNavigate();

  // Formater l'affichage de la date
  const getDateDisplay = () => {
    // Vérifier AVANT de parser si c'est une session récurrente
    const dateStr = session.date ? String(session.date) : '';
    if (dateStr === 'RÉCURRENT' || dateStr === '2099-12-31' || isRecurring(session)) {
      const day = getRecurrenceDay(session);
      if (day) {
        return `Récurrent tous les ${day}s`;
      }
      return 'Récurrent (hebdomadaire)';
    }
    // Seulement si ce n'est pas récurrent, on formate normalement
    return parseDates(session.date).map(formatDateLabel).join(' • ');
  };

  return (
    <article
      className="group bg-white/[0.01] border border-white/5 p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start lg:items-center hover:bg-white/[0.03] hover:border-white/20 transition-all duration-500"
      role="listitem"
    >
      {/* Image de la session */}
      <div className="w-full lg:w-56 xl:w-64 h-32 sm:h-44 lg:h-48 shrink-0">
        {session.photo ? (
          <LazyImage
            src={session.photo}
            alt={`${session.club} - ${session.title}`}
            className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            placeholderClassName="w-full h-full bg-zinc-900"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
            <svg
              className="h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[8px] font-bold uppercase tracking-wider">
              Pas de photo
            </span>
          </div>
        )}
      </div>

      {/* Informations de la session */}
      <div className="flex-grow w-full min-w-0">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <span className="text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-white/40 uppercase break-words max-w-full">
            {session.club}
          </span>
          <div className="h-[1px] w-6 sm:w-8 bg-white/10 shrink-0"></div>
          <span className="text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] text-white uppercase">
            {session.type}
          </span>
          {(session.date === 'RÉCURRENT' || session.date === '2099-12-31' || isRecurring(session)) && (
            <>
              <div className="h-[1px] w-6 sm:w-8 bg-white/10 shrink-0"></div>
              <span className="text-[9px] font-black tracking-[0.3em] px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 uppercase">
                🔄 RÉCURRENT
              </span>
            </>
          )}
          <div className="ml-auto flex items-center gap-2">
            {/* Compteur de likes */}
            {likeCount > 0 && (
              <span className="text-[10px] font-bold text-white/60 px-2 py-1 bg-white/5 rounded">
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(session.id);
              }}
              className="p-2 hover:bg-white/5 transition-all rounded focus:ring-2 focus:ring-white/40 focus:outline-none group/like"
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart
                className={`h-5 w-5 transition-all ${
                  isFavorite
                    ? 'fill-red-500 text-red-500 animate-pulse'
                    : 'text-white/30 group-hover/like:text-white/60 group-hover/like:scale-110'
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-6 sm:mb-8 break-words max-w-full leading-tight">
          {session.title}
        </h3>

        {/* Détails de la session */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${(session.date === 'RÉCURRENT' || session.date === '2099-12-31' || isRecurring(session)) ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4 sm:gap-6 lg:gap-8`}>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">
              Ville
            </p>
            <p className="text-xs font-bold text-white uppercase break-words overflow-hidden">
              {session.city}
            </p>
          </div>
          {/* Ne pas afficher la date pour les sessions récurrentes */}
          {!(session.date === 'RÉCURRENT' || session.date === '2099-12-31' || isRecurring(session)) && (
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">
                Date
              </p>
              <p className="text-xs font-bold uppercase break-words overflow-hidden text-white">
                {getDateDisplay()}
              </p>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">
              Horaire
            </p>
            <p className="text-xs font-bold text-white break-words overflow-hidden">
              {session.time}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">
              Accès
            </p>
            <p className="text-xs font-bold text-white uppercase break-words overflow-hidden">
              {session.price}
            </p>
          </div>
        </div>
      </div>

      {/* Bouton d'action */}
      <button
        onClick={() => navigate(`/explorer/${session.id}`)}
        className="w-full lg:w-auto px-6 sm:px-10 py-4 sm:py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-white hover:text-black transition-all whitespace-nowrap shrink-0 text-center focus:ring-2 focus:ring-white/50 focus:outline-none"
        aria-label={`Voir les détails de ${session.title} à ${session.city}`}
      >
        Détails
      </button>
    </article>
  );
};

export default SessionCard;
