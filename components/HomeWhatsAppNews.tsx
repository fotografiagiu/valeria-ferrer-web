import React from 'react'
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_WHATSAPP_URL,
} from '../lib/officialContact'

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    width="18"
    height="18"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-1.24.241a.513.513 0 01-.626-.362.52.52 0 01.025-.216l.242-1.2-.215-.36a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

/**
 * Compact Home news card for the new WhatsApp line.
 * Reserved min-height keeps CLS low (no popup).
 */
const HomeWhatsAppNews: React.FC = () => {
  return (
    <aside className="home-whatsapp-news" aria-label="Nuevo WhatsApp de atención">
      <span className="home-whatsapp-news__badge">NUEVO</span>
      <div className="home-whatsapp-news__copy min-w-0">
        <h2 className="home-whatsapp-news__title">Nuevo WhatsApp de atención</h2>
        <p className="home-whatsapp-news__text">
          Ahora también puedes escribirnos por WhatsApp{' '}
          <span className="home-whatsapp-news__number">{OFFICIAL_PHONE_LABEL}</span>
        </p>
      </div>
      <a
        href={OFFICIAL_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-contact-placement="home_whatsapp_news"
        className="home-whatsapp-news__action"
      >
        <WhatsAppIcon />
        WhatsApp
      </a>
    </aside>
  )
}

export default HomeWhatsAppNews
