import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

interface BlogCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    featuredImage: string;
    tags: string[];
  };
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ article, index }) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#c2b2a3]/30 transition-all duration-500 group"
    >
      {/* Featured Image */}
      <div className="aspect-[16/10] relative overflow-hidden">
        <OptimizedImage
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[#c2b2a3]/20 backdrop-blur-sm border border-[#c2b2a3]/30 rounded-full text-[10px] text-[#c2b2a3] uppercase tracking-[0.2em] font-bold">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Title */}
        <Link to={`/blog/${article.id}`} className="block group">
          <h3 className="text-xl md:text-2xl font-light tracking-wider mb-4 text-white group-hover:text-[#c2b2a3] transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User size={12} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-gray-400 uppercase tracking-[0.1em]"
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-gray-400 uppercase tracking-[0.1em]">
              +{article.tags.length - 3}
            </span>
          )}
        </div>

        {/* Read More Button */}
        <Link 
          to={`/blog/${article.id}`}
          className="inline-flex items-center space-x-2 text-[#c2b2a3] hover:text-white transition-colors duration-300 group"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Leer Artículo</span>
          <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;
