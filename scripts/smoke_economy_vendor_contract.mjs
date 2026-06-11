/**
 * Contract smoke: shared/economy kanon — UI + functions vendor är tunna re-exports.
 * Usage: npm run smoke:economy-vendor
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const functionsRoot = resolve(root, 'functions');

const SHARED = 'shared/economy';
const UI_RULES = 'src/modules/features/dailyLife/wellbeing/economy/rules';
const VENDOR = 'functions/src/economy/vendor';

const REEXPORT_MODULES = [
  'payTimeRules.ts',
  'payAbsenceRules.ts',
  'generatePayslipCore.ts',
  'taxTable32.ts',
  'livsmedel2026.ts',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function assertSharedCanonical() {
  console.log('[smoke:economy-vendor] shared/economy kanon…');
  for (const name of REEXPORT_MODULES) {
    const src = read(`${SHARED}/${name}`);
    assert(src.length > 80, `${SHARED}/${name} ska innehålla affärslogik`);
    assert(!src.includes('@/'), `${SHARED}/${name} får inte använda @/-alias`);
  }
  assert(existsSync(resolve(root, `${SHARED}/timeMath.ts`)), 'saknar shared/economy/timeMath.ts');
}

function assertThinReExports() {
  console.log('[smoke:economy-vendor] Tunna re-exports (UI + vendor)…');
  for (const name of REEXPORT_MODULES) {
    const ui = read(`${UI_RULES}/${name}`).trim();
    const vendor = read(`${VENDOR}/${name}`).trim();
    assert(ui.includes(`shared/economy/${name.replace('.ts', '')}`) || ui.includes('@economy/'), `${UI_RULES}/${name}`);
    assert(vendor.includes(`shared/economy/${name.replace('.ts', '')}`), `${VENDOR}/${name}`);
    assert(!ui.includes('export function'), `${UI_RULES}/${name} ska inte duplicera logik`);
    assert(!vendor.includes('export function'), `${VENDOR}/${name} ska inte duplicera logik`);
  }
  const vendorTimeMath = read(`${VENDOR}/timeMath.ts`).trim();
  assert(vendorTimeMath.includes('shared/economy/timeMath'), 'vendor/timeMath.ts ska re-exportera shared');
}

function buildFunctions() {
  console.log('[smoke:economy-vendor] functions build…');
  execSync('npm run build', { cwd: functionsRoot, stdio: 'pipe', encoding: 'utf8' });
}

function vendorLibPath(name) {
  const candidates = [
    resolve(functionsRoot, 'lib/economy/vendor', name),
    resolve(functionsRoot, 'lib/functions/src/economy/vendor', name),
  ];
  const hit = candidates.find((p) => existsSync(p));
  assert(hit, `saknar compiled vendor: ${name} (kör cd functions && npm run build)`);
  return hit;
}

async function runVendorGolden() {
  const mod = await import(pathToFileURL(vendorLibPath('generatePayslipCore.js')).href);
  const liv = await import(pathToFileURL(vendorLibPath('livsmedel2026.js')).href);
  const tax = await import(pathToFileURL(vendorLibPath('taxTable32.js')).href);
  const pay = await import(pathToFileURL(vendorLibPath('payTimeRules.js')).href);

  const golden = JSON.parse(read(`${SHARED}/__fixtures__/sheet-golden.json`));
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
  assertSharedCanonical();
  assertThinReExports();
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
    `[smoke:economy-vendor] PASS — shared/economy kanon + ${REEXPORT_MODULES.length} re-exports + golden runtime.`,
  );
}

main().catch((err) => {
  console.error('[smoke:economy-vendor] FAIL:', err.message ?? err);
  process.exit(1);
});
