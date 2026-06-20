/**
 * YOLO-vakt smoke gate — obligatorisk pre-deploy batch.
 * Usage: npm run smoke:yolo
 *
 * Env:
 *   YOLO_SKIP_BUILD=1  — hoppa över npm run build (frontend + functions)
 */
import { spawnSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function run(label, command, args = [], opts = {}) {
  console.log(`\n[yolo-gate] ▶ ${label}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    ...opts,
  });
  if (result.status !== 0) {
    console.error(`[yolo-gate] FAIL — ${label}`);
    process.exit(result.status ?? 1);
  }
}

function runNpm(script) {
  run(script, 'npm', ['run', script]);
}

const skipBuild = process.env.YOLO_SKIP_BUILD === '1';

console.log('[yolo-gate] YOLO-vakt stående deploy-gate');
console.log('[yolo-gate] Kanon: docs/YOLO-VAKT-GATE.md');

if (!skipBuild) {
  run('frontend build', 'npm', ['run', 'build']);
  run('functions build', 'npm', ['run', 'build'], { cwd: resolve(root, 'functions') });
} else {
  console.log('[yolo-gate] YOLO_SKIP_BUILD=1 — hoppar över build');
}

runNpm('smoke:manifest');
runNpm('smoke:chrome-header');
runNpm('smoke:locked-ux');
runNpm('smoke:e2e-locked-ux');
runNpm('smoke:orkester');
runNpm('smoke:plausible-deniability');
runNpm('smoke:valv-security');
runNpm('smoke:innehall');
runNpm('smoke:prompts');

console.log('\n[yolo-gate] PASS — smoke:yolo (snabb tier).');
console.log('[yolo-gate] Deploy kräver: /yolo-vakt GO + npm run smoke:predeploy:build + Pontus OK vid PMIR.');
console.log('[yolo-gate] Se docs/CURSOR-YOLO-MODEL-GUIDE.md');
