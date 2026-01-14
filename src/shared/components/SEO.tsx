import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'OpenMat France - Sessions JJB & Luta Livre',
  description = 'Découvrez et publiez des sessions d\'Open Mat de Jiu-Jitsu Brésilien et Luta Livre partout en France. Rejoignez la communauté grappling française.',
  keywords = 'open mat, JJB, jiu-jitsu brésilien, luta livre, grappling, bjj, no-gi',
  ogImage = 'https://www.openmatfrance.fr/og-image.jpg',
  canonical
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
    
  }, [title, description, keywords, ogImage, canonical, location.pathname]);
  
  return null;
};

export default SEO;
