
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
            <span className="text-2xl md:text-3xl tracking-[0.1em] font-light luxury-text-gradient uppercase leading-none whitespace-nowrap">Valeria Ferrer</span>
            <span className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#c2b2a3] font-medium mt-1">Agencia de Modelos de Lujo</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10 text-[13px] font-medium tracking-widest uppercase lg:mr-4">
          <Link to="/" className="hover:text-[#c2b2a3] transition-colors">Inicio</Link>
          <Link to="/models" className="hover:text-[#c2b2a3] transition-colors">Modelos</Link>
          <Link to="/about" className="hover:text-[#c2b2a3] transition-colors">Agencia</Link>
          
          <div className="group relative">
            <button className="flex items-center hover:text-[#c2b2a3] transition-colors">
              Experiencias <ChevronDown size={14} className="ml-1" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block">
              <div className="bg-[#1a1a1a] border border-white/5 p-6 w-72 shadow-2xl">
                <div className="mb-4">
                  <p className="text-[9px] text-[#c2b2a3] tracking-widest mb-3 font-bold">SERVICIOS EXCLUSIVOS</p>
                  <ul className="space-y-3">
                    <li><Link to="/services/gfe" className="hover:text-[#c2b2a3] block text-[11px] flex items-center"><span className="w-1 h-1 bg-[#c2b2a3] rounded-full mr-3"></span>Girlfriend Experience</Link></li>
                    <li><Link to="/services/duo" className="hover:text-[#c2b2a3] block text-[11px] flex items-center"><span className="w-1 h-1 bg-[#c2b2a3] rounded-full mr-3"></span>Experiencia Dúo</Link></li>
                    <li><Link to="/services/dinner" className="hover:text-[#c2b2a3] block text-[11px] flex items-center"><span className="w-1 h-1 bg-[#c2b2a3] rounded-full mr-3"></span>Cenas de Negocios</Link></li>
                  </ul>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[9px] text-gray-500 tracking-widest mb-3 font-bold">SERVICIOS PREMIUM</p>
                  <ul className="space-y-3">
                    <li><Link to="/travel" className="hover:text-[#c2b2a3] block text-[11px] flex items-center"><span className="w-1 h-1 bg-gray-500 rounded-full mr-3"></span>Acompañamiento de Viaje</Link></li>
                    <li><Link to="/booking" className="hover:text-[#c2b2a3] block text-[11px] flex items-center"><span className="w-1 h-1 bg-gray-500 rounded-full mr-3"></span>Reservas VIP</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Link to="/casting" className="hover:text-[#c2b2a3] transition-colors">Casting</Link>
          <Link to="/booking" className="px-6 py-2 border border-[#c2b2a3]/30 text-[#c2b2a3] hover:bg-[#c2b2a3] hover:text-black transition-all duration-300 rounded-full text-[11px]">Reservar</Link>
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
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>Agencia</Link>
          <Link to="/casting" onClick={() => setIsMobileMenuOpen(false)}>Casting</Link>
          <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-2 border border-[#c2b2a3]/30 text-[#c2b2a3] hover:bg-[#c2b2a3] hover:text-black transition-all duration-300 rounded-full text-[11px]">Reservar</Link>
          <button onClick={() => { setIsMobileMenuOpen(false); openMembers(); }} className="text-[#c2b2a3]">Lounge de Miembros <span className="text-[10px] opacity-60">(Próximamente)</span></button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
