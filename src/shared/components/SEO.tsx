import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  author?: string;
  type?: 'website' | 'article' | 'event';
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'OpenMat France - Sessions JJB & Luta Livre',
  description = 'Découvrez et publiez des sessions d\'Open Mat de Jiu-Jitsu Brésilien et Luta Livre partout en France. Rejoignez la communauté grappling française.',
  keywords = 'open mat, JJB, jiu-jitsu brésilien, luta livre, grappling, bjj, no-gi',
  ogImage = 'https://www.openmatfrance.fr/og-image.jpg',
  canonical,
  author = 'OpenMat France',
  type = 'website',
  publishedTime,
  modifiedTime
}) => {
  const location = useLocation();
  
  useEffect(() => {
    // Mettre à jour le titre
    document.title = title;
    
    // Mettre à jour la description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Mettre à jour les keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Mettre à jour Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    // Mettre à jour Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    // Mettre à jour Open Graph image
    const ogImageTag = document.querySelector('meta[property="og:image"]');
    if (ogImageTag) {
      ogImageTag.setAttribute('content', ogImage);
    }
    
    // Mettre à jour Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://www.openmatfrance.fr${location.pathname}`);
    }
    
    // Mettre à jour Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    
    // Mettre à jour Twitter description
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
    
    // Mettre à jour Twitter image
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', ogImage);
    }
    
    // Mettre à jour le canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical || `https://www.openmatfrance.fr${location.pathname}`);
    
    // Mettre à jour ou créer les meta tags supplémentaires
    const updateOrCreateMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Meta tags additionnels
    updateOrCreateMeta('author', author);
    updateOrCreateMeta('og:type', type, true);
    updateOrCreateMeta('og:site_name', 'OpenMat France', true);
    updateOrCreateMeta('og:locale', 'fr_FR', true);
    
    if (publishedTime) {
      updateOrCreateMeta('article:published_time', publishedTime, true);
    }
    if (modifiedTime) {
      updateOrCreateMeta('article:modified_time', modifiedTime, true);
    }
    
    // Twitter Card
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:site', '@openmatfrance');
    updateOrCreateMeta('twitter:creator', '@openmatfrance');
    
    // Meta robots
    updateOrCreateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    
  }, [title, description, keywords, ogImage, canonical, location.pathname, author, type, publishedTime, modifiedTime]);
  
  return null;
};

export default SEO;
