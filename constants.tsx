import { Model, Review, FAQ } from './types';
import modelsData from './data/models.json';

export const MODELS: Model[] = (modelsData as any[]).map((item) => ({
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
}));

export const REVIEWS: Review[] = [
  {
    id: '1',
    modelName: 'Ariel',
    title: 'Una experiencia inolvidable',
    content: 'Ariel es simplemente espectacular. Su elegancia y trato son de otro nivel. Pasamos una velada increíble en Valencia, es una mujer muy culta y encantadora. Repetiré sin duda.',
    author: 'Carlos R.'
  },
  {
    id: '2',
    modelName: 'Maria',
    title: 'Sofisticación pura',
    content: 'Maria es la definición de clase. Buscaba una cena tranquila con buena conversación y superó todas mis expectativas. Es una mujer bellísima y muy inteligente.',
    author: 'Javier M.'
  },
  {
    id: '3',
    modelName: 'Carlota',
    title: 'Impresionante presencia',
    content: 'Carlota te deja sin palabras desde el primer momento. Su altura y porte son increíbles, pero lo mejor es su cercanía. Una experiencia VIP de verdad.',
    author: 'Marc T.'
  },
  {
    id: '4',
    modelName: 'Yaiza',
    title: 'Dulzura y frescura',
    content: 'Yaiza es encantadora. Tiene una sonrisa que ilumina todo y un trato muy dulce. Fue un placer compartir unas horas con ella, se nota que las fotos son 100% reales.',
    author: 'David L.'
  },
  {
    id: '5',
    modelName: 'Mariana',
    title: 'Belleza y simpatía',
    content: 'Mariana es una chica excepcional. Muy puntual, educada y con un físico de infarto. Me sorprendió gratamente su madurez a pesar de su juventud.',
    author: 'Sergio V.'
  },
  {
    id: '6',
    modelName: 'Naty',
    title: 'Energía positiva',
    content: 'Naty es pura alegría. Desde que nos vimos la conexión fue total. Es una mujer muy atractiva y divertida, hizo que mi viaje a Valencia fuera perfecto.',
    author: 'Roberto G.'
  },
  {
    id: '7',
    modelName: 'Erika',
    title: 'Elegancia y discreción',
    content: 'Erika es una profesional de los pies a la cabeza. Muy discreta y con una conversación muy interesante. Una velada perfecta en todos los sentidos.',
    author: 'Antonio P.'
  },
  {
    id: '8',
    modelName: 'Tatiana (VIP)',
    title: 'Exclusividad máxima',
    content: 'Tatiana es simplemente otro nivel. La exclusividad que ofrece la agencia se nota en cada detalle. Una chica bellísima y muy atenta.',
    author: 'Fernando S.'
  },
  {
    id: '9',
    modelName: 'Alicia',
    title: 'Dulzura infinita',
    content: 'Alicia es un encanto de mujer. Muy dulce y cariñosa, me hizo sentir muy cómodo desde el primer minuto. Totalmente recomendable.',
    author: 'Miguel A.'
  }
];

export const FAQS: FAQ[] = [
  {
    question: "¿Qué hace especial a la Agencia Valeria Ferrer?",
    answer: "Nos enfocamos en un concepto integral que combina estética, pasión, educación y elegancia. Nuestras modelos son seleccionadas meticulosamente por su intelecto, etiqueta social y belleza natural."
  },
  {
    question: "¿Cómo es el proceso de reserva?",
    answer: "El proceso es transparente: 1. Contacto vía email o formulario. 2. Consulta personal y selección. 3. Confirmación de cita. 4. Garantía de discreción y seguridad. 5. Encuentro en la ubicación acordada."
  }
];

export const FEES = {
  header: "Tarifas y Honorarios",
  description: "Nuestras tarifas reflejan la exclusividad y el alto nivel de nuestras modelos. Todos los honorarios incluyen la gestión de la agencia y la compensación de la modelo.",
  rates: [
    { duration: "2 Horas", price: "Desde 800€", note: "Reserva mínima" },
    { duration: "4 Horas", price: "Desde 1.400€", note: "Ideal para cenas" },
    { duration: "Overnight (12h)", price: "Desde 2.500€", note: "Noche completa" },
    { duration: "Fin de Semana", price: "Consultar", note: "Incluye viajes" }
  ]
};

export const DOCUMENTATION = {
  travel: {
    title: "Acompañamiento de Viajes",
    content: "Las modelos de Valeria Ferrer están disponibles para acompañarle en viajes de negocios o placer. El cliente se hace cargo de los gastos de transporte (Business Class en vuelos de más de 4h), alojamiento en hoteles de 5 estrellas y dietas."
  },
  etiquette: {
    title: "Etiqueta y Discreción",
    content: "Esperamos de nuestros clientes el mismo nivel de respeto y cortesía que nuestras modelos ofrecen. La discreción es nuestra máxima prioridad: no se permiten grabaciones de ningún tipo y los datos de contacto son eliminados tras el encuentro."
  }
};
