/**
 * Smoke: G13 — Tidshjulet partition logic (pure, no Firebase).
 * Usage: node scripts/smoke_tidshjul.mjs
 */

function parseEffectiveDate(entry) {
  const raw = (entry.eventDate || entry.createdAt || '').trim();
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? new Date(0) : new Date(parsed);
}

function startOfLocalDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function partition(entries) {
  const today = startOfLocalDay(new Date());
  const nutidCutoff = new Date(today);
  nutidCutoff.setDate(nutidCutoff.getDate() - 14);

  const sorted = [...entries].sort(
    (a, b) => parseEffectiveDate(b).getTime() - parseEffectiveDate(a).getTime()
  );

  const dåtid = [];
  const nutid = [];
  const framtid = [];

  for (const entry of sorted) {
    const effective = startOfLocalDay(parseEffectiveDate(entry));
    if (effective > today) framtid.push(entry);
    else if (effective >= nutidCutoff) nutid.push(entry);
    else dåtid.push(entry);
  }

  return { dåtid, nutid, framtid };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const old = new Date(today);
old.setDate(old.getDate() - 30);
const future = new Date(today);
future.setDate(future.getDate() + 5);

const entries = [
  { id: '1', title: 'Old', eventDate: old.toISOString().slice(0, 10), createdAt: old.toISOString() },
  { id: '2', title: 'Now', eventDate: yesterday.toISOString().slice(0, 10), createdAt: yesterday.toISOString() },
  { id: '3', title: 'Future', eventDate: future.toISOString().slice(0, 10), createdAt: future.toISOString() },
];

const parts = partition(entries);
assert(parts.dåtid.some((e) => e.id === '1'), 'dåtid ska innehålla gammal post');
assert(parts.nutid.some((e) => e.id === '2'), 'nutid ska innehålla recent post');
assert(parts.framtid.some((e) => e.id === '3'), 'framtid ska innehålla framtida post');

console.log('[smoke] partition:', {
  dåtid: parts.dåtid.length,
  nutid: parts.nutid.length,
  framtid: parts.framtid.length,
});
console.log('\n[smoke] PASS — G13 Tidshjulet partition.');
process.exit(0);
