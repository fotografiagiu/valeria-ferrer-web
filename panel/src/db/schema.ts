import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  bigint,
} from 'drizzle-orm/pg-core';

export const staffUsers = pgTable('staff_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const staffSessions = pgTable('staff_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  staffUserId: uuid('staff_user_id')
    .notNull()
    .references(() => staffUsers.id),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  ip: text('ip'),
  userAgent: text('user_agent'),
});

export const catalogMeta = pgTable('catalog_meta', {
  id: smallint('id').primaryKey().default(sql`1`),
  orderVersion: integer('order_version').notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const modelOverrides = pgTable('model_overrides', {
  slug: text('slug').primaryKey(),
  /** 1..N when active in catalog; NULL when inactive / parked historically */
  displayOrder: integer('display_order'),
  coverImagePath: text('cover_image_path').notNull(),
  coverVersion: integer('cover_version').notNull().default(1),
  /**
   * Ordered gallery paths after the cover (public ModelDetail gallery).
   * NULL = use catalog `images` order. Paths must stay in the allowlist.
   */
  galleryImagePaths: jsonb('gallery_image_paths').$type<string[] | null>(),
  /**
   * Staff removed this ficha from the panel (and public web via hiddenSlugs).
   * Keep the row; ensure must NOT auto-reactivate while this is true.
   */
  staffHidden: boolean('staff_hidden').notNull().default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid('updated_by').references(() => staffUsers.id),
});

export const auditLog = pgTable('audit_log', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  staffUserId: uuid('staff_user_id').references(() => staffUsers.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  action: text('action').notNull(),
  modelSlug: text('model_slug'),
  before: jsonb('before'),
  after: jsonb('after'),
  ip: text('ip'),
  userAgent: text('user_agent'),
});

export const rateLimitBuckets = pgTable('rate_limit_buckets', {
  bucketKey: text('bucket_key').primaryKey(),
  hitCount: integer('hit_count').notNull().default(0),
  windowStart: timestamp('window_start', { withTimezone: true }).notNull().defaultNow(),
});

/** Singleton row (id=1): remote control for public-site Copas / Duples promos. */
export const webPromotion = pgTable('web_promotion', {
  id: smallint('id').primaryKey().default(sql`1`),
  activePromotion: text('active_promotion').notNull().default('none'),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  durationHours: integer('duration_hours'),
  promoId: text('promo_id'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid('updated_by').references(() => staffUsers.id),
});
