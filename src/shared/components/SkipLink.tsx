import React from 'react';

/**
 * Composant Skip Link pour l'accessibilité
 * Permet aux utilisateurs de clavier de sauter directement au contenu principal
 */
const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[300] focus:px-6 focus:py-3 focus:bg-white focus:text-black focus:font-bold focus:text-sm focus:uppercase focus:tracking-wider focus:border-2 focus:border-black focus:shadow-lg"
      style={{ transition: 'none' }}
    >
      Aller au contenu principal
    </a>
  );
};

export default SkipLink;
