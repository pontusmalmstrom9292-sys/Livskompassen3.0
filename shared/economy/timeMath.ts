export const TIMEZONE = 'Europe/Stockholm';

export const DEFAULT_HELDAG = { in: '08:00', out: '16:30' } as const;
export const DEFAULT_BREAK_MINUTES = 30;
export const DEFAULT_SCOPE_PERCENT = 100;

const DATE_FMT = new Intl.DateTimeFormat('sv-SE', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const TIME_FMT = new Intl.DateTimeFormat('sv-SE', {
  timeZone: TIMEZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatDateLocal(date = new Date()): string {
  const parts = DATE_FMT.formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value ?? '0000';
  const m = parts.find((p) => p.type === 'month')?.value ?? '01';
  const d = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${y}-${m}-${d}`;
}

export function formatTimeLocal(date = new Date()): string {
  const parts = TIME_FMT.formatToParts(date);
  const h = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const min = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return `${h.padStart(2, '0')}:${min.padStart(2, '0')}`;
}

/** Normaliserar "09.30", "9:5" → "09:05" för robust parsning. */
export function normalizeClock(clock: string): string {
  const cleaned = clock.trim().replace(/\./g, ':').replace(/\s/g, '');
  const [hRaw, minRaw = '0'] = cleaned.split(':');
  const h = Number(hRaw);
  const min = Number(minRaw);
  if (Number.isNaN(h) || Number.isNaN(min)) return '00:00';
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

export function parseDateOnly(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') {
    throw new Error(`parseDateOnly: ogiltigt indata (fick "${String(dateStr)}")`);
  }
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    throw new Error(`parseDateOnly: ogiltigt datumformat "${String(dateStr)}" — förväntar YYYY-MM-DD`);
  }
  const [y, m, d] = parts.map(Number);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) {
    throw new Error(`parseDateOnly: ogiltigt datumformat "${String(dateStr)}" — förväntar YYYY-MM-DD`);
  }
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function parseClockOnDate(dateStr: string, clock: string): Date {
  const normalized = normalizeClock(clock);
  const [h, min] = normalized.split(':').map(Number);
  const base = parseDateOnly(dateStr);
  base.setHours(h, min, 0, 0);
  return base;
}

export function buildCategoryName(category: string, scopePercent?: number): string {
  const cat = category.trim();
  if (!cat) throw new Error('Kategori saknas.');
  const pct = Number(scopePercent);
  if (pct > 0 && pct < 100) return `${cat} (${pct}%)`;
  return cat;
}

export function categoryBase(category: string): string {
  return String(category || '').split(' (')[0].trim();
}

export function computeHoursWorked(params: {
  date: string;
  clockIn: string;
  clockOut?: string | null;
  breakMinutes: number;
  scopePercent: number;
}): number {
  if (!params.clockOut) return 0;
  const start = parseClockOnDate(params.date, params.clockIn);
  const end = parseClockOnDate(params.date, params.clockOut);
  if (end <= start) return 0;
  const rawHours = (end.getTime() - start.getTime()) / 3_600_000;
  const net = Math.max(0, rawHours - params.breakMinutes / 60);
  const scoped = net * (params.scopePercent / 100);
  return Math.round(scoped * 10) / 10;
}

export function getMonday(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekNumber(date = new Date()): number {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - oneJan.getTime()) / 86_400_000 + oneJan.getDay() + 1) / 7);
}

export function eachDateInclusive(from: string, to: string): string[] {
  const start = parseDateOnly(from);
  const end = parseDateOnly(to);
  if (end < start) throw new Error('"Till"-datum kan inte vara före "Från"-datum.');
  const out: string[] = [];
  const curr = new Date(start);
  while (curr <= end) {
    out.push(formatDateLocal(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return out;
}

export type WeekDaySummary = {
  namn: string;
  datum: string;
  timmar: number;
  pass: number;
  idag: boolean;
};

const DAY_NAMES = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

export function emptyWeekCalendar(date = new Date()): WeekDaySummary[] {
  const monday = getMonday(date);
  const today = formatDateLocal(date);
  return DAY_NAMES.map((namn, i) => {
    const curr = new Date(monday);
    curr.setDate(curr.getDate() + i);
    const datum = formatDateLocal(curr);
    return { namn, datum, timmar: 0, pass: 0, idag: datum === today };
  });
}
