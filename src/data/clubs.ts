export interface Club {
  id: string;
  name: string;
  city: string;
  logo: string; // URL du logo ou data:image en base64
  academy?: string; // Affiliation (Gracie Barra, Alliance, etc.)
  type: 'JJB' | 'Luta Livre' | 'Grappling' | 'MMA';
}

// Fonction pour générer un logo SVG avec initiales
const generateLogoSVG = (initials: string, bgColor: string = '#1a1a1a', textColor: string = '#ffffff'): string => {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${bgColor}"/>
      <text x="100" y="120" font-family="Arial, sans-serif" font-size="80" font-weight="900" fill="${textColor}" text-anchor="middle">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Base de données des principaux clubs de grappling en France
export const CLUBS_DATABASE: Club[] = [
  // Paris et Île-de-France
  {
    id: 'gracie-barra-paris',
    name: 'Gracie Barra Paris',
    city: 'Paris',
    logo: generateLogoSVG('GB', '#cc0000', '#ffffff'),
    academy: 'Gracie Barra',
    type: 'JJB'
  },
  {
    id: 'team-malecot',
    name: 'Team Malécot',
    city: 'Paris',
    logo: generateLogoSVG('TM', '#0066cc', '#ffffff'),
    type: 'JJB'
  },
  {
    id: 'cercle-tissier',
    name: 'Cercle Tissier',
    city: 'Vincennes',
    logo: generateLogoSVG('CT', '#8b0000', '#ffffff'),
    type: 'JJB'
  },
  {
    id: 'team-nantes-jjb',
    name: 'Team Nantes JJB',
    city: 'Nantes',
    logo: generateLogoSVG('TN', '#004d00', '#ffffff'),
    type: 'JJB'
  },
  {
    id: 'bjj-academy-marseille',
    name: 'BJJ Academy Marseille',
    city: 'Marseille',
    logo: generateLogoSVG('BJJ', '#003399', '#ffffff'),
    type: 'JJB'
  },
  {
    id: 'alliance-paris',
    name: 'Alliance Jiu-Jitsu Paris',
    city: 'Paris',
    logo: generateLogoSVG('A', '#000000', '#ffdd00'),
    academy: 'Alliance',
    type: 'JJB'
  },
  {
    id: 'kimura-academy',
    name: 'Kimura Academy',
    city: 'Lyon',
    logo: generateLogoSVG('KA', '#cc0000', '#000000'),
    type: 'JJB'
  },
  {
    id: 'brasa-team-france',
    name: 'Brasa Team France',
    city: 'Paris',
    logo: generateLogoSVG('BT', '#009900', '#ffcc00'),
    academy: 'Brasa',
    type: 'JJB'
  },
  {
    id: 'jjb-toulouse',
    name: 'JJB Toulouse',
    city: 'Toulouse',
    logo: generateLogoSVG('TLS', '#8B008B', '#ffffff'),
    type: 'JJB'
  },
  {
    id: 'checkmat-france',
    name: 'CheckMat France',
    city: 'Paris',
    logo: generateLogoSVG('CM', '#000000', '#FFD700'),
    academy: 'CheckMat',
    type: 'JJB'
  },
  {
    id: 'gracie-humaita-france',
    name: 'Gracie Humaita France',
    city: 'Paris',
    logo: generateLogoSVG('GH', '#ffffff', '#cc0000'),
    academy: 'Gracie Humaita',
    type: 'JJB'
  },
  {
    id: 'carlson-gracie-france',
    name: 'Carlson Gracie France',
    city: 'Nice',
    logo: generateLogoSVG('CG', '#8b4513', '#ffffff'),
    academy: 'Carlson Gracie',
    type: 'JJB'
  },
  {
    id: 'mjj-bordeaux',
    name: 'MJJ Bordeaux',
    city: 'Bordeaux',
    logo: generateLogoSVG('MJJ', '#660000', '#ffffff'),
    type: 'JJB'
  },
  {
    id: 'atos-paris',
    name: 'Atos Jiu-Jitsu Paris',
    city: 'Paris',
    logo: generateLogoSVG('A', '#000080', '#ffffff'),
    academy: 'Atos',
    type: 'JJB'
  },
  {
    id: 'fight-zone-lille',
    name: 'Fight Zone Lille',
    city: 'Lille',
    logo: generateLogoSVG('FZ', '#ff6600', '#000000'),
    type: 'JJB'
  },
  {
    id: 'luta-livre-france',
    name: 'Luta Livre France',
    city: 'Paris',
    logo: generateLogoSVG('LL', '#ffcc00', '#000000'),
    type: 'Luta Livre'
  },
  {
    id: 'renzo-gracie-france',
    name: 'Renzo Gracie France',
    city: 'Paris',
    logo: generateLogoSVG('RG', '#000000', '#ffffff'),
    academy: 'Renzo Gracie',
    type: 'JJB'
  },
  {
    id: 'team-lloyd-irvin-france',
    name: 'Team Lloyd Irvin France',
    city: 'Paris',
    logo: generateLogoSVG('TLI', '#cc0000', '#000000'),
    type: 'JJB'
  },
  {
    id: 'nova-uniao-france',
    name: 'Nova União France',
    city: 'Lyon',
    logo: generateLogoSVG('NU', '#000080', '#ffcc00'),
    academy: 'Nova União',
    type: 'JJB'
  },
  {
    id: 'de-la-riva-france',
    name: 'De La Riva France',
    city: 'Marseille',
    logo: generateLogoSVG('DLR', '#006600', '#ffffff'),
    type: 'JJB'
  },
  // Clubs supplémentaires
  {
    id: 'bjj-club-strasbourg',
    name: 'BJJ Club Strasbourg',
    city: 'Strasbourg',
    logo: generateLogoSVG('SBG', '#003399', '#ffffff'),
    type: 'JJB'
  },
  {
    id: 'grappling-academy-montpellier',
    name: 'Grappling Academy Montpellier',
    city: 'Montpellier',
    logo: generateLogoSVG('GAM', '#ff8c00', '#000000'),
    type: 'Grappling'
  },
  {
    id: 'team-béziers',
    name: 'Team Béziers JJB',
    city: 'Béziers',
    logo: generateLogoSVG('TBZ', '#8b0000', '#ffffff'),
    type: 'JJB'
  },
  {
    id: 'gracie-barra-lyon',
    name: 'Gracie Barra Lyon',
    city: 'Lyon',
    logo: generateLogoSVG('GB', '#cc0000', '#ffffff'),
    academy: 'Gracie Barra',
    type: 'JJB'
  },
  {
    id: 'team-noge',
    name: 'Team Nogé',
    city: 'Paris',
    logo: generateLogoSVG('TN', '#4169E1', '#ffffff'),
    type: 'JJB'
  }
];

// Fonction pour rechercher des clubs par nom
export const searchClubs = (query: string): Club[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return CLUBS_DATABASE.filter(club => 
    club.name.toLowerCase().includes(lowerQuery) ||
    club.city.toLowerCase().includes(lowerQuery) ||
    club.academy?.toLowerCase().includes(lowerQuery)
  ).slice(0, 8); // Limiter à 8 résultats
};

// Fonction pour obtenir un club par son ID
export const getClubById = (id: string): Club | undefined => {
  return CLUBS_DATABASE.find(club => club.id === id);
};

// Logo par défaut pour les clubs sans logo
export const DEFAULT_CLUB_LOGO = generateLogoSVG('JJB', '#1a1a1a', '#ffffff');
