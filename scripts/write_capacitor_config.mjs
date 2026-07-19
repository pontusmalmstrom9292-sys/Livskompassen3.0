/**
 * Writes capacitor.config.json from env (CAPACITOR_SERVER_URL / CAPACITOR_DEV_SERVER_URL).
 * Capacitor CLI cannot load .ts under TypeScript 7, and ESM .js is unreliable via require().
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const prodServerUrl = process.env.CAPACITOR_SERVER_URL?.trim();
const devServerUrl = process.env.CAPACITOR_DEV_SERVER_URL?.trim();

const config = {
  appId: 'com.livskompassen.app',
  appName: 'Livskompassen',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: 'https',
    ...(prodServerUrl ? { url: prodServerUrl, cleartext: false } : {}),
    ...(devServerUrl ? { url: devServerUrl, cleartext: true } : {}),
  },
  plugins: {
    FirebaseAuthentication: {
      providers: ['google.com'],
    },
  },
};

const out = resolve(root, 'capacitor.config.json');
writeFileSync(out, JSON.stringify(config, null, 2) + '\n', 'utf8');
console.log(
  `[capacitor-config] wrote ${out}` +
    (prodServerUrl ? ` (prod url)` : '') +
    (devServerUrl ? ` (dev url)` : '') +
    (!prodServerUrl && !devServerUrl ? ' (bundled dist)' : ''),
);
