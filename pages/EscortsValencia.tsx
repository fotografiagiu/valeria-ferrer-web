import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ShieldCheck,
  Camera,
  Lock,
  Calendar,
  Sparkles,
  MessageCircle,
  Phone,
  MapPin,
} from 'lucide-react';
import PageSEOHead from '../components/PageSEOHead';
import LazyImage from '../components/LazyImage';
import { MODELS } from '../constants';
import { getModelCoverImage, getModelCoverThumbnailPath } from '../lib/modelGridImage';
import type { Model } from '../types';

const SEO = {
  title: 'Escorts en Valencia | Agencia Premium Valeria Ferrer',
  description:
    'Descubre escorts en Valencia con Valeria Ferrer. Modelos exclusivas, acompañantes seleccionadas y reservas privadas con atención discreta.',
  canonicalUrl: 'https://www.valeriaferrer.com/escorts-valencia',
};

/** Perfiles con galería y portada de alta calidad — solo lectura de MODELS. */
const FEATURED_SLUGS = [
  'flor',
  'monica',
  'key',
  'elena',
  'paula-vip',
  'lana',
  'maria-escort-valencia',
] as const;

const TRUST_POINTS = [
  { icon: ShieldCheck, label: 'Modelos verificadas' },
  { icon: Camera, label: 'Fotografías cuidadas' },
  { icon: Lock, label: 'Atención discreta' },
  { icon: Calendar, label: 'Reserva privada' },
  { icon: Sparkles, label: 'Experiencia premium' },
  { icon: MessageCircle, label: 'Comunicación directa por Telegram o teléfono' },
] as const;

const LOCAL_ZONES = [
  'Centro histórico y Ciutat Vella',
  'Ruzafa y El Carmen',
  'Ciudad de las Artes y Ciencias',
  'Campanar y Avenida de las Cortes Valencianas',
  'Malvarrosa, Cabanyal y playas',
  'Alrededores y desplazamientos bajo consulta',
] as const;

const FAQ_ITEMS = [
  {
    question: '¿Cómo reservar una escort en Valencia?',
    answer:
      'Puedes iniciar la reserva desde nuestra página de modelos, elegir el perfil que más te interese y contactarnos por Telegram o teléfono. Te orientamos en horarios, preferencias y tipo de encuentro con total discreción.',
  },
  {
    question: '¿Las fotografías son reales?',
    answer:
      'Sí. Trabajamos con sesiones propias y revisamos cada perfil antes de publicarlo. Las imágenes reflejan el estilo y la presencia de cada acompañante; si necesitas más detalle, te atendemos de forma privada antes de confirmar.',
  },
  {
    question: '¿Qué zonas de Valencia cubrís?',
    answer:
      'Atendemos en Valencia ciudad y zonas cercanas: Centro, Ruzafa, El Carmen, Ciudad de las Artes, Campanar, Cortes Valencianas, playa y alrededores. Indícanos tu ubicación al reservar y te confirmamos disponibilidad.',
  },
  {
    question: '¿Ofrecéis acompañantes para cenas o eventos?',
    answer:
      'Sí. Muchas de nuestras modelos están habituadas a cenas, eventos sociales y acompañamiento de viaje. Cuéntanos el contexto del encuentro y te recomendamos el perfil más adecuado.',
  },
  {
    question: '¿La reserva es discreta?',
    answer:
      'La discreción es parte esencial del servicio. La comunicación es directa, sin intermediarios innecesarios, y tratamos cada solicitud con confidencialidad desde el primer contacto.',
  },
] as const;

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function modelCardImage(model: Model): string {
  return getModelCoverThumbnailPath(getModelCoverImage(model.image));
}

