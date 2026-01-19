
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, ArrowRight, ShieldCheck, Plus,
  ChevronRight, Globe, Trophy, Activity,
  Cpu, Hash, HardDrive, Search, Terminal as TerminalIcon, Clock
} from 'lucide-react';
import SEO from '../../shared/components/SEO';
import LazyImage from '../../shared/components/LazyImage';
import { OrganizationStructuredData, WebSiteStructuredData } from '../../shared/components/StructuredData';
import { db } from '../../database/db';

interface Stat {
  label: string;
  val: string;
  type: 'number';
}

const FillingLine = ({ vertical = false, className = "" }: { vertical?: boolean, className?: string }) => (
  <div className={`relative bg-white/5 overflow-hidden ${vertical ? 'w-[1px] h-full' : 'h-[1px] w-full'} ${className}`}>
    <div className={`absolute inset-0 bg-white/20 ${vertical ? 'animate-[slideVertical_6s_infinite]' : 'animate-[slideHorizontal_6s_infinite]'}`} />
  </div>
);

const TechnicalPanel = ({ side = 'left', children }: { side?: 'left' | 'right', children?: React.ReactNode }) => (
  <div className={`flex flex-col absolute top-0 ${side === 'left' ? 'left-0 border-r' : 'right-0 border-l'} h-full w-16 sm:w-24 md:w-40 xl:w-80 border-white/5 bg-black/40 backdrop-blur-sm z-[5] p-2 sm:p-4 md:p-6 xl:p-8 pt-32 sm:pt-40 xl:pt-48 opacity-50 sm:opacity-60 xl:opacity-100 pointer-events-none`}>
    {children}
  </div>
);

