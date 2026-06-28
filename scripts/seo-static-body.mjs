/**
 * Contenido HTML estático para inyección post-build (Fase B).
 * Solo rutas explícitas; el resto mantiene #root vacío.
 */

/** @type {Record<string, string>} */
export const STATIC_BODY_BY_PATH = {
  '/escorts-valencia': `
<main class="static-seo-escorts-valencia" style="max-width:48rem;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,'Times New Roman',serif;color:#e5e5e5;line-height:1.75;background:#0a0a0a;">
  <article>
    <h1 style="font-size:1.75rem;font-weight:400;letter-spacing:0.04em;margin:0 0 1.25rem;color:#fff;">Escorts en Valencia</h1>
    <p style="margin:0 0 1.5rem;font-size:1rem;color:#a3a3a3;">
      En Valeria Ferrer encontrarás escorts en Valencia con fotos reales, perfiles actualizados y contacto discreto.
      Si buscas escort Valencia, escorts Valencia o acompañantes en Valencia, reunimos perfiles con una presentación cuidada,
      información clara y disponibilidad orientada a quienes buscan una experiencia elegante, segura y profesional.
    </p>
    <nav aria-label="Enlaces relacionados" style="margin:0 0 2rem;">
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:0.75rem 1.25rem;font-size:0.875rem;">
        <li><a href="/models" style="color:#c2b2a3;text-decoration:underline;text-underline-offset:3px;">chicas disponibles en Valencia</a></li>
        <li><a href="/escorts-de-lujo-valencia" style="color:#c2b2a3;text-decoration:underline;text-underline-offset:3px;">escorts de lujo en Valencia</a></li>
        <li><a href="/vip" style="color:#c2b2a3;text-decoration:underline;text-underline-offset:3px;">acompañantes VIP</a></li>
        <li><a href="/casting" style="color:#c2b2a3;text-decoration:underline;text-underline-offset:3px;">casting</a></li>
      </ul>
    </nav>
    <section aria-labelledby="static-seo-faq-heading">
      <h2 id="static-seo-faq-heading" style="font-size:1.125rem;font-weight:400;margin:0 0 1rem;color:#fff;">Preguntas frecuentes</h2>
      <div style="margin-bottom:1rem;">
        <h3 style="font-size:1rem;font-weight:400;margin:0 0 0.35rem;color:#e5e5e5;">¿Dónde ver escorts disponibles en Valencia?</h3>
        <p style="margin:0;font-size:0.9375rem;color:#a3a3a3;">
          Puedes consultar los perfiles actualizados en Valeria Ferrer, con fotos reales, información clara y contacto discreto.
        </p>
      </div>
      <div>
        <h3 style="font-size:1rem;font-weight:400;margin:0 0 0.35rem;color:#e5e5e5;">¿Las fotos de los perfiles son reales?</h3>
        <p style="margin:0;font-size:0.9375rem;color:#a3a3a3;">
          Sí, la web está orientada a mostrar perfiles con presentación cuidada, fotos reales y datos actualizados.
        </p>
      </div>
    </section>
  </article>
</main>`.trim(),
};

/** Comprobaciones mínimas para verify-inject-seo (solo Fase B). */
export const STATIC_BODY_CHECKS = {
  '/escorts-valencia': [
    { label: 'h1', pattern: /<h1[^>]*>\s*Escorts en Valencia\s*<\/h1>/i },
    {
      label: 'intro paragraph',
      pattern: /En Valeria Ferrer encontrarás escorts en Valencia con fotos reales/i,
    },
    { label: 'keyword escort Valencia', pattern: /\bescort Valencia\b/i },
    { label: 'keyword escorts Valencia', pattern: /\bescorts Valencia\b/i },
    { label: 'keyword acompañantes en Valencia', pattern: /acompañantes en Valencia/i },
    { label: 'link /models', pattern: /<a[^>]+href="\/models"[^>]*>chicas disponibles en Valencia<\/a>/i },
    {
      label: 'link /escorts-de-lujo-valencia',
      pattern: /<a[^>]+href="\/escorts-de-lujo-valencia"[^>]*>escorts de lujo en Valencia<\/a>/i,
    },
    { label: 'link /vip', pattern: /<a[^>]+href="\/vip"[^>]*>acompañantes VIP<\/a>/i },
    { label: 'link /casting', pattern: /<a[^>]+href="\/casting"[^>]*>casting<\/a>/i },
    {
      label: 'faq q1',
      pattern: /¿Dónde ver escorts disponibles en Valencia\?/i,
    },
    {
      label: 'faq q2',
      pattern: /¿Las fotos de los perfiles son reales\?/i,
    },
  ],
};
