
import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, ArrowUpRight, Map as MapIcon, List, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OpenMatSession } from '../../types';
import { db } from '../../database/db';
import SEO from '../../shared/components/SEO';

const FindOpenMat: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<OpenMatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await db.getSessions('approved');
        setSessions(data);
      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           session.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === '' || session.city === selectedCity;
      const matchesType = selectedType === 'Tous' || session.type === selectedType;
      return matchesSearch && matchesCity && matchesType;
    });
  }, [searchTerm, selectedCity, selectedType, sessions]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="h-6 w-6 text-white/20 animate-spin" />
    </div>
  );

  return (
    <>
      <SEO 
        title="Explorer les Sessions Open Mat - JJB & Luta Livre en France"
        description="Trouvez des sessions d'Open Mat de Jiu-Jitsu Brésilien et Luta Livre près de chez vous. Explorez notre base de données mise à jour en temps réel."
        keywords="explorer open mat, sessions jjb france, luta livre sessions, trouver open mat, jiu jitsu près de moi, grappling france"
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

      {/* Barre de recherche Minimaliste - Toujours affichée */}
      <div className="reveal active bg-white/[0.02] border border-white/10 p-2 mb-12 sm:mb-16 lg:mb-20" data-always-active="true">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-white/20" />
            <input
              type="text"
              placeholder="CLUB, VILLE, DISCIPLINE..."
              className="w-full h-12 sm:h-14 lg:h-16 bg-transparent text-white text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wide sm:tracking-widest px-12 sm:px-16 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:col-span-3 md:border-l border-white/5">
            <select
              className="w-full h-12 sm:h-14 lg:h-16 bg-transparent text-white/60 text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wide sm:tracking-widest px-4 sm:px-8 outline-none appearance-none cursor-pointer"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="" className="bg-black">TOUTES LES VILLES</option>
              {Array.from(new Set(sessions.map(s => s.city))).map((city) => (
                <option key={city as string} value={city as string} className="bg-black">{(city as string).toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3 md:border-l border-white/5">
            <select
              className="w-full h-12 sm:h-14 lg:h-16 bg-transparent text-white/60 text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wide sm:tracking-widest px-4 sm:px-8 outline-none appearance-none cursor-pointer"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="Tous" className="bg-black">TOUTES DISCIPLINES</option>
              <option value="JJB" className="bg-black">JJB (GI)</option>
              <option value="Luta Livre" className="bg-black">LUTA LIVRE (NO-GI)</option>
              <option value="Mixte" className="bg-black">MIXTE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des sessions */}
      <div className="grid grid-cols-1 gap-1">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session, idx) => (
            <React.Fragment key={session.id}>
              <div 
              className="group bg-white/[0.01] border border-white/5 p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start lg:items-center hover:bg-white/[0.03] hover:border-white/20 transition-all duration-500"
            >
            <div className="w-full lg:w-56 xl:w-64 h-40 sm:h-44 lg:h-48 bg-zinc-900 overflow-hidden shrink-0 flex items-center justify-center">
              {session.photo ? (
                <img 
                  src={session.photo} 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  alt={session.club}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                  <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[8px] font-bold uppercase tracking-wider">Pas de photo</span>
                </div>
              )}
            </div>

            <div className="flex-grow w-full min-w-0">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <span className="text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-white/40 uppercase break-words max-w-full">{session.club}</span>
                <div className="h-[1px] w-6 sm:w-8 bg-white/10 shrink-0"></div>
                <span className="text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] text-white uppercase">{session.type}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-6 sm:mb-8 break-words max-w-full leading-tight">{session.title}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">Ville</p>
                  <p className="text-xs font-bold text-white uppercase break-words overflow-hidden">{session.city}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">Date</p>
                  <p className="text-xs font-bold text-white uppercase break-words overflow-hidden">{new Date(session.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">Horaire</p>
                  <p className="text-xs font-bold text-white break-words overflow-hidden">{session.time}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">Accès</p>
                  <p className="text-xs font-bold text-white uppercase break-words overflow-hidden">{session.price}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/explorer/${session.id}`)}
              className="w-full lg:w-auto px-6 sm:px-10 py-4 sm:py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-white hover:text-black transition-all whitespace-nowrap shrink-0 text-center"
            >
              Détails
            </button>
          </div>
            </React.Fragment>
          ))
        ) : (
          <div className="py-40 text-center border border-white/5 bg-white/[0.01] reveal active" data-always-active="true">
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