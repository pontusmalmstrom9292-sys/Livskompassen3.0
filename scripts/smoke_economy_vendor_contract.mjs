/**
 * Contract smoke: UI economy rules vs functions/src/economy/vendor (no merge).
 * Usage: npm run smoke:economy-vendor
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const functionsRoot = resolve(root, 'functions');

const UI_RULES = 'src/modules/features/dailyLife/wellbeing/economy/rules';
const VENDOR = 'functions/src/economy/vendor';

/** Paired rule modules — logic must match after import normalization. */
const LOGIC_PAIRS = [
  'payTimeRules.ts',
  'payAbsenceRules.ts',
  'generatePayslipCore.ts',
];

/** Byte-identical copies. */
const IDENTICAL_PAIRS = ['taxTable32.ts', 'livsmedel2026.ts'];

const FIXTURE_PAIRS = ['__fixtures__/taxTable32-2026.json'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

/** Strip import/export-from blocks — jämför affärslogik, inte alias. */
function normalizeLogicSource(src) {
  return src
    .replace(/import\s+(?:type\s+)?(?:\{[\s\S]*?\}|[^\n;]+)\s+from\s+['"][^'"]+['"];?\n?/g, '')
    .replace(/export\s+\{[\s\S]*?\}\s+from\s+['"][^'"]+['"];?\n?/g, '')
    .replace(/^export\s+\{[^}]+\}\s*;?\s*$/gm, '')
    .replace(/\r/g, '')
    .trim();
}

function compareIdenticalPairs() {
  console.log('[smoke:economy-vendor] Identiska filpar…');
  for (const name of IDENTICAL_PAIRS) {
    const ui = read(`${UI_RULES}/${name}`);
    const vendor = read(`${VENDOR}/${name}`);
    assert(ui === vendor, `${name} skiljer sig — förväntat byte-identiskt`);
  }
  for (const rel of FIXTURE_PAIRS) {
    const ui = read(`${UI_RULES}/${rel}`);
    const vendor = read(`${VENDOR}/${rel}`);
    assert(ui === vendor, `${rel} skiljer sig — förväntat byte-identiskt`);
  }
}

function compareLogicPairs() {
  console.log('[smoke:economy-vendor] Normaliserad logik (import-skillnad OK)…');
  for (const name of LOGIC_PAIRS) {
    const uiNorm = normalizeLogicSource(read(`${UI_RULES}/${name}`));
    const vendorNorm = normalizeLogicSource(read(`${VENDOR}/${name}`));
    assert(
      uiNorm === vendorNorm,
      `${name} — affärslogik skiljer efter import-normalisering. Kör diff manuellt; merge kräver godkännande.`,
    );
  }
}

function assertVendorOnlyFiles() {
  console.log('[smoke:economy-vendor] Vendor timeMath (server bundle)…');
  assert(existsSync(resolve(root, `${VENDOR}/timeMath.ts`)), 'saknar vendor/timeMath.ts');
  mustNotImportAlias(`${VENDOR}/generatePayslipCore.ts`);
}

function mustNotImportAlias(relPath) {
  const text = read(relPath);
  assert(!text.includes('@/'), `${relPath} får inte använda @/-alias (server-isolering)`);
}

function buildFunctions() {
  console.log('[smoke:economy-vendor] functions build…');
  execSync('npm run build', { cwd: functionsRoot, stdio: 'pipe', encoding: 'utf8' });
}

