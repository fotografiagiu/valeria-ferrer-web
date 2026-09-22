import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  activatePromotion,
  deactivatePromotion,
  toEffectivePromotion,
  type StoredPromotion,
} from '../src/lib/webPromotion.js'
import { createApp } from '../src/app.js'
import { createTestDb, type AppDb } from '../src/db/client.js'
import { staffUsers } from '../src/db/schema.js'
import { loadEnv } from '../src/lib/env.js'
import { hashPassword } from '../src/lib/password.js'
import { writeSnapshot, readSnapshot } from '../src/lib/catalogSnapshot.js'
import { seedOverridesFromEffectiveOrder } from '../src/lib/overridesService.js'

function stored(partial: Partial<StoredPromotion> = {}): StoredPromotion {
  return {
    activePromotion: 'none',
    startsAt: null,
    endsAt: null,
    durationHours: null,
    promoId: null,
    updatedAt: new Date().toISOString(),
    updatedBy: null,
    ...partial,
  }
}

describe('toEffectivePromotion', () => {
  it('none → inactive', () => {
    const eff = toEffectivePromotion(stored({ activePromotion: 'none' }))
    expect(eff.active).toBe(false)
    expect(eff.activePromotion).toBe('none')
  })

  it('copas within window → active', () => {
    const now = Date.parse('2026-09-23T01:00:00.000Z')
    const eff = toEffectivePromotion(
      stored({
        activePromotion: 'copas',
        startsAt: '2026-09-23T00:00:00.000Z',
        endsAt: '2026-09-23T03:00:00.000Z',
        durationHours: 3,
        promoId: 'copas-x',
      }),
      now
    )
    expect(eff.active).toBe(true)
    expect(eff.activePromotion).toBe('copas')
    expect(eff.promoId).toBe('copas-x')
  })

  it('expired → inactive even if row still says copas', () => {
    const now = Date.parse('2026-09-23T04:00:00.000Z')
    const eff = toEffectivePromotion(
      stored({
        activePromotion: 'copas',
        startsAt: '2026-09-23T00:00:00.000Z',
        endsAt: '2026-09-23T03:00:00.000Z',
      }),
      now
    )
    expect(eff.active).toBe(false)
    expect(eff.activePromotion).toBe('none')
  })
})

describe('promotion API', () => {
  let db: AppDb
  let close: () => Promise<void>
  let app: ReturnType<typeof createApp>
  let cookie = ''
  let staffId = ''

  async function json(res: Response) {
    return res.json() as Promise<any>
  }

  beforeAll(async () => {
    writeSnapshot()
    const test = await createTestDb()
    db = test.db
    close = test.close

    const passwordHash = await hashPassword('test-password-ok')
    const [user] = await db
      .insert(staffUsers)
      .values({
        username: 'promo-admin',
        passwordHash,
        displayName: 'Pedro',
      })
      .returning()
    staffId = user.id

    await seedOverridesFromEffectiveOrder({
      db,
      snapshotModels: readSnapshot().models,
    })

    app = createApp({
      db,
      env: loadEnv({
        NODE_ENV: 'test',
        SESSION_SECRET: 'test-session-secret-at-least-32-chars',
        PANEL_ORIGIN: 'http://localhost:8787',
        PUBLIC_WEB_ORIGINS: 'http://localhost:5173',
        STAFF_COOKIE_NAME: 'vf_staff_session',
        STAFF_SESSION_TTL_HOURS: '12',
      }),
      skipSnapshotFreshness: true,
      skipLiveCatalog: true,
    })

    const login = await app.request('http://localhost/api/staff/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'promo-admin', password: 'test-password-ok' }),
    })
    cookie = (login.headers.get('set-cookie') || '').split(';')[0]
  }, 30_000)

  afterAll(async () => {
    await close()
  })

  it('public GET starts as none', async () => {
    const res = await app.request('http://localhost/api/public/promotion')
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toContain('no-store')
    const body = await json(res)
    expect(body.active).toBe(false)
    expect(body.activePromotion).toBe('none')
  })

  it('rejects unauthenticated write', async () => {
    const res = await app.request('http://localhost/api/staff/promotion', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'activate', promotion: 'copas', durationHours: 3 }),
    })
    expect(res.status).toBe(401)
  })

  it('activates copas', async () => {
    const res = await app.request('http://localhost/api/staff/promotion', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ action: 'activate', promotion: 'copas', durationHours: 3 }),
    })
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.effective.active).toBe(true)
    expect(body.effective.activePromotion).toBe('copas')
    expect(body.effective.durationHours).toBe(3)
    expect(body.history[0].summary).toContain('COPAS')
  })

  it('public GET returns only copas while live', async () => {
    const res = await app.request('http://localhost/api/public/promotion')
    const body = await json(res)
    expect(body.active).toBe(true)
    expect(body.activePromotion).toBe('copas')
  })

  it('replaces copas with duples in one write', async () => {
    const res = await app.request('http://localhost/api/staff/promotion', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ action: 'activate', promotion: 'duples', durationHours: 1 }),
    })
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.effective.activePromotion).toBe('duples')
    expect(body.effective.durationHours).toBe(1)
    expect(body.history[0].action).toBe('promotion.replace')

    const pub = await json(await app.request('http://localhost/api/public/promotion'))
    expect(pub.activePromotion).toBe('duples')
  })

  it('manual deactivate clears public state', async () => {
    const res = await app.request('http://localhost/api/staff/promotion', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ action: 'deactivate' }),
    })
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.effective.active).toBe(false)
    expect(body.effective.activePromotion).toBe('none')

    const pub = await json(await app.request('http://localhost/api/public/promotion'))
    expect(pub.active).toBe(false)
  })

  it('service helpers activate/deactivate with audit', async () => {
    const on = await activatePromotion({
      db,
      promotion: 'copas',
      durationHours: 4,
      staffUserId: staffId,
      now: new Date('2026-09-23T10:00:00.000Z'),
    })
    expect(on.effective.activePromotion).toBe('copas')
    expect(on.effective.endsAt).toBe('2026-09-23T14:00:00.000Z')

    const off = await deactivatePromotion({
      db,
      staffUserId: staffId,
      now: new Date('2026-09-23T11:00:00.000Z'),
    })
    expect(off.effective.active).toBe(false)
  })
})
