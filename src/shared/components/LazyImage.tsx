import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  onLoad?: () => void;
}

/**
 * Composant d'image optimisé avec lazy loading et effet de chargement progressif
 */
const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  onLoad 
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Utiliser IntersectionObserver pour lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Charger l'image 50px avant qu'elle soit visible
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${placeholderClassName}`}>
      {/* Placeholder avec effet de shimmer */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      )}
      
      {/* Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
