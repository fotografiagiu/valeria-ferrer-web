import React, { useEffect } from 'react';

const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl serif luxury-text-gradient uppercase tracking-widest mb-4 text-center">
          Términos y condiciones de uso
        </h1>
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-12">
          Valeria Ferrer · Valencia
        </p>

        <div className="space-y-10 text-gray-300 font-light text-sm leading-relaxed">
          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Uso del sitio
            </h2>
            <p>
              El acceso y uso del sitio web de <strong className="text-gray-200">Valeria Ferrer</strong> implica la
              lectura y aceptación de estas condiciones. El sitio ofrece información sobre servicios en{' '}
              <strong className="text-gray-200">Valencia</strong>; el uso debe ser lícito y respetuoso.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Mayoría de edad
            </h2>
            <p>
              El contenido está dirigido exclusivamente a personas mayores de edad según la legislación de su país de
              residencia. Si no cumple ese requisito, debe abstenerse de utilizar el sitio.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Responsabilidad del usuario
            </h2>
            <p>
              El usuario es responsable de la veracidad de la información que facilite y del uso que haga del sitio y
              de los canales de contacto. Se abstendrá de conductas que puedan dañar sistemas, terceros o el normal
              funcionamiento del servicio.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Limitación de responsabilidad
            </h2>
            <p>
              La información se ofrece sin garantía de exhaustividad. Valeria Ferrer no se hace responsable de daños
              indirectos o lucro cesante derivados del uso del sitio, salvo lo imperativo por ley. Los enlaces a sitios
              externos son meramente informativos; no se responde por sus contenidos.
            </p>
          </section>

          <section className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
            <h2 className="text-[#c2b2a3] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Cambios
            </h2>
            <p>
              Estas condiciones pueden actualizarse. La versión vigente será la publicada en esta página; se recomienda
              revisarla periódicamente.
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
  );
};

export default Terms;
