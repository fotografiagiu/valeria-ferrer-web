#!/usr/bin/env tsx
/**
 * Confirm required panel env vars exist (and meet basic shape).
 * Never prints secret values — only names + ok/missing/invalid.
 */
import { loadLocalEnv } from './lib/loadLocalEnv.js';

loadLocalEnv();

type Check = { name: string; ok: boolean; detail: string };

function present(name: string): boolean {
  const v = process.env[name];
  return typeof v === 'string' && v.trim().length > 0;
}

function originOk(value: string): boolean {
  try {
    const u = new URL(value);
    return (u.protocol === 'http:' || u.protocol === 'https:') && !value.endsWith('/');
  } catch {
    return false;
  }
}

const checks: Check[] = [];

function requirePresent(name: string): void {
  if (!present(name)) {
    checks.push({ name, ok: false, detail: 'missing' });
    return;
  }
  checks.push({ name, ok: true, detail: 'set' });
}

requirePresent('DATABASE_URL');

{
  const unpooledNames = ['DATABASE_URL_UNPOOLED', 'DATABASE_POSTGRES_URL_NON_POOLING'] as const;
  const found = unpooledNames.find((n) => present(n));
  if (!found) {
    checks.push({
      name: 'DATABASE_*_UNPOOLED',
      ok: false,
      detail: 'missing(need DATABASE_URL_UNPOOLED or DATABASE_POSTGRES_URL_NON_POOLING)',
    });
  } else {
    checks.push({ name: found, ok: true, detail: 'set(unpooled)' });
  }
}

if (!present('SESSION_SECRET')) {
  checks.push({ name: 'SESSION_SECRET', ok: false, detail: 'missing' });
} else if ((process.env.SESSION_SECRET || '').trim() === '[SENSITIVE]') {
  // `vercel env pull` redacts Secret values; presence confirmed, length not locally verifiable.
  checks.push({ name: 'SESSION_SECRET', ok: true, detail: 'set(remote_secret_redacted)' });
} else if ((process.env.SESSION_SECRET || '').length < 32) {
  checks.push({ name: 'SESSION_SECRET', ok: false, detail: 'too_short(<32)' });
} else {
  checks.push({ name: 'SESSION_SECRET', ok: true, detail: 'set' });
}

if (!present('PANEL_ORIGIN')) {
  checks.push({ name: 'PANEL_ORIGIN', ok: false, detail: 'missing' });
} else if (!originOk(process.env.PANEL_ORIGIN!.trim())) {
  checks.push({
    name: 'PANEL_ORIGIN',
    ok: false,
    detail: 'invalid_origin(need http(s) URL, no trailing slash)',
  });
} else {
  checks.push({ name: 'PANEL_ORIGIN', ok: true, detail: 'set' });
}

if (!present('PUBLIC_WEB_ORIGINS')) {
  checks.push({ name: 'PUBLIC_WEB_ORIGINS', ok: false, detail: 'missing' });
} else {
  const parts = process.env.PUBLIC_WEB_ORIGINS!.split(',').map((s) => s.trim()).filter(Boolean);
  const bad = parts.some((p) => !originOk(p));
  checks.push({
    name: 'PUBLIC_WEB_ORIGINS',
    ok: !bad && parts.length > 0,
    detail: bad ? 'invalid_origin_in_list' : `set(${parts.length}_origins)`,
  });
}

// Optional with runtime defaults — report but do not fail if absent
if (!present('STAFF_COOKIE_NAME')) {
  checks.push({ name: 'STAFF_COOKIE_NAME', ok: true, detail: 'unset(default=vf_staff_session)' });
} else {
  checks.push({ name: 'STAFF_COOKIE_NAME', ok: true, detail: 'set' });
}

if (!present('STAFF_SESSION_TTL_HOURS')) {
  checks.push({ name: 'STAFF_SESSION_TTL_HOURS', ok: true, detail: 'unset(default=12)' });
} else {
  const n = Number(process.env.STAFF_SESSION_TTL_HOURS);
  checks.push({
    name: 'STAFF_SESSION_TTL_HOURS',
    ok: Number.isFinite(n) && n > 0,
    detail: Number.isFinite(n) && n > 0 ? 'set' : 'invalid_number',
  });
}

let failed = false;
for (const c of checks) {
  const mark = c.ok ? 'OK' : 'FAIL';
  if (!c.ok) failed = true;
  console.log(`${mark}  ${c.name}  (${c.detail})`);
}

if (failed) {
  console.error('\nenv:check failed — set missing/invalid vars in Vercel or panel/.env.local (gitignored).');
  process.exit(1);
}

console.log('\nenv:check passed (values not shown).');
process.exit(0);
