import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Models from './pages/Models';
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
import Footer from './components/Footer';
import MembersModal from './components/MembersModal';
import Chatbot from './components/Chatbot';
import FloatingContactPopup from './components/FloatingContactPopup';
import ContentProtection from './components/ContentProtection';
import Analytics from './components/Analytics';

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
            <Route path="/fees" element={<Fees />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/casting" element={<Casting />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/services/:type" element={<ServiceDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogArticle />} />
            <Route path="/district/:districtId" element={<DistrictPage />} />
            {/* Rutas adicionales podrían añadirse aquí siguiendo el mismo patrón */}
          </Routes>
        </main>

        <Footer />

        <MembersModal 
          isOpen={isMembersModalOpen} 
          onClose={() => setIsMembersModalOpen(false)} 
        />

        <Chatbot />
        <FloatingContactPopup />
        <ContentProtection />
        <Analytics />
      </div>
    </Router>
  );
};

export default App;
