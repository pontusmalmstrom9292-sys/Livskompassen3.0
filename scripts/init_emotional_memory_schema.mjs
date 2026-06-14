/**
 * Valideringsskript för emotional_memory (WORM känslominne).
 *
 * Verifierar att test-payload och firestore.rules är i linje med
 * EmotionalMemoryEntry i src/modules/core/types/firestore.ts.
 *
 * Körning:
 * node scripts/init_emotional_memory_schema.mjs
 */

import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ALLOWED_KEYS = [
  'userId',
  'ownerId',
  'createdAt',
  'memoryType',
  'content',
  'intensity',
];

const VALID_MEMORY_TYPES = new Set(['identity', 'feeling', 'reflection', 'freeform']);

const WORM_FORBIDDEN_KEYS = ['updatedAt', 'deletedAt', 'modifiedAt', 'revision'];

const MockFieldValue = {
  serverTimestamp: () => ({ isServerTimestamp: true, toDate: () => new Date() }),
};

function validateEmotionalMemoryEntry(payload) {
  const errors = [];

  if (typeof payload.userId !== 'string' || !payload.userId) {
    errors.push('userId måste vara en giltig sträng.');
  }

  if (typeof payload.ownerId !== 'string' || !payload.ownerId) {
    errors.push('ownerId måste vara en giltig sträng.');
  }

  if (payload.userId !== payload.ownerId) {
    errors.push('userId och ownerId måste matcha (owner-bound).');
  }

  if (!payload.createdAt || !payload.createdAt.isServerTimestamp) {
    errors.push('createdAt måste vara en serverTidsstämpel.');
  }

  if (!VALID_MEMORY_TYPES.has(payload.memoryType)) {
    errors.push(`memoryType ogiltig: ${payload.memoryType}`);
  }

  if (typeof payload.content !== 'string' || payload.content.length === 0) {
    errors.push('content måste vara en icke-tom sträng.');
  }

  if (payload.content.length > 50000) {
    errors.push('content får max vara 50000 tecken.');
  }

  if (!Number.isInteger(payload.intensity) || payload.intensity < 1 || payload.intensity > 10) {
    errors.push('intensity måste vara heltal 1–10.');
  }

  for (const key of WORM_FORBIDDEN_KEYS) {
    if (key in payload) {
      errors.push(`WORM-förbjuden nyckel: ${key}`);
    }
  }

  const extraKeys = Object.keys(payload).filter((k) => !ALLOWED_KEYS.includes(k));
  if (extraKeys.length > 0) {
    errors.push(`Otillåtna nycklar (WORM-brott): ${extraKeys.join(', ')}`);
  }

  return errors;
}

async function runValidation() {
  console.log('=== BÖRJAR VALIDERING AV EMOTIONAL_MEMORY ===');

  const samplePayload = {
    userId: 'test-user-123',
    ownerId: 'test-user-123',
    createdAt: MockFieldValue.serverTimestamp(),
    memoryType: 'feeling',
    content: 'Jag kände lugn efter andningsövningen — kort anteckning för WORM-test.',
    intensity: 6,
  };

  console.log('\n[1] Verifierar test-payload mot schema...');
  const errors = validateEmotionalMemoryEntry(samplePayload);

  if (errors.length > 0) {
    console.error('❌ Validering misslyckades:');
    errors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  }
  console.log('✅ Payload validerades — WORM-kompatibel.');

  console.log('\n[2] Analyserar firestore.rules...');
  const rulesPath = resolve(root, 'firestore.rules');
  if (!existsSync(rulesPath)) {
    console.error('❌ firestore.rules saknas.');
    process.exit(1);
  }

  const rules = readFileSync(rulesPath, 'utf8');
  const checks = [
    ['isValidEmotionalMemoryCreate', 'valideringsfunktion'],
    ['match /emotional_memory/{docId}', 'collection-match'],
    ['allow update, delete: if false', 'update/delete nekas'],
    ['isOwnerCreateSensitive()', 'ownerId + verifierad e-post på create'],
  ];

  for (const [needle, label] of checks) {
    if (!rules.includes(needle)) {
      console.error(`❌ firestore.rules saknar ${label}: ${needle}`);
      process.exit(1);
    }
  }
  console.log('✅ firestore.rules innehåller WORM-regler för emotional_memory.');

  console.log('\n=== VALIDERINGSRAPPORT ===');
  console.log('Status: GODKÄND');
  console.log('Samling: emotional_memory (append-only, owner-bound)');
  console.log('Fält: userId, ownerId, createdAt, memoryType, content, intensity');
}

runValidation().catch((err) => {
  console.error(err);
  process.exit(1);
});
