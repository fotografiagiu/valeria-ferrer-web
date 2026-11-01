import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const HomeEditorial: React.FC = () => (
  <div className="vf-noir vf-home-editorial-wrap">
      <section className="vf-noir-editorial" aria-labelledby="vf-noir-editorial-title">
        <div className="vf-noir-editorial__index"><span>V / F</span><small>VALENCIA · SELECCIÓN EXCLUSIVA</small></div>
        <div className="vf-noir-editorial__copy">
          <p className="vf-noir-editorial__kicker">Conoce Valeria Ferrer</p>
          <h2 id="vf-noir-editorial-title">Escorts de lujo en <em>Valencia</em></h2>
          <p>En Valeria Ferrer encontrarás una selección de escorts y acompañantes en Valencia con fotografías reales, perfiles individuales y atención privada. Consulta nuestras chicas disponibles, descubre sus galerías y elige con información clara antes de reservar.</p>
          <div className="vf-noir-editorial__links">
            <Link to="/escorts-de-lujo-valencia">Escorts de lujo en Valencia <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link to="/models">Explorar todas las chicas <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
  </div>
);
export default HomeEditorial;
