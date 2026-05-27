import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Models from './pages/Models';
import ModelsHub from './pages/ModelsHub';
import Novedades from './pages/Novedades';
import ModelDetail from './pages/ModelDetail';
import Fees from './pages/Fees';
import Booking from './pages/Booking';
import Casting from './pages/Casting';
import Contact from './pages/Contact';
import Travel from './pages/Travel';
import ServiceDetail from './pages/ServiceDetail';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import DistrictPage from './pages/DistrictPage';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Footer from './components/Footer';
import MembersModal from './components/MembersModal';
import FloatingContactPopup from './components/FloatingContactPopup';
import ContentProtection from './components/ContentProtection';
import AnalyticsTracker from './components/AnalyticsTracker';
import LocalAnalyticsDashboard from './components/LocalAnalyticsDashboard';
import { Analytics } from '@vercel/analytics/react';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnalyticsTracker>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
          <Navbar 
            isScrolled={isScrolled} 
            openMembers={() => setIsMembersModalOpen(true)} 
          />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/models" element={<Models />} />
              <Route path="/models/:id" element={<ModelDetail />} />
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
              <Route path="/analytics-local" element={<LocalAnalyticsDashboard />} />
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
          </main>

          <Footer />

          <MembersModal 
            isOpen={isMembersModalOpen} 
            onClose={() => setIsMembersModalOpen(false)} 
          />

          <FloatingContactPopup />
          <ContentProtection />
          <Analytics />
        </div>
      </Router>
    </AnalyticsTracker>
  );
};

export default App;
