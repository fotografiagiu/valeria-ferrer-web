import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl serif luxury-text-gradient uppercase mb-6">Contacto</h1>
          <p className="text-gray-400 font-light tracking-widest uppercase text-xs leading-relaxed max-w-2xl mx-auto">
            Estamos en el corazón de Valencia. Contáctenos para una experiencia exclusiva y discreta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl serif text-white uppercase tracking-widest mb-8">Información de Contacto</h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="text-[#c2b2a3] mt-1">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white uppercase tracking-widest mb-2">Ubicación</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Calle Colón<br />
                      Valencia, 46004<br />
                      Zona exclusiva y discreta
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="text-[#c2b2a3] mt-1">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white uppercase tracking-widest mb-2">Teléfono</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      <a href="tel:645872227" className="hover:text-[#c2b2a3] transition-colors">
                        +34 645 872 227
                      </a>
                      <br />
                      Disponible 24/7 para clientes VIP
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="text-[#c2b2a3] mt-1">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white uppercase tracking-widest mb-2">Email</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      <a href="mailto:valeriaferrer.agency@gmail.com" className="hover:text-[#c2b2a3] transition-colors">
                        valeriaferrer.agency@gmail.com
                      </a>
                      <br />
                      Respuesta en menos de 2 horas
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="text-[#c2b2a3] mt-1">
                    <Send size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white uppercase tracking-widest mb-2">Telegram</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      <a href="https://t.me/Valeriaferreeer" target="_blank" rel="noopener noreferrer" className="hover:text-[#c2b2a3] transition-colors">
                        @Valeriaferreeer
                      </a>
                      <br />
                      Comunicación segura y cifrada
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#111111] border border-white/5 p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Clock size={20} className="text-[#c2b2a3]" />
                <h3 className="text-xl serif text-white uppercase tracking-widest">Horario de Atención</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Lunes - Viernes</span>
                  <span>24 horas</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Sábado</span>
                  <span>24 horas</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Domingo</span>
                  <span>Cita previa</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Festivos</span>
                  <span>Cita previa</span>
                </div>
                <div className="flex justify-between text-[#c2b2a3] pt-3 border-t border-white/10">
                  <span>Emergencias VIP</span>
                  <span>Disponible siempre</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <h2 className="text-3xl serif text-white uppercase tracking-widest mb-8">Nuestra Ubicación</h2>
            
            <div className="bg-[#111111] border border-white/5 p-4 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 relative">
                <iframe
                  src="https://www.google.com/maps?q=El+Corte+Inglés+Pintor+Sorolla+Colón+Edificio+2,+Valencia&output=embed"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-645872227 lg:h-full min-h-[400px]"
                />
              </div>
            </div>

            <div className="bg-[#111111] border border-white/5 p-8">
              <h3 className="text-xl serif text-white uppercase tracking-widest mb-4">Cómo Llegar</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start">
                  <span className="text-[#c2b2a3] mr-3 mt-1">•</span>
                  <span>Ubicados en Calle Colón, corazón de Valencia, zona exclusiva y discreta</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c2b2a3] mr-3 mt-1">•</span>
                  <span>Acceso discreto por entrada principal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c2b2a3] mr-3 mt-1">•</span>
                  <span>Servicio de conserjería 24/7 para asistencia</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Quick Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-[#111111] border border-white/5 p-12">
            <h2 className="text-3xl serif text-white uppercase tracking-widest mb-6">Contacto Rápido</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-2xl mx-auto">
              Para consultas inmediatas o reservas de última hora, puede contactarnos directamente a través de WhatsApp o teléfono.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="https://wa.me/34687410110"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[#c2b2a3] text-black font-bold uppercase tracking-[0.3em] text-xs hover:bg-white transition-all duration-300"
              >
                <Send size={16} className="mr-3" />
                WhatsApp
              </a>
              <a
                href="tel:645872227"
                className="inline-flex items-center px-8 py-4 border border-[#c2b2a3]/30 text-[#c2b2a3] font-bold uppercase tracking-[0.3em] text-xs hover:bg-[#c2b2a3] hover:text-black transition-all duration-300"
              >
                <Phone size={16} className="mr-3" />
                Llamar Ahora
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
