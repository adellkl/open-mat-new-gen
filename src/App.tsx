
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Shared Components
import Navbar from './shared/components/Navbar';
import Footer from './shared/components/Footer';

// Public Pages
import Home from './public/pages/Home';
import About from './public/pages/About';
import FindOpenMat from './public/pages/FindOpenMat';
import OpenMatDetails from './public/pages/OpenMatDetails';
import AddOpenMat from './public/pages/AddOpenMat';
import Contact from './public/pages/Contact';
import Privacy from './public/pages/Privacy';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';

// Composant pour scroller vers le haut lors de la navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroller vers le haut immédiatement
    window.scrollTo(0, 0);
    // Fallback pour les navigateurs qui supportent smooth scroll
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // Réinitialiser et activer les animations reveal
    const initRevealAnimations = () => {
      // Retirer temporairement la classe active pour réinitialiser
      // SAUF pour les éléments avec data-always-active
      const allRevealElements = document.querySelectorAll('.reveal');
      allRevealElements.forEach((el) => {
        if (el.getAttribute('data-always-active') !== 'true') {
          el.classList.remove('active');
        }
      });

      // Créer un nouvel observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              // Ne plus observer une fois activé
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      // Observer tous les éléments .reveal qui ne sont pas déjà actifs
      const revealElements = document.querySelectorAll('.reveal:not(.active)');
      revealElements.forEach((el) => {
        observer.observe(el);
      });

      // Activer immédiatement les éléments avec data-always-active
      const alwaysActiveElements = document.querySelectorAll('.reveal[data-always-active="true"]');
      alwaysActiveElements.forEach((el) => {
        el.classList.add('active');
      });

      return () => {
        revealElements.forEach((el) => observer.unobserve(el));
      };
    };

    // Délai pour s'assurer que le DOM est mis à jour après le changement de route
    const timeoutId = setTimeout(() => {
      initRevealAnimations();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isDashboard = location.pathname === '/admin/dashboard';
  const isAdminLogin = location.pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && !isAdminLogin && <Navbar />}
      <main className={`flex-grow ${!isDashboard && !isAdminLogin ? 'pt-32 lg:pt-40' : ''}`}>
        {children}
      </main>
      {!isDashboard && !isAdminLogin && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/explorer" element={<FindOpenMat />} />
          <Route path="/explorer/:id" element={<OpenMatDetails />} />
          <Route path="/publier" element={<AddOpenMat />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

export default App;
