/**
 * Kopierar ren lönelogik till functions/src/economy/vendor för Cloud Functions build.
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const vendor = resolve(root, 'functions/src/economy/vendor');
const rules = resolve(root, 'src/modules/ekonomi/rules');
const timeMathSrc = resolve(root, 'src/modules/core/utils/timeMath.ts');

mkdirSync(vendor, { recursive: true });
mkdirSync(resolve(vendor, '__fixtures__'), { recursive: true });

cpSync(timeMathSrc, resolve(vendor, 'timeMath.ts'));

const files = [
  'livsmedel2026.ts',
  'payTimeRules.ts',
  'payAbsenceRules.ts',
  'taxTable32.ts',
  'generatePayslipCore.ts',
];

for (const f of files) {
  let text = readFileSync(resolve(rules, f), 'utf8');
  text = text.replace(/from '\.\.\/\.\.\/core\/utils\/timeMath'/g, "from './timeMath'");
  text = text.replace(/from '\.\/payTimeRules'/g, "from './payTimeRules'");
  writeFileSync(resolve(vendor, f), text);
}

cpSync(
  resolve(rules, '__fixtures__/taxTable32-2026.json'),
  resolve(vendor, '__fixtures__/taxTable32-2026.json'),
);

console.log('[sync-payroll] OK → functions/src/economy/vendor');
