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
  Wine,
  Users,
  Heart,
  Building2,
} from 'lucide-react';
import PageSEOHead from '../components/PageSEOHead';
import LazyImage from '../components/LazyImage';
import { MODELS } from '../constants';
import { getModelCoverImage, getModelCoverThumbnailPath } from '../lib/modelGridImage';
import { getModelProfilePath } from '../lib/modelLink';
import type { Model } from '../types';

const SEO = {
  title: 'Escorts de lujo en Valencia | Valeria Ferrer',
  description:
    'Descubre escorts de lujo en Valencia con perfiles seleccionados, atención privada y acompañantes premium para citas exclusivas, eventos, cenas y experiencias discretas.',
  canonicalUrl: 'https://www.valeriaferrer.com/escorts-de-lujo-valencia',
  keywords:
    'escorts de lujo Valencia, escort de lujo Valencia, acompañantes de lujo Valencia, agencia escorts Valencia, modelos premium Valencia',
};

const FEATURED_SLUGS = ['luna', 'naty', 'flor', 'lili', 'monica', 'key'] as const;

const EXPERIENCES = [
  { icon: Wine, label: 'Cenas privadas en restaurantes y terrazas selectas' },
  { icon: Users, label: 'Eventos sociales, galas y acompañamiento de protocolo' },
  { icon: Heart, label: 'Acompañamiento social con elegancia y naturalidad' },
  { icon: Lock, label: 'Citas discretas con confidencialidad desde el primer contacto' },
  { icon: Building2, label: 'Encuentros en hoteles boutique y espacios privados' },
  { icon: Calendar, label: 'Reservas planificadas con antelación y trato personalizado' },
] as const;

const LOCAL_ZONES = [
  'Valencia centro y Ciutat Vella',
  'Ruzafa',
  'El Carmen',
  'Ciudad de las Artes y Ciencias',
  'Hoteles boutique del centro histórico',
  'Desplazamientos bajo consulta en la ciudad',
] as const;

