import { describe, expect, it } from 'vitest';
import {
  CAPACITY_PLANNING_KANBAN_THRESHOLD,
  CAPACITY_STABILITY_THRESHOLD,
  capacityScoreToScale10,
  moodEnergyAverageToNormalized,
  normalizeStoredCapacityScore,
} from './capacityScore';

describe('capacityScore', () => {
  it('normalizes MåBra mood/energy average to 0–1', () => {
    expect(moodEnergyAverageToNormalized(7)).toBeCloseTo(0.7);
    expect(moodEnergyAverageToNormalized(0)).toBe(0);
    expect(moodEnergyAverageToNormalized(10)).toBe(1);
  });

  it('reads canonical 0–1 store values', () => {
    expect(normalizeStoredCapacityScore(0.45)).toBeCloseTo(0.45);
    expect(normalizeStoredCapacityScore(undefined)).toBe(0);
  });

  it('converts legacy 0–10 and 0–100 scales', () => {
    expect(normalizeStoredCapacityScore(7)).toBeCloseTo(0.7);
    expect(normalizeStoredCapacityScore(70)).toBeCloseTo(0.7);
  });

  it('maps to 0–10 for backend callables', () => {
    expect(capacityScoreToScale10(0.5)).toBe(5);
    expect(capacityScoreToScale10(undefined)).toBe(5);
  });

  it('exposes stable gate thresholds', () => {
    expect(CAPACITY_STABILITY_THRESHOLD).toBe(0.5);
    expect(CAPACITY_PLANNING_KANBAN_THRESHOLD).toBe(0.45);
  });
});
