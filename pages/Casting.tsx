
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Star, Globe, Heart } from 'lucide-react';

const Casting: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    contact: '',
    about: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `SOLICITUD DE CASTING - VALERIA FERRER\n\n` +
      `Nombre: ${formData.name}\n` +
      `Edad: ${formData.age}\n` +
      `Ciudad: ${formData.city}\n` +
      `Contacto: ${formData.contact}\n` +
      `Sobre mí: ${formData.about}\n\n` +
      `* Adjuntaré las fotos a continuación en este chat.`;
    
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/Valeriaferreeer?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl serif luxury-text-gradient uppercase mb-6">Casting</h1>
          <p className="text-gray-400 font-light tracking-widest uppercase text-xs leading-relaxed max-w-2xl mx-auto">
            ¿Deseas formar parte de la agencia más exclusiva del mundo? Buscamos mujeres excepcionales, inteligentes y con una elegancia natural. Únete a Valeria Ferrer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8">
            <h2 className="text-3xl serif text-white uppercase tracking-widest">Requisitos</h2>
            <ul className="space-y-6">
              {[
                { icon: <Star size={18} />, text: "Elegancia natural y saber estar impecable." },
                { icon: <Globe size={18} />, text: "Dominio de idiomas (Mínimo Español e Inglés)." },
                { icon: <Heart size={18} />, text: "Personalidad carismática y culta." },
                { icon: <Camera size={18} />, text: "Excelente presencia física y fotogenia." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-4">
                  <div className="text-[#c2b2a3] mt-1">{item.icon}</div>
                  <span className="text-sm text-gray-400 font-light tracking-wide">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#111111] p-10 border border-[#c2b2a3]/20">
            <h3 className="text-xl serif text-[#c2b2a3] mb-6 uppercase">Beneficios</h3>
            <ul className="space-y-4 text-xs tracking-widest uppercase text-gray-500 leading-relaxed">
              <li>• Representación de alto nivel.</li>
              <li>• Gestión de agenda profesional y discreta.</li>
              <li>• Acceso a los clientes más exclusivos del mundo.</li>
              <li>• Seguridad y protección legal garantizada.</li>
              <li>• Honorarios competitivos y pagos puntuales.</li>
            </ul>
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
              <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Nombre</label>
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
              <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Edad</label>
              <input 
                type="number" 
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[#c2b2a3] transition-colors" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Ciudad de Residencia</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[#c2b2a3] transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">WhatsApp / Telegram</label>
              <input 
                type="text" 
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[#c2b2a3] transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Cuéntanos sobre ti (Experiencia, Idiomas, etc.)</label>
            <textarea 
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={4} 
              className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[#c2b2a3] transition-colors resize-none"
            ></textarea>
          </div>

          <div className="p-8 border border-dashed border-white/10 text-center">
            <Camera size={32} className="mx-auto text-gray-600 mb-4" />
            <p className="text-[10px] tracking-widest uppercase text-gray-500">Adjuntar Fotos (Mínimo 3 fotos recientes sin filtros)</p>
            <p className="text-[8px] text-gray-600 mt-2 uppercase tracking-widest">Se enviarán directamente por Telegram tras pulsar enviar</p>
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-[#c2b2a3] text-black font-bold uppercase tracking-[0.4em] text-xs hover:bg-white transition-all duration-500 mt-10"
          >
            Enviar Solicitud de Casting
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Casting;
