
import React from 'react';
import { Mail, Phone, Instagram, Twitter, MapPin, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="space-y-6">
            <h3 className="text-3xl tracking-[0.2em] font-light luxury-text-gradient uppercase leading-none">Valeria Ferrer</h3>
            <p className="text-xs font-light text-gray-400 leading-relaxed uppercase tracking-wider">
              Exclusiva Agencia de Escorts de Lujo que representa a las mejores escorts en todo el mundo. Redefinimos el acompañamiento de lujo con sofisticación y discreción absoluta.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#c2b2a3] hover:bg-[#c2b2a3] hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#c2b2a3] hover:bg-[#c2b2a3] hover:text-black transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-[#c2b2a3]">Escorts Valeria</h4>
            <ul className="space-y-4 text-xs font-light tracking-widest uppercase">
              <li><a href="#" className="hover:text-[#c2b2a3] transition-colors">Escorts de Lujo</a></li>
              <li><a href="#" className="hover:text-[#c2b2a3] transition-colors">Girlfriend Experience</a></li>
              <li><a href="#" className="hover:text-[#c2b2a3] transition-colors">Especiales Dúo</a></li>
            </ul>
          </div>

          {/* Gentlemen Lounge */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-[#c2b2a3]">Para Caballeros</h4>
            <ul className="space-y-4 text-xs font-light tracking-widest uppercase">
              <li><a href="#" className="hover:text-[#c2b2a3] transition-colors">Información de Reserva</a></li>
              <li><a href="#" className="hover:text-[#c2b2a3] transition-colors">Honorarios y Tarifas</a></li>
              <li><a href="#" className="hover:text-[#c2b2a3] transition-colors">Lounge de Miembros <span className="text-[9px] opacity-50">(Próximamente)</span></a></li>
              <li><a href="#" className="hover:text-[#c2b2a3] transition-colors">Guía de Ciudades</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-[#c2b2a3]">Contacto</h4>
            <div className="space-y-4 text-xs font-light tracking-widest">
              <a href="https://t.me/Valeriaferreeer" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:text-[#c2b2a3] transition-colors">
                <Send size={16} className="text-[#c2b2a3]" />
                <span>Telegram: @Valeriaferreeer</span>
              </a>
              <a href="tel:645872227" className="flex items-center space-x-3 hover:text-[#c2b2a3] transition-colors">
                <Phone size={16} className="text-[#c2b2a3]" />
                <span>+34 645 872 227</span>
              </a>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-[#c2b2a3]" />
                <span className="uppercase">Calle Colón, Valencia • Barcelona • Dubái</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] text-gray-500 italic">Calle Colón, Valencia (sin número por privacidad). El número exacto se proporcionará por Telegram o llamada. Discreción absoluta garantizada.</p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-[10px] font-medium tracking-[0.3em] uppercase text-gray-600">
          <p>Copyright © 2026 Agencia Valeria Ferrer™ - Todos los derechos reservados</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-[#c2b2a3]">Aviso Legal</a>
            <a href="#" className="hover:text-[#c2b2a3]">Privacidad</a>
            <a href="#" className="hover:text-[#c2b2a3]">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
