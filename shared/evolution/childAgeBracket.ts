/** Shared age bracket logic — client + Cloud Functions (Infinite Evolution). */

export type AgeBracket = 'toddler_preschool' | 'early_school' | 'pre_teen' | 'teen';

export function bracketFromAgeYears(ageYears: number): AgeBracket {
  if (ageYears <= 5) return 'toddler_preschool';
  if (ageYears <= 9) return 'early_school';
  if (ageYears <= 13) return 'pre_teen';
  return 'teen';
}

export function ageYearsFromBirthDate(birthDate: string, now = new Date()): number | null {
  const parsed = Date.parse(birthDate);
  if (Number.isNaN(parsed)) return null;
  const birth = new Date(parsed);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export function bracketFromBirthDate(birthDate: string, now = new Date()): AgeBracket | null {
  const age = ageYearsFromBirthDate(birthDate, now);
  if (age === null) return null;
  return bracketFromAgeYears(age);
}
