import { describe, expect, it } from 'vitest';
import {
  envelopeRemaining,
  split503020,
  weeklyBudgetLeft,
  weeklyProgressPercent,
  weeklySpentSek,
} from './budgetTemplates';

describe('split503020', () => {
  it('splits income into 50/30/20', () => {
    expect(split503020(10_000)).toEqual({
      needsSek: 5000,
      wantsSek: 3000,
      savingsSek: 2000,
    });
  });

  it('clamps negative income to zero', () => {
    expect(split503020(-100)).toEqual({
      needsSek: 0,
      wantsSek: 0,
      savingsSek: 0,
    });
  });
});

describe('envelopeRemaining', () => {
  it('returns allocated minus spent', () => {
    expect(envelopeRemaining({ allocatedSek: 500, spentSek: 120 })).toBe(380);
  });

  it('never goes below zero', () => {
    expect(envelopeRemaining({ allocatedSek: 100, spentSek: 200 })).toBe(0);
  });
});

describe('weeklySpentSek', () => {
  it('sums negative amounts in current week only', () => {
    const now = new Date('2026-06-04T12:00:00'); // Wednesday
    const txs = [
      { amountSek: -50, createdAt: '2026-06-03T10:00:00.000Z' },
      { amountSek: -30, createdAt: '2026-06-01T10:00:00.000Z' },
      { amountSek: 500, createdAt: '2026-06-03T10:00:00.000Z' },
      { amountSek: -100, createdAt: '2026-05-25T10:00:00.000Z' },
    ];
    expect(weeklySpentSek(txs, now)).toBe(80);
  });
});

describe('weeklyBudgetLeft', () => {
  it('computes remaining budget', () => {
    expect(weeklyBudgetLeft(1500, 450)).toBe(1050);
  });
});

describe('weeklyProgressPercent', () => {
  it('caps at 100', () => {
    expect(weeklyProgressPercent(100, 150)).toBe(100);
  });
});
