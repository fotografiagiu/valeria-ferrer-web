import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const files = [
  'black-friday-hero.1.b64',
  'black-friday-hero.2.b64',
  'black-friday-hero.3a.b64',
  'black-friday-hero.3b.b64',
  'black-friday-hero.3c.b64',
];
const lengths = [3500, 3500, 800, 800, 760];
const hashes = [
  '1e0983a93d366080eaef381ec3cc87f78ce64d70f7d96725e627a93e5d5d2b31',
  '5336dfcd7f291ba6ce85b339e2c1b8df4309b9d58c0fbefc272e9e0161f70cc7',
  'ba677d3d348013760e51d4461fa31234f4b6da14a894599af5f4ba6ce90e4041',
  'ad5d73fed7b7948adb703f0c46b2b640e0c7250beab4e197effa6f67f230110f',
  '5a4d4a580960be244e7fbf014b5aa01f49791d62e4098ecd7f96e47ef766c7d4',
];
const segments = files.map((name, index) => {
  const value = readFileSync(join(root, 'scripts', 'assets', name), 'utf8').trim();
  if (value.length !== lengths[index]) throw new Error(`Invalid segment length: ${name}`);
  const sha = createHash('sha256').update(value).digest('hex');
  if (sha !== hashes[index]) throw new Error(`Campaign asset segment corrupted: ${name}`);
  return value;
});
const bytes = Buffer.from(segments.join(''), 'base64');
const sha = createHash('sha256').update(bytes).digest('hex');
if (bytes.length !== 7020 || sha !== 'c289fc6ace08246666ad1d80e9a36fdd77ed5e57b6b85442c0b11c066f669727') {
  throw new Error('Black Friday hero asset hash mismatch');
}
const destination = join(root, 'public', 'images');
mkdirSync(destination, { recursive: true });
writeFileSync(join(destination, 'black-friday-hero-trial.avif'), bytes);
console.log('Black Friday hero AVIF verified and generated (1200×357, 7 KB)');
