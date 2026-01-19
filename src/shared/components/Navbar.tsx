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
      <nav className="fixed top-0 left-0 right-0 z-[200] py-3 lg:py-8" role="navigation" aria-label="Navigation principale">
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
            <div className="hidden lg:flex items-center gap-2" role="menubar">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  role="menuitem"
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={`relative px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 active:outline-none [-webkit-tap-highlight-color:transparent] select-none group overflow-hidden
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
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white transition-all duration-300 rounded-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
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
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobile"
        className={`fixed top-0 right-0 bottom-0 w-full bg-black/98 backdrop-blur-2xl border-l border-white/10 z-[195] lg:hidden transition-all duration-700 ease-out overflow-y-auto ${isOpen
            ? 'translate-x-0'
            : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col justify-center p-6">
          <nav className="space-y-3" role="navigation" aria-label="Menu mobile">
            {/* Menu Items */}
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`block relative px-4 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-200 text-center focus:outline-none focus:ring-2 focus:ring-white/40 [-webkit-tap-highlight-color:transparent] ${isActive(item.path)
                    ? 'text-white'
                    : 'text-white/50'
                  }`}
              >
                {/* Petit demi-carré en haut à droite pour le lien actif */}
                {isActive(item.path) && (
                  <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/60"></span>
                )}
                
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Footer Info */}
          <div className="mt-12 pt-6 border-t border-white/10 text-center space-y-4">
            <p className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">
              OPENMAT<span className="text-white/20">.FR</span>
            </p>
            
            {/* Boutons CTA */}
            <div className="flex flex-col gap-2 px-4">
              <Link
                to="/explorer"
                className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] transition-opacity duration-200 active:opacity-80"
                onClick={() => setIsOpen(false)}
              >
                Explorer
              </Link>
              <Link
                to="/publier"
                className="px-6 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.15em] transition-opacity duration-200 active:opacity-80"
                onClick={() => setIsOpen(false)}
              >
                Publier
              </Link>
            </div>
          </div>
        </div>

        {/* Texte défilant en bas du menu */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/10 py-4">
          <div className="marquee-content">
            <span className="outline-text">JJB • LUTA LIVRE • GRAPPLING • NO-GI • OPEN MAT • </span>
            <span className="outline-text">JJB • LUTA LIVRE • GRAPPLING • NO-GI • OPEN MAT • </span>
          </div>
        </div>

        <style>{`
          .marquee-content {
            display: flex;
            width: fit-content;
            animation: marquee 25s linear infinite;
            will-change: transform;
          }
          
          .outline-text {
            font-size: 2rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            white-space: nowrap;
            color: transparent;
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.12);
            text-stroke: 1px rgba(255, 255, 255, 0.12);
            font-style: italic;
          }
          
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Navbar;
