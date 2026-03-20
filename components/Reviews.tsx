
import React, { useState, useEffect } from 'react';
import { REVIEWS } from '../constants';
import { Quote, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsToShow(reviewsPerPage.mobile);
      else if (window.innerWidth < 1024) setItemsToShow(reviewsPerPage.tablet);
      else setItemsToShow(reviewsPerPage.desktop);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(REVIEWS.length / itemsToShow));
    }, 5000);
    return () => clearInterval(timer);
  }, [itemsToShow]);

  const visibleReviews = REVIEWS.slice(
    currentIndex * itemsToShow,
    (currentIndex + 1) * itemsToShow
  );

  // If we don't have enough reviews for the last page, wrap around or pad
  if (visibleReviews.length < itemsToShow && REVIEWS.length > itemsToShow) {
    const remaining = itemsToShow - visibleReviews.length;
    visibleReviews.push(...REVIEWS.slice(0, remaining));
  }

  return (
    <section className="py-24 bg-[#111111] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-light mb-4">Reseñas de <span className="italic">Caballeros</span></h2>
          <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
        </div>

        <div className="relative h-[450px] md:h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 absolute inset-0"
            >
              {visibleReviews.map((review, idx) => (
                <div key={`${review.id}-${idx}`} className="bg-[#0a0a0a] border border-white/5 p-10 relative group hover:border-[#c2b2a3]/30 transition-all duration-500 h-full flex flex-col">
                  <Quote className="absolute top-6 right-6 text-[#c2b2a3]/20" size={40} />
                  <div className="mb-6 flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-[#c2b2a3]/20 bg-[#1a1a1a] flex items-center justify-center">
                      {review.image ? (
                        <img src={review.image} alt={review.author} className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-[#c2b2a3]/40" size={32} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#c2b2a3] tracking-widest text-xs uppercase">{review.author}</h4>
                      <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Cliente Verificado</p>
                    </div>
                  </div>
                  <h3 className="text-xl serif italic mb-4">"{review.title}"</h3>
                  <p className="text-sm font-light text-gray-400 leading-relaxed italic mb-6 flex-grow">
                    {review.content}
                  </p>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                    <span className="text-[10px] tracking-widest uppercase text-[#c2b2a3]">Cita con {review.modelName}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-12 space-x-2">
          {Array.from({ length: Math.ceil(REVIEWS.length / itemsToShow) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'bg-[#c2b2a3] w-8' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
