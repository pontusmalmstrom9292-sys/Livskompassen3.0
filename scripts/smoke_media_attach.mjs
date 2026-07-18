/**
 * Static smoke: shared MediaAttachWithCaption + captioned attachment model.
 * Usage: npm run smoke:media-attach
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) {
    console.error(`[smoke:media-attach] FAIL — ${message}`);
    process.exit(1);
  }
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function main() {
  mustInclude(
    'src/modules/shared/media/MediaAttachWithCaption.tsx',
    '@locked MOD-SHARED-MEDIA',
    'Ladda upp en bild till',
    'caption',
    'CAPTIONED_ATTACHMENT_MAX',
    'enablePaste',
  );
  mustInclude(
    'src/modules/shared/media/captionedAttachment.ts',
    'CaptionedAttachment',
    'resolveCaptionedAttachments',
    'CAPTION_MAX_CHARS',
    'CAPTIONED_ATTACHMENT_MAX',
  );
  mustInclude(
    'src/modules/shared/media/index.ts',
    'MediaAttachWithCaption',
    'CaptionedAttachment',
  );
  mustInclude(
    'firestore.rules',
    'isValidCaptionedAttachmentMap',
    'attachments',
    'caption',
    'mediaCaption',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/types/journal.ts',
    'attachments?:',
  );
  mustInclude(
    '.cursor/agents/specialist-media-attach.md',
    'specialist-media-attach',
    'MediaAttachWithCaption',
  );

  const register = JSON.parse(read('.context/module-lock-register.json'));
  const mod = (register.modules || []).find((m) => m.id === 'MOD-SHARED-MEDIA');
  assert(mod, 'MOD-SHARED-MEDIA saknas i module-lock-register');
  assert(
    mod.globs?.some((g) => g.includes('shared/media')),
    'MOD-SHARED-MEDIA globs saknar shared/media',
  );


  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/JournalArchiveToolbar.tsx',
    'Tidslinje',
    'Bild + text',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/JournalMediaLightbox.tsx',
    '@locked MOD-SHARED-MEDIA',
    'Bildvisning',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/JournalDetailsPanel.tsx',
    'MediaAttachWithCaption',
    'Lägg till minne',
  );
  mustInclude(
    '.context/locked-ux-features.md',
    'bild + bildtext (max 2)',
    'MediaAttachWithCaption',
  );

  console.log('[smoke:media-attach] PASS');
}

main();
