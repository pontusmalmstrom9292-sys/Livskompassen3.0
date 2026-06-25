/**
 * Delade hjälpare för Gemini / NotebookLM / external-ai sync.
 */
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** @param {string} dir */
export function cleanDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

/**
 * @param {string} root
 * @param {string} srcRel
 * @param {string} destAbs
 * @param {{ extensions?: string[] }} [opts]
 */
export function mirrorDirectory(root, srcRel, destAbs, opts = {}) {
  const extensions = opts.extensions ?? ['.md', '.txt'];
  const srcAbs = join(root, srcRel);
  mkdirSync(destAbs, { recursive: true });

  const synced = [];
  const missing = [];

  try {
    statSync(srcAbs);
  } catch {
    missing.push(srcRel);
    return { synced, missing };
  }

  for (const name of readdirSync(srcAbs)) {
    if (!extensions.some((ext) => name.endsWith(ext))) continue;
    const from = join(srcAbs, name);
    const to = join(destAbs, name);
    try {
      if (!statSync(from).isFile()) continue;
      copyFileSync(from, to);
      synced.push({
        src: `${srcRel}/${name}`,
        dest: to.replace(root + '/', ''),
        bytes: statSync(to).size,
      });
    } catch {
      missing.push(`${srcRel}/${name}`);
    }
  }

  return { synced, missing };
}
