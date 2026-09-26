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

/** Full photo order for a ficha: index 0 = portada, rest = gallery. */
export const galleryBodySchema = z
  .object({
    slug: z.string().min(1),
    orderedImagePaths: z.array(z.string().min(1)).min(1),
    version: z.number().int().positive(),
  })
  .strict();

export const removeModelBodySchema = z
  .object({
    slug: z.string().min(1),
    version: z.number().int().positive(),
  })
  .strict();

export const loginBodySchema = z
  .object({
    username: z
      .string()
      .max(64)
      .transform((value) => value.trim())
      .refine((value) => value.length > 0),
    password: z.string().min(1).max(200),
  })
  .strict();

export const promotionBodySchema = z.discriminatedUnion('action', [
  z
    .object({
      action: z.literal('activate'),
      promotion: z.enum(['copas', 'duples']),
      durationHours: z.union([z.literal(1), z.literal(3), z.literal(4)]),
    })
    .strict(),
  z
    .object({
      action: z.literal('deactivate'),
    })
    .strict(),
]);

export type OrderValidationOk = { ok: true; orderedSlugs: string[] };
export type OrderValidationErr = { ok: false; status: 400; error: string };
export type CoverValidationOk = { ok: true; slug: string; coverImagePath: string };
export type CoverValidationErr = { ok: false; status: 400; error: string };
export type GalleryValidationOk = {
  ok: true;
  slug: string;
  coverImagePath: string;
  galleryImagePaths: string[];
};
export type GalleryValidationErr = { ok: false; status: 400; error: string };

/**
 * orderedSlugs must be exactly the orderable set passed in (active catalog minus
 * staff-hidden): same size, no dupes, no missing, no extras.
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
      error: `orderedSlugs length ${orderedSlugs.length} != orderable count ${activeSlugs.length}`,
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

/**
 * orderedImagePaths must be a permutation of the allowlist (same set, no dupes).
 * Index 0 becomes cover; the rest become galleryImagePaths.
 */
export function validateGalleryOrder(
  slug: string,
  orderedImagePaths: string[],
  snapshotModels: CatalogModelLite[]
): GalleryValidationOk | GalleryValidationErr {
  const model = snapshotModels.find((m) => m.slug === slug);
  if (!model) {
    return { ok: false, status: 400, error: `unknown slug: ${slug}` };
  }
  if (model.active === false) {
    return { ok: false, status: 400, error: `slug is inactive: ${slug}` };
  }

  const allowed = allowedCoverPaths(model);
  if (allowed.length === 0) {
    return { ok: false, status: 400, error: `no images in catalog for ${slug}` };
  }
  if (orderedImagePaths.length !== allowed.length) {
    return {
      ok: false,
      status: 400,
      error: `orderedImagePaths length ${orderedImagePaths.length} != allowlist ${allowed.length}`,
    };
  }

  const allowedSet = new Set(allowed);
  const seen = new Set<string>();
  for (const path of orderedImagePaths) {
    if (seen.has(path)) {
      return { ok: false, status: 400, error: `duplicate image path: ${path}` };
    }
    seen.add(path);
    if (!allowedSet.has(path)) {
      return {
        ok: false,
        status: 400,
        error: `image path not in allowlist for ${slug}: ${path}`,
      };
    }
  }

  for (const path of allowed) {
    if (!seen.has(path)) {
      return { ok: false, status: 400, error: `missing allowlist path: ${path}` };
    }
  }

  return {
    ok: true,
    slug,
    coverImagePath: orderedImagePaths[0],
    galleryImagePaths: orderedImagePaths.slice(1),
  };
}

