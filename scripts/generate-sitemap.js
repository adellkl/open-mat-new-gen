#!/usr/bin/env node

/**
 * Script de génération du sitemap.xml
 * Usage: node scripts/generate-sitemap.js
 * 
 * Ce script génère un sitemap.xml complet incluant toutes les pages statiques
 * et toutes les sessions approuvées de la base de données.
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Configuration
const BASE_URL = 'https://www.openmatfrance.fr';
const OUTPUT_PATH = resolve(process.cwd(), 'public/sitemap.xml');

// Pages statiques
const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/explorer', priority: 0.9, changefreq: 'daily' },
  { path: '/publier', priority: 0.8, changefreq: 'weekly' },
  { path: '/a-propos', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'monthly' },
  { path: '/confidentialite', priority: 0.3, changefreq: 'yearly' }
];

/**
 * Génère une URL de sitemap
 */
function generateUrl(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}${loc}" />
  </url>`;
}

/**
 * Génère le sitemap complet
 */
async function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const urls = [];

  // Ajouter les pages statiques
  staticPages.forEach(page => {
    urls.push(generateUrl(page.path, today, page.changefreq, page.priority));
  });

  // Si vous avez accès à la DB ici, vous pouvez ajouter les sessions dynamiques
  // Pour l'instant, nous utilisons uniquement les pages statiques
  
  // Note: Pour inclure les sessions, décommentez et configurez :
  /*
  try {
    const { db } = await import('../src/database/db.js');
    const sessions = await db.getSessions('approved');
    
    sessions.forEach(session => {
      urls.push(generateUrl(
        `/explorer/${session.id}`,
        today,
        'weekly',
        0.7
      ));
    });
  } catch (error) {
    console.warn('⚠️  Impossible de charger les sessions:', error.message);
  }
  */

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join('\n')}
</urlset>`;

  return xml;
}

/**
 * Script principal
 */
async function main() {
  try {
    console.log('🚀 Génération du sitemap...');
    
    const sitemap = await generateSitemap();
    writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');
    
    console.log('✅ Sitemap généré avec succès!');
    console.log(`📍 Chemin: ${OUTPUT_PATH}`);
    console.log(`📊 URLs incluses: ${staticPages.length} pages statiques`);
    console.log('\n💡 Pour inclure les sessions dynamiques, configurez la connexion DB dans ce script.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
    process.exit(1);
  }
}

main();