const BentoBlock = ({ title, desc, icon: Icon, className = "", badge, delay = 0 }: { title: string, desc: string, icon: any, className?: string, badge?: string, delay?: number }) => (
  <div
    className={`reveal group relative overflow-hidden bg-white/[0.01] border border-white/5 p-8 sm:p-10 lg:p-12 transition-all duration-700 hover:border-white/20 flex flex-col ${className}`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <Plus className="h-4 w-4 text-white/20" />
    </div>
    <div className="mb-20">
      <div className="inline-flex items-center justify-center p-4 border border-white/10 rounded-sm mb-8 group-hover:border-white/40 transition-colors">
        <Icon className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
      </div>
      {badge && (
        <p className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase mb-4">{badge}</p>
      )}
    </div>
    <div className="mt-auto">
      <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter flex items-center justify-between">
        {title} <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </h3>
      <p className="text-white/40 text-sm font-medium leading-relaxed group-hover:text-white/70 transition-colors">
        {desc}
      </p>
    </div>
  </div>
);

// Composant pour afficher la date/heure
// Composant pour la main animée
const AnimatedHand: React.FC = () => {
  return (
    <div className="absolute top-1/2 right-[10%] -translate-y-1/2 z-20 pointer-events-none hidden lg:block">
      <div className="relative animate-hand-float">
        {/* Main SVG stylisée */}
        <svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          className="animate-hand-point"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
        >
          {/* Paume */}
          <path
            d="M60 20 C70 20, 80 25, 85 35 L90 50 C92 60, 90 70, 85 75 L80 85 C75 95, 70 100, 60 100 C50 100, 45 95, 40 85 L35 75 C30 70, 28 60, 30 50 L35 35 C40 25, 50 20, 60 20 Z"
            fill="rgba(255,255,255,0.1)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            className="group-hover:fill-white/20 group-hover:stroke-white/50 transition-all duration-500"
          />

          {/* Pouce */}
          <path
            d="M60 40 C55 40, 50 45, 48 50 L45 60 C43 65, 45 70, 50 72 C55 74, 60 72, 62 67 L65 57 C67 52, 65 45, 60 40 Z"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            className="group-hover:fill-white/25 transition-all duration-500"
          />

          {/* Index (pointant) */}
          <path
            d="M70 35 L75 25 L80 20 L85 25 L88 35 L90 50 L88 65 L85 75 L80 80 L75 75 L72 65 L70 50 Z"
            fill="rgba(255,255,255,0.2)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            className="animate-finger-tap group-hover:fill-white/30 group-hover:stroke-white/60 transition-all duration-500"
            style={{ transformOrigin: '75px 20px' }}
          />

          {/* Majeur */}
          <path
            d="M75 40 L80 30 L85 25 L90 30 L93 40 L95 55 L93 70 L90 80 L85 85 L80 80 L77 70 L75 55 Z"
            fill="rgba(255,255,255,0.1)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            className="group-hover:fill-white/20 transition-all duration-500"
          />

          {/* Annulaire */}
          <path
            d="M80 45 L85 35 L90 30 L95 35 L98 45 L100 60 L98 75 L95 85 L90 90 L85 85 L82 75 L80 60 Z"
            fill="rgba(255,255,255,0.1)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            className="group-hover:fill-white/20 transition-all duration-500"
          />

          {/* Auriculaire */}
          <path
            d="M85 50 L90 40 L95 35 L100 40 L103 50 L105 65 L103 80 L100 90 L95 95 L90 90 L87 80 L85 65 Z"
            fill="rgba(255,255,255,0.1)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            className="group-hover:fill-white/20 transition-all duration-500"
          />

          {/* Ligne de pointage */}
          <line
            x1="88"
            y1="35"
            x2="110"
            y2="15"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-pulse-glow"
            style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}
          />
        </svg>

        {/* Particules autour de la main */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${30 + i * 15}%`,
              left: `${50 + Math.sin(i) * 20}%`,
              animation: `pulseGlow ${1 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>
    </div>
  );
};

const DateTimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Mettre à jour l'heure chaque seconde
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
    const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC'];

    const day = days[date.getDay()];
    const dayNum = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${dayNum} ${month} ${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <p className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase mb-6 flex items-center gap-2">
        <Clock className="h-3 w-3" /> System Time
      </p>
      <div className="bg-white/[0.02] p-4 border border-white/5 font-mono">
        <div className="text-[8px] text-white/30 uppercase font-black mb-2">Date</div>
        <div className="text-[10px] text-white/60 font-bold mb-4">{formatDate(currentTime)}</div>
        <div className="text-[8px] text-white/30 uppercase font-black mb-2">Heure UTC+1</div>
        <div className="text-[14px] text-white font-black tracking-wider">{formatTime(currentTime)}</div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Sessions Actives', val: '0', type: 'number' },
    { label: 'Clubs Partenaires', val: '0', type: 'number' },
    { label: 'Villes Connectées', val: '10', type: 'number' },
    { label: 'Utilisateurs', val: '9.2k', type: 'number' }
  ]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const sessions = await db.getSessions('approved');

        // Compter les sessions actives
        const activeSessions = sessions.length;

        // Compter les clubs uniques
        const uniqueClubs = new Set(sessions.map(s => s.club));
        const clubsCount = uniqueClubs.size;

        setStats([
          { label: 'Sessions Actives', val: activeSessions.toString(), type: 'number' },
          { label: 'Clubs Partenaires', val: clubsCount.toString(), type: 'number' },
          { label: 'Villes Connectées', val: '10', type: 'number' },
          { label: 'Utilisateurs', val: '9.2k', type: 'number' }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="relative bg-black min-h-screen selection:bg-white selection:text-black">
      <SEO
        title="OpenMat France - Trouvez des Sessions JJB, Luta Livre & Grappling près de chez vous"
        description="🥋 Plateforme gratuite pour trouver et publier des sessions Open Mat de JJB, Luta Livre et Grappling en France. +100 clubs partenaires à Paris, Lyon, Marseille et toute la France. Débutants et confirmés bienvenus."
        keywords="open mat france, open mat paris, open mat lyon, open mat marseille, jjb open mat, luta livre france, jiu jitsu brésilien, bjj france, grappling france, no-gi france, gi jjb, combat au sol, entraînement jjb, sparring jjb, rouler jjb, académie jjb france, club jjb, open mat gratuit, open mat débutant, trouver open mat, sessions jjb, rolling jjb, submission grappling"
        type="website"
      />
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-40"></div>

      {/* SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      {/* Hero Section with Restored Technical Effects */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* LEFT TECHNICAL PANEL */}
        <TechnicalPanel side="left">
          <div className="space-y-6 md:space-y-12">
            <div>
              <p className="hidden md:flex text-[9px] font-black tracking-[0.4em] text-white/20 uppercase mb-6 items-center gap-2">
                <Activity className="h-3 w-3" /> Data Stream
              </p>
              <div className="space-y-2 md:space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center justify-between group">
                    <span className="hidden md:inline text-[8px] font-bold text-white/10 uppercase">Node_0{i}</span>
                    <div className="h-[1px] flex-grow mx-1 md:mx-4 bg-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 animate-[slideHorizontal_3s_infinite]" style={{ animationDelay: `${i * 0.5}s` }}></div>
                    </div>
                    <span className="hidden md:inline text-[8px] font-black text-white/40 uppercase tracking-tighter">Active</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block pt-8 border-t border-white/5">
              <p className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase mb-6 flex items-center gap-2">
                <TerminalIcon className="h-3 w-3" /> Console Logs
              </p>
              <div className="bg-white/[0.02] p-4 font-mono text-[7px] text-white/20 leading-loose border border-white/5">
                {'>'} INITIALIZING_RECRUITMENT...<br />
                {'>'} SYNCING_GEOLOCATION_MAP...<br />
                {'>'} ENCRYPTING_SESSION_DATA...<br />
                {'>'} ANALYZING_GRAPPLING_DENSITY...<br />
                {'>'} STATUS: NOMINAL.
              </div>
            </div>
          </div>
        </TechnicalPanel>

        {/* RIGHT TECHNICAL PANEL */}
        <TechnicalPanel side="right">
          <div className="space-y-6 md:space-y-12">
            <div className="hidden md:block">
              <p className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase mb-6 flex items-center gap-2">
                <Hash className="h-3 w-3" /> Network Traffic
              </p>
              <div className="p-4 border border-white/5 bg-white/[0.01]">
                <div className="flex justify-between text-[8px] text-white/30 uppercase font-black mb-2">
                  <span>Throughput</span>
                  <span>94.8%</span>
                </div>
                <div className="h-1 w-full bg-white/5"><div className="h-full w-[94%] bg-white/40 animate-pulse"></div></div>
              </div>
            </div>
            <div>
              <p className="hidden md:flex text-[9px] font-black tracking-[0.4em] text-white/20 uppercase mb-6 items-center gap-2">
                <Cpu className="h-3 w-3" /> System Load
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`h-4 bg-white/${i % 3 === 0 ? '20' : '5'} transition-opacity duration-300`}></div>
                ))}
              </div>
            </div>
            <div className="hidden md:block mt-auto pt-8 border-t border-white/5">
              <DateTimeDisplay />
            </div>
          </div>
        </TechnicalPanel>

        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6">
          <div className="reveal active flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 opacity-40">
            <div className="h-[1px] w-6 sm:w-8 bg-white"></div>
            <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.3em] sm:tracking-[0.5em] uppercase">Protocol de Combat v.26.1</span>
            <div className="h-[1px] w-6 sm:w-8 bg-white"></div>
          </div>

          <h1 className="reveal active text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black leading-[0.75] tracking-tighter uppercase mb-6 sm:mb-8 lg:mb-10 text-white italic select-none">
            OPEN<br />MAT.FR
          </h1>

          <div className="reveal active max-w-2xl text-center mb-6 sm:mb-8 lg:mb-10 px-4" style={{ transitionDelay: '100ms' }}>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/40 leading-relaxed font-light tracking-wide uppercase">
              L'infrastructure numérique dédiée au <span className="text-white">Grappling</span>. <br />
              <span className="text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] block mt-3 sm:mt-4 font-black">Performance. Réseau. Precision.</span>
            </p>
          </div>

          <div className="reveal active flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 w-full sm:w-auto px-4" style={{ transitionDelay: '200ms' }}>
            <Link
              to="/explorer"
              className="px-8 sm:px-12 lg:px-14 py-5 sm:py-6 bg-white text-black font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:bg-zinc-200 transition-all flex items-center justify-center group shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            >
              <span className="hidden sm:inline">Initialiser la recherche</span>
              <span className="sm:hidden">Explorer</span>
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/publier"
              className="px-8 sm:px-12 lg:px-14 py-5 sm:py-6 border border-white/10 text-white font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:bg-white/5 transition-all text-center"
            >
              <span className="hidden sm:inline">Organiser</span>
              <span className="sm:hidden">Publier</span>
            </Link>
          </div>

          <div className="reveal active animate-bounce opacity-20 mt-4 sm:mt-6" style={{ transitionDelay: '300ms' }}>
            <div className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-white to-transparent mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Structural Bento Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 lg:py-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/5 border border-white/5 overflow-hidden">
          <div className="md:col-span-2 group relative overflow-hidden bg-white/[0.01] border border-white/5 p-8 sm:p-10 lg:p-12 transition-all duration-700 hover:border-white/20 flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-white/20" />
            </div>
            <div className="mb-20">
              <div className="inline-flex items-center justify-center p-4 border border-white/10 rounded-sm mb-8 group-hover:border-white/40 transition-colors">
                <Globe className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase mb-4">Infrastructure</p>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter flex items-center justify-between">
                Réseau Centralisé <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed group-hover:text-white/70 transition-colors">
                L'annuaire exhaustif des tapis ouverts. Une interface pensée pour la précision technique et la rapidité d'accès.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-white/[0.01] border border-white/5 p-8 sm:p-10 lg:p-12 transition-all duration-700 hover:border-white/20 flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-white/20" />
            </div>
            <div className="mb-20">
              <div className="inline-flex items-center justify-center p-4 border border-white/10 rounded-sm mb-8 group-hover:border-white/40 transition-colors">
                <MapPin className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase mb-4">Geodata</p>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter flex items-center justify-between">
                Localisation <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed group-hover:text-white/70 transition-colors">
                Moteur de recherche géospatial haute précision.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-white/[0.01] border border-white/5 p-8 sm:p-10 lg:p-12 transition-all duration-700 hover:border-white/20 flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-white/20" />
            </div>
            <div className="mb-20">
              <div className="inline-flex items-center justify-center p-4 border border-white/10 rounded-sm mb-8 group-hover:border-white/40 transition-colors">
                <ShieldCheck className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase mb-4">Compliance</p>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter flex items-center justify-between">
                Vérification <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed group-hover:text-white/70 transition-colors">
                Protocoles de sécurité et standards de qualité club.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 group relative overflow-hidden bg-white/[0.01] border border-white/5 p-8 sm:p-10 lg:p-12 transition-all duration-700 hover:border-white/20 flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-white/20" />
            </div>
            <div className="mb-20">
              <div className="inline-flex items-center justify-center p-4 border border-white/10 rounded-sm mb-8 group-hover:border-white/40 transition-colors">
                <Trophy className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase mb-4">Networking</p>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter flex items-center justify-between">
                Communauté Élite <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed group-hover:text-white/70 transition-colors">
                Échangez avec les académies de référence et développez votre réseau grappling professionnel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Visual Separator */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <FillingLine className="opacity-40" />
      </div>

      {/* Open Mat Gallery */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
        <div className="mb-12 sm:mb-16 text-center">
          <p className="text-[9px] font-black tracking-[0.4em] text-white/30 uppercase mb-4">Open Mat</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Grappling, Luta Livre & JJB en action
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto mt-4">
            Des sessions ouvertes, des échanges techniques et l&apos;énergie brute du tatami partout en France.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-6">
          <div className="md:col-span-4 h-72 sm:h-80 md:h-96 border border-white/10">
            <LazyImage
              src="/img-jjb/open-mat-rolls-1024x683.jpg"
              alt="Open mat grappling - Session d'entraînement de Jiu-Jitsu Brésilien"
              className="h-full w-full object-cover"
              placeholderClassName="h-full w-full"
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:gap-6">
            <div className="h-40 sm:h-44 md:h-48 border border-white/10">
              <LazyImage
                src="/img-jjb/open-mat-1.png"
                alt="Session JJB - Entraînement de grappling en gi"
                className="h-full w-full object-cover"
                placeholderClassName="h-full w-full"
              />
            </div>
            <div className="h-40 sm:h-44 md:h-48 border border-white/10">
              <LazyImage
                src="/img-jjb/image.jpg"
                alt="Luta livre open mat - Combat au sol no-gi"
                className="h-full w-full object-cover"
                placeholderClassName="h-full w-full"
              />
            </div>
          </div>
          <div className="md:col-span-2 h-56 sm:h-64 md:h-72 border border-white/10">
            <LazyImage
              src="/img-jjb/history-of-ibjjf.jpg"
              alt="Combat au sol - Histoire du grappling brésilien"
              className="h-full w-full object-cover"
              placeholderClassName="h-full w-full"
            />
          </div>
          <div className="md:col-span-2 h-56 sm:h-64 md:h-72 border border-white/10">
            <LazyImage
              src="/img-jjb/open-mat-rolls-1024x683.jpg"
              alt="Grappling training - Entraînement de Jiu-Jitsu en France"
              className="h-full w-full object-cover"
              placeholderClassName="h-full w-full"
            />
          </div>
          <div className="md:col-span-2 h-56 sm:h-64 md:h-72 border border-white/10">
            <LazyImage
              src="/img-jjb/open-mat-1.png"
              alt="Open mat france - Communauté JJB française"
              className="h-full w-full object-cover"
              placeholderClassName="h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28 lg:py-40">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          {stats.map((s, i) => (
            <div key={i} className="reveal active text-center" style={{ transitionDelay: `${i * 100}ms` }}>
              <p className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 sm:mb-6">{s.label}</p>
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter">{s.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA with Animated Hand */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-32 lg:pb-60">
        <div className="border border-white/10 p-8 sm:p-12 md:p-20 lg:p-32 xl:p-40 text-center relative overflow-hidden group hover:border-white/30 transition-all duration-1000">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-white/[0.02] rounded-full blur-3xl animate-pulse-slow"></div>
          </div>

          {/* Animated Hand */}
          <AnimatedHand />

          <div className="relative z-10 reveal active">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 sm:mb-10 md:mb-12 uppercase tracking-tight sm:tracking-tighter italic relative px-2">
              <span className="relative z-10 break-words">ÉLEVEZ VOTRE STANDARD.</span>
              <span className="absolute inset-0 text-white/5 blur-2xl animate-pulse-slow break-words">ÉLEVEZ VOTRE STANDARD.</span>
            </h2>
            <p className="text-white/40 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-16 font-light leading-relaxed relative z-10 px-2">
              Rejoignez l'infrastructure de référence du grappling français. <br className="hidden sm:block" />
              <span className="text-white/60 block sm:inline">Open Mat JJB, Luta Livre & Grappling.</span>
              <span className="text-white/60 block sm:inline">Simple. Efficace. Professionnel.</span>
            </p>
            <div className="relative inline-block w-full sm:w-auto">
              {/* Glow effect behind button */}
              <div className="absolute inset-0 bg-white blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-pulse-glow"></div>
              <Link
                to="/explorer"
                className="relative z-10 inline-flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-12 md:px-16 lg:px-20 py-5 sm:py-6 md:py-7 lg:py-8 bg-white text-black font-black text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] hover:bg-zinc-200 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] group/btn w-full sm:w-auto"
              >
                <span>Ouvrir le terminal</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      <style>{`
        @keyframes slideHorizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideVertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes handPoint {
          0%, 100% { 
            transform: translate(-50%, -50%) rotate(-10deg) scale(1);
          }
          25% { 
            transform: translate(-50%, -50%) rotate(-5deg) scale(1.05);
          }
          50% { 
            transform: translate(-50%, -50%) rotate(-15deg) scale(1);
          }
          75% { 
            transform: translate(-50%, -50%) rotate(-8deg) scale(1.03);
          }
        }
        @keyframes handFloat {
          0%, 100% { 
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% { 
            transform: translate(-50%, -50%) translateY(-20px);
          }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.5; }
        }
        @keyframes fingerTap {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .animate-hand-point {
          animation: handPoint 3s ease-in-out infinite;
        }
        .animate-hand-float {
          animation: handFloat 4s ease-in-out infinite;
        }
        .animate-finger-tap {
          animation: fingerTap 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
