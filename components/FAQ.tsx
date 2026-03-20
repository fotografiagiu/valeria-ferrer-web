
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../constants';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button 
        className="w-full py-6 flex items-center justify-between text-left hover:text-[#c2b2a3] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg md:text-xl font-light tracking-wide uppercase">{question}</span>
        {isOpen ? <ChevronUp size={20} className="text-[#c2b2a3]" /> : <ChevronDown size={20} className="text-[#c2b2a3]" />}
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400 font-light leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-light mb-4"><span className="italic">FAQs</span> del Servicio</h2>
          <p className="text-[#c2b2a3] tracking-widest uppercase text-xs">Todo lo que necesita saber sobre nuestro servicio exclusivo</p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
