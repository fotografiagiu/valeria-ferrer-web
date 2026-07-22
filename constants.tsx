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
  vip: item.vip || false,
  vipRates: item.vipRates || {},
  services: item.services || [],
  availability: item.availability || {},
  featured: item.featured || false,
  tags: item.tags || [],
}));

export const REVIEWS: Review[] = [
  {
    id: '10',
    modelName: 'Flor',
    title: 'Calma y elegancia natural',
    content:
      'Flor transmite una serenidad que se agradece desde el primer minuto. Cena tranquila en el centro, conversación fluida y una presencia impecable sin artificios. Muy recomendable si buscas discreción y trato cercano.',
    author: 'Daniel H.',
    publishedLabel: 'Mayo 2026',
    publishedAt: '2026-05',
  },
  {
    id: '11',
    modelName: 'Mónica',
    title: 'Presencia y clase mediterránea',
    content:
      'Mónica destaca por su estatura y su manera de estar: segura, educada y muy agradable. La velada fue sofisticada sin rigidez; se nota buen gusto en cada detalle. Repetiría sin dudarlo.',
    author: 'Andrés C.',
    publishedLabel: 'Mayo 2026',
    publishedAt: '2026-05',
  },
  {
    id: '16',
    modelName: 'Claudia (VIP)',
    title: 'Nivel VIP de verdad',
    content:
      'Claudia reúne presencia, estilo y una atención al detalle poco habitual. La experiencia se sintió exclusiva de principio a fin, con la discreción que exige este tipo de servicio. A la altura de lo que promete la agencia.',
    author: 'Enrique D.',
    publishedLabel: 'Mayo 2026',
    publishedAt: '2026-05',
  },
  {
    id: '13',
    modelName: 'KEY',
    title: 'Energía y buen rollo',
    content:
      'KEY llega con una sonrisa que cambia el ambiente. Divertida, espontánea y muy presente; ideal si buscas una salida con ritmo y buena vibra. Las fotos corresponden con la realidad.',
    author: 'Pablo R.',
    publishedLabel: 'Abril 2026',
    publishedAt: '2026-04',
  },
  {
    id: '14',
    modelName: 'Teresa',
    title: 'Trato impecable',
    content:
      'Teresa fue puntual, educada y muy atenta en todo momento. La experiencia fue relajada, con conversación agradable y total discreción. Justo lo que esperaba de una agencia de este nivel.',
    author: 'Iván S.',
    publishedLabel: 'Abril 2026',
    publishedAt: '2026-04',
  },
  {
    id: '15',
    modelName: 'Luna',
    title: 'Dulzura y naturalidad',
    content:
      'Luna es cercana y fácil de estar. Me hizo sentir cómodo desde el saludo; el encuentro fue sencillo, elegante y sin presiones. Una compañía muy agradable para una tarde en Valencia.',
    author: 'Raúl V.',
    publishedLabel: 'Marzo 2026',
    publishedAt: '2026-03',
  },
  {
    id: '9',
    modelName: 'Alicia',
    title: 'Dulzura infinita',
    content:
      'Alicia es un encanto de mujer. Muy dulce y cariñosa, me hizo sentir muy cómodo desde el primer minuto. Totalmente recomendable.',
    author: 'Miguel A.',
    publishedLabel: 'Noviembre 2025',
    publishedAt: '2025-11',
  },
  {
    id: '8',
    modelName: 'Tatiana (VIP)',
    title: 'Exclusividad máxima',
    content:
      'Tatiana es simplemente otro nivel. La exclusividad que ofrece la agencia se nota en cada detalle. Una chica bellísima y muy atenta.',
    author: 'Fernando S.',
    publishedLabel: 'Octubre 2025',
    publishedAt: '2025-10',
  },
  {
    id: '7',
    modelName: 'Erika',
    title: 'Elegancia y discreción',
    content:
      'Erika es una profesional de los pies a la cabeza. Muy discreta y con una conversación muy interesante. Una velada perfecta en todos los sentidos.',
    author: 'Antonio P.',
    publishedLabel: 'Agosto 2025',
    publishedAt: '2025-08',
  },
  {
    id: '6',
    modelName: 'Naty',
    title: 'Energía positiva',
    content:
      'Naty es pura alegría. Desde que nos vimos la conexión fue total. Es una mujer muy atractiva y divertida, hizo que mi viaje a Valencia fuera perfecto.',
    author: 'Roberto G.',
    publishedLabel: 'Mayo 2025',
    publishedAt: '2025-05',
  },
  {
    id: '5',
    modelName: 'Mariana',
    title: 'Belleza y simpatía',
    content:
      'Mariana es una chica excepcional. Muy puntual, educada y con un físico de infarto. Me sorprendió gratamente su madurez a pesar de su juventud.',
    author: 'Sergio V.',
    publishedLabel: 'Marzo 2025',
    publishedAt: '2025-03',
  },
  {
    id: '4',
    modelName: 'Yaiza',
    title: 'Dulzura y frescura',
    content:
      'Yaiza es encantadora. Tiene una sonrisa que ilumina todo y un trato muy dulce. Fue un placer compartir unas horas con ella, se nota que las fotos son 100% reales.',
    author: 'David L.',
    publishedLabel: 'Enero 2025',
    publishedAt: '2025-01',
  },
  {
    id: '3',
    modelName: 'Carlota',
    title: 'Impresionante presencia',
    content:
      'Carlota te deja sin palabras desde el primer momento. Su altura y porte son increíbles, pero lo mejor es su cercanía. Una experiencia VIP de verdad.',
    author: 'Marc T.',
    publishedLabel: 'Septiembre 2024',
    publishedAt: '2024-09',
  },
  {
    id: '2',
    modelName: 'Maria',
    title: 'Sofisticación pura',
    content:
      'Maria es la definición de clase. Buscaba una cena tranquila con buena conversación y superó todas mis expectativas. Es una mujer bellísima y muy inteligente.',
    author: 'Javier M.',
    publishedLabel: 'Agosto 2024',
    publishedAt: '2024-08',
  },
  {
    id: '1',
    modelName: 'Ariel',
    title: 'Una experiencia inolvidable',
    content:
      'Ariel es simplemente espectacular. Su elegancia y trato son de otro nivel. Pasamos una velada increíble en Valencia, es una mujer muy culta y encantadora. Repetiré sin duda.',
    author: 'Carlos R.',
    publishedLabel: 'Junio 2024',
    publishedAt: '2024-06',
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
