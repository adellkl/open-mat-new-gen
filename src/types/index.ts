
export interface OpenMatSession {
  id: string;
  title: string;
  club: string;
  city: string;
  address: string;
  date: string;
  time: string;
  price: string;
  type: 'JJB' | 'Luta Livre' | 'Mixte';
  description: string;
  status: 'pending' | 'approved';
  photo?: string; // URL ou base64 de la photo
  coordinates: {
    lat: number;
    lng: number;
    x: number;
    y: number;
  };
}

export type NavItem = {
  label: string;
  path: string;
};
