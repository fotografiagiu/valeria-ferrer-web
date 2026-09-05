import { eq, sql } from 'drizzle-orm';
import type { AppDb } from '../db/client.js';
import { rateLimitBuckets } from '../db/schema.js';

/**
 * Fixed-window rate limit backed by Postgres (no extra vendor).
 * Returns true if the request is allowed.
 */
export async function hitRateLimit(
  db: AppDb,
  bucketKey: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const existing = await db
    .select()
    .from(rateLimitBuckets)
    .where(eq(rateLimitBuckets.bucketKey, bucketKey))
    .limit(1);

  const row = existing[0];
  if (!row) {
    await db.insert(rateLimitBuckets).values({
      bucketKey,
      hitCount: 1,
      windowStart: now,
    });
    return { allowed: true, remaining: limit - 1 };
  }

  const elapsed = now.getTime() - new Date(row.windowStart).getTime();
  if (elapsed > windowMs) {
    await db
      .update(rateLimitBuckets)
      .set({ hitCount: 1, windowStart: now })
      .where(eq(rateLimitBuckets.bucketKey, bucketKey));
    return { allowed: true, remaining: limit - 1 };
  }

  if (row.hitCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await db
    .update(rateLimitBuckets)
    .set({ hitCount: sql`${rateLimitBuckets.hitCount} + 1` })
    .where(eq(rateLimitBuckets.bucketKey, bucketKey));

  return { allowed: true, remaining: limit - row.hitCount - 1 };
}
