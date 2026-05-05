import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Star, MapPin, Phone, Filter, Search, ChevronDown } from 'lucide-react';
import MODELS_SEO from '../data/models-seo.json';

interface ModelSEO {
  name: string;
  slug: string;
  nationality: string;
  age: number;
  hair: string;
  height: string;
  weight: string;
  measurements: string;
  languages: string[];
  breast: string;
  shortHeadline: string;
  seoTitle: string;
  seoDescription: string;
  services: string[];
  images: string[];
  altImages: string[];
  longDescription: string;
  availability: string;
  location: string;
  whatsapp: string;
  vip?: boolean;
}

const EscortsValencia: React.FC = () => {
  const [filteredModels, setFilteredModels] = useState<ModelSEO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const nationalities = Array.from(new Set(MODELS_SEO.map(m => m.nationality)));
  const services = Array.from(new Set(MODELS_SEO.flatMap(m => m.services)));

  useEffect(() => {
    let filtered = MODELS_SEO as ModelSEO[];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.shortHeadline.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Nationality filter
    if (selectedNationality !== 'all') {
      filtered = filtered.filter(model => model.nationality === selectedNationality);
    }

    // Age filter
    if (selectedAge !== 'all') {
      filtered = filtered.filter(model => {
        if (selectedAge === '18-22') return model.age >= 18 && model.age <= 22;
        if (selectedAge === '23-25') return model.age >= 23 && model.age <= 25;
        if (selectedAge === '26+') return model.age >= 26;
        return true;
      });
    }

    // Service filter
    if (selectedService !== 'all') {
      filtered = filtered.filter(model => model.services.includes(selectedService));
    }

    setFilteredModels(filtered);
  }, [searchTerm, selectedNationality, selectedAge, selectedService]);

  return (
    <>
      <Helmet>
        <title>Escorts Valencia | Escorts de lujo en Valencia | Valeria Ferrer</title>
        <meta name="description" content="Descubre las mejores escorts de lujo en Valencia. Compañía elegante y discreta para caballeros exigentes. Citas, cenas y eventos sociales. 100% reales y verificadas." />
        <meta name="keywords" content="escorts valencia, acompañantes valencia, escorts lujo valencia, acompañantes discretas, escorts españolas, escorts latinas" />
        <link rel="canonical" href="https://www.valeriaferrer.com/escorts-valencia" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header Spacer */}
        <div className="h-20 lg:h-32"></div>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-white">Escorts Valencia</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">
              Escorts <span className="italic luxury-text-gradient">Valencia</span>
            </h1>
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-3xl mx-auto mb-8">
              Descubre a nuestras escorts de lujo en Valencia. Compañía elegante, sofisticada y discreta 
              para caballeros exigentes. Todas nuestras modelos son 100% reales, verificadas y profesionales.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a 
                href="tel:+34645872227" 
                className="inline-flex items-center justify-center px-8 py-4 luxury-gradient text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] transition-all duration-500"
              >
                <Phone size={16} className="mr-2" />
                Llamar Ahora
              </a>
              <a 
                href="https://wa.me/34645872227" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border border-[#c2b2a3]/30 text-[#c2b2a3] uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-[#c2b2a3] hover:text-black transition-all duration-700"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* SEO Text */}
          <div className="bg-[#111111] border border-white/5 p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Escorts de Lujo en Valencia</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              En Valeria Ferrer, ofrecemos el servicio más exclusivo de escorts en Valencia. Nuestras acompañantes 
              son seleccionadas cuidadosamente para garantizar experiencias inolvidables, combinando belleza, 
              inteligencia y sofisticación. Cada una de nuestras escorts ofrece un servicio personalizado, 
              adaptado a tus necesidades preferencias.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Ya sea para cenas de negocios, eventos sociales, viajes o simplemente compañía privada, 
              nuestras escorts en Valencia están disponibles 24/7 para ofrecerte el más alto nivel de 
              discreción y profesionalismo. Todas nuestras modelos verificadas garantizan autenticidad 
              y calidad en cada encuentro.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-[#c2b2a3]/30 text-[#c2b2a3] hover:bg-[#c2b2a3]/20 transition-colors mb-4"
            >
              <Filter size={16} />
              <span>Filtros</span>
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="bg-[#111111] border border-white/5 p-6 space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Buscar</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre, nacionalidad..."
                      className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c2b2a3]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Nationality Filter */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nacionalidad</label>
                    <select
                      value={selectedNationality}
                      onChange={(e) => setSelectedNationality(e.target.value)}
                      className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c2b2a3]/50"
                    >
                      <option value="all">Todas</option>
                      {nationalities.map(nat => (
                        <option key={nat} value={nat}>{nat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Age Filter */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Edad</label>
                    <select
                      value={selectedAge}
                      onChange={(e) => setSelectedAge(e.target.value)}
                      className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c2b2a3]/50"
                    >
                      <option value="all">Todas</option>
                      <option value="18-22">18-22 años</option>
                      <option value="23-25">23-25 años</option>
                      <option value="2645872227+">2645872227+ años</option>
                    </select>
                  </div>

                  {/* Service Filter */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Servicios</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c2b2a3]/50"
                    >
                      <option value="all">Todos</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              {filteredModels.length} escorts encontradas
            </p>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <Link
                key={model.slug}
                to={`/escorts-valencia/${model.slug}`}
                className="group relative overflow-hidden bg-[#111111] border border-white/5 rounded-2xl transition-all duration-300 hover:border-[#c2b2a3]/30"
              >
                {/* VIP Badge */}
                {model.vip && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="px-3 py-1 bg-gradient-to-r from-red-600/20 to-red-500/10 backdrop-blur-sm border border-red-600/30 rounded-full">
                      <span className="text-red-400 text-[10px] tracking-[0.3em] uppercase font-light">VIP</span>
                    </div>
                  </div>
                )}

                {/* Availability Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1 bg-green-600/20 backdrop-blur-sm border border-green-600/30 rounded-full">
                    <span className="text-green-400 text-[10px] tracking-[0.3em] uppercase font-light">
                      {model.availability}
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={model.images[0]}
                    alt={model.altImages[0]}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#c2b2a3] transition-colors">
                      {model.name}
                    </h3>
                    <span className="text-sm text-gray-400">{model.age} años</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {model.shortHeadline}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{model.nationality}</span>
                    <span>{model.height}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {model.services.slice(0, 2).map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-[#c2b2a3]/10 border border-[#c2b2a3]/20 rounded text-[10px] text-[#c2b2a3] uppercase tracking-[0.2em]"
                      >
                        {service}
                      </span>
                    ))}
                    {model.services.length > 2 && (
                      <span className="px-2 py-1 bg-[#c2b2a3]/10 border border-[#c2b2a3]/20 rounded text-[10px] text-[#c2b2a3] uppercase tracking-[0.2em]">
                        +{model.services.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No se encontraron escorts con los filtros seleccionados.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedNationality('all');
                  setSelectedAge('all');
                  setSelectedService('all');
                }}
                className="mt-4 px-6 py-2 border border-[#c2b2a3]/30 text-[#c2b2a3] hover:bg-[#c2b2a3]/20 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </section>

        {/* Internal Links Section */}
        <section className="bg-[#080808] py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-8">Servicios y Tipos de Escorts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((service) => (
                <Link
                  key={service}
                  to={`/escorts-valencia?service=${encodeURIComponent(service)}`}
                  className="px-4 py-3 bg-[#111111] border border-white/5 rounded-lg text-center text-gray-400 hover:text-[#c2b2a3] hover:border-[#c2b2a3]/30 transition-all"
                >
                  {service}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EscortsValencia;
