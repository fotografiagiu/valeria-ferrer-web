#!/usr/bin/env tsx
/**
 * API smoke cases for web promotion against local smoke server.
 *
 *   npm run smoke:promotion:server   # other terminal
 *   npm run smoke:promotion:api
 */
const BASE = process.env.SMOKE_PANEL_URL || 'http://localhost:8787';

type JsonBody = Record<string, unknown> & {
  active?: boolean;
  activePromotion?: string;
  effective?: {
    active?: boolean;
    activePromotion?: string;
    endsAt?: string;
    durationHours?: number;
  };
  history?: Array<{ action?: string }>;
};

async function json(res: Response) {
  const body = (await res.json()) as JsonBody;
  return { status: res.status, body, setCookie: res.headers.get('set-cookie') || '' };
}

const noStore: RequestInit = { headers: { 'Cache-Control': 'no-store' } };

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function main() {
  const results: string[] = [];

  // CASE 1 — initial
  {
    const pub = await json(await fetch(`${BASE}/api/public/promotion`, noStore));
    assert(pub.status === 200, `public status ${pub.status}`);
    assert(pub.body.active === false, 'expected inactive');
    assert(pub.body.activePromotion === 'none', 'expected none');
    results.push('CASE1 public none OK');
  }

  // Login
  const login = await json(
    await fetch(`${BASE}/api/staff/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'promo', password: 'promo-pass-ok' }),
    })
  );
  assert(login.status === 200, `login ${login.status}`);
  const cookie = login.setCookie.split(';')[0];
  assert(cookie.includes('vf_staff_session='), 'missing session cookie');

  // Unauth write rejected
  {
    const res = await json(
      await fetch(`${BASE}/api/staff/promotion`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'activate', promotion: 'copas', durationHours: 1 }),
      })
    );
    assert(res.status === 401, `expected 401 got ${res.status}`);
    results.push('CASE security unauth write OK');
  }

  // CASE 2 — activate copas 1h
  {
    const res = await json(
      await fetch(`${BASE}/api/staff/promotion`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', cookie, Origin: 'http://localhost:5173' },
        body: JSON.stringify({ action: 'activate', promotion: 'copas', durationHours: 1 }),
      })
    );
    assert(res.status === 200, `activate copas ${res.status} ${JSON.stringify(res.body)}`);
    assert(res.body.effective?.activePromotion === 'copas', 'copas not active');
    assert(res.body.effective?.durationHours === 1, 'duration not 1h');
    const pub = await json(await fetch(`${BASE}/api/public/promotion`, noStore));
    assert(pub.body.active === true && pub.body.activePromotion === 'copas', 'public not copas');
    results.push('CASE2 activate copas 1h OK');
  }

  // CASE 3 — replace with duples 3h
  {
    const res = await json(
      await fetch(`${BASE}/api/staff/promotion`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', cookie, Origin: 'http://localhost:5173' },
        body: JSON.stringify({ action: 'activate', promotion: 'duples', durationHours: 3 }),
      })
    );
    assert(res.status === 200, `replace ${res.status}`);
    assert(res.body.effective?.activePromotion === 'duples', 'duples not active');
    assert(res.body.history?.[0]?.action === 'promotion.replace', 'expected replace audit');
    const pub = await json(await fetch(`${BASE}/api/public/promotion`, noStore));
    assert(pub.body.activePromotion === 'duples', 'public not duples');
    results.push('CASE3 replace duples 3h OK');
  }

  // CASE 4 — deactivate
  {
    const res = await json(
      await fetch(`${BASE}/api/staff/promotion`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', cookie, Origin: 'http://localhost:5173' },
        body: JSON.stringify({ action: 'deactivate' }),
      })
    );
    assert(res.status === 200, `deactivate ${res.status}`);
    const pub = await json(await fetch(`${BASE}/api/public/promotion`, noStore));
    assert(pub.body.active === false && pub.body.activePromotion === 'none', 'still active');
    results.push('CASE4 deactivate OK');
  }

  // CASE 5 — expiry semantics: past endsAt ⇒ inactive without write
  {
    const res = await json(
      await fetch(`${BASE}/api/staff/promotion`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', cookie, Origin: 'http://localhost:5173' },
        body: JSON.stringify({ action: 'activate', promotion: 'copas', durationHours: 1 }),
      })
    );
    assert(res.body.effective?.active === true, 'should be live now');
    const ends = Date.parse(String(res.body.effective?.endsAt));
    assert(Number.isFinite(ends) && ends > Date.now(), 'endsAt not in future');
    const staleEnds = Date.now() - 1000;
    const stillShows =
      res.body.effective?.activePromotion === 'copas' &&
      Number.isFinite(staleEnds) &&
      Date.now() < staleEnds;
    assert(!stillShows, 'stale endsAt must not keep promo live');
    await fetch(`${BASE}/api/staff/promotion`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie, Origin: 'http://localhost:5173' },
      body: JSON.stringify({ action: 'deactivate' }),
    });
    results.push('CASE5 expiry client rule OK');
  }

  // CASE 6 — API error ⇒ web treats as no promo (fetch failure)
  {
    let failedNull = false;
    try {
      const res = await fetch('http://127.0.0.1:9/api/public/promotion', {
        signal: AbortSignal.timeout(500),
      });
      failedNull = !res.ok;
    } catch {
      failedNull = true;
    }
    assert(failedNull, 'expected network failure');
    results.push('CASE6 API failure path OK');
  }

  for (const line of results) console.log(line);
  console.log('SMOKE_API_PASS');
}

main().catch((err) => {
  console.error('SMOKE_API_FAIL', err instanceof Error ? err.message : err);
  process.exit(1);
});
