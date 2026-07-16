import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flower2, Leaf, Snowflake, Sun } from 'lucide-react';
import {
  getSeasonalStripTheme,
  SEASONAL_NOVEDADES_STRIP_ENABLED,
  type Season,
} from '../lib/seasonalStripTheme';

const ExploreProfilesNav = React.lazy(() => import('./ExploreProfilesNav'));

const SEASON_ICONS: Record<Season, React.FC<{ className?: string; strokeWidth?: number }>> = {
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
  spring: Flower2,
};

type HomeNovedadesStripProps = {
  exploreLinks: ReturnType<typeof import('../lib/homeExploreLinks').getHomeExploreLinks>;
  loadExploreNav: boolean;
};

const HomeNovedadesStrip: React.FC<HomeNovedadesStripProps> = ({
  exploreLinks,
  loadExploreNav,
}) => {
  const seasonal = SEASONAL_NOVEDADES_STRIP_ENABLED ? getSeasonalStripTheme() : null;
  const SeasonIcon = seasonal ? SEASON_ICONS[seasonal.season] : null;

  if (!seasonal) {
    return (
      <section className="bg-[#111111] border-y border-white/5 py-8 md:py-10">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-gray-400 font-light text-sm md:text-base tracking-wide mb-4">
              Nuevas incorporaciones y mejoras
            </p>
            <NovedadesButton />
          </div>
          <ExploreNavSlot exploreLinks={exploreLinks} loadExploreNav={loadExploreNav} />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden border-y py-8 md:py-10 ${seasonal.sectionClass} ${seasonal.borderClass}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${seasonal.glowClass}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/25 to-transparent"
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-x-8 md:inset-x-16 bottom-0 h-px bg-gradient-to-r ${seasonal.accentLineClass}`}
        aria-hidden
      />

      <div className="relative max-w-[1600px] mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="inline-flex items-center justify-center gap-2 text-[#c2b2a3]/75 text-[10px] md:text-xs uppercase tracking-[0.38em] font-medium mb-3">
            {SeasonIcon ? (
              <SeasonIcon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.25} />
            ) : null}
            {seasonal.eyebrow}
          </p>
          <p className="text-gray-400 font-light text-sm md:text-base tracking-wide mb-4">
            {seasonal.headline}
          </p>
          <NovedadesButton />
        </div>
        <ExploreNavSlot exploreLinks={exploreLinks} loadExploreNav={loadExploreNav} />
      </div>
    </section>
  );
};

const NovedadesButton: React.FC = () => (
  <Link
    to="/novedades"
    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#c2b2a3]/35 bg-[#c2b2a3]/10 text-[#c2b2a3] text-[10px] md:text-xs uppercase tracking-[0.32em] font-medium hover:bg-[#c2b2a3]/18 hover:border-[#c2b2a3]/50 hover:text-white transition-all duration-300 shadow-[0_0_24px_-8px_rgba(194,178,163,0.25)]"
  >
    Ver novedades
    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
  </Link>
);

const ExploreNavSlot: React.FC<{
  exploreLinks: HomeNovedadesStripProps['exploreLinks'];
  loadExploreNav: boolean;
}> = ({ exploreLinks, loadExploreNav }) => (
  <div className="min-h-[5.5rem] md:min-h-[4.5rem]">
    {loadExploreNav ? (
      <Suspense fallback={null}>
        <ExploreProfilesNav links={exploreLinks} title="Explorar" variant="embedded" />
      </Suspense>
    ) : null}
  </div>
);

export default HomeNovedadesStrip;
