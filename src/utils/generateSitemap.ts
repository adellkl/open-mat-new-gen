// Générateur de sitemap dynamique pour OpenMat France
import { db } from '../database/db';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://www.openmatfrance.fr';
  const today = new Date().toISOString().split('T')[0];
  
  const urls: SitemapURL[] = [
    // Pages statiques
    {
      loc: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/explorer`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/publier`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/a-propos`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: `${baseUrl}/confidentialite`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.3
    }
  ];

  // Ajouter les sessions approuvées dynamiquement
  try {
    const sessions = await db.getSessions('approved');
    
    sessions.forEach(session => {
      urls.push({
        loc: `${baseUrl}/explorer/${session.id}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.7
      });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions pour le sitemap:', error);
  }

  // Générer le XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Fonction pour sauvegarder le sitemap
export const saveSitemap = async () => {
  const sitemap = await generateSitemap();
  // En production, vous écririez ce fichier dans le dossier public
  console.log('Sitemap généré avec succès');
  return sitemap;
};
