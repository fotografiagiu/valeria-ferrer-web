import React, { useEffect } from 'react';

const Legal: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl serif luxury-text-gradient uppercase tracking-widest mb-4 text-center">
          Aviso legal
        </h1>
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-12">
          Valeria Ferrer · Valencia
        </p>

        <div className="space-y-10 text-gray-300 font-light text-sm leading-relaxed">
          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Identificación del sitio
            </h2>
            <p>
              El presente sitio web es operado bajo la denominación <strong className="text-gray-200">Valeria Ferrer</strong>,
              con actividad vinculada a <strong className="text-gray-200">Valencia</strong> (España). La información
              facilitada en estas páginas tiene carácter general e informativo.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Finalidad
            </h2>
            <p>
              Este sitio tiene finalidad informativa y de contacto. La navegación y el uso de los medios de contacto
              indicados (Telegram, teléfono) implican la aceptación de un uso responsable y conforme a la legislación
              aplicable.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Uso responsable
            </h2>
            <p>
              El usuario se compromete a utilizar el sitio de forma lícita, sin vulnerar derechos de terceros ni
              introducir contenido ilícito o lesivo. Valeria Ferrer podrá restringir el acceso en caso de uso contrario
              a estos principios.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Propiedad intelectual
            </h2>
            <p>
              Los textos, imágenes, marcas y demás contenidos del sitio están protegidos por la normativa vigente. Queda
              prohibida su reproducción, distribución o transformación sin autorización expresa, salvo lo permitido por
              la ley.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Contacto
            </h2>
            <p className="mb-4">
              Para cualquier consulta relacionada con este aviso legal puede contactar a través de:
            </p>
            <ul className="space-y-2 text-gray-400">
              <li>
                Telegram:{' '}
                <a
                  href="https://t.me/valeriaferreer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c2b2a3] hover:text-white underline underline-offset-4"
                >
                  @valeriaferreer
                </a>
              </li>
              <li>
                Teléfono:{' '}
                <a href="tel:+34645872227" className="text-[#c2b2a3] hover:text-white">
                  +34 645 872 227
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Legal;
