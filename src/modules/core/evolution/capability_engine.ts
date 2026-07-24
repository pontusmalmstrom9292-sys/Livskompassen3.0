import type { MabraProgress } from '../types/firestore';

/**
 * Calculates a capacity score based on Mabra progress data.
 * Currently bases the score on the number of defined core values.
 * Prepared for future 7-day trend calculations.
 *
 * @param progress The MabraProgress document data.
 * @returns A normalized score between 0 and 1.
 */
export function calculateCapacityScore(progress: MabraProgress | null): number {
  if (!progress || !progress.coreValues) {
    return 0;
  }

  const coreValuesCount = progress.coreValues.length;

  if (coreValuesCount >= 5) {
    return 1.0;
  } else if (coreValuesCount >= 2) {
    return 0.5;
  } else if (coreValuesCount > 0) {
    return 0.2;
  }

  return 0;
}
