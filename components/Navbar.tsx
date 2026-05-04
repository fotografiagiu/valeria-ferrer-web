import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Lock, Clock, Mail, Send, Phone } from 'lucide-react';

interface NavbarProps {
  isScrolled: boolean;
  openMembers: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, openMembers }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
    }`}>
      {/* Top Bar */}
      <div className="flex items-center justify-center space-x-4 md:space-x-8 text-[10px] md:text-[11px] font-medium tracking-widest text-[#c2b2a3] border-b border-[#c2b2a3]/10 pb-2 mb-2 px-4 text-center">
        <a href="https://t.me/Valeriaferreeer" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
          <Send size={12} className="mr-2 hidden md:block" />
          <span className="uppercase">Telegram: @Valeriaferreeer</span>
        </a>
        <a href="tel:645872227" className="flex items-center hover:text-white transition-colors">
          <Phone size={12} className="mr-2 hidden md:block" />
          <span className="uppercase">Telf: 645 872 227</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-6 lg:space-x-8 lg:ml-4">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl tracking-[0.05em] font-[300] luxury-text-gradient uppercase leading-none whitespace-nowrap" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.15em', fontWeight: '300' }}>Valeria Ferrer</span>
            <span className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#c2b2a3] font-medium mt-1">Agencia de Modelos de Lujo</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10 text-[13px] font-medium tracking-widest uppercase lg:mr-4">
          <div className="hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/" className="hover:text-[#c2b2a3] transition-colors relative group">
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c2b2a3] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className="hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/models" className="hover:text-[#c2b2a3] transition-colors relative group">
              Modelos
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c2b2a3] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className="hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/blog" className="hover:text-[#c2b2a3] transition-colors relative group">
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c2b2a3] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className="hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/about" className="hover:text-[#c2b2a3] transition-colors relative group">
              Agencia
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c2b2a3] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className="hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/contact" className="hover:text-[#c2b2a3] transition-colors relative group">
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c2b2a3] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className="hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/casting" className="hover:text-[#c2b2a3] transition-colors relative group">
              Casting
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c2b2a3] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className="hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/booking" className="px-6 py-2 border border-[#c2b2a3]/30 text-[#c2b2a3] hover:bg-[#c2b2a3] hover:text-black transition-all duration-300 rounded-full text-[11px] hover:shadow-[0_4px_20px_rgba(194,178,163,0.3)]">
              Reservar
            </Link>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={openMembers} className="flex items-center text-[12px] font-medium tracking-widest uppercase text-[#c2b2a3] hover:text-white transition-colors">
              <Lock size={14} className="mr-2" /> Acceso <span className="ml-2 text-[8px] opacity-60">(Próximamente)</span>
            </button>
            <div className="flex items-center text-[12px] font-medium tracking-widest uppercase cursor-pointer hover:text-[#c2b2a3] transition-colors">
              <Globe size={14} className="mr-1" /> ES
            </div>
          </div>
          
          <button 
            className="lg:hidden p-2 text-[#c2b2a3]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0a0a0a] border-t border-white/5 py-10 px-8 flex flex-col space-y-6 items-center uppercase tracking-[0.2em] text-sm animate-in fade-in slide-in-from-top duration-300">
          <div className="flex flex-col items-center space-y-2 mb-4 pb-4 border-b border-white/5 w-full">
            <a href="https://t.me/Valeriaferreeer" target="_blank" rel="noopener noreferrer" className="flex items-center text-[10px] text-[#c2b2a3]">
              <Send size={12} className="mr-2" />
              <span>Telegram: @Valeriaferreeer</span>
            </a>
            <a href="tel:645872227" className="flex items-center text-[10px] text-[#c2b2a3]">
              <Phone size={12} className="mr-2" />
              <span>Telf: 645 872 227</span>
            </a>
          </div>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
          <Link to="/models" onClick={() => setIsMobileMenuOpen(false)}>Modelos</Link>
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>Agencia</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contacto</Link>
          <Link to="/casting" onClick={() => setIsMobileMenuOpen(false)}>Casting</Link>
          <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-2 border border-[#c2b2a3]/30 text-[#c2b2a3] hover:bg-[#c2b2a3] hover:text-black transition-all duration-300 rounded-full text-[11px]">Reservar</Link>
          <button onClick={() => { setIsMobileMenuOpen(false); openMembers(); }} className="text-[#c2b2a3]">Lounge de Miembros <span className="text-[10px] opacity-60">(Próximamente)</span></button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
