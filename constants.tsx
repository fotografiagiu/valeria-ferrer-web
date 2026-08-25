import { Model, Review, FAQ } from './types';
import modelsData from './data/models.json';
import { filterActiveModels } from './lib/modelsCatalog';

const catalogModels = filterActiveModels(modelsData as { active?: boolean }[]);

export const MODELS: Model[] = catalogModels.map((item) => ({
  id: item.slug,
  slug: item.slug,
  name: item.name,
  age: item.age,
  height: item.height,
  weight: item.weight,
  nationality: item.nationality,
  location: item.city ? `${item.city} | Centro` : 'Valencia | Centro',
  description: item.description || '',
  image: item.coverImageUrl || item.images?.[0] || '',
  hoverImage: item.images?.[1] || item.coverImageUrl || item.images?.[0] || '',
  gallery: item.images || [],
  videos: item.videos || [],
  isNew: item.isNew || false,
  galleryUpdated: item.galleryUpdated || undefined,
  vip: item.vip || false,
  vipRates: item.vipRates || {},
  services: item.services || [],
  availability: item.availability || {},
  featured: item.featured || false,
  tags: item.tags || [],
}));

export const REVIEWS: Review[] = [
  {
    id: '34',
    modelName: 'Barbie',
    title: 'Parece buena chica',
    content:
      'Barbie tiene un rollo colegiala que engancha: mirada dulce, muy guapa y un cuerpo que no te esperas. Maja, fácil de hablar y la cita se pasó volando. Repito.',
    author: 'Marcos D.',
    publishedLabel: 'Agosto 2026',
    publishedAt: '2026-08',
  },
  {
    id: '20',
    modelName: 'Luna',
    title: 'Menuda tarde',
    content:
      'Quedamos en una terraza del centro y en nada ya estábamos riéndonos como si nos conociéramos de siempre. Luna es súper fácil de hablar, no va a mil por hora y se nota que le gusta Valencia. Salí con una sonrisa, de verdad. Repito seguro.',
    author: 'Héctor M.',
    publishedLabel: 'Agosto 2026',
    publishedAt: '2026-08',
  },
  {
    id: '21',
    modelName: 'Mia',
    title: 'Tal cual las fotos',
    content:
      'Mia llegó puntual y es ella, no hay truco. Tiene un rollo muy guapo, habla sin parar (en el buen sentido) y se adapta a lo que le digas. Yo quería una noche light y lo clavó. Muy contento.',
    author: 'Óscar L.',
    publishedLabel: 'Agosto 2026',
    publishedAt: '2026-08',
  },
  {
    id: '22',
    modelName: 'Sofía',
    title: 'Muy cercana',
    content:
      'Sofía es un encanto. Cena, un paseíto y a hablar de todo. Nada de poses raras, se ve a gusto y eso te relaja. Ya le he dicho a la agencia que quiero otra con ella.',
    author: 'Nico B.',
    publishedLabel: 'Agosto 2026',
    publishedAt: '2026-08',
  },
  {
    id: '23',
    modelName: 'Vero',
    title: 'Qué presencia',
    content:
      'Vero entra y se nota. Española, segura, sin inventarse nada. Venía de un viaje de curro y necesitaba desconectar… y vaya si desconecté. Discreta y top.',
    author: 'Guille F.',
    publishedLabel: 'Julio 2026',
    publishedAt: '2026-07',
  },
  {
    id: '24',
    modelName: 'Zoe',
    title: 'Alta y con mucho rollo',
    content:
      'Zoe es altísima y encima súper maja. Fuimos a cenar y luego a un sitio de cócteles y encajó perfecto, cero vergüenza. Todo claro, sin prisas. La agencia va bien y ella es real.',
    author: 'Tomás E.',
    publishedLabel: 'Julio 2026',
    publishedAt: '2026-07',
  },
  {
    id: '25',
    modelName: 'Andrea',
    title: 'Se puede hablar de todo',
    content:
      'Con Andrea no te aburres. Tiene humor, calma y se nota que ha vivido. No es de esas citas de relleno: te ríes, charlas y te sientes a gusto. Si te gusta que haya conversación, esta.',
    author: 'Álvaro P.',
    publishedLabel: 'Junio 2026',
    publishedAt: '2026-06',
  },
  {
    id: '26',
    modelName: 'Jazmín',
    title: 'Me levantó el ánimo',
    content:
      'Jazmín tiene una energía buenísima, sin ser pesada. Divertida, atenta y en persona está igual o mejor que en las fotos. Lo pillamos con poco tiempo y aun así todo fino: mensaje, llegada y listo.',
    author: 'Bruno S.',
    publishedLabel: 'Junio 2026',
    publishedAt: '2026-06',
  },
  {
    id: '27',
    modelName: 'Paula (VIP)',
    title: 'Otro nivel',
    content:
      'Paula es VIP de verdad, no de postureo. Llega hecha un pincel, hotel de lujo y todo cuadrado. Si quieres algo más premium en Valencia, esta.',
    author: 'Ricardo A.',
    publishedLabel: 'Mayo 2026',
    publishedAt: '2026-05',
  },
  {
    id: '28',
    modelName: 'Rihanna',
    title: 'Muy buena onda',
    content:
      'Rihanna va al grano y se nota. Pedí algo más informal y lo clavó: risas, cero rareza. Las fotos son reales, en persona incluso mejor. Me lo pasé genial.',
    author: 'Diego N.',
    publishedLabel: 'Mayo 2026',
    publishedAt: '2026-05',
  },
  {
    id: '29',
    modelName: 'Julieta',
    title: 'Joven pero con cabeza',
    content:
      'Julieta me sorprendió. Es joven, sí, pero educada y con mucho criterio. Fue una cita cortita y aun así salí muy contento. La próxima con más tiempo.',
    author: 'Mateo C.',
    publishedLabel: 'Abril 2026',
    publishedAt: '2026-04',
  },
  {
    id: '30',
    modelName: 'Carolina',
    title: 'Sin prisas',
    content:
      'Carolina va con calma, sin frases de manual ni nada forzado. Una tarde tranquila por el centro, justo lo que buscaba. Acerté.',
    author: 'Nacho R.',
    publishedLabel: 'Abril 2026',
    publishedAt: '2026-04',
  },
  {
    id: '31',
    modelName: 'Naty',
    title: 'Pasión a tope',
    content:
      'Naty tiene fuego, pero sin pasarse: apasionada, educada y puntual. Esa noche me salvó el viaje a Valencia. Agencia fiable, sin dramas.',
    author: 'Jorge V.',
    publishedLabel: 'Marzo 2026',
    publishedAt: '2026-03',
  },
  {
    id: '32',
    modelName: 'Elena',
    title: 'Clase y conversación',
    content:
      'Elena tiene mucha clase. Se habla bien con ella, nada vulgar, y para una cena larga va de cine. De las mejores que he pillado por aquí.',
    author: 'Sebas Q.',
    publishedLabel: 'Febrero 2026',
    publishedAt: '2026-02',
  },
  {
    id: '33',
    modelName: 'Adara',
    title: 'Distinta y agradable',
    content:
      'Adara se sale un poco del resto y se nota. Puntual, discreta y con un estilo propio. Todo limpio de principio a fin, sin rarezas. Recomendada.',
    author: 'Hugo T.',
    publishedLabel: 'Enero 2026',
    publishedAt: '2026-01',
  },
];

