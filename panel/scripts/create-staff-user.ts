#!/usr/bin/env tsx
import { eq } from 'drizzle-orm';
import { getDb } from '../src/db/client.js';
import { staffUsers } from '../src/db/schema.js';
import { hashPassword } from '../src/lib/password.js';

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const username = arg('--username');
const password = arg('--password');
const displayName = arg('--name') || username;

if (!username || !password) {
  console.error('Usage: npm run staff:create -- --username NAME --password SECRET [--name "Display"]');
  process.exit(1);
}
if (password.length < 10) {
  console.error('Password must be at least 10 characters');
  process.exit(1);
}

const db = getDb();
const passwordHash = await hashPassword(password);

const existing = await db.select().from(staffUsers).where(eq(staffUsers.username, username)).limit(1);
if (existing[0]) {
  console.error(`User already exists: ${username}`);
  process.exit(1);
}

const inserted = await db.insert(staffUsers).values({
  username,
  passwordHash,
  displayName: displayName!,
}).returning();

console.log('Created staff user:', {
  id: inserted[0]?.id,
  username: inserted[0]?.username,
});
