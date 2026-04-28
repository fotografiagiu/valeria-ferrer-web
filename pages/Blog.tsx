import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import blogData from '../data/blog.json';

const Blog: React.FC = () => {
  const [filteredArticles, setFilteredArticles] = useState(blogData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique categories
  const categories = ['Todos', ...Array.from(new Set(blogData.map(article => article.category)))];

  useEffect(() => {
    let filtered = blogData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      {/* Hero Section */}
      <section className="bg-[#111111] py-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wider">
              Blog <span className="italic luxury-text-gradient">Valeria Ferrer</span>
            </h1>
            <p className="text-[#c2b2a3] font-light tracking-wider text-sm mb-8 max-w-2xl mx-auto">
              Guías exclusivas, experiencias de lujo y todo sobre el mundo de las acompañantes VIP en Valencia
            </p>
            <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#111111] border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-[#c2b2a3]/50 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-3 bg-[#111111] border border-white/10 rounded-full text-white hover:border-[#c2b2a3]/50 transition-colors"
              >
                <Filter size={16} />
                <span className="text-sm">{selectedCategory}</span>
              </button>

              {/* Results Count */}
              <span className="text-sm text-gray-400">
                {filteredArticles.length} artículo{filteredArticles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Category Dropdown */}
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsFilterOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#c2b2a3] text-black'
                      : 'bg-[#111111] border border-white/10 text-gray-400 hover:border-[#c2b2a3]/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No se encontraron artículos</p>
              <p className="text-gray-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <BlogCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="py-16 px-6 bg-[#111111] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">Temas Populares</h2>
            <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Guías de Valencia",
                description: "Descubre las mejores zonas, hoteles y restaurantes para experiencias VIP",
                tags: ["escorts valencia", "hoteles lujo", "restaurantes"]
              },
              {
                title: "Servicios VIP",
                description: "Conoce todos nuestros servicios exclusivos de acompañamiento",
                tags: ["girlfriend experience", "cenas negocios", "viajes"]
              },
              {
                title: "Experiencias de Lujo",
                description: "Todo sobre eventos, spas y actividades premium en Valencia",
                tags: ["eventos exclusivos", "spa lujo", "noche valencia"]
              }
            ].map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-[#c2b2a3]/30 transition-all duration-500"
              >
                <h3 className="text-xl font-light tracking-wider mb-3 text-[#c2b2a3]">{topic.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{topic.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[#c2b2a3]/10 border border-[#c2b2a3]/20 rounded-full text-[9px] text-[#c2b2a3] uppercase tracking-[0.1em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">Mantente Informado</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Recibe artículos exclusivos sobre el mundo de las acompañantes VIP en Valencia directamente en tu email
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email..."
                className="flex-1 px-4 py-3 bg-[#111111] border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-[#c2b2a3]/50 transition-colors"
              />
              <button className="px-6 py-3 bg-[#c2b2a3] text-black font-bold rounded-full hover:bg-white transition-colors duration-300">
                Suscribirse
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
