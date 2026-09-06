import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PANEL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Load env files into process.env if present.
 * Does not override already-set env vars. Never logs values.
 *
 * Order:
 * 1. PANEL_ENV_FILE (absolute path; for ephemeral Vercel pulls outside the repo)
 * 2. panel/.env
 * 3. panel/.env.local
 */
export function loadLocalEnv(): void {
  const files: string[] = [];
  if (process.env.PANEL_ENV_FILE) {
    files.push(process.env.PANEL_ENV_FILE);
  }
  files.push(path.join(PANEL_ROOT, '.env'), path.join(PANEL_ROOT, '.env.local'));

  for (const file of files) {
    if (!existsSync(file)) continue;
    const text = readFileSync(file, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

export { PANEL_ROOT };
