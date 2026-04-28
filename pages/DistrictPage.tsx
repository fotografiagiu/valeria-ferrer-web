import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Calendar, Star, Clock, User } from 'lucide-react';
import modelsData from '../data/models.json';
import OptimizedImage from '../components/OptimizedImage';
import BlogCard from '../components/BlogCard';
import blogData from '../data/blog.json';

interface DistrictData {
  id: string;
  name: string;
  description: string;
  features: string[];
  hotels: Array<{
    name: string;
    description: string;
    category: string;
  }>;
  restaurants: Array<{
    name: string;
    description: string;
    category: string;
  }>;
  attractions: Array<{
    name: string;
    description: string;
  }>;
  relatedBlogIds: string[];
}

const districtsData: Record<string, DistrictData> = {
  'valencia-centro': {
    id: 'valencia-centro',
    name: 'Valencia Centro',
    description: 'El corazón histórico de Valencia, donde la elegancia milenaria se encuentra con el lujo moderno. El casco antiguo alberga los hoteles boutique más exclusivos, restaurantes Michelin y una atmósfera sofisticada perfecta para encuentros discretos.',
    features: [
      'Hoteles 5 estrellas con suites presidenciales',
      'Restaurantes con estrellas Michelin',
      'Plazas históricas románticas',
      'Galerías de arte contemporáneo',
      'Tiendas de lujo internacionales',
      'Seguridad y discreción garantizadas'
    ],
    hotels: [
      { name: 'Hotel Caro Palace', description: 'Palacio histórico con spa árabe', category: '5 Estrellas' },
      { name: 'Hospes Palau de la Mar', description: 'Diseño contemporáneo con rooftop pool', category: '5 Estrellas' },
      { name: 'Only YOU Boutique', description: 'Intimidad absoluta en el centro', category: 'Boutique' }
    ],
    restaurants: [
      { name: 'Ricard Camarena', description: '2 Estrellas Michelin, innovación valenciana', category: 'Alta Cocina' },
      { name: 'Begoña Rodrigo', description: '1 Estrella Michelin, cocina contemporánea', category: 'Alta Cocina' },
      { name: 'La Riua', description: 'Arroces tradicionales y mariscos', category: 'Tradicional' }
    ],
    attractions: [
      { name: 'Plaza de la Virgen', description: 'Corazón espiritual de Valencia' },
      { name: 'Lonja de la Seda', description: 'Patrimonio de la Humanidad' },
      { name: 'Catedral de Valencia', description: 'Gótico valenciano impresionante' },
      { name: 'IVAM', description: 'Instituto Valenciano de Arte Moderno' }
    ],
    relatedBlogIds: ['escorts-valencia-centro', 'guia-escorts-valencia']
  },
  'ruzafa': {
    id: 'ruzafa',
    name: 'Ruzafa',
    description: 'El barrio más trendy y creativo de Valencia. Con su ambiente bohemio, galerías de arte, restaurantes vanguardistas y vida nocturna sofisticada, Ruzafa es el destino perfecto para experiencias culturales y modernas.',
    features: [
      'Galerías de arte contemporáneo',
      'Restaurantes vanguardistas',
      'Bares de copas exclusivos',
      'Tiendas de diseño local',
      'Mercados gourmet',
      'Vida nocturna vibrante'
    ],
    hotels: [
      { name: 'Hotel Dimar', description: 'Diseño nórdico minimalista', category: 'Boutique' },
      { name: 'Hotel Malcom and Barlow', description: 'Estilo industrial-chic', category: 'Boutique' }
    ],
    restaurants: [
      { name: 'Begoña Rodrigo Restaurant', description: '1 Estrella Michelin', category: 'Alta Cocina' },
      { name: 'La Safrà', description: 'Cocina de mercado innovadora', category: 'Contemporáneo' },
      { name: 'Ricard Camarena Taperia', description: 'Alta cocina accesible', category: 'Gourmet' }
    ],
    attractions: [
      { name: 'Galería Punto', description: 'Arte contemporáneo español' },
      { name: 'Espai Tactel', description: 'Arte urbano y diseño gráfico' },
      { name: 'Mercado de Ruzafa', description: 'Productos locales y gourmet' },
      { name: 'Casa Museo Benlliure', description: 'Casa-museo del pintor valenciano' }
    ],
    relatedBlogIds: ['escorts-russafa-valencia', 'servicios-acompañamiento-valencia']
  },
  'el-cabanyal': {
    id: 'el-cabanyal',
    name: 'El Cabanyal',
    description: 'El barrio marítimo de Valencia, donde el encanto tradicional de los pescadores se encuentra con el lujo moderno. Playas, restaurantes de marisco fresco y un ambiente relajado junto al Mediterráneo.',
    features: [
      'Playas mediterráneas',
      'Restaurantes de marisco fresco',
      'Atardeceres románticos',
      'Ambiente relajado',
      'Paseos marítimos',
      'Cultura marinera tradicional'
    ],
    hotels: [
      { name: 'SH Valencia Palace', description: 'Vistas al mar y spa', category: '5 Estrellas' },
      { name: 'Las Arenas Balneario', description: 'Balneario histórico', category: '4 Estrellas' }
    ],
    restaurants: [
      { name: 'La Pepica', description: 'Arroces a la marinera tradicionales', category: 'Marisco' },
      { name: 'Restaurante Submarino', description: 'Vistas al mar y pescado fresco', category: 'Marisco' },
      { name: 'Casa Montaña', description: 'Marisco y especialidades locales', category: 'Tradicional' }
    ],
    attractions: [
      { name: 'Playa de la Malvarrosa', description: 'Playa urbana más famosa' },
      { name: 'Playa de las Arenas', description: 'Playa histórica con balneario' },
      { name: 'Puerto de Valencia', description: 'Puerto deportivo y comercial' },
      { name: 'Cabañal-Cañamelar', description: 'Barrio tradicional marinero' }
    ],
    relatedBlogIds: ['hoteles-lujo-valencia-escorts', 'guia-escorts-valencia']
  }
};

