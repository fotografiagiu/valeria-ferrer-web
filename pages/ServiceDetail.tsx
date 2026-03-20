
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Users, Utensils, ArrowRight } from 'lucide-react';

const servicesData = {
  gfe: {
    title: "Girlfriend Experience",
    subtitle: "Conexión Real y Sofisticada",
    description: "La experiencia GFE (Girlfriend Experience) es nuestro servicio más solicitado. Se trata de una conexión auténtica, cálida y natural, donde la escort se convierte en su pareja ideal. Sin guiones, solo la fluidez de un encuentro genuino.",
    icon: <Heart size={48} />,
    features: [
      "Trato cercano y afectuoso",
      "Conversación inteligente y amena",
      "Complicidad absoluta",
      "Naturalidad en cada momento"
    ],
    image: "https://picsum.photos/seed/gfe/1200/800"
  },
  duo: {
    title: "Experiencia Dúo",
    subtitle: "Doble Elegancia, Doble Placer",
    description: "Para aquellos que buscan una experiencia verdaderamente excepcional, ofrecemos la posibilidad de un encuentro con dos de nuestras escorts. Una coreografía perfecta de belleza y sofisticación diseñada para superar sus fantasías más exigentes.",
    icon: <Users size={48} />,
    features: [
      "Sincronía perfecta entre escorts",
      "Atención personalizada doble",
      "Ambiente de lujo compartido",
      "Experiencia sensorial completa"
    ],
    image: "https://picsum.photos/seed/duo/1200/800"
  },
  dinner: {
    title: "Acompañante de Cenas",
    subtitle: "La Invitada Perfecta",
    description: "Nuestras escorts poseen la educación, el protocolo y la cultura necesarios para acompañarle a los eventos sociales más exclusivos. Ya sea una cena de negocios, una gala benéfica o un evento privado, ella será el centro de todas las miradas por su elegancia.",
    icon: <Utensils size={48} />,
    features: [
      "Dominio de protocolo social",
      "Cultura general y conversación",
      "Vestimenta acorde al evento",
      "Discreción en entornos públicos"
    ],
    image: "https://picsum.photos/seed/dinner/1200/800"
  }
};

const ServiceDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const service = servicesData[type as keyof typeof servicesData];

  useEffect(() => { window.scrollTo(0, 0); }, [type]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <h1 className="text-2xl serif uppercase tracking-widest">Servicio no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="text-[#c2b2a3] mb-6 opacity-40 flex justify-center">{service.icon}</div>
          <h1 className="text-4xl md:text-6xl serif luxury-text-gradient uppercase mb-6">{service.title}</h1>
          <p className="text-[#c2b2a3] font-light tracking-[0.4em] uppercase text-xs mb-4">{service.subtitle}</p>
          <div className="w-20 h-[1px] bg-[#c2b2a3]/30 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-gray-400 font-light leading-[2] text-xl mb-12">
              {service.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-4 group">
                  <div className="w-2 h-2 rounded-full bg-[#c2b2a3] group-hover:scale-150 transition-transform"></div>
                  <span className="text-sm tracking-widest uppercase text-gray-300 font-light">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-16">
              <Link 
                to="/booking" 
                className="inline-flex items-center space-x-4 text-[#c2b2a3] hover:text-white transition-colors group"
              >
                <span className="text-xs font-bold tracking-[0.4em] uppercase">Solicitar este servicio</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] border border-[#c2b2a3]/20 p-4">
              <img src={service.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt={service.title} />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-[#111111] p-10 border border-[#c2b2a3]/20 hidden md:block">
              <Star size={24} className="text-[#c2b2a3] mb-4" />
              <p className="text-sm tracking-widest uppercase text-white font-bold">Excelencia Garantizada</p>
            </div>
          </motion.div>
        </div>

        <div className="bg-[#111111] p-12 md:p-20 border border-white/5 text-center">
          <h3 className="text-2xl serif text-white uppercase tracking-widest mb-8">Personalice su Experiencia</h3>
          <p className="text-gray-500 text-sm font-light leading-relaxed uppercase tracking-widest max-w-2xl mx-auto mb-12">
            Cada cliente es único. Si tiene requerimientos especiales o desea combinar varios servicios, nuestro equipo de conserjería está a su disposición para crear un plan a medida.
          </p>
          <Link 
            to="/booking" 
            className="inline-block px-14 py-5 bg-[#c2b2a3] text-black text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white transition-all duration-500"
          >
            Contactar con Conserjería
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