async function runVendorGolden() {
  const mod = await import(
    pathToFileURL(resolve(functionsRoot, 'lib/economy/vendor/generatePayslipCore.js')).href
  );
  const liv = await import(
    pathToFileURL(resolve(functionsRoot, 'lib/economy/vendor/livsmedel2026.js')).href
  );
  const tax = await import(
    pathToFileURL(resolve(functionsRoot, 'lib/economy/vendor/taxTable32.js')).href
  );
  const pay = await import(
    pathToFileURL(resolve(functionsRoot, 'lib/economy/vendor/payTimeRules.js')).href
  );

  const golden = JSON.parse(read(`${UI_RULES}/__fixtures__/sheet-golden.json`));
  const PAYDAY = new Date(2026, 4, 16);
  const period = mod.getPayslipPeriodForPayday(PAYDAY);
  const payslip = mod.buildMonthlyPayslip({
    entries: [],
    period,
    monthlySalarySek: liv.BASE_SALARY_SEK,
  });

  const even = golden.weekTargets.evenWeekExample;
  const odd = golden.weekTargets.oddWeekExample;
  const longBreak = golden.autoBreak.longShiftNoBreak;
  const shortBreak = golden.autoBreak.shortShiftNoBreak;

  const longHours = pay.computeHoursWorkedOnClockOut({
    date: longBreak.date,
    clockIn: longBreak.clockIn,
    clockOut: longBreak.clockOut,
    breakMinutes: longBreak.breakMinutesIn,
    scopePercent: 100,
  });

  const shortHours = pay.computeHoursWorkedOnClockOut({
    date: shortBreak.date,
    clockIn: shortBreak.clockIn,
    clockOut: shortBreak.clockOut,
    breakMinutes: shortBreak.breakMinutesIn,
    scopePercent: 100,
  });

  const flexRef = new Date('2026-05-19');
  const flexArbete = pay.computeWeekFlexSummary(golden.flexWeek.arbeteOnly, flexRef);

  return {
    payslipPeriod: { from: period.from, to: period.to },
    payslipTaxSek: payslip.taxSek,
    payslipNetSek: payslip.netSalarySek,
    taxTable32Base: tax.getTaxAmount(liv.BASE_SALARY_SEK),
    evenWeek: {
      isEven: pay.isEvenISOWeek(new Date(even.isoDate)),
      flexTarget: pay.getWeekFlexTarget(new Date(even.isoDate)),
    },
    oddWeek: {
      isEven: pay.isEvenISOWeek(new Date(odd.isoDate)),
      flexTarget: pay.getWeekFlexTarget(new Date(odd.isoDate)),
    },
    longBreakMinutes: pay.resolveBreakMinutesOnClockOut({
      date: longBreak.date,
      clockIn: longBreak.clockIn,
      clockOut: longBreak.clockOut,
      breakMinutes: longBreak.breakMinutesIn,
    }),
    longHoursWorked: longHours.hoursWorked,
    shortHoursWorked: shortHours.hoursWorked,
    flexWorkHours: flexArbete.workHoursWeek,
    dayFlexEight: pay.computeDayFlexDelta(golden.dayFlex.arbeteEightHours.entry),
  };
}

function runUiGolden() {
  console.log('[smoke:economy-vendor] UI golden (tsx)…');
  const out = execSync('npx tsx scripts/economy_vendor_contract_ui.ts', {
    cwd: root,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
  return JSON.parse(out);
}

function deepEqual(a, b, path = '') {
  if (a === b) return;
  if (typeof a !== typeof b) {
    throw new Error(`contract mismatch ${path}: ${typeof a} vs ${typeof b}`);
  }
  if (a == null || typeof a !== 'object') {
    throw new Error(`contract mismatch ${path}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  }
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    deepEqual(a[key], b[key], path ? `${path}.${key}` : key);
  }
}

async function main() {
  compareIdenticalPairs();
  compareLogicPairs();
  assertVendorOnlyFiles();
  buildFunctions();

  console.log('[smoke:economy-vendor] Runtime golden — vendor…');
  const vendorResult = await runVendorGolden();

  console.log('[smoke:economy-vendor] Runtime golden — UI…');
  const uiResult = runUiGolden();

  deepEqual(vendorResult, uiResult);

  assert(vendorResult.payslipPeriod.from === '2026-04-16', 'löneperiod from');
  assert(vendorResult.payslipPeriod.to === '2026-05-15', 'löneperiod to');
  assert(vendorResult.payslipTaxSek === 7312, 'Tabell 32 skatt');
  assert(vendorResult.evenWeek.flexTarget === 30, 'jämn vecka flex');
  assert(vendorResult.oddWeek.flexTarget === 50, 'ojämn vecka flex');

  console.log(
    `[smoke:economy-vendor] PASS — ${LOGIC_PAIRS.length} logikpar + ${IDENTICAL_PAIRS.length} identiska + golden runtime.`,
  );
  console.log(
    '[smoke:economy-vendor] Obs: dubbla kopior kvar — merge UI↔vendor kräver explicit godkännande.',
  );
}

main().catch((err) => {
  console.error('[smoke:economy-vendor] FAIL:', err.message ?? err);
  process.exit(1);
});
