
import React, { useEffect } from 'react';
import { FEES } from '../constants';
import { Wallet, Info } from 'lucide-react';

const Fees: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen animate-in fade-in duration-700 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <Wallet size={40} className="mx-auto text-[#c2b2a3] mb-6 opacity-40" />
          <h1 className="text-4xl md:text-6xl serif luxury-text-gradient uppercase mb-6">{FEES.header}</h1>
          <p className="text-gray-400 font-light tracking-widest uppercase text-xs leading-relaxed max-w-2xl mx-auto">
            {FEES.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {FEES.rates.map((rate, idx) => (
            <div key={idx} className="bg-[#111111] border border-white/5 p-10 hover:border-[#c2b2a3]/30 transition-all">
              <h3 className="text-2xl serif text-[#c2b2a3] mb-2 uppercase">{rate.duration}</h3>
              <p className="text-3xl font-light mb-4">{rate.price}</p>
              <div className="h-[1px] w-12 bg-white/10 mb-4"></div>
              <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">{rate.note}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.02] border border-[#c2b2a3]/10 p-10 rounded-sm">
          <div className="flex items-center space-x-4 mb-6">
            <Info size={20} className="text-[#c2b2a3]" />
            <h4 className="text-sm font-bold tracking-widest uppercase">Notas Importantes</h4>
          </div>
          <ul className="space-y-4 text-xs font-light text-gray-400 tracking-widest uppercase leading-relaxed">
            <li>• Los honorarios de la escort se pagan directamente al inicio del encuentro.</li>
            <li>• Los gastos de desplazamiento no están incluidos y se calculan según la ubicación.</li>
            <li>• Para reservas de larga distancia se requiere un depósito del 50%.</li>
            <li>• Cancelaciones con menos de 24h de antelación requieren el pago del 50% de la tarifa mínima.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Fees;
