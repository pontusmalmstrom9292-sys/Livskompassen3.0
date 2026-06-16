#!/usr/bin/env node
/**
 * Samlar ALLT för Prompt G i få filer + 2 uppladdningsomgångar.
 * Kör: npm run chatbot:sync:backend-review
 */
import { copyFileSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const destDir = join(root, 'docs/external-ai/bifoga/06-backend-masterplan-review');
const omgang1 = join(destDir, 'omgang-1-register');
const omgang2 = join(destDir, 'omgang-2-kod');

const REGISTER_SOURCES = [
  { path: 'docs/external-ai/LIFE-OS-BUILD-STATE.md', title: 'LIFE-OS-BUILD-STATE' },
  { path: 'docs/MODUL-FUNKTIONS-REGISTER.md', title: 'MODUL-FUNKTIONS-REGISTER' },
  { path: 'docs/INNEHALL-REGISTER.md', title: 'INNEHALL-REGISTER' },
  { path: 'docs/external-ai/imports/gap-matrix-2026-06-16.md', title: 'gap-matrix-2026-06-16' },
  { path: '.context/security.md', title: 'security (Layered Defense)' },
];

const EVAL_SOURCES = [
  { path: 'docs/evaluations/2026-06-16-backend-masterplan-exekvering.md', title: 'backend-masterplan-exekvering' },
  { path: 'docs/evaluations/2026-06-16-backend-pmir-docs.md', title: 'backend-pmir-docs' },
  { path: 'docs/evaluations/2026-06-16-backend-security-pelare1.md', title: 'backend-security-pelare1' },
  { path: 'docs/evaluations/SENASTE-SAMMANFATTNING.md', title: 'SENASTE-SAMMANFATTNING' },
];

function readRoot(relPath) {
  return readFileSync(join(root, relPath), 'utf8');
}

function mergeMarkdown(sources) {
  return sources
    .map(({ path, title }) => {
      const body = readRoot(path).trimEnd();
      return `---\n\n# ${title}\n\n_Källa: \`${path}\`_\n\n${body}`;
    })
    .join('\n\n');
}

function main() {
  console.log('[sync:backend-review] Genererar security-pack…');
  const pack = spawnSync('npm', ['run', 'chatbot:pack:security'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
  if (pack.status !== 0) {
    console.error('[sync:backend-review] chatbot:pack:security misslyckades');
    process.exit(1);
  }

  rmSync(destDir, { recursive: true, force: true });
  mkdirSync(omgang1, { recursive: true });
  mkdirSync(omgang2, { recursive: true });

  copyFileSync(
    join(root, 'docs/external-ai/bifoga/03-prompter/BACKEND-MASTERPLAN-REVIEW-G.md'),
    join(omgang1, '01-PROMPT-G.md'),
  );

  const registerPaket = `# Register-paket (Prompt G)\n\n${mergeMarkdown(REGISTER_SOURCES)}`;
  writeFileSync(join(omgang1, '02-REGISTER-PAKET.md'), registerPaket);

  const evalPaket = `# Evalueringar (Prompt G)\n\n${mergeMarkdown(EVAL_SOURCES)}`;
  writeFileSync(join(omgang2, '03-EVALUERINGAR.md'), evalPaket);

  copyFileSync(
    join(root, 'exports/chatbot-handoff/chatbot-pack-security.md'),
    join(omgang2, '04-BACKEND-KOD.md'),
  );

  const stamp = new Date().toISOString();
  writeFileSync(
    join(destDir, 'SYNC-STAMP.txt'),
    `Senast synkad: ${stamp}\nKommando: npm run chatbot:sync:backend-review\n`,
  );

  writeFileSync(
    join(destDir, '00-LAS-MIG-FORST.md'),
    `# Backend masterplan — ladda upp i 2 omgångar

**Datum:** 2026-06-16 · **Syfte:** Prompt G — granska FREEZE

Gemini/ChatBox tar ofta max ~10 filer. Här är **4 filer** i **2 mappar**.

## Omgång 1 — register (3 filer)

Bifoga hela mappen \`omgang-1-register/\`:

| Fil | Innehåll |
|-----|----------|
| \`01-PROMPT-G.md\` | Prompten — spara till omgång 2 |
| \`02-REGISTER-PAKET.md\` | LIFE-OS, moduler, innehåll, gap-matrix, security |

Skriv i chatten: *"Jag laddar upp omgång 2 strax — bekräfta att du läst registren."*

## Omgång 2 — kod + bevis (2 filer)

Bifoga hela mappen \`omgang-2-kod/\`:

| Fil | Innehåll |
|-----|----------|
| \`03-EVALUERINGAR.md\` | Exekvering, PMIR, säkerhet, senaste sammanfattning |
| \`04-BACKEND-KOD.md\` | Backend/säkerhetskod (repomix) |

Klistra in texten från \`omgang-1-register/01-PROMPT-G.md\` (under kodblocket).

Spara svaret → \`docs/external-ai/imports/BACKEND-MASTERPLAN-REVIEW-SVAR.md\`

## Uppdatera

\`\`\`bash
npm run chatbot:sync:backend-review
\`\`\`

**Finder (Cmd+Shift+G):**

\`\`\`
${destDir}
\`\`\`
`,
  );

  const files = [
    join(destDir, '00-LAS-MIG-FORST.md'),
    join(omgang1, '01-PROMPT-G.md'),
    join(omgang1, '02-REGISTER-PAKET.md'),
    join(omgang2, '03-EVALUERINGAR.md'),
    join(omgang2, '04-BACKEND-KOD.md'),
  ];

  console.log(`\n[sync:backend-review] Klart — ${files.length} filer i:\n  ${destDir}\n`);
  for (const file of files) {
    console.log(`  ${file.replace(destDir + '/', '')} (${statSync(file).size} bytes)`);
  }
}

main();
