import React, { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Event' | 'BreadcrumbList';
  data: any;
}

/**
 * Composant pour injecter des données structurées JSON-LD
 * Améliore le référencement et l'affichage dans les résultats de recherche
 */
const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  useEffect(() => {
    // Créer un script tag pour les structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `structured-data-${type.toLowerCase()}`;
    script.innerHTML = JSON.stringify(structuredData);
    
    // Supprimer l'ancien script s'il existe
    const existingScript = document.getElementById(script.id);
    if (existingScript) {
      document.head.removeChild(existingScript);
    }
    
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById(script.id);
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [structuredData, type]);

  return null;
};

/**
 * Données structurées pour l'organisation
 */
export const OrganizationStructuredData: React.FC = () => (
  <StructuredData
    type="Organization"
    data={{
      name: 'OpenMat France',
      url: 'https://www.openmatfrance.fr',
      logo: 'https://www.openmatfrance.fr/favicon.svg',
      description: 'Plateforme de découverte et publication de sessions Open Mat de JJB et Luta Livre en France',
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'adelloukal2@gmail.com',
        contactType: 'customer service',
        availableLanguage: 'French'
      }
    }}
  />
);

/**
 * Données structurées pour le site web
 */
export const WebSiteStructuredData: React.FC = () => (
  <StructuredData
    type="WebSite"
    data={{
      name: 'OpenMat France',
      url: 'https://www.openmatfrance.fr',
      description: 'Plateforme de découverte et publication de sessions Open Mat de JJB et Luta Livre en France',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.openmatfrance.fr/explorer?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }}
  />
);

/**
 * Données structurées pour un événement (session)
 */
export const EventStructuredData: React.FC<{
  name: string;
  description: string;
  location: string;
  startDate: string;
  price?: string;
  organizer: string;
}> = ({ name, description, location, startDate, price, organizer }) => (
  <StructuredData
    type="Event"
    data={{
      name,
      description,
      startDate,
      location: {
        '@type': 'Place',
        name: location,
        address: {
          '@type': 'PostalAddress',
          addressLocality: location,
          addressCountry: 'FR'
        }
      },
      organizer: {
        '@type': 'Organization',
        name: organizer
      },
      ...(price && {
        offers: {
          '@type': 'Offer',
          price: price.replace(/[^\d.-]/g, ''),
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock'
        }
      })
    }}
  />
);

export default StructuredData;
