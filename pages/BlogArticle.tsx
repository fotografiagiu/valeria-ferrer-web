import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, Bookmark } from 'lucide-react';
import blogData from '../data/blog.json';
import OptimizedImage from '../components/OptimizedImage';

const BlogArticle: React.FC = () => {
  const { id } = useParams();
  const article = blogData.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Artículo no encontrado</h1>
          <Link to="/blog" className="text-[#c2b2a3] hover:text-white transition-colors">
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  // Update SEO meta tags
  useEffect(() => {
    document.title = article.seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', article.seo.description);
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', article.seo.keywords);
    }
  }, [article]);

  const renderContent = (content: string) => {
    // Convert markdown-like content to HTML
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl md:text-5xl font-light mb-8 luxury-text-gradient">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl md:text-4xl font-light mb-6 mt-12 text-white">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl md:text-3xl font-light mb-4 mt-8 text-[#c2b2a3]">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-xl md:text-2xl font-light mb-3 mt-6 text-white">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-[#c2b2a3]">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="text-gray-300 mb-2">$1</li>')
      .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-6 space-y-2">$1</ul>')
      .replace(/^\d+\. (.*$)/gim, '<li class="text-gray-300 mb-2">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-6">')
      .replace(/^(.+)/g, '<p class="text-gray-300 leading-relaxed mb-6">$1</p>')
      .replace(/<p class="text-gray-300 leading-relaxed mb-6">(.*):<\/p>/g, '<p class="text-gray-300 leading-relaxed mb-6"><strong class="text-white">$1:</strong></p>')
      .replace(/<p class="text-gray-300 leading-relaxed mb-6">(<\/h[1-6]])/g, '$1')
      .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/(<\/ul>)<\/p>/g, '$1')
      .replace(/(<\/ol>)<\/p>/g, '$1');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <OptimizedImage
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link 
                to="/blog" 
                className="inline-flex items-center space-x-2 text-[#c2b2a3] hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">Volver al Blog</span>
              </Link>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-[#c2b2a3]/20 backdrop-blur-sm border border-[#c2b2a3]/30 rounded-full text-[10px] text-[#c2b2a3] uppercase tracking-[0.2em] font-bold">
                  {article.category}
                </span>
                <div className="flex items-center space-x-4 text-[10px] text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User size={12} />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-light mb-6 text-white leading-tight">
                {article.title}
              </h1>
              
              <p className="text-lg text-gray-300 max-w-3xl">
                {article.excerpt}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-white/5">
                <h3 className="text-sm font-bold text-[#c2b2a3] uppercase tracking-[0.2em] mb-4">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 uppercase tracking-[0.1em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t border-white/5">
                <h3 className="text-sm font-bold text-[#c2b2a3] uppercase tracking-[0.2em] mb-4">Compartir Artículo</h3>
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:bg-white/10 transition-colors">
                    <Share2 size={14} />
                    <span>Compartir</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:bg-white/10 transition-colors">
                    <Heart size={14} />
                    <span>Me Gusta</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:bg-white/10 transition-colors">
                    <Bookmark size={14} />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Table of Contents */}
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-light tracking-wider mb-4 text-[#c2b2a3]">Contenido</h3>
                  <nav className="space-y-2">
                    <a href="#introduction" className="block text-sm text-gray-400 hover:text-[#c2b2a3] transition-colors">
                      Introducción
                    </a>
                    <a href="#services" className="block text-sm text-gray-400 hover:text-[#c2b2a3] transition-colors">
                      Servicios
                    </a>
                    <a href="#locations" className="block text-sm text-gray-400 hover:text-[#c2b2a3] transition-colors">
                      Ubicaciones
                    </a>
                    <a href="#contact" className="block text-sm text-gray-400 hover:text-[#c2b2a3] transition-colors">
                      Contacto
                    </a>
                  </nav>
                </div>

                {/* Related Articles */}
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-light tracking-wider mb-4 text-[#c2b2a3]">Artículos Relacionados</h3>
                  <div className="space-y-4">
                    {blogData
                      .filter(a => a.id !== article.id && a.category === article.category)
                      .slice(0, 3)
                      .map((relatedArticle) => (
                        <Link
                          key={relatedArticle.id}
                          to={`/blog/${relatedArticle.id}`}
                          className="block group"
                        >
                          <h4 className="text-sm font-light text-white group-hover:text-[#c2b2a3] transition-colors line-clamp-2">
                            {relatedArticle.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {relatedArticle.readTime}
                          </p>
                        </Link>
                      ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-[#c2b2a3]/10 to-[#c2b2a3]/5 border border-[#c2b2a3]/20 rounded-2xl p-6">
                  <h3 className="text-lg font-light tracking-wider mb-4 text-[#c2b2a3]">¿Interesado en Nuestros Servicios?</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Descubre las mejores acompañantes VIP en Valencia con discreción absoluta.
                  </p>
                  <Link
                    to="/models"
                    className="block w-full text-center px-4 py-3 bg-[#c2b2a3] text-black font-bold rounded-full hover:bg-white transition-colors duration-300"
                  >
                    Ver Modelos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <section className="py-16 px-6 bg-[#111111] border-t border-white/5">
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

          <div className="grid md:grid-cols-3 gap-8">
            {blogData
              .filter(a => a.id !== article.id)
              .slice(0, 3)
              .map((relatedArticle, index) => (
                <motion.div
                  key={relatedArticle.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => window.location.href = `/blog/${relatedArticle.id}`}
                >
                  <div className="aspect-[16/10] relative overflow-hidden rounded-2xl mb-4">
                    <OptimizedImage
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.title}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2 py-1 bg-[#c2b2a3]/20 backdrop-blur-sm border border-[#c2b2a3]/30 rounded-full text-[9px] text-[#c2b2a3] uppercase tracking-[0.2em] font-bold">
                        {relatedArticle.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-light text-white group-hover:text-[#c2b2a3] transition-colors line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">{relatedArticle.readTime}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogArticle;
