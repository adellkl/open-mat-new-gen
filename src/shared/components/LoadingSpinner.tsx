import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

/**
 * Composant de chargement réutilisable avec design cohérent
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClass = fullScreen 
    ? 'min-h-screen bg-black flex flex-col items-center justify-center' 
    : 'flex flex-col items-center justify-center p-12';

  return (
    <div className={containerClass}>
      <div className="relative">
        {/* Cercle extérieur pulsant */}
        <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" />
        
        {/* Spinner principal */}
        <Loader2 
          className={`${sizeClasses[size]} text-white/40 animate-spin relative z-10`}
        />
      </div>
      
      {text && (
        <p className="mt-6 text-xs font-bold text-white/30 uppercase tracking-[0.3em] animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
