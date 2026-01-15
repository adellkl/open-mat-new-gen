import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    // Optimisations pour le serveur de développement
    hmr: {
      overlay: true
    },
    // Force le pré-bundling des dépendances
    force: false
  },
  preview: {
    port: 3000,
    strictPort: false,
    host: true
  },
  // Optimisation des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@neondatabase/serverless'
    ],
    // Forcer la découverte des dépendances
    force: false
  },
  // Améliorer les performances de build
  build: {
    // Réduire la taille des chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['lucide-react']
        }
      }
    }
  }
});
