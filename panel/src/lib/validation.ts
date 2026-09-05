import { z } from 'zod';
import {
  allowedCoverPaths,
  type CatalogModelLite,
} from './effectiveOrder.js';

export const orderBodySchema = z
  .object({
    version: z.number().int().positive(),
    orderedSlugs: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const coverBodySchema = z
  .object({
    slug: z.string().min(1),
    coverImagePath: z.string().min(1),
    version: z.number().int().positive(),
  })
  .strict();

export const loginBodySchema = z
  .object({
    username: z.string().min(1).max(64),
    password: z.string().min(1).max(200),
  })
  .strict();

export type OrderValidationOk = { ok: true; orderedSlugs: string[] };
export type OrderValidationErr = { ok: false; status: 400; error: string };
export type CoverValidationOk = { ok: true; slug: string; coverImagePath: string };
export type CoverValidationErr = { ok: false; status: 400; error: string };

/**
 * orderedSlugs must be exactly the active set: same size, no dupes, no missing, no extras, all active.
 */
export function validateOrderedSlugs(
  orderedSlugs: string[],
  activeModels: CatalogModelLite[]
): OrderValidationOk | OrderValidationErr {
  const activeSlugs = activeModels.map((m) => m.slug);
  const activeSet = new Set(activeSlugs);

  if (orderedSlugs.length !== activeSlugs.length) {
    return {
      ok: false,
      status: 400,
      error: `orderedSlugs length ${orderedSlugs.length} != active count ${activeSlugs.length}`,
    };
  }

  const seen = new Set<string>();
  for (const slug of orderedSlugs) {
    if (seen.has(slug)) {
      return { ok: false, status: 400, error: `duplicate slug: ${slug}` };
    }
    seen.add(slug);
    if (!activeSet.has(slug)) {
      return {
        ok: false,
        status: 400,
        error: `slug not active or unknown in catalog snapshot: ${slug}`,
      };
    }
  }

  for (const slug of activeSlugs) {
    if (!seen.has(slug)) {
      return { ok: false, status: 400, error: `missing active slug: ${slug}` };
    }
  }

  return { ok: true, orderedSlugs };
}

export function validateCoverChange(
  slug: string,
  coverImagePath: string,
  snapshotModels: CatalogModelLite[]
): CoverValidationOk | CoverValidationErr {
  const model = snapshotModels.find((m) => m.slug === slug);
  if (!model) {
    return { ok: false, status: 400, error: `unknown slug: ${slug}` };
  }
  if (model.active === false) {
    return { ok: false, status: 400, error: `slug is inactive: ${slug}` };
  }

  const allowed = new Set(allowedCoverPaths(model));
  if (!allowed.has(coverImagePath)) {
    return {
      ok: false,
      status: 400,
      error: `coverImagePath not in allowlist for ${slug}`,
    };
  }

  return { ok: true, slug, coverImagePath };
}
