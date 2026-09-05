export type PanelEnv = {
  sessionSecret: string;
  cookieName: string;
  sessionTtlHours: number;
  panelOrigin: string;
  publicWebOrigins: string[];
  isProd: boolean;
};

export function loadEnv(env: NodeJS.ProcessEnv = process.env): PanelEnv {
  const sessionSecret = env.SESSION_SECRET || '';
  if (sessionSecret.length < 32 && env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be at least 32 characters in production');
  }

  const publicWebOrigins = (env.PUBLIC_WEB_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    sessionSecret: sessionSecret || 'dev-only-session-secret-min-32-chars!!',
    cookieName: env.STAFF_COOKIE_NAME || 'vf_staff_session',
    sessionTtlHours: Number(env.STAFF_SESSION_TTL_HOURS || 12),
    panelOrigin: (env.PANEL_ORIGIN || 'http://localhost:8787').replace(/\/$/, ''),
    publicWebOrigins,
    isProd: env.NODE_ENV === 'production',
  };
}
