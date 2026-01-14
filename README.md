# OpenMat France

Plateforme de découverte et publication de sessions Open Mat de Jiu-Jitsu Brésilien et Luta Livre en France.

## Technologies

- React 19 + TypeScript
- Tailwind CSS
- Neon PostgreSQL (Serverless)
- Vite

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env.local` :

```env
VITE_DATABASE_URL=postgresql://...
```

## Développement

```bash
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Déploiement

Le projet est configuré pour Vercel avec les fichiers :
- `vercel.json`
- `public/_redirects` (Netlify)
- `public/.htaccess` (Apache)

---

**Développeur** : Adel Loukal  
**Contact** : adelloukal2@gmail.com  
**Site** : https://www.openmatfrance.fr
