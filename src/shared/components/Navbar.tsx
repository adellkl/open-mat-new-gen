import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const navItems = [
    { label: 'ACCUEIL', path: '/' },
    { label: 'EXPLORER', path: '/explorer' },
    { label: 'PUBLIER', path: '/publier' },
    { label: 'À PROPOS', path: '/a-propos' },
    { label: 'CONTACT', path: '/contact' },
  ];

  // Mettre à jour currentPath quand location change
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Bloquer le scroll de l'arrière-plan quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Fermer le menu avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const isActive = (path: string): boolean => {
    // Page d'accueil - correspondance STRICTE
    if (path === '/') {
      return currentPath === '/';
    }
    
    // Page Explorer - inclut les sous-routes  
    if (path === '/explorer') {
      return currentPath === '/explorer' || currentPath.startsWith('/explorer/');
    }
    
    // Toutes les autres pages - correspondance exacte
    return currentPath === path;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[200] py-3 lg:py-8">
        <div className="max-w-[90rem] mx-auto px-3 lg:px-12">
          <div className={`relative flex items-center justify-between px-4 lg:px-12 py-3 lg:py-6 transition-all duration-500 ${
            scrolled 
              ? 'bg-black/95 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)]' 
              : 'bg-black/70 backdrop-blur-xl border border-white/10'
          }`}>
            
            {/* Decorative lines left */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
            
            {/* Decorative lines right */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <div className="absolute right-2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>

            {/* Logo */}
            <Link
              to="/"
              className="focus:outline-none focus-visible:outline-none focus:ring-0 focus:shadow-none active:outline-none active:scale-100 [-webkit-tap-highlight-color:transparent] select-none"
              style={{ transition: 'none' }}
            >
              <span className="text-white font-black text-lg lg:text-2xl tracking-tighter uppercase pointer-events-none">
                OPENMAT<span className="text-white/40">.FR</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none focus-visible:outline-none focus:ring-0 focus:shadow-none active:outline-none [-webkit-tap-highlight-color:transparent] select-none group overflow-hidden
                    ${isActive(item.path)
                      ? 'text-white'
                      : 'text-white/50 hover:text-white'
                    }`}
                >
                  {/* Background on hover/active */}
                  <span className={`absolute inset-0 transition-all duration-300 ${
                    isActive(item.path) 
                      ? 'bg-white/10 border border-white/20' 
                      : 'bg-white/0 border border-white/0 group-hover:bg-white/5 group-hover:border-white/10'
                  }`}></span>
                  
                  {/* Top accent line for active */}
                  {isActive(item.path) && (
                    <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"></span>
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-white/30 font-mono text-[9px]">0{index + 1}</span>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white transition-all duration-300 rounded-sm border border-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span className={`h-[2px] w-full bg-white transition-all duration-500 ease-in-out origin-center ${
                  isOpen ? 'rotate-45 translate-y-[7px] scale-110' : 'rotate-0 translate-y-0'
                }`}></span>
                <span className={`h-[2px] w-full bg-white transition-all duration-300 ease-in-out ${
                  isOpen ? 'opacity-0 scale-x-0 rotate-180' : 'opacity-100 scale-x-100 rotate-0'
                }`}></span>
                <span className={`h-[2px] w-full bg-white transition-all duration-500 ease-in-out origin-center ${
                  isOpen ? '-rotate-45 -translate-y-[7px] scale-110' : 'rotate-0 translate-y-0'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-lg z-[190] lg:hidden transition-all duration-700 ease-out ${isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      >
        {/* Effet de grille technique */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-black/98 backdrop-blur-2xl border-l-2 border-white/20 z-[195] lg:hidden transition-all duration-700 ease-out overflow-y-auto ${isOpen
            ? 'translate-x-0 shadow-[-20px_0_60px_rgba(255,255,255,0.1)]'
            : 'translate-x-full'
          }`}
      >
        {/* Effet scanline */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.25)_50%)] bg-[length:100%_2px]"></div>
        
        {/* Lignes décoratives animées */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <div className="p-8 pt-32 sm:pt-36 space-y-6">
          {/* Menu Items */}
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block relative px-8 py-5 text-sm font-black uppercase tracking-[0.3em] transition-all duration-300 overflow-visible group text-center border border-white/0 hover:border-white/20 rounded-sm focus:outline-none active:opacity-100 [-webkit-tap-highlight-color:transparent] ${isActive(item.path)
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
                }`}
            >
              {/* Petit demi-carré en haut à droite pour le lien actif */}
              {isActive(item.path) && (
                <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></span>
              )}
              
              {/* Ligne de progression au hover */}
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-white transition-all duration-300 ${isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              
              <span className="flex items-center justify-center gap-3">
                {/* Indicateur numérique */}
                <span className="text-[10px] text-white/30 font-mono">0{index + 1}</span>
                {item.label}
                <svg
                  className={`h-4 w-4 transition-all duration-300 ${isActive(item.path) ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}

          {/* Footer Info */}
          <div
            className="mt-16 pt-8 border-t border-white/20 text-center space-y-4"
          >
            {/* Logo */}
            <div className="inline-block px-6 py-3 border border-white/10 rounded-sm">
              <p className="text-xs font-black tracking-[0.3em] text-white/40 uppercase">
                OPENMAT<span className="text-white/20">.FR</span>
              </p>
            </div>
            
            {/* Description */}
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
              L'infrastructure Grappling
            </p>
            
            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 text-[9px] text-white/30 uppercase tracking-wider mt-6">
              <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse"></div>
              <span>Système Opérationnel</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
