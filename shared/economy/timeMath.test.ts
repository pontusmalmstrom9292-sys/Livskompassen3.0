import { describe, expect, it } from 'vitest';
import {
  parseDateOnly,
  normalizeClock,
  parseClockOnDate,
  eachDateInclusive,
  computeHoursWorked,
  buildCategoryName,
  categoryBase,
} from '@economy/timeMath';

describe('parseDateOnly', () => {
  it('parsar giltigt YYYY-MM-DD', () => {
    const d = parseDateOnly('2026-07-23');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6); // 0-baserat
    expect(d.getDate()).toBe(23);
    expect(d.getHours()).toBe(12); // middag för tidszonssäkerhet
  });

  it('kastar vid tom sträng', () => {
    expect(() => parseDateOnly('')).toThrow('ogiltigt indata');
  });

  it('kastar vid fel format (saknar dag)', () => {
    expect(() => parseDateOnly('2026-07')).toThrow('förväntar YYYY-MM-DD');
  });

  it('kastar vid icke-numeriska delar', () => {
    expect(() => parseDateOnly('2026-xx-07')).toThrow('förväntar YYYY-MM-DD');
  });

  it('kastar vid extra segment', () => {
    expect(() => parseDateOnly('2026-07-23-extra')).toThrow('förväntar YYYY-MM-DD');
  });
});

describe('normalizeClock', () => {
  it('normaliserar med punkt som separator', () => {
    expect(normalizeClock('09.30')).toBe('09:30');
  });

  it('nollpaddar timmar och minuter', () => {
    expect(normalizeClock('9:5')).toBe('09:05');
  });

  it('returnerar 00:00 för ogiltigt indata', () => {
    expect(normalizeClock('abc')).toBe('00:00');
  });

  it('returnerar 00:00 för tom sträng', () => {
    expect(normalizeClock('')).toBe('00:00');
  });

  it('hanterar blanksteg korrekt', () => {
    expect(normalizeClock('  09:30  ')).toBe('09:30');
  });

  it('returnerar 00:00 för noll-timme och noll-minut', () => {
    expect(normalizeClock('0:0')).toBe('00:00');
  });

  it('normaliserar maxgiltig tid 23:59', () => {
    expect(normalizeClock('23:59')).toBe('23:59');
  });

  it('normaliserar midnatt med punkt', () => {
    expect(normalizeClock('00.00')).toBe('00:00');
  });
});

describe('parseClockOnDate', () => {
  it('sätter rätt timme och minut på datumet', () => {
    const d = parseClockOnDate('2026-07-23', '14:45');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6);
    expect(d.getDate()).toBe(23);
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(45);
  });

  it('hanterar punktnotation i klocktid', () => {
    const d = parseClockOnDate('2026-07-23', '08.00');
    expect(d.getHours()).toBe(8);
    expect(d.getMinutes()).toBe(0);
  });
});

describe('eachDateInclusive', () => {
  it('returnerar korrekt datumspann', () => {
    const dates = eachDateInclusive('2026-07-01', '2026-07-03');
    expect(dates).toHaveLength(3);
    expect(dates[0]).toBe('2026-07-01');
    expect(dates[2]).toBe('2026-07-03');
  });

  it('returnerar ett datum när från och till är samma', () => {
    const dates = eachDateInclusive('2026-07-15', '2026-07-15');
    expect(dates).toHaveLength(1);
    expect(dates[0]).toBe('2026-07-15');
  });

  it('kastar om till-datum är före från-datum', () => {
    expect(() => eachDateInclusive('2026-07-05', '2026-07-01')).toThrow(
      '"Till"-datum kan inte vara före "Från"-datum.',
    );
  });
});

describe('computeHoursWorked', () => {
  it('beräknar nettotimmar korrekt', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '08:00',
      clockOut: '16:30',
      breakMinutes: 30,
      scopePercent: 100,
    });
    expect(h).toBe(8.0); // 8.5h - 30min = 8h
  });

  it('returnerar 0 om clockOut saknas (null)', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '08:00',
      clockOut: null,
      breakMinutes: 30,
      scopePercent: 100,
    });
    expect(h).toBe(0);
  });

  it('returnerar 0 om clockOut är undefined', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '08:00',
      clockOut: undefined,
      breakMinutes: 0,
      scopePercent: 100,
    });
    expect(h).toBe(0);
  });

  it('tillämpar scopePercent korrekt', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '08:00',
      clockOut: '16:00',
      breakMinutes: 0,
      scopePercent: 50,
    });
    expect(h).toBe(4.0);
  });

  it('returnerar 0 om clockOut är före clockIn', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '16:00',
      clockOut: '08:00',
      breakMinutes: 0,
      scopePercent: 100,
    });
    expect(h).toBe(0);
  });

  it('returnerar 0 om clockIn och clockOut är identiska', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '09:00',
      clockOut: '09:00',
      breakMinutes: 0,
      scopePercent: 100,
    });
    expect(h).toBe(0);
  });

  it('returnerar 0 om rast överstiger arbetstiden', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '08:00',
      clockOut: '09:00',
      breakMinutes: 120, // 2h rast men bara 1h arbete
      scopePercent: 100,
    });
    expect(h).toBe(0);
  });

  it('returnerar 0 om scopePercent är 0', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '08:00',
      clockOut: '16:00',
      breakMinutes: 0,
      scopePercent: 0,
    });
    expect(h).toBe(0);
  });

  it('beräknar korrekt utan rast och full scope', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '08:00',
      clockOut: '16:00',
      breakMinutes: 0,
      scopePercent: 100,
    });
    expect(h).toBe(8.0);
  });
});

describe('buildCategoryName', () => {
  it('returnerar kategori med procent om < 100', () => {
    expect(buildCategoryName('Arbete', 50)).toBe('Arbete (50%)');
  });

  it('returnerar kategori utan procent om 100%', () => {
    expect(buildCategoryName('Arbete', 100)).toBe('Arbete');
  });

  it('returnerar kategori utan procent om 0%', () => {
    expect(buildCategoryName('Arbete', 0)).toBe('Arbete');
  });

  it('returnerar kategori utan procent om scopePercent saknas', () => {
    expect(buildCategoryName('Semester')).toBe('Semester');
  });

  it('kastar om kategori är tom', () => {
    expect(() => buildCategoryName('')).toThrow('Kategori saknas.');
  });
});

describe('categoryBase', () => {
  it('extraherar basnamn från kategori med procent', () => {
    expect(categoryBase('Arbete (50%)')).toBe('Arbete');
  });

  it('returnerar kategori oförändrad om inget parentes-suffix', () => {
    expect(categoryBase('Semester')).toBe('Semester');
  });

  it('returnerar tom sträng för tomma värden', () => {
    expect(categoryBase('')).toBe('');
  });
});
