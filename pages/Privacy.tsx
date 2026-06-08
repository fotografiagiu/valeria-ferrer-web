import React, { useEffect } from 'react';
import PageSEOHead, { SITE_ORIGIN } from '../components/PageSEOHead';

const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageSEOHead
        title="Política de privacidad | Valeria Ferrer"
        description="Política de privacidad de Valeria Ferrer. Información sobre el tratamiento de datos personales y derechos de los usuarios en Valencia."
        canonicalUrl={`${SITE_ORIGIN}/privacy`}
      />
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl serif luxury-text-gradient uppercase tracking-widest mb-4 text-center">
          Política de privacidad
        </h1>
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-12">
          Valeria Ferrer · Valencia
        </p>

        <div className="space-y-10 text-gray-300 font-light text-sm leading-relaxed">
          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Responsable
            </h2>
            <p>
              El responsable del tratamiento de los datos personales facilitados a través de los medios de contacto
              del sitio es <strong className="text-gray-200">Valeria Ferrer</strong>, con actividad en{' '}
              <strong className="text-gray-200">Valencia</strong> (España).
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Datos que puede facilitar
            </h2>
            <p>
              Al contactar por Telegram o teléfono, puede facilitar datos identificativos o de contacto (por ejemplo,
              nombre, usuario de Telegram, número de teléfono o el contenido del mensaje). Solo se solicitarán datos
              adecuados, pertinentes y limitados a lo necesario para atender su solicitud.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Finalidad
            </h2>
            <p>
              Los datos se tratan con la finalidad de <strong className="text-gray-200">responder a su solicitud</strong>{' '}
              de información o contacto, gestionar la comunicación y, en su caso, mantener la relación comercial o
              informativa derivada de dicha comunicación.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Cesiones
            </h2>
            <p>
              No se venden datos personales a terceros. Solo podrán comunicarse datos si existe obligación legal o
              colaboración con proveedores estrictamente necesarios para el funcionamiento del sitio (por ejemplo,
              hosting), bajo contrato de tratamiento cuando corresponda.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Derechos
            </h2>
            <p>
              Puede ejercer los derechos de acceso, rectificación, supresión, limitación, oposición y portabilidad que
              le correspondan conforme a la normativa aplicable, así como retirar el consentimiento en cualquier
              momento, cuando el tratamiento se base en consentimiento. Para ello puede dirigirse a los medios de
              contacto indicados al final de esta política.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Analítica y cookies
            </h2>
            <p>
              El sitio puede utilizar herramientas de analítica (por ejemplo, servicios de medición de audiencia del
              proveedor de alojamiento) y cookies o tecnologías similares con fines técnicos o estadísticos. Puede
              configurar su navegador para rechazar cookies; algunas funciones del sitio podrían verse limitadas.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Contacto
            </h2>
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
    </>
  );
};

export default Privacy;
