/** Prueba estacional en la franja de novedades (home). false = diseño original. */
export const SEASONAL_NOVEDADES_STRIP_ENABLED = true;

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type SeasonalStripTheme = {
  season: Season;
  eyebrow: string;
  headline: string;
  sectionClass: string;
  borderClass: string;
  glowClass: string;
  accentLineClass: string;
};

export function getSeason(date = new Date()): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

const THEMES: Record<Season, Omit<SeasonalStripTheme, 'season'>> = {
  summer: {
    eyebrow: 'Verano en Valencia',
    headline: 'Nuevas incorporaciones y mejoras',
    sectionClass: 'bg-[#111111]',
    borderClass: 'border-[#c2b2a3]/12',
    glowClass:
      'bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(194,178,163,0.14),transparent_70%)]',
    accentLineClass: 'from-[#c2b2a3]/40 via-[#e8d5b5]/25 to-transparent',
  },
  autumn: {
    eyebrow: 'Otoño · temporada',
    headline: 'Nuevas incorporaciones y mejoras',
    sectionClass: 'bg-[#111111]',
    borderClass: 'border-[#c2b2a3]/10',
    glowClass:
      'bg-[radial-gradient(ellipse_75%_55%_at_50%_100%,rgba(180,130,90,0.12),transparent_72%)]',
    accentLineClass: 'from-amber-900/30 via-[#c2b2a3]/20 to-transparent',
  },
  winter: {
    eyebrow: 'Invierno en la ciudad',
    headline: 'Nuevas incorporaciones y mejoras',
    sectionClass: 'bg-[#101014]',
    borderClass: 'border-white/8',
    glowClass:
      'bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(180,195,210,0.08),transparent_75%)]',
    accentLineClass: 'from-slate-400/20 via-[#c2b2a3]/15 to-transparent',
  },
  spring: {
    eyebrow: 'Primavera · nueva temporada',
    headline: 'Nuevas incorporaciones y mejoras',
    sectionClass: 'bg-[#111111]',
    borderClass: 'border-[#c2b2a3]/10',
    glowClass:
      'bg-[radial-gradient(ellipse_75%_55%_at_50%_100%,rgba(160,175,140,0.1),transparent_72%)]',
    accentLineClass: 'from-emerald-900/20 via-[#c2b2a3]/18 to-transparent',
  },
};

export function getSeasonalStripTheme(date = new Date()): SeasonalStripTheme {
  const season = getSeason(date);
  return { season, ...THEMES[season] };
}
