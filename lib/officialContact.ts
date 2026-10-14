/**
 * Official public contacts (site chrome, fichas, SEO).
 * Single source of truth — do not hardcode phone numbers elsewhere.
 */
export const OFFICIAL_TELEGRAM_URL = 'https://t.me/Valeriaferreeer'
export const OFFICIAL_TELEGRAM_HANDLE = '@Valeriaferreeer'

/** Display: "611 076 490" */
export const OFFICIAL_PHONE_LABEL = '611 076 490'
/** Display with country: "+34 611 076 490" */
export const OFFICIAL_PHONE_LABEL_INTL = '+34 611 076 490'
/** tel: link (national digits) */
export const OFFICIAL_PHONE_TEL = 'tel:+34611076490'
/** E.164 without spaces, for wa.me / tel */
export const OFFICIAL_PHONE_E164 = '34611076490'
export const OFFICIAL_PHONE_E164_PLUS = '+34611076490'

export const OFFICIAL_WHATSAPP_URL = `https://wa.me/${OFFICIAL_PHONE_E164}`
export const OFFICIAL_WHATSAPP_LABEL = OFFICIAL_PHONE_LABEL

export function officialWhatsAppUrlWithText(text: string): string {
  return `${OFFICIAL_WHATSAPP_URL}?text=${encodeURIComponent(text)}`
}
