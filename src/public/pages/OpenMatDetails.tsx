import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Tag, User, 
  DollarSign, Info, Loader2, Navigation, Share2 
} from 'lucide-react';
import { OpenMatSession } from '../../types';
import { db } from '../../database/db';

const OpenMatDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<OpenMatSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const data = await db.getSessions('approved');
        const foundSession = data.find(s => s.id === id);
        
        if (foundSession) {
          setSession(foundSession);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white/20 animate-spin" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center border border-white/10 p-16">
          <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">
            SESSION INTROUVABLE
          </h1>
          <p className="text-white/40 text-sm mb-12">
            Cette session n'existe pas ou a été supprimée.
          </p>
          <Link 
            to="/explorer" 
            className="inline-block border border-white/20 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
          >
            Retour à l'Explorer
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const shareData = {
      title: `${session.title} - Open Mat France`,
      text: `${session.title} au ${session.club} à ${session.city}\n${session.description.substring(0, 100)}...`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback : copier dans le presse-papier
        await navigator.clipboard.writeText(window.location.href);
        alert('✓ Lien copié dans le presse-papier !');
      }
    } catch (err) {
      // Si l'utilisateur annule le partage, ne rien faire
      if ((err as Error).name !== 'AbortError') {
        console.error('Erreur de partage:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black pt-0">
      {/* Hero Section avec Image */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden z-0 -mt-24 lg:-mt-32 pt-24 lg:pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black z-10"></div>
        {session.photo ? (
          <img 
            src={session.photo}
            alt={session.title}
            className="w-full h-full object-cover grayscale opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-8 border-2 border-white/10 rounded-sm mb-4">
                <svg className="h-16 w-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">Aucune photo</p>
            </div>
          </div>
        )}
        
        {/* Bouton Retour */}
        <Link 
          to="/explorer"
          className="absolute top-32 lg:top-40 left-4 sm:left-8 z-[50] flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-black/80 border border-white/20 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>

        {/* Badge Discipline */}
        <div className="absolute top-32 lg:top-40 right-4 sm:right-8 z-[50]">
          <span className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-black/80 border border-white/20 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-[0.3em]">
            {session.type}
          </span>
        </div>

        {/* Titre et Info basiques */}
        <div className="absolute bottom-0 left-0 right-0 z-[50] p-4 sm:p-8 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase">
                {session.club}
              </span>
              <div className="h-[1px] w-8 sm:w-12 bg-white/30"></div>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase flex items-center gap-2">
                <MapPin className="h-3 w-3" /> {session.city}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6">
              {session.title}
            </h1>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-bold uppercase">
                  {new Date(session.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-bold uppercase">{session.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Colonne Principale - Description */}
          <div className="lg:col-span-2 space-y-12">
            <div className="reveal active" data-always-active="true">
              <div className="flex items-center gap-4 mb-8">
                <Info className="h-5 w-5 text-white/40" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  À Propos de la Session
                </h2>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12">
                <p className="text-white/70 text-base leading-relaxed whitespace-pre-line">
                  {session.description}
                </p>
              </div>
            </div>

            {/* Localisation */}
            <div className="reveal active" data-always-active="true">
              <div className="flex items-center gap-4 mb-8">
                <MapPin className="h-5 w-5 text-white/40" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Localisation
                </h2>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12">
                <p className="text-white/80 text-lg font-bold mb-2">{session.club}</p>
                <p className="text-white/50 text-sm mb-6">{session.address}</p>
                <p className="text-white/50 text-sm mb-6">{session.city}</p>
                
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${session.address}, ${session.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                >
                  <Navigation className="h-4 w-4" />
                  Ouvrir dans Maps
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar - Informations Rapides */}
          <div className="space-y-6">
            {/* Carte Info Rapide */}
            <div className="border border-white/10 bg-white/[0.02] p-8 reveal active" data-always-active="true">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8">
                Informations Pratiques
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-4 w-4 text-white/40" />
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Date</p>
                  </div>
                  <p className="text-sm font-black text-white pl-7">
                    {new Date(session.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-4 w-4 text-white/40" />
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Horaire</p>
                  </div>
                  <p className="text-sm font-black text-white pl-7">{session.time}</p>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag className="h-4 w-4 text-white/40" />
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Discipline</p>
                  </div>
                  <p className="text-sm font-black text-white pl-7">{session.type}</p>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-4 w-4 text-white/40" />
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Club</p>
                  </div>
                  <p className="text-sm font-black text-white pl-7">{session.club}</p>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-4 w-4 text-white/40" />
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Tarif</p>
                  </div>
                  <p className="text-sm font-black text-white pl-7">
                    {session.price || 'Gratuit'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton Partager */}
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all"
            >
              <Share2 className="h-4 w-4" />
              Partager
            </button>

            {/* Message Important */}
            <div className="border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                Veuillez contacter directement le club pour confirmer votre participation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenMatDetails;
