
import { Model, Review, FAQ } from './types';

export const MODELS: Model[] = [
  {
    id: 'ariel',
    name: 'Ariel',
    age: 24,
    height: 160,
    weight: 55,
    nationality: 'Colombiana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer3-scaled.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer2-scaled.jpg',
    description: 'Belleza colombiana con una energía vibrante y sofisticada.',
    bio: 'Ariel es una escort colombiana de 24 años que destaca por su elegancia y carisma. Con 1.60m de altura y una figura armoniosa, ofrece una compañía excepcional en Valencia.',
    services: ['Acompañamiento VIP', 'Cenas de Gala', 'Eventos Sociales'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer1-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer4-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer6-scaled.jpg'
    ]
  },
  {
    id: 'maria',
    name: 'Maria',
    age: 29,
    height: 157,
    weight: 50,
    nationality: 'Española',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer3-scaled.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer2-scaled.jpg',
    description: 'Elegancia española y madurez encantadora.',
    bio: 'Maria combina la sofisticación europea con una personalidad cálida. A sus 29 años, es la elección perfecta para quienes buscan una conversación inteligente y una presencia distinguida.',
    services: ['GFE', 'Eventos de Empresa', 'Cenas Románticas'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer1-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer4-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/Maria_ValeriaFerrer6-scaled.jpg'
    ]
  },
  {
    id: 'carlota',
    name: 'Carlota',
    age: 23,
    height: 180,
    weight: 77,
    nationality: 'Venezolana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/03/CARLOTA_VF_VALENCIA.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/03/CARLOTA_VF_VALENCIA1.jpg',
    description: 'Impresionante presencia venezolana con una estatura escultural.',
    bio: 'Carlota destaca por su imponente altura de 1.80m y su belleza latina. Es una escort venezolana de 23 años que cautiva con su porte y elegancia natural.',
    services: ['Acompañamiento de Lujo', 'Eventos VIP', 'Viajes'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/CARLOTA_VF_VALENCIA3.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/CARLOTA_VF_VALENCIA4.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/CARLOTA_VF_VALENCIA5.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/03/CARLOTA_VF_VALENCIA6.jpg'
    ]
  },
  {
    id: 'yaiza',
    name: 'Yaiza',
    age: 22,
    height: 165,
    weight: 52,
    nationality: 'Española',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Yaiza_ValeriaFerrer_01-scaled.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Yaiza_ValeriaFerrer_02-scaled.jpg',
    description: 'Juventud y frescura española en un perfil universitario.',
    bio: 'Yaiza es una joven española de 22 años que representa la belleza mediterránea moderna. Inteligente, dulce y con una presencia que ilumina cualquier estancia.',
    services: ['GFE', 'Cenas', 'Acompañamiento Social'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Yaiza_ValeriaFerrer_03-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Yaiza_ValeriaFerrer_04-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Yaiza_ValeriaFerrer_05-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Yaiza_ValeriaFerrer_06-scaled.jpg'
    ]
  },
  {
    id: 'mariana',
    name: 'Mariana',
    age: 20,
    height: 175,
    weight: 65,
    nationality: 'Colombiana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/MARIANA_VF_01-1-scaled.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/MARIANA_VF_02-1-scaled.jpg',
    description: 'Juventud colombiana con una estatura y elegancia notables.',
    bio: 'Mariana, a sus 20 años, ofrece una combinación perfecta de juventud y sofisticación. Su altura de 1.75m la convierte en una presencia destacada en cualquier evento.',
    services: ['Acompañamiento VIP', 'Eventos', 'Sesiones de Fotos'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/MARIANA_VF_03-1-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/MARIANA_VF_04-1-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/MARIANA_VF_05-1-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/MARIANA_VF_06-scaled.jpg'
    ]
  },
  {
    id: 'naty',
    name: 'Naty',
    age: 23,
    height: 165,
    weight: 55,
    nationality: 'Colombiana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2024/05/LINDA-2-VF-Model-Agency-Valencia-1.jpeg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2024/05/LINDA-2-VF-Model-Agency-Valencia-2.jpeg',
    description: 'Encanto colombiano y una figura perfecta.',
    bio: 'Naty es una escort colombiana de 23 años con una personalidad arrolladora y una belleza natural que no deja indiferente a nadie.',
    services: ['GFE', 'Cenas de Gala', 'Viajes'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2024/05/LINDA-2-VF-Model-Agency-Valencia-1.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/05/LINDA-2-VF-Model-Agency-Valencia-2.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/05/LINDA-2-VF-Model-Agency-Valencia-3.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/05/LINDA-2-VF-Model-Agency-Valencia-4.jpeg'
    ]
  },
  {
    id: 'erika',
    name: 'Erika',
    age: 22,
    height: 167,
    weight: 52,
    nationality: 'Española',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2024/05/MAJO-VF-Model-Agency-Valencia-01.jpeg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2024/05/MAJO-VF-Model-Agency-Valencia-02.jpeg',
    description: 'Belleza española con un toque moderno y elegante.',
    bio: 'Erika, de 22 años, es una escort española que destaca por su elegancia y su capacidad para adaptarse a cualquier entorno social de alto nivel.',
    services: ['Acompañamiento de Lujo', 'Eventos VIP', 'Cenas'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2024/05/MAJO-VF-Model-Agency-Valencia-01.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/05/MAJO-VF-Model-Agency-Valencia-02.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/05/MAJO-VF-Model-Agency-Valencia-03.jpeg'
    ]
  },
  {
    id: 'tatiana-vip',
    name: 'Tatiana (VIP)',
    age: 18,
    height: 169,
    weight: 52,
    nationality: 'Española',
    location: 'Valencia | VIP',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2024/02/CELIA-2-VF-Model-Agency-Valencia-01.jpeg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2024/02/CELIA-2-VF-Model-Agency-Valencia-02.jpeg',
    description: 'Exclusividad VIP y juventud radiante.',
    bio: 'Tatiana es una de nuestras escorts VIP más jóvenes. Con 18 años, ofrece una experiencia de lujo basada en la frescura y la máxima discreción.',
    services: ['Servicio VIP', 'Acompañamiento Exclusivo', 'Eventos de Lujo'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2024/02/CELIA-2-VF-Model-Agency-Valencia-01.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/02/CELIA-2-VF-Model-Agency-Valencia-02.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/02/CELIA-2-VF-Model-Agency-Valencia-03.jpeg'
    ]
  },
  {
    id: 'alicia',
    name: 'Alicia',
    age: 18,
    height: 168,
    weight: 53,
    nationality: 'Colombiana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2024/05/CRISTAL-2-VF-Valeria-Ferrer-Model-Agency-Valencia-02.jpeg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2024/05/CRISTAL-2-VF-Valeria-Ferrer-Model-Agency-Valencia-01.jpeg',
    description: 'Dulzura colombiana en un perfil joven y elegante.',
    bio: 'Alicia, de 18 años, combina la belleza latina con una educación y saber estar impecables. Ideal para quienes buscan frescura y elegancia.',
    services: ['GFE', 'Cenas Románticas', 'Eventos'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2024/05/CRISTAL-2-VF-Valeria-Ferrer-Model-Agency-Valencia-02.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/05/CRISTAL-2-VF-Valeria-Ferrer-Model-Agency-Valencia-01.jpeg'
    ]
  },
  {
    id: 'paula-vip',
    name: 'Paula (VIP)',
    age: 26,
    height: 160,
    weight: 50,
    nationality: 'Española',
    location: 'Valencia | VIP',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/BEA_VIP_VALERIAFERRER_2025.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/BEA_VIP_VALERIAFERRER_20251.jpg',
    description: 'Sofisticación VIP y madurez elegante.',
    bio: 'Paula es una escort VIP española de 26 años. Su experiencia y elegancia la convierten en la acompañante ideal para los clientes más exigentes.',
    services: ['Servicio VIP', 'Cenas de Gala', 'Viajes de Negocios'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/BEA_VIP_VALERIAFERRER_20252.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/BEA_VIP_VALERIAFERRER_20253.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/BEA_VIP_VALERIAFERRER_20254.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/BEA_VIP_VALERIAFERRER_20255.jpg'
    ]
  },
  {
    id: 'luna',
    name: 'Luna',
    age: 26,
    height: 156,
    weight: 52,
    nationality: 'Colombiana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Samanta_ValeriaFerrer012-scaled.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Samanta_ValeriaFerrer10-1-scaled.jpg',
    description: 'Encanto latino y una personalidad magnética.',
    bio: 'Luna es una escort colombiana de 26 años que destaca por su calidez y su belleza exótica. Una compañía inolvidable para cualquier ocasión.',
    services: ['Acompañamiento VIP', 'Cenas', 'Eventos Sociales'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Samanta_ValeriaFerrer13-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Samanta_ValeriaFerrer00-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Samanta_ValeriaFerrer01-1-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Samanta_ValeriaFerrer02-1-scaled.jpg'
    ]
  },
  {
    id: 'tania',
    name: 'Tania',
    age: 25,
    height: 163,
    weight: 52,
    nationality: 'Colombiana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Luns_Valeria_Ferrer_01-scaled.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Luns_Valeria_Ferrer_02-scaled.jpg',
    description: 'Elegancia y carisma colombiano.',
    bio: 'Tania, de 25 años, ofrece una compañía sofisticada y amena. Su belleza y educación la hacen destacar en cualquier entorno.',
    services: ['GFE', 'Eventos VIP', 'Viajes'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Luns_Valeria_Ferrer_03-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Luns_Valeria_Ferrer_04-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Luns_Valeria_Ferrer_05-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Luns_Valeria_Ferrer_06-scaled.jpg'
    ]
  },
  {
    id: 'alba-vip',
    name: 'Alba (VIP)',
    age: 23,
    height: 160,
    weight: 55,
    nationality: 'Española',
    location: 'Valencia | VIP',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2024/12/JULIA-VIP-VF-Model-Agency-Valencia-1.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2024/12/JULIA-VIP-VF-Model-Agency-Valencia-2.jpg',
    description: 'Exclusividad española y belleza natural.',
    bio: 'Alba es una escort VIP de 23 años que encarna la elegancia española. Discreta, inteligente y con una presencia encantadora.',
    services: ['Servicio VIP', 'Acompañamiento de Lujo', 'Cenas'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2024/12/JULIA-VIP-VF-Model-Agency-Valencia-1.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/12/JULIA-VIP-VF-Model-Agency-Valencia-2.jpg'
    ]
  },
  {
    id: 'claudia-vip',
    name: 'Claudia (VIP)',
    age: 21,
    height: 167,
    weight: 55,
    nationality: 'Española',
    location: 'Valencia | VIP',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2025/12/CLAUDIA-VF-NF-11.12.2025-Model-Agency-Valencia-02.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2025/12/CLAUDIA-VF-NF-11.12.2025-Model-Agency-Valencia-03.jpg',
    description: 'Juventud VIP con un porte aristocrático.',
    bio: 'Claudia, de 21 años, es una de nuestras escorts VIP más destacadas. Su elegancia y saber estar son excepcionales para su juventud.',
    services: ['Servicio VIP', 'Eventos de Gala', 'Viajes'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2025/12/CLAUDIA-VF-NF-24.09.2025-Model-Agency-Valencia-.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/12/CLAUDIA-VF-NF-11.12.2025-Model-Agency-Valencia-07-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/12/CLAUDIA-VF-NF-11.12.2025-Model-Agency-Valencia-04.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/12/CLAUDIA-VF-NF-11.12.2025-Model-Agency-Valencia-05.jpg'
    ]
  },
  {
    id: 'brenda',
    name: 'Brenda',
    age: 26,
    height: 168,
    weight: 60,
    nationality: 'Colombiana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Brenda_VF_05-scaled.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Brenda_VF_03-scaled.jpg',
    description: 'Belleza colombiana con una figura escultural.',
    bio: 'Brenda destaca por su físico impresionante y su elegancia latina. A sus 26 años, es una escort con gran experiencia en el trato VIP.',
    services: ['Acompañamiento VIP', 'Cenas', 'Eventos'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Brenda_VF_04-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Brenda_VF_06-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Brenda_VF_07-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Brenda_VF_08-scaled.jpg'
    ]
  },
  {
    id: 'sol',
    name: 'Sol',
    age: 24,
    height: 158,
    weight: 51,
    nationality: 'Venezolana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2024/04/LIZ-2-VF-Model-Agency-Valencia-1.jpeg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2024/04/LIZ-2-VF-Model-Agency-Valencia-2.jpeg',
    description: 'Luz y belleza venezolana.',
    bio: 'Sol, de 24 años, hace honor a su nombre con una personalidad radiante y una belleza venezolana clásica y elegante.',
    services: ['GFE', 'Cenas Románticas', 'Acompañamiento Social'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2024/04/LIZ-2-VF-Model-Agency-Valencia-1.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/04/LIZ-2-VF-Model-Agency-Valencia-2.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/04/LIZ-2-VF-Model-Agency-Valencia-3.jpeg'
    ]
  },
  {
    id: 'lucia-vip',
    name: 'Lucia (VIP)',
    age: 24,
    height: 172,
    weight: 67,
    nationality: 'Española',
    location: 'Valencia | VIP',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2024/01/LUCIA-VIP-VF-Model-Agency-Valencia-01.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2024/01/LUCIA-VIP-VF-Model-Agency-Valencia-02.jpg',
    description: 'Estatura y elegancia VIP española.',
    bio: 'Lucia es una escort VIP de 24 años con una presencia imponente de 1.72m. Su sofisticación la hace ideal para los eventos más exclusivos.',
    services: ['Servicio VIP', 'Eventos de Lujo', 'Viajes de Negocios'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2024/01/LUCIA-VIP-VF-Model-Agency-Valencia-01.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/01/LUCIA-VIP-VF-Model-Agency-Valencia-02.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/01/LUCIA-VIP-VF-Model-Agency-Valencia-03.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/01/LUCIA-VIP-VF-Model-Agency-Valencia-04.jpg'
    ]
  },
  {
    id: 'carol',
    name: 'Carol',
    age: 18,
    height: 157,
    weight: 52,
    nationality: 'Colombiana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Carol_VF_01-scaled.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Carol_VF_02-scaled.jpg',
    description: 'Juventud y dulzura colombiana.',
    bio: 'Carol es una joven escort colombiana de 18 años. Su frescura y encanto natural la convierten en una compañía muy especial.',
    services: ['GFE', 'Cenas', 'Eventos'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Carol_VF_03-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Carol_VF_04-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Carol_VF_05-scaled.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2026/01/Carol_VF_06-scaled.jpg'
    ]
  },
  {
    id: 'adara',
    name: 'Adara',
    age: 19,
    height: 168,
    weight: 55,
    nationality: 'Filipina',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2025/06/ADARA-VF-NF-05.06.2025-Model-Agency-Valencia-Valeria-Ferrer-09.jpeg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2025/06/ADARA-VF-NF-05.06.2025-Model-Agency-Valencia-Valeria-Ferrer-10.jpeg',
    description: 'Exotismo filipino y elegancia juvenil.',
    bio: 'Adara aporta un toque exótico y refinado con su belleza filipina. A sus 19 años, es una escort educada y con un encanto único.',
    services: ['Acompañamiento VIP', 'Cenas de Gala', 'Eventos'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/ADARA-VF-NF-05.06.2025-Model-Agency-Valencia-Valeria-Ferrer-09.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/ADARA-VF-NF-05.06.2025-Model-Agency-Valencia-Valeria-Ferrer-10.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/ADARA-VF-NF-05.06.2025-Model-Agency-Valencia-Valeria-Ferrer-04.jpeg'
    ]
  },
  {
    id: 'sara',
    name: 'Sara',
    age: 26,
    height: 162,
    weight: 62,
    nationality: 'Brasileña',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2025/06/SARAY-2-VF-NF-12.06.2025-Model-Agency-Valencia-Valeria-Ferrer-03.jpeg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2025/06/SARAY-2-VF-NF-12.06.2025-Model-Agency-Valencia-Valeria-Ferrer-04.jpeg',
    description: 'Pasión y elegancia brasileña.',
    bio: 'Sara es una escort brasileña de 26 años que combina la alegría de su tierra con una sofisticación europea impecable.',
    services: ['GFE', 'Viajes de Lujo', 'Eventos VIP'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/SARAY-2-VF-NF-12.06.2025-Model-Agency-Valencia-Valeria-Ferrer-03.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/SARAY-2-VF-NF-12.06.2025-Model-Agency-Valencia-Valeria-Ferrer-04.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/SARAY-2-VF-NF-12.06.2025-Model-Agency-Valencia-Valeria-Ferrer-02.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/SARAY-2-VF-NF-12.06.2025-Model-Agency-Valencia-Valeria-Ferrer-01.jpeg'
    ]
  },
  {
    id: 'sandra',
    name: 'Sandra',
    age: 26,
    height: 165,
    weight: 52,
    nationality: 'Española',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2025/06/JULIETA-2-VF-Model-Agency-Valencia-Valeria-Ferrer-1.jpeg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2025/06/JULIETA-2-VF-Model-Agency-Valencia-Valeria-Ferrer-2.jpeg',
    description: 'Belleza española clásica y atemporal.',
    bio: 'Sandra, de 26 años, es una escort española con una elegancia natural y una gran capacidad de conversación.',
    services: ['Acompañamiento Social', 'Cenas', 'Eventos'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/JULIETA-2-VF-Model-Agency-Valencia-Valeria-Ferrer-1.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/JULIETA-2-VF-Model-Agency-Valencia-Valeria-Ferrer-2.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/JULIETA-2-VF-Model-Agency-Valencia-Valeria-Ferrer-3.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2025/06/JULIETA-2-VF-Model-Agency-Valencia-Valeria-Ferrer-4.jpeg'
    ]
  },
  {
    id: 'silvia',
    name: 'Silvia',
    age: 19,
    height: 160,
    weight: 48,
    nationality: 'Venezolana',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2024/11/VANESA-VF-NF-21.11.2024-Valeria-Ferrer-Model-Agency-Valencia-3.jpg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2024/11/VANESA-VF-NF-21.11.2024-Valeria-Ferrer-Model-Agency-Valencia-4.jpg',
    description: 'Juventud venezolana y figura esbelta.',
    bio: 'Silvia es una joven escort venezolana de 19 años. Su belleza latina y su carácter dulce la hacen una compañía encantadora.',
    services: ['GFE', 'Cenas Románticas', 'Eventos'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2024/11/VANESA-VF-NF-21.11.2024-Valeria-Ferrer-Model-Agency-Valencia-3.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/11/VANESA-VF-NF-21.11.2024-Valeria-Ferrer-Model-Agency-Valencia-4.jpg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/11/VANESA-VF-NF-21.11.2024-Valeria-Ferrer-Model-Agency-Valencia-5.jpg'
    ]
  },
  {
    id: 'andrea',
    name: 'Andrea',
    age: 28,
    height: 165,
    weight: 50,
    nationality: 'Uruguaya',
    location: 'Valencia | Centro',
    image: 'https://www.valeriaferrer.com/wp-content/uploads/2024/02/LORENA-VF-NF-13.02.2024-Valeria-Ferrer-Model-Agency-Valencia-01.jpeg',
    hoverImage: 'https://www.valeriaferrer.com/wp-content/uploads/2024/02/LORENA-VF-NF-13.02.2024-Valeria-Ferrer-Model-Agency-Valencia-03.jpeg',
    description: 'Sofisticación uruguaya y madurez encantadora.',
    bio: 'Andrea, de 28 años, es una escort uruguaya con una gran elegancia y un trato exquisito. Ideal para eventos de alto nivel.',
    services: ['Acompañamiento VIP', 'Cenas de Gala', 'Viajes'],
    availability: { 'Lunes - Domingo': '24 Horas' },
    gallery: [
      'https://www.valeriaferrer.com/wp-content/uploads/2024/02/LORENA-VF-NF-13.02.2024-Valeria-Ferrer-Model-Agency-Valencia-01.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/02/LORENA-VF-NF-13.02.2024-Valeria-Ferrer-Model-Agency-Valencia-03.jpeg',
      'https://www.valeriaferrer.com/wp-content/uploads/2024/02/LORENA-VF-NF-13.02.2024-Valeria-Ferrer-Model-Agency-Valencia-04.jpeg'
    ]
  }
];

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
    answer: "Nos enfocamos en un concepto integral que combina estética, pasión, educación y elegancia. Nuestras escorts son seleccionadas meticulosamente por su intelecto, etiqueta social y belleza natural."
  },
  {
    question: "¿Cómo es el proceso de reserva?",
    answer: "El proceso es transparente: 1. Contacto vía email o formulario. 2. Consulta personal y selección. 3. Confirmación de cita. 4. Garantía de discreción y seguridad. 5. Encuentro en la ubicación acordada."
  }
];

export const FEES = {
  header: "Tarifas y Honorarios",
  description: "Nuestras tarifas reflejan la exclusividad y el alto nivel de nuestras escorts. Todos los honorarios incluyen la gestión de la agencia y la compensación de la escort.",
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
    content: "Las escorts de Valeria Ferrer están disponibles para acompañarle en viajes de negocios o placer. El cliente se hace cargo de los gastos de transporte (Business Class en vuelos de más de 4h), alojamiento en hoteles de 5 estrellas y dietas."
  },
  etiquette: {
    title: "Etiqueta y Discreción",
    content: "Esperamos de nuestros clientes el mismo nivel de respeto y cortesía que nuestras escorts ofrecen. La discreción es nuestra máxima prioridad: no se permiten grabaciones de ningún tipo y los datos de contacto son eliminados tras el encuentro."
  }
};
