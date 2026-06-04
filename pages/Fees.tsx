
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FEES } from '../constants';
import { Wallet, Info, ChevronDown, ChevronUp } from 'lucide-react';
import PageSEOHead from '../components/PageSEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

const FEES_SEO = {
  title: 'Tarifas de escorts en Valencia | Valeria Ferrer',
  description:
    'Consulta tarifas orientativas de escorts y acompañantes en Valencia desde 80 €. Precios según duración, modelo, disponibilidad y desplazamiento.',
  canonicalUrl: 'https://www.valeriaferrer.com/fees',
};

const FEES_FAQ = [
  {
    question: '¿Cuánto cuesta una escort en Valencia?',
    answer:
      'Las tarifas orientativas empiezan desde 80 € (30 minutos) y desde 150 € por 1 hora. Para encuentros más largos, salidas, noche o 24 horas, los precios suben según duración y modelo. Consulta la tabla de esta página y la ficha individual para el detalle exacto.',
  },
  {
    question: '¿Las tarifas son iguales para todas las modelos?',
    answer:
      'No. Cada modelo tiene sus propias tarifas según perfil, experiencia y tipo de servicio. Los importes de esta página son orientativos; el precio concreto puede variar según disponibilidad y condiciones del encuentro.',
  },
  {
    question: '¿El desplazamiento está incluido?',
    answer:
      'En la mayoría de los casos, el desplazamiento no está incluido en la tarifa base. Se calcula según la ubicación del encuentro. Te lo confirmamos al consultar disponibilidad antes de reservar.',
  },
  {
    question: '¿Dónde puedo ver el precio exacto de cada modelo?',
    answer:
      'En la ficha individual de cada modelo, dentro de nuestro catálogo. Allí encontrarás las tarifas concretas por duración y cualquier condición específica de esa acompañante.',
  },
  {
    question: '¿Cómo se confirma una reserva?',
    answer:
      'Puedes iniciar la reserva desde la página de reservas o contactarnos por Telegram o teléfono. Confirmamos disponibilidad, duración, modelo y condiciones antes de cerrar la cita con total discreción.',
  },
] as const;

function buildFeesFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FEES_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        className="w-full py-6 flex items-center justify-between text-left hover:text-[#c2b2a3] transition-colors gap-4"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg font-light tracking-wide">{question}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-[#c2b2a3] shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-[#c2b2a3] shrink-0" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-[400px] opacity-100 pb-8' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-400 font-light leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const Fees: React.FC = () => {
  const faqSchema = useMemo(() => buildFeesFaqSchema(), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageSEOHead
        title={FEES_SEO.title}
        description={FEES_SEO.description}
        canonicalUrl={FEES_SEO.canonicalUrl}
        structuredData={faqSchema}
      />

      <div className="min-h-screen animate-in fade-in duration-700 bg-[#0a0a0a]">
        <div className="pt-24">
          <Breadcrumbs />

          <div className="px-6 pb-24 pt-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Wallet size={40} className="mx-auto text-[#c2b2a3] mb-6 opacity-40" />
                <h1 className="text-4xl md:text-6xl serif luxury-text-gradient uppercase mb-6">
                  {FEES.header}
                </h1>
                <p className="text-gray-400 font-light text-sm leading-relaxed max-w-2xl mx-auto normal-case tracking-normal">
                  {FEES.description}
                </p>
              </div>

              <section className="mb-16" aria-labelledby="fees-rates-heading">
                <h2
                  id="fees-rates-heading"
                  className="text-2xl md:text-3xl font-light text-center mb-6 tracking-wide"
                >
                  Tarifas orientativas por duración
                </h2>
                <p className="text-gray-400 font-light text-sm leading-relaxed max-w-2xl mx-auto text-center mb-12 normal-case tracking-normal">
                  Las tarifas son orientativas y pueden variar según la modelo, duración, disponibilidad
                  y desplazamiento. Para conocer el precio exacto, revisa la ficha individual de cada
                  modelo o consulta disponibilidad directamente.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {FEES.rates.map((rate, idx) => (
                    <div
                      key={idx}
                      className="bg-[#111111] border border-white/5 p-8 hover:border-[#c2b2a3]/30 transition-all"
                    >
                      <h3 className="text-lg serif text-[#c2b2a3] mb-2 uppercase tracking-wide">
                        {rate.duration}
                      </h3>
                      <p className="text-2xl font-light">{rate.price}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-white/[0.02] border border-[#c2b2a3]/10 p-10 rounded-sm mb-16">
                <div className="flex items-center space-x-4 mb-6">
                  <Info size={20} className="text-[#c2b2a3]" />
                  <h2 className="text-sm font-bold tracking-widest uppercase">Condiciones</h2>
                </div>
                <ul className="space-y-4 text-xs font-light text-gray-400 tracking-wide normal-case leading-relaxed">
                  {FEES.conditions.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center px-10 py-4 luxury-gradient text-black text-[10px] font-bold uppercase tracking-[0.35em] hover:scale-[1.02] transition-transform duration-300"
                >
                  Consultar disponibilidad
                </Link>
                <Link
                  to="/models"
                  className="inline-flex items-center justify-center px-10 py-4 border border-[#c2b2a3]/40 text-[#c2b2a3] text-[10px] font-bold uppercase tracking-[0.35em] hover:bg-[#c2b2a3] hover:text-black transition-all duration-500"
                >
                  Ver modelos
                </Link>
              </div>

              <section className="border-t border-white/5 pt-16 mb-16" aria-labelledby="fees-faq-heading">
                <div className="text-center mb-12">
                  <h2 id="fees-faq-heading" className="text-3xl md:text-4xl font-light mb-3 tracking-wide">
                    Preguntas <span className="italic">frecuentes</span>
                  </h2>
                  <p className="text-[#c2b2a3] text-xs uppercase tracking-[0.3em]">
                    Tarifas, reservas y condiciones
                  </p>
                </div>
                <div>
                  {FEES_FAQ.map((item) => (
                    <FaqItem key={item.question} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </section>

              <nav
                className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-gray-500 border-t border-white/5 pt-10"
                aria-label="Enlaces relacionados"
              >
                <Link to="/models" className="hover:text-[#c2b2a3] transition-colors">
                  Ver modelos
                </Link>
                <Link to="/escorts-valencia" className="hover:text-[#c2b2a3] transition-colors">
                  Escorts en Valencia
                </Link>
                <Link to="/booking" className="hover:text-[#c2b2a3] transition-colors">
                  Reservar
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fees;