const FAQ_ITEMS = [
  {
    question: '¿Qué diferencia hay entre escorts de lujo y acompañantes convencionales?',
    answer:
      'Las escorts de lujo se seleccionan por presencia, educación, conversación y adaptación a entornos premium. No se trata solo de apariencia: la experiencia incluye puntualidad, discreción, vestimenta acorde al plan y un trato sofisticado en cenas, eventos o encuentros privados.',
  },
  {
    question: '¿Puedo reservar una acompañante para una cena o evento en Valencia?',
    answer:
      'Sí. Muchas de nuestras modelos están habituadas a cenas, eventos sociales y acompañamiento en Valencia. Indícanos la ocasión, duración y ambiente del encuentro y te recomendamos el perfil más adecuado.',
  },
  {
    question: '¿Las reservas son privadas?',
    answer:
      'La confidencialidad es esencial. La comunicación es directa por Telegram o teléfono, sin intermediarios innecesarios, y cada solicitud se gestiona con total discreción desde el primer mensaje.',
  },
  {
    question: '¿En qué zonas de Valencia están disponibles?',
    answer:
      'Coordinamos citas en Valencia centro, Ruzafa, El Carmen, Ciudad de las Artes, hoteles boutique y otras zonas de la ciudad. Confirma tu ubicación al reservar y te indicamos disponibilidad.',
  },
  {
    question: '¿Cómo contacto con Valeria Ferrer?',
    answer:
      'Puedes escribirnos por Telegram @Valeriaferreeer o llamar al +34 645 872 227. Te orientamos en perfiles, horarios y tipo de experiencia sin compromiso.',
  },
  {
    question: '¿Puedo ver modelos disponibles antes de reservar?',
    answer:
      'Sí. En el catálogo encontrarás perfiles con fotografías, descripción y datos de presencia. También puedes explorar las modelos destacadas de esta página o visitar el catálogo completo antes de contactar.',
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

const FeaturedModelCard: React.FC<{ model: Model; index: number }> = ({ model, index }) => {
  const profilePath = getModelProfilePath(model);
  if (!profilePath) return null;

  return (
    <Link
      to={profilePath}
      className="group overflow-hidden rounded-xl border border-white/5 bg-[#111111] transition-all duration-500 hover:border-[#c2b2a3]/30 hover:shadow-[0_8px_32px_-8px_rgba(194,178,163,0.15)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <LazyImage
          src={modelCardImage(model)}
          alt={`${model.name} — escort de lujo en Valencia`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
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
};

const EscortsLujoValencia: React.FC = () => {
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
        keywords={SEO.keywords}
        canonicalUrl={SEO.canonicalUrl}
        structuredData={faqSchema}
      />

      <header className="bg-[#111111] border-b border-white/5 py-16 md:py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-6 md:mb-8">
            <Link to="/" className="hover:text-[#c2b2a3] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-[#c2b2a3]">Escorts de lujo Valencia</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-6">
            Escorts de lujo en <span className="italic luxury-text-gradient">Valencia</span>
          </h1>
          <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed max-w-3xl mx-auto uppercase tracking-[0.15em]">
            Acompañantes premium seleccionadas para citas privadas, eventos y experiencias exclusivas en
            Valencia.
          </p>
        </div>
      </header>

      <section className="py-16 md:py-14 px-6 border-b border-white/5">
        <div className="max-w-3xl mx-auto space-y-6 text-gray-400 font-light leading-[1.9] text-base md:text-lg">
          <p>
            Valeria Ferrer es una{' '}
            <strong className="text-gray-200 font-normal">agencia de escorts de lujo en Valencia</strong>{' '}
            orientada a quienes buscan más que un encuentro puntual: buscan presencia, conversación,
            elegancia y una experiencia cuidada de principio a fin. Nuestro catálogo reúne{' '}
            <strong className="text-gray-200 font-normal">acompañantes de lujo en Valencia</strong>{' '}
            seleccionadas por imagen, actitud y profesionalidad, con fotografías propias y perfiles
            detallados para que elijas con tranquilidad.
          </p>
          <p>
            Cada <strong className="text-gray-200 font-normal">escort de lujo Valencia</strong> que
            publicamos encaja en entornos exigentes: cenas en restaurantes de referencia, eventos sociales,
            veladas en hoteles boutique o citas íntimas con total discreción. Trabajamos con{' '}
            <strong className="text-gray-200 font-normal">modelos de lujo Valencia</strong> que dominan la
            etiqueta social, la puntualidad y un trato refinado, sin perder naturalidad ni calidez en la
            conversación.
          </p>
          <p>
            Si valoras la confidencialidad, la atención personalizada y un servicio premium, esta página te
            acerca a nuestra propuesta de{' '}
            <strong className="text-gray-200 font-normal">acompañantes premium Valencia</strong>. Puedes{' '}
            <Link
              to="/models"
              className="text-[#c2b2a3] hover:text-white underline underline-offset-4 decoration-[#c2b2a3]/40"
            >
              ver modelos disponibles
            </Link>{' '}
            en el catálogo, consultar{' '}
            <Link
              to="/fees"
              className="text-[#c2b2a3] hover:text-white underline underline-offset-4 decoration-[#c2b2a3]/40"
            >
              tarifas orientativas
            </Link>{' '}
            o contactarnos directamente para planificar{' '}
            <strong className="text-gray-200 font-normal">citas exclusivas Valencia</strong> adaptadas a tu
            agenda y preferencias.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-14 px-6 bg-[#080808] border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-center mb-8 text-white">
            Escort genérica vs. <span className="italic luxury-text-gradient">acompañante de lujo</span>
          </h2>
          <div className="space-y-6 text-gray-400 font-light leading-[1.9] text-base md:text-lg">
            <p>
              Una escort convencional puede cubrir un encuentro básico; una acompañante de lujo aporta
              presencia en contextos exigentes, conversación fluida, imagen cuidada y coherencia entre lo
              que ves en el perfil y lo que vives en persona. En Valeria Ferrer priorizamos perfiles que
              encajan en cenas, eventos y experiencias donde la elegancia importa tanto como la complicidad.
            </p>
            <p>
              La diferencia también está en el proceso: selección rigurosa, fotografías verificadas,
              comunicación directa y reservas gestionadas con discreción. No publicamos listados masivos ni
              perfiles genéricos; cada modelo representa un estándar de calidad acorde a clientes que buscan{' '}
              <strong className="text-gray-200 font-normal">escorts de lujo Valencia</strong> con garantías
              de trato y confidencialidad.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-4 tracking-wide">
            Experiencias <span className="italic luxury-text-gradient">exclusivas</span>
          </h2>
          <p className="text-gray-500 text-xs uppercase tracking-[0.3em] text-center mb-12 max-w-xl mx-auto">
            Servicios habituales de nuestras acompañantes premium
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {EXPERIENCES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-4 p-6 border border-white/5 rounded-xl bg-[#111111]"
              >
                <Icon size={22} className="text-[#c2b2a3] shrink-0 mt-0.5" strokeWidth={1.25} />
                <span className="text-gray-300 font-light leading-relaxed">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-[#080808]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
              Modelos de lujo <span className="italic luxury-text-gradient">destacadas</span>
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-[0.3em] max-w-xl mx-auto">
              Perfiles premium con galería completa — selección Valeria Ferrer
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {featuredModels.map((model, index) => (
              <FeaturedModelCard key={model.slug} model={model} index={index} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/models"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#c2b2a3] hover:text-white transition-colors border-b border-[#c2b2a3]/30 pb-1"
            >
              Ver modelos disponibles
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-14 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-8 text-[#c2b2a3]">
            <MapPin size={22} strokeWidth={1.25} />
            <h2 className="text-2xl md:text-3xl font-light tracking-wide text-center text-white">
              Zonas premium en Valencia
            </h2>
          </div>
          <p className="text-gray-400 font-light leading-relaxed text-center mb-10 max-w-3xl mx-auto">
            Coordinamos encuentros en los entornos más demandados para{' '}
            <strong className="text-gray-200 font-normal">acompañantes de lujo Valencia</strong>. Indica tu
            zona al reservar y confirmamos disponibilidad.
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

      <section className="py-16 md:py-20 px-6 bg-[#111111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-10 md:mb-12 tracking-wide">
            Por qué elegir <span className="italic luxury-text-gradient">Valeria Ferrer</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: ShieldCheck, label: 'Modelos de lujo verificadas y seleccionadas' },
              { icon: Camera, label: 'Fotografías propias y perfiles detallados' },
              { icon: Lock, label: 'Reservas privadas y confidenciales' },
              { icon: Sparkles, label: 'Experiencia premium en cenas y eventos' },
            ].map(({ icon: Icon, label }) => (
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

      <section className="py-16 md:py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-3 tracking-wide">
              Preguntas <span className="italic">frecuentes</span>
            </h2>
            <p className="text-[#c2b2a3] text-xs uppercase tracking-[0.3em]">
              Escorts de lujo, reservas y discreción en Valencia
            </p>
          </div>
          <div className="space-y-1">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-[#080808] border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-6 tracking-wide">
            Reserva tu experiencia de lujo
          </h2>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            Explora perfiles premium, consulta tarifas orientativas o contacta para una cita privada. Te
            respondemos con rapidez y total confidencialidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link
              to="/models"
              className="inline-flex items-center justify-center px-10 py-4 luxury-gradient text-black text-[10px] font-bold uppercase tracking-[0.35em] hover:scale-[1.02] transition-transform duration-300"
            >
              Ver modelos disponibles
            </Link>
            <Link
              to="/booking"
              className="inline-flex items-center justify-center px-10 py-4 border border-[#c2b2a3]/40 text-[#c2b2a3] text-[10px] font-bold uppercase tracking-[0.35em] hover:bg-[#c2b2a3] hover:text-black transition-all duration-500"
            >
              Reservar cita privada
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-gray-500">
            <Link to="/escorts-valencia" className="hover:text-[#c2b2a3] transition-colors">
              Escorts en Valencia
            </Link>
            <Link to="/models" className="hover:text-[#c2b2a3] transition-colors">
              Catálogo de modelos
            </Link>
            <Link to="/fees" className="hover:text-[#c2b2a3] transition-colors">
              Consultar tarifas orientativas
            </Link>
            <Link to="/contact" className="hover:text-[#c2b2a3] transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EscortsLujoValencia;
