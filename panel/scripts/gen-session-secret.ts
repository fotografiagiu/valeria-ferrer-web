#!/usr/bin/env tsx
/**
 * Print a fresh SESSION_SECRET to stdout for pasting into Vercel / .env.local.
 * Does not write files. Does not commit anything.
 */
import { randomBytes } from 'node:crypto';

const secret = randomBytes(48).toString('base64url');
console.log(secret);
console.error('Copy into Vercel env SESSION_SECRET (Production + Preview). Do not commit.');
