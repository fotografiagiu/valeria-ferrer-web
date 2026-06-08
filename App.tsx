import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Footer from './components/Footer';
import ContentProtection from './components/ContentProtection';
import AnalyticsTracker from './components/AnalyticsTracker';
import { Analytics } from '@vercel/analytics/react';

const About = React.lazy(() => import('./pages/About'));
const Models = React.lazy(() => import('./pages/Models'));
const ModelsHub = React.lazy(() => import('./pages/ModelsHub'));
const Novedades = React.lazy(() => import('./pages/Novedades'));
const ModelDetail = React.lazy(() => import('./pages/ModelDetail'));
const Fees = React.lazy(() => import('./pages/Fees'));
const Booking = React.lazy(() => import('./pages/Booking'));
const Casting = React.lazy(() => import('./pages/Casting'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Travel = React.lazy(() => import('./pages/Travel'));
const ServiceDetail = React.lazy(() => import('./pages/ServiceDetail'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogArticle = React.lazy(() => import('./pages/BlogArticle'));
const DistrictPage = React.lazy(() => import('./pages/DistrictPage'));
const EscortsValencia = React.lazy(() => import('./pages/EscortsValencia'));
const EscortsLujoValencia = React.lazy(() => import('./pages/EscortsLujoValencia'));
const MembersModal = React.lazy(() => import('./components/MembersModal'));
const FloatingContactPopup = React.lazy(() => import('./components/FloatingContactPopup'));

/** Ruta /members: enlace desde Footer “Lounge de Miembros”; contenido próximamente. */
const MembersPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl serif luxury-text-gradient uppercase tracking-widest mb-6">
          Lounge de Miembros
        </h1>
        <p className="text-gray-400 font-light text-sm leading-relaxed mb-4">
          Zona exclusiva para miembros. Estamos preparando esta experiencia.
        </p>
        <p className="text-[#c2b2a3] text-xs uppercase tracking-[0.3em]">Próximamente</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [enableFloatingContact, setEnableFloatingContact] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let lastScrolled = window.scrollY > 50;

    const updateScrollState = () => {
      rafId = 0;
      const next = window.scrollY > 50;
      if (next === lastScrolled) return;
      lastScrolled = next;
      setIsScrolled(next);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();

    const scrollOpts: AddEventListenerOptions = { passive: true };
    window.addEventListener('scroll', onScroll, scrollOpts);

    return () => {
      window.removeEventListener('scroll', onScroll, scrollOpts);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Carga diferida: popup flotante no es crítico para el primer paint.
  useEffect(() => {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
    let idleId: number | null = null;
    const t = window.setTimeout(() => setEnableFloatingContact(true), 2500);

    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(() => setEnableFloatingContact(true), { timeout: 4000 });
    }

    return () => {
      window.clearTimeout(t);
      if (idleId !== null && 'cancelIdleCallback' in window) {
        // @ts-expect-error cancelIdleCallback not in TS lib by default
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  const routeFallback = useMemo(
    () => (
      <div className="px-6 py-20 text-center text-xs uppercase tracking-[0.35em] text-[#c2b2a3]/55">
        Cargando…
      </div>
    ),
    []
  );

  return (
    <AnalyticsTracker>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
          <Navbar 
            isScrolled={isScrolled} 
            openMembers={() => setIsMembersModalOpen(true)} 
          />
          
          <main>
            <Suspense fallback={routeFallback}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/models" element={<Models />} />
                <Route path="/models/:id" element={<ModelDetail />} />
                <Route path="/escorts-valencia" element={<EscortsValencia />} />
                <Route path="/escorts-de-lujo-valencia" element={<EscortsLujoValencia />} />
                <Route
                  path="/models/kimberly-colombiana-24-años"
                  element={<Navigate to="/models" replace />}
                />
                <Route path="/vip" element={<ModelsHub hubKey="vip" />} />
                <Route path="/nuevas" element={<ModelsHub hubKey="nuevas" />} />
                <Route path="/colombianas" element={<ModelsHub hubKey="colombianas" />} />
                <Route path="/espanolas" element={<ModelsHub hubKey="espanolas" />} />
                <Route path="/jovenes" element={<ModelsHub hubKey="jovenes" />} />
                <Route path="/maduras" element={<ModelsHub hubKey="maduras" />} />
                <Route path="/novedades" element={<Novedades />} />
                <Route path="/fees" element={<Fees />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/casting" element={<Casting />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/travel" element={<Travel />} />
                <Route path="/services/:type" element={<ServiceDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogArticle />} />
                <Route path="/district/:districtId" element={<DistrictPage />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/members" element={<MembersPage />} />

                {/* SEO Redirects - Redirecciones 301 para URLs alternativas */}
                <Route path="/inicio" element={<Navigate to="/" replace />} />
                <Route path="/inicio/*" element={<Navigate to="/" replace />} />
                <Route path="/valencia-casting" element={<Navigate to="/casting" replace />} />

                {/* Rutas adicionales podrían añadirse aquí siguiendo el mismo patrón */}
              </Routes>
            </Suspense>
          </main>

          <Footer />

          {isMembersModalOpen && (
            <Suspense fallback={null}>
              <MembersModal isOpen={isMembersModalOpen} onClose={() => setIsMembersModalOpen(false)} />
            </Suspense>
          )}

          {enableFloatingContact && (
            <Suspense fallback={null}>
              <FloatingContactPopup />
            </Suspense>
          )}
          <ContentProtection />
          <Analytics />
        </div>
      </Router>
    </AnalyticsTracker>
  );
};

export default App;
