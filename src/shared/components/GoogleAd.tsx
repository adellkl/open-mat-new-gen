import React, { useEffect } from 'react';

interface GoogleAdProps {
  slot: string; // ID de l'emplacement Google AdSense
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Composant pour afficher des publicités Google AdSense
 * 
 * Pour l'activer :
 * 1. Créer un compte Google AdSense
 * 2. Ajouter le script dans index.html :
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
 *            crossorigin="anonymous"></script>
 * 3. Utiliser ce composant avec votre slot ID
 */
const GoogleAd: React.FC<GoogleAdProps> = ({ 
  slot, 
  format = 'auto', 
  style = { display: 'block' },
  className = ''
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // En développement, afficher un placeholder
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div 
        className={`border-2 border-dashed border-yellow-500/30 bg-yellow-500/5 flex items-center justify-center ${className}`}
        style={{ minHeight: '250px', ...style }}
      >
        <div className="text-center p-4">
          <p className="text-yellow-500/60 text-xs font-bold uppercase tracking-wider mb-2">
            Google AdSense Preview
          </p>
          <p className="text-yellow-500/40 text-[10px] uppercase">
            Slot: {slot} • Format: {format}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // À remplacer par votre ID AdSense
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
};

export default GoogleAd;