const DistrictPage: React.FC = () => {
  const { districtId } = useParams<{ districtId: string }>();
  const district = districtsData[districtId || ''];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [districtId]);

  if (!district) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Distrito no encontrado</h1>
          <Link to="/models" className="text-[#c2b2a3] hover:text-white transition-colors">
            Volver a Modelos
          </Link>
        </div>
      </div>
    );
  }

  // Filter models available in this district
  const availableModels = modelsData.filter(model => 
    model.city === 'Valencia' || model.location?.toLowerCase().includes(district.name.toLowerCase())
  );

  // Filter related blog articles
  const relatedArticles = blogData.filter(article => 
    district.relatedBlogIds.includes(article.id)
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c2b2a3]/20 to-[#c2b2a3]/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link 
                to="/models" 
                className="inline-flex items-center space-x-2 text-[#c2b2a3] hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">Volver a Modelos</span>
              </Link>
              
              <div className="flex items-center space-x-4 mb-6">
                <MapPin className="text-[#c2b2a3]" size={24} />
                <h1 className="text-4xl md:text-6xl font-light mb-4 text-white leading-tight">
                  {district.name}
                </h1>
              </div>
              
              <p className="text-lg text-gray-300 max-w-3xl">
                {district.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">Características Exclusivas</h2>
            <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {district.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-[#c2b2a3]/30 transition-all duration-500"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-2 h-2 bg-[#c2b2a3] rounded-full"></div>
                  <h3 className="text-white font-light tracking-wider">{feature}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Models */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">Modelos Disponibles en {district.name}</h2>
            <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Descubre nuestras acompañantes exclusivas disponibles en esta zona
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableModels.slice(0, 6).map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => window.location.href = `/models/${model.id}`}
              >
                <div className="aspect-[2/3] relative overflow-hidden rounded-2xl mb-4">
                  <OptimizedImage
                    src={model.coverImageUrl}
                    alt={`${model.name} - Modelo exclusiva en ${district.name}`}
                    className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-light text-white mb-1">{model.name}</h3>
                    <p className="text-sm text-[#c2b2a3]">{model.age} años • {model.nationality}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {availableModels.length > 6 && (
            <div className="text-center mt-12">
              <Link
                to="/models"
                className="inline-block px-8 py-3 bg-[#c2b2a3] text-black font-bold rounded-full hover:bg-white transition-colors duration-300"
              >
                Ver Todas las Modelos
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Hotels Section */}
      <section className="py-16 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">Hoteles de Lujo en {district.name}</h2>
            <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {district.hotels.map((hotel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-[#c2b2a3]/30 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-light text-white mb-2">{hotel.name}</h3>
                    <span className="text-xs text-[#c2b2a3] uppercase tracking-[0.2em]">{hotel.category}</span>
                  </div>
                  <Star className="text-[#c2b2a3]" size={20} />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{hotel.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">Restaurantes Exclusivos</h2>
            <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {district.restaurants.map((restaurant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-[#c2b2a3]/30 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-light text-white mb-2">{restaurant.name}</h3>
                    <span className="text-xs text-[#c2b2a3] uppercase tracking-[0.2em]">{restaurant.category}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{restaurant.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Attractions Section */}
      <section className="py-16 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">Atracciones Turísticas</h2>
            <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {district.attractions.map((attraction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex items-start space-x-4 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-[#c2b2a3]/30 transition-all duration-500"
              >
                <MapPin className="text-[#c2b2a3] mt-1" size={20} />
                <div>
                  <h3 className="text-lg font-light text-white mb-2">{attraction.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{attraction.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Blog Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-light mb-4">Artículos Relacionados</h2>
              <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((article, index) => (
                <BlogCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#c2b2a3]/10 to-[#c2b2a3]/5 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              ¿Lista para una Experiencia VIP en {district.name}?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Descubre nuestras acompañantes exclusivas disponibles en esta zona. 
              Experiencias personalizadas con total discreción y profesionalismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/models"
                className="px-8 py-3 bg-[#c2b2a3] text-black font-bold rounded-full hover:bg-white transition-colors duration-300"
              >
                Ver Modelos Disponibles
              </Link>
              <a
                href="https://t.me/Valeriaferreeer"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-[#c2b2a3] text-[#c2b2a3] font-bold rounded-full hover:bg-[#c2b2a3] hover:text-black transition-all duration-300 flex items-center justify-center"
              >
                <Phone size={16} className="mr-2" />
                Contactar Ahora
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DistrictPage;
