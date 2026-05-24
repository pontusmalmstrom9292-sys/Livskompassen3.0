import { execSync } from 'child_process';
function run(cmd) { return execSync(cmd, { encoding: 'utf8' }).trim(); }
function fail(msg) { console.error('[check:main-trunk] FAIL —', msg); process.exit(1); }
try {
  if (run('git rev-parse --abbrev-ref HEAD') !== 'main') fail('expected branch main');
  if (!run('git remote -v').includes('Livskompassen3.0')) fail('origin should be Livskompassen3.0');
  if (run('git status -sb').includes('behind')) {
    console.warn('[check:main-trunk] WARN — behind origin; git pull --ff-only origin main');
  }
  console.log('[check:main-trunk] branch=main, remote OK');
  execSync('npm run smoke:locked-ux', { stdio: 'inherit' });
  console.log('[check:main-trunk] PASS');
} catch (e) { fail(e.message || e); }
