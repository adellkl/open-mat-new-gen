import React from 'react';
import { Zap, TrendingUp, Mail } from 'lucide-react';

interface AdSpaceProps {
  size?: 'small' | 'medium' | 'large' | 'banner';
  className?: string;
  showContact?: boolean; // Afficher un lien de contact
}

const AdSpace: React.FC<AdSpaceProps> = ({ size = 'medium', className = '', showContact = true }) => {
  const sizeClasses = {
    small: 'h-32 w-full md:w-64',
    medium: 'h-48 w-full md:w-80',
    large: 'h-80 w-full max-w-4xl',
    banner: 'h-24 w-full'
  };

  return (
    <div
      className={`relative border-2 border-dashed border-white/20 bg-white/[0.02] flex flex-col items-center justify-center overflow-hidden group hover:border-white/40 transition-all ${sizeClasses[size]} ${className}`}
    >
      {/* Grille de fond animée */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Coin indicateurs */}
      <div className="absolute top-2 left-2 flex items-center gap-1 opacity-40">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-[7px] font-black uppercase tracking-wider text-white">AD</span>
      </div>

      <div className="absolute top-2 right-2 opacity-40">
        <TrendingUp className="w-3 h-3 text-white" />
      </div>

      {/* Contenu central */}
      <div className="relative z-10 text-center px-6">
        <div className="mb-4 inline-flex items-center justify-center">
          <Zap className={`${size === 'large' ? 'w-12 h-12' : 'w-8 h-8'} text-white/30 group-hover:text-white/50 transition-colors`} />
        </div>
        {showContact && (
          <a
            href="mailto:adelloukal2@gmail.com?subject=Demande%20d'espace%20publicitaire%20OpenMat%20France"
            className={`inline-flex items-center gap-2 ${size === 'large' ? 'px-6 py-3 text-xs' : 'px-4 py-2 text-[8px]'} border border-white/20 text-white/50 font-black uppercase tracking-wider hover:bg-white/5 hover:text-white/70 hover:border-white/40 transition-all`}
          >
            <Mail className={`${size === 'large' ? 'w-4 h-4' : 'w-3 h-3'}`} />
          </a>
        )}
      </div>

      {/* Effet de glow au hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-all duration-300"></div>

      {/* Ligne animée en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-white/20 animate-[slideHorizontal_3s_infinite]"></div>
      </div>

      <style>{`
        @keyframes slideHorizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AdSpace;
