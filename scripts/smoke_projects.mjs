/**
 * Smoke: Projekt create-path — API + video type (+ rules soft-check, PMIR)
 * Usage: npm run smoke:projects
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function warn(condition, message) {
  if (!condition) console.warn(`[smoke:projects] WARN (PMIR): ${message}`);
}

function readCanonical(relativePath) {
  const full = resolve(root, relativePath);
  assert(existsSync(full), `Saknar fil: ${relativePath}`);
  return readFileSync(full, 'utf8');
}

console.log('[smoke:projects] Rules (soft — PMIR-gate)…');
const rules = readCanonical('firestore.rules');
warn(rules.includes('isValidProjectCreate'), 'firestore.rules saknar isValidProjectCreate');
warn(rules.includes('isValidProjectBlockCreate'), 'firestore.rules saknar isValidProjectBlockCreate');
warn(rules.includes("'video'"), 'project_blocks saknar video i rules');
warn(rules.includes('primaryBlockType'), 'projects saknar primaryBlockType-validering');

const storage = readCanonical('storage.rules');
warn(storage.includes('project_media/{userId}/{projectId}/{allPaths=**}'), 'storage project_media saknas');
warn(storage.includes('50 * 1024 * 1024'), 'project_media size gate saknas');
warn(storage.includes('video/(mp4|quicktime|webm)'), 'project_media video MIME saknas');

console.log('[smoke:projects] API + auth gate…');
const projectsApi = readCanonical('src/modules/features/admin/projects/api/projectsApi.ts');
assert(projectsApi.includes('assertProjectWriteAuth'), 'createProject saknar auth gate');
assert(projectsApi.includes('status'), 'createProject saknar status-stöd');

const blocksApi = readCanonical('src/modules/features/admin/projects/api/projectBlocksApi.ts');
assert(blocksApi.includes('isProjectBlockType'), 'createProjectBlock saknar typ-validering');
assert(blocksApi.includes('assertProjectWriteAuth'), 'createProjectBlock saknar auth gate');

console.log('[smoke:projects] Utils + UI…');
const types = readCanonical('src/modules/features/admin/projects/utils/projectBlockTypes.ts');
assert(types.includes("'video'"), 'PROJECT_BLOCK_TYPES saknar video');

const errUtil = readCanonical('src/modules/features/admin/projects/utils/resolveProjectSaveError.ts');
assert(errUtil.includes('resolveProjectSaveError'), 'resolveProjectSaveError saknas');
assert(errUtil.includes('permission-denied'), 'felmapper saknar permission-denied');

const nyPage = readCanonical('src/modules/features/admin/projects/components/ProjektNyPage.tsx');
assert(nyPage.includes('resolveProjectSaveError'), 'ProjektNyPage saknar felmapper');

const quickList = readCanonical('src/modules/features/admin/planning/components/PlaneringQuickListPanel.tsx');
assert(quickList.includes('resolveProjectSaveError'), 'PlaneringQuickListPanel saknar felmapper');

const triage = readCanonical('src/modules/dashboard/components/IntakeTriageModal.tsx');
assert(triage.includes('createProject(userId'), 'IntakeTriageModal ska använda createProject API');
assert(!triage.includes("addDoc(collection(db, 'projects')"), 'IntakeTriageModal ska inte raw-addDoc projects');

console.log('[smoke:projects] PASS — API/utils/UI (rules soft-check; PMIR för isValidProject*).');