function modelMetaLine(model: Model): string {
  const place = model.location || 'Valencia';
  if (model.age) return `${model.age} años · ${place}`;
  return place;
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

const FeaturedModelCard: React.FC<{ model: Model; index: number }> = ({ model, index }) => (
  <Link
    to={`/models/${model.slug}`}
    className="group overflow-hidden rounded-xl border border-white/5 bg-[#111111] transition-all duration-500 hover:border-[#c2b2a3]/30 hover:shadow-[0_8px_32px_-8px_rgba(194,178,163,0.15)]"
  >
    <div className="relative aspect-[4/5] overflow-hidden">
      <LazyImage
        src={modelCardImage(model)}
        alt={`${model.name} — escort en Valencia`}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
        priority={index < 4}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      {model.vip && (
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-red-900/40 border border-red-500/30 text-red-300 text-[8px] uppercase tracking-[0.25em] rounded-sm">
          VIP
        </span>
      )}
    </div>
    <div className="p-4 md:p-5 text-center">
      <h3 className="serif text-lg md:text-xl font-light uppercase tracking-wider text-white mb-1 group-hover:text-[#c2b2a3] transition-colors">
        {model.name}
      </h3>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#c2b2a3]/80">{modelMetaLine(model)}</p>
      <div className="mt-3 flex items-center justify-center gap-1 text-[10px] uppercase tracking-[0.28em] text-[#c2b2a3] group-hover:text-white transition-colors">
        <span>Ver perfil</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  </Link>
);

const EscortsValencia: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredModels = useMemo(() => {
    const bySlug = new Map(MODELS.map((m) => [m.slug, m]));
    return FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter((m): m is Model => Boolean(m));
  }, []);

  const faqSchema = useMemo(() => buildFaqSchema(), []);

  return (
    <div className="pt-24 min-h-screen bg-[#0a0a0a] text-white">
      <PageSEOHead
        title={SEO.title}
        description={SEO.description}
        canonicalUrl={SEO.canonicalUrl}
        structuredData={faqSchema}
      />

      {/* Hero */}
      <header className="bg-[#111111] border-b border-white/5 py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-8">
            <Link to="/" className="hover:text-[#c2b2a3] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-[#c2b2a3]">Escorts Valencia</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-6">
            Escorts en <span className="italic luxury-text-gradient">Valencia</span>
          </h1>
          <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.15em]">
            Agencia premium · Acompañantes seleccionadas · Reserva privada
          </p>
        </div>
      </header>

      {/* Intro SEO */}
      <section className="py-16 md:py-20 px-6 border-b border-white/5">
        <div className="max-w-3xl mx-auto space-y-6 text-gray-400 font-light leading-[1.9] text-base md:text-lg">
          <p>
            Si buscas <strong className="text-gray-200 font-normal">escorts en Valencia</strong> con un
            trato cercano, elegante y sin artificios, Valeria Ferrer reúne un catálogo de{' '}
            <strong className="text-gray-200 font-normal">acompañantes en Valencia</strong> elegidas por
            presencia, actitud y profesionalidad. No somos un listado masivo: cada{' '}
            <strong className="text-gray-200 font-normal">escort en Valencia</strong> que publicamos pasa
            por un proceso de selección en el que importan la imagen, la conversación y la capacidad de
            adaptarse a distintos planes, desde una cena íntima hasta un evento social.
          </p>
          <p>
            Valencia es una ciudad que invita a vivir experiencias con calma y estilo. Por eso
            trabajamos como agencia premium, con atención personalizada y{' '}
            <strong className="text-gray-200 font-normal">reservas privadas</strong> que respetan tu
            tiempo y tu privacidad. Puedes explorar perfiles, comparar sensibilidades y contactarnos
            directamente cuando tengas claro qué tipo de compañía buscas: discreta, divertida,
            sofisticada o más reservada.
          </p>
          <p>
            Nuestras modelos combinan fotografías cuidadas con descripciones honestas. Sabemos que al
            buscar <strong className="text-gray-200 font-normal">escort Valencia</strong> o{' '}
            <strong className="text-gray-200 font-normal">escorts Valencia</strong> lo primero es la
            confianza; por eso priorizamos la coherencia entre imagen y encuentro, y estamos disponibles
            para resolver dudas antes de confirmar cualquier cita. El servicio está pensado para
            caballeros que valoran la puntualidad, la elegancia y una comunicación clara.
          </p>
          <p>
            Ofrecemos <strong className="text-gray-200 font-normal">acompañantes exclusivas</strong>{' '}
            para encuentros en hotel, domicilio acordado o salidas por la ciudad. Si necesitas una
            compañera para un restaurante en el centro, un paseo por la Ciudad de las Artes o una velada
            más íntima en Ruzafa, te ayudamos a elegir el perfil adecuado. La disponibilidad varía según
            agenda; te recomendamos contactar con antelación en fines de semana y fechas señaladas.
          </p>
          <p>
            La ciudad ofrece rincones perfectos para citas con estilo: terrazas en Ruzafa, hoteles
            boutique en el centro o paseos al atardecer junto al mar. Nuestras acompañantes conocen la
            dinámica local y se integran con naturalidad en planes sociales o más reservados. Tú marcas
            el ritmo; nosotras nos ocupamos de que la elección del perfil sea sencilla y agradable.
          </p>
          <p>
            Cada perfil del catálogo incluye fotos en alta resolución, datos de presencia y servicios
            habituales, para que puedas decidir con tranquilidad. Si es tu primera vez contratando una{' '}
            <strong className="text-gray-200 font-normal">escort en Valencia</strong>, te guiamos sin
            prisas: horarios, vestimenta, duración del encuentro y logística. Para clientes habituales,
            facilitamos la continuidad con la misma acompañante cuando su agenda lo permite.
          </p>
          <p>
            En Valeria Ferrer creemos que una buena experiencia empieza mucho antes del encuentro: en la
            forma de responder, en el respeto mutuo y en los detalles. Si quieres conocer a nuestras
            modelos destacadas, revisa la selección inferior o visita el{' '}
            <Link to="/models" className="text-[#c2b2a3] hover:text-white underline underline-offset-4 decoration-[#c2b2a3]/40">
              catálogo completo
            </Link>
            . También puedes explorar perfiles{' '}
            <Link to="/vip" className="text-[#c2b2a3] hover:text-white underline underline-offset-4 decoration-[#c2b2a3]/40">
              VIP
            </Link>{' '}
            si buscas un nivel aún más exclusivo, o nuestras{' '}
            <Link
              to="/escorts-de-lujo-valencia"
              className="text-[#c2b2a3] hover:text-white underline underline-offset-4 decoration-[#c2b2a3]/40"
            >
              escorts de lujo en Valencia
            </Link>{' '}
            para cenas, eventos y experiencias premium. Estamos en Valencia para ofrecerte un servicio premium,
            humano y absolutamente discreto.
          </p>
        </div>
      </section>

      {/* Modelos destacadas */}
      <section className="py-16 md:py-24 px-6 bg-[#080808]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
              Modelos <span className="italic luxury-text-gradient">destacadas</span>
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-[0.3em] max-w-xl mx-auto">
              Una muestra de nuestro catálogo — perfiles con galería completa en alta resolución
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredModels.map((model, index) => (
              <FeaturedModelCard key={model.slug} model={model} index={index} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/models"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#c2b2a3] hover:text-white transition-colors border-b border-[#c2b2a3]/30 pb-1"
            >
              Ver todas las modelos
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Zonas locales */}
      <section className="py-16 md:py-20 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-8 text-[#c2b2a3]">
            <MapPin size={22} strokeWidth={1.25} />
            <h2 className="text-2xl md:text-3xl font-light tracking-wide text-center text-white">
              Escorts en Valencia ciudad y zonas exclusivas
            </h2>
          </div>
          <p className="text-gray-400 font-light leading-relaxed text-center mb-10 max-w-2xl mx-auto">
            Coordinamos encuentros en los barrios y entornos más demandados de la capital. Indica tu
            zona al reservar y confirmamos disponibilidad con la modelo que elijas.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LOCAL_ZONES.map((zone) => (
              <li
                key={zone}
                className="px-5 py-4 bg-[#111111] border border-white/5 rounded-lg text-sm text-gray-300 font-light tracking-wide"
              >
                {zone}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Confianza */}
      <section className="py-16 md:py-24 px-6 bg-[#111111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12 tracking-wide">
            Por qué elegir <span className="italic luxury-text-gradient">Valeria Ferrer</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-4 p-6 border border-white/5 rounded-xl bg-[#0a0a0a]/50"
              >
                <Icon size={22} className="text-[#c2b2a3] shrink-0 mt-0.5" strokeWidth={1.25} />
                <span className="text-gray-300 font-light leading-relaxed">{label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <a
              href="https://t.me/Valeriaferreeer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#c2b2a3] hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px]"
            >
              <MessageCircle size={16} />
              Telegram @Valeriaferreeer
            </a>
            <span className="hidden sm:inline text-gray-600">·</span>
            <a
              href="tel:+34645872227"
              className="inline-flex items-center gap-2 text-[#c2b2a3] hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px]"
            >
              <Phone size={16} />
              +34 645 872 227
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-3 tracking-wide">
              Preguntas <span className="italic">frecuentes</span>
            </h2>
            <p className="text-[#c2b2a3] text-xs uppercase tracking-[0.3em]">
              Reservas, zonas y discreción en Valencia
            </p>
          </div>
          <div className="space-y-1">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA + enlaces internos */}
      <section className="py-20 md:py-28 px-6 bg-[#080808] border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-6 tracking-wide">
            ¿Lista para reservar tu experiencia?
          </h2>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            Explora el catálogo o solicita una cita privada. Te respondemos con rapidez y total
            confidencialidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link
              to="/models"
              className="inline-flex items-center justify-center px-10 py-4 luxury-gradient text-black text-[10px] font-bold uppercase tracking-[0.35em] hover:scale-[1.02] transition-transform duration-300"
            >
              Ver modelos
            </Link>
            <Link
              to="/booking"
              className="inline-flex items-center justify-center px-10 py-4 border border-[#c2b2a3]/40 text-[#c2b2a3] text-[10px] font-bold uppercase tracking-[0.35em] hover:bg-[#c2b2a3] hover:text-black transition-all duration-500"
            >
              Reservar cita privada
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-gray-500">
            <Link to="/models" className="hover:text-[#c2b2a3] transition-colors">
              Catálogo de modelos
            </Link>
            <Link to="/vip" className="hover:text-[#c2b2a3] transition-colors">
              Perfiles VIP
            </Link>
            <Link to="/contact" className="hover:text-[#c2b2a3] transition-colors">
              Contacto
            </Link>
            <Link to="/blog/guia-escorts-valencia" className="hover:text-[#c2b2a3] transition-colors">
              Guía Valencia
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EscortsValencia;