export const FAQS: FAQ[] = [
  {
    question: '¿Qué hace especial a la Agencia Valeria Ferrer?',
    answer:
      'Nos enfocamos en un concepto integral que combina estética, pasión, educación y elegancia. Nuestras modelos son seleccionadas meticulosamente por su intelecto, etiqueta social y belleza natural.',
  },
  {
    question: '¿Cómo es el proceso de reserva?',
    answer:
      'El proceso es transparente: 1. Contacto vía email o formulario. 2. Consulta personal y selección. 3. Confirmación de cita. 4. Garantía de discreción y seguridad. 5. Encuentro en la ubicación acordada.',
  },
];

export const FEES = {
  header: 'Tarifas',
  description:
    'Consulta las tarifas orientativas según la duración del encuentro. Los precios pueden variar según la modelo, disponibilidad, tipo de servicio y desplazamiento. Para ver condiciones concretas, revisa la ficha individual de cada modelo o consúltanos directamente.',
  rates: [
    { duration: '30 minutos', price: 'Desde 80 €' },
    { duration: '45 minutos', price: 'Desde 120 €' },
    { duration: '1 hora', price: 'Desde 150 €' },
    { duration: '1,5 horas', price: 'Desde 230 €' },
    { duration: '2 horas', price: 'Desde 300 €' },
    { duration: '3 horas', price: 'Desde 430 €' },
    { duration: 'Salida', price: 'Desde 200 €' },
    { duration: 'Noche / 10h', price: 'Desde 1.200 €' },
    { duration: '24h', price: 'Desde 2.800 €' },
  ],
  conditions: [
    'Las tarifas son orientativas y pueden variar según la modelo.',
    'Consulta la ficha individual para ver los precios concretos.',
    'Los desplazamientos pueden no estar incluidos y se calculan según ubicación.',
    'Las reservas de larga duración pueden requerir depósito previo.',
    'Todas las reservas están sujetas a disponibilidad.',
  ],
};

export const DOCUMENTATION = {
  travel: {
    title: 'Acompañamiento de Viajes',
    content:
      'Las modelos de Valeria Ferrer están disponibles para acompañarle en viajes de negocios o placer. El cliente se hace cargo de los gastos de transporte (Business Class en vuelos de más de 4h), alojamiento en hoteles de 5 estrellas y dietas.',
  },
  etiquette: {
    title: 'Etiqueta y Discreción',
    content:
      'Esperamos de nuestros clientes el mismo nivel de respeto y cortesía que nuestras modelos ofrecen. La discreción es nuestra máxima prioridad: no se permiten grabaciones de ningún tipo y los datos de contacto son eliminados tras el encuentro.',
  },
};
