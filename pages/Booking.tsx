
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, ShieldCheck, Send } from 'lucide-react';

const Booking: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    escort: '',
    date: '',
    details: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `SOLICITUD DE RESERVA - VALERIA FERRER\n\n` +
      `Nombre: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Escort: ${formData.escort}\n` +
      `Fecha: ${formData.date}\n` +
      `Detalles: ${formData.details}`;
    
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/Valeriaferreeer?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl serif luxury-text-gradient uppercase mb-6">Reservas</h1>
          <p className="text-gray-400 font-light tracking-widest uppercase text-xs leading-relaxed max-w-2xl mx-auto">
            Inicie su experiencia con Valeria Ferrer. Por favor, complete el siguiente formulario con la mayor precisión posible. Toda la información es tratada con absoluta confidencialidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <a href="tel:645872227" className="bg-[#111111] p-8 border border-white/5 text-center hover:border-[#c2b2a3]/30 transition-colors">
            <Phone size={24} className="mx-auto text-[#c2b2a3] mb-4" />
            <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-2">Llamada Directa</p>
            <p className="text-sm font-bold">645 872 227</p>
          </a>
          <a href="https://t.me/Valeriaferreeer" target="_blank" rel="noopener noreferrer" className="bg-[#111111] p-8 border border-white/5 text-center hover:border-[#c2b2a3]/30 transition-colors">
            <Send size={24} className="mx-auto text-[#c2b2a3] mb-4" />
            <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-2">Telegram</p>
            <p className="text-sm font-bold">@Valeriaferreeer</p>
          </a>
          <div className="bg-[#111111] p-8 border border-white/5 text-center">
            <ShieldCheck size={24} className="mx-auto text-[#c2b2a3] mb-4" />
            <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-2">Seguridad</p>
            <p className="text-sm font-bold">Encriptación SSL</p>
          </div>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-[#111111] border border-white/5 p-10 md:p-16 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Nombre Completo</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[#c2b2a3] transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Email de Contacto</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[#c2b2a3] transition-colors" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Escort de Interés</label>
              <select 
                name="escort"
                value={formData.escort}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[#c2b2a3] transition-colors appearance-none"
              >
                <option value="" className="bg-[#111111]">Seleccione una escort</option>
                <option value="ariel" className="bg-[#111111]">Ariel</option>
                <option value="maria" className="bg-[#111111]">Maria</option>
                <option value="carlota" className="bg-[#111111]">Carlota</option>
                <option value="yaiza" className="bg-[#111111]">Yaiza</option>
                <option value="mariana" className="bg-[#111111]">Mariana</option>
                <option value="naty" className="bg-[#111111]">Naty</option>
                <option value="erika" className="bg-[#111111]">Erika</option>
                <option value="tatiana" className="bg-[#111111]">Tatiana (VIP)</option>
                <option value="alicia" className="bg-[#111111]">Alicia</option>
                <option value="paula" className="bg-[#111111]">Paula (VIP)</option>
                <option value="luna" className="bg-[#111111]">Luna</option>
                <option value="tania" className="bg-[#111111]">Tania</option>
                <option value="alba" className="bg-[#111111]">Alba (VIP)</option>
                <option value="claudia" className="bg-[#111111]">Claudia (VIP)</option>
                <option value="brenda" className="bg-[#111111]">Brenda</option>
                <option value="sol" className="bg-[#111111]">Sol</option>
                <option value="lucia" className="bg-[#111111]">Lucia (VIP)</option>
                <option value="carol" className="bg-[#111111]">Carol</option>
                <option value="adara" className="bg-[#111111]">Adara</option>
                <option value="sara" className="bg-[#111111]">Sara</option>
                <option value="sandra" className="bg-[#111111]">Sandra</option>
                <option value="silvia" className="bg-[#111111]">Silvia</option>
                <option value="andrea" className="bg-[#111111]">Andrea</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Fecha Deseada</label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[#c2b2a3] transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Detalles del Encuentro / Preferencias</label>
            <textarea 
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={4} 
              className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[#c2b2a3] transition-colors resize-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-[#c2b2a3] text-black font-bold uppercase tracking-[0.4em] text-xs hover:bg-white transition-all duration-500 mt-10"
          >
            Enviar Solicitud de Reserva
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Booking;
