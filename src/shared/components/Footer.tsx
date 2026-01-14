
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, CircleDot, Lock, ArrowUpRight, Plus } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-black border-t border-white/5 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-4 text-white mb-12 group">
              <CircleDot className="h-6 w-6 text-white" />
              <span className="text-xl font-black tracking-tighter uppercase italic">OpenMat.fr</span>
            </Link>
            <p className="max-w-sm text-white/30 font-medium text-sm leading-relaxed mb-12">
              L'infrastructure numérique de référence pour la communauté Grappling en France. Développé pour la performance et le réseau.
            </p>
            <div className="flex gap-4">
              <a href="mailto:adelloukal2@gmail.com" className="h-12 w-12 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Mail className="h-4 w-4" />
              </a>
              <a href="#" className="h-12 w-12 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-12">Système</h3>
            <ul className="space-y-6">
              {[
                { label: 'Accueil', path: '/' },
                { label: 'Explorer', path: '/explorer' },
                { label: 'Publier', path: '/publier' },
                { label: 'À propos', path: '/a-propos' },
                { label: 'Contact', path: '/contact' },
                { label: 'Confidentialité', path: '/confidentialite' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-between group">
                    {link.label} <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-12">Siège</h3>
            <div className="space-y-6">
               <div className="flex flex-col gap-2">
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">France HQ</p>
                 <p className="text-xs font-medium text-white/40 leading-relaxed">75000, Paris</p>
               </div>
               <div className="flex flex-col gap-2">
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Support</p>
                 <p className="text-xs font-medium text-white/40">adelloukal2@gmail.com</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.5em]">
            © 2026 OPENMAT FRANCE / INFRASTRUCTURE PROTOCOL
          </p>
          <Link 
            to="/admin" 
            className="flex items-center gap-3 text-[9px] font-black text-white/40 uppercase tracking-[0.3em] px-8 py-3 border border-white/10 hover:border-white/40 hover:text-white transition-all"
          >
            <Lock className="h-3 w-3" /> Accès Terminal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
