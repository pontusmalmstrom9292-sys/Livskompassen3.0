import { describe, expect, it } from 'vitest';
import { parseDateOnly, normalizeClock, eachDateInclusive, computeHoursWorked } from '@economy/timeMath';

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
});

describe('eachDateInclusive', () => {
  it('returnerar korrekt datumspann', () => {
    const dates = eachDateInclusive('2026-07-01', '2026-07-03');
    expect(dates).toHaveLength(3);
    expect(dates[0]).toBe('2026-07-01');
    expect(dates[2]).toBe('2026-07-03');
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

  it('returnerar 0 om clockOut saknas', () => {
    const h = computeHoursWorked({
      date: '2026-07-23',
      clockIn: '08:00',
      clockOut: null,
      breakMinutes: 30,
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
});
