export type PanelEnv = {
  sessionSecret: string;
  cookieName: string;
  sessionTtlHours: number;
  /** Canonical panel origin (PANEL_ORIGIN). */
  panelOrigin: string;
  /**
   * Origins allowed for staff write CSRF checks.
   * Always includes PANEL_ORIGIN; also https://$VERCEL_URL and https://$VERCEL_BRANCH_URL
   * when Vercel injects them (Preview-safe without broad *.vercel.app wildcards).
   */
  staffWriteOrigins: string[];
  publicWebOrigins: string[];
  isProd: boolean;
};

function normalizeOrigin(raw: string): string {
  return raw.trim().replace(/\/$/, '');
}

function hostToHttpsOrigin(hostOrUrl: string): string | null {
  const cleaned = hostOrUrl.trim().replace(/\/$/, '');
  if (!cleaned) return null;
  try {
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      const u = new URL(cleaned);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
      return `${u.protocol}//${u.host}`;
    }
    return `https://${cleaned}`;
  } catch {
    return null;
  }
}

export function buildStaffWriteOrigins(
  panelOrigin: string,
  env: NodeJS.ProcessEnv = process.env
): string[] {
  const set = new Set<string>();
  set.add(normalizeOrigin(panelOrigin));
  for (const key of ['VERCEL_URL', 'VERCEL_BRANCH_URL'] as const) {
    const raw = env[key];
    if (!raw) continue;
    const origin = hostToHttpsOrigin(raw);
    if (origin) set.add(origin);
  }
  // Local Vite PWA (panel/web) proxies /api → :8787; browser Origin is :5173.
  if (env.NODE_ENV !== 'production') {
    set.add('http://localhost:5173');
    set.add('http://127.0.0.1:5173');
  }
  return [...set];
}

export function loadEnv(env: NodeJS.ProcessEnv = process.env): PanelEnv {
  const sessionSecret = env.SESSION_SECRET || '';
  if (sessionSecret.length < 32 && env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be at least 32 characters in production');
  }

  const publicWebOrigins = (env.PUBLIC_WEB_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const panelOrigin = normalizeOrigin(env.PANEL_ORIGIN || 'http://localhost:8787');

  return {
    sessionSecret: sessionSecret || 'dev-only-session-secret-min-32-chars!!',
    cookieName: env.STAFF_COOKIE_NAME || 'vf_staff_session',
    sessionTtlHours: Number(env.STAFF_SESSION_TTL_HOURS || 12),
    panelOrigin,
    staffWriteOrigins: buildStaffWriteOrigins(panelOrigin, env),
    publicWebOrigins,
    isProd: env.NODE_ENV === 'production',
  };
}
