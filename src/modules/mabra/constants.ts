import type { MabraDurationMinutes, MabraExerciseType, MabraSymptomHub } from './types';

export const MABRA_DURATION_OPTIONS: MabraDurationMinutes[] = [1, 3, 5];

export const DEFAULT_MABRA_DURATION: MabraDurationMinutes = 3;

export const SYMPTOM_HUB_OPTIONS: {
  id: MabraSymptomHub;
  label: string;
  hint: string;
}[] = [
  {
    id: 'panic_rsd',
    label: 'Panik / RSD',
    hint: 'Nervsystemet går på högvarv',
  },
  {
    id: 'self_critical',
    label: 'Självkritik',
    hint: 'Tungt självprat — landa först',
  },
  {
    id: 'find_self',
    label: 'Hitta mig',
    hint: 'Här och nu, utan krav',
  },
];

export const HUB_EXERCISE_TYPE: Record<MabraSymptomHub, MabraExerciseType> = {
  panic_rsd: 'breathing',
  self_critical: 'breathing',
  find_self: 'grounding',
};

export function exerciseTypeForHub(hub: MabraSymptomHub): MabraExerciseType {
  return HUB_EXERCISE_TYPE[hub];
}

export function hubUsesDurationPicker(hub: MabraSymptomHub): boolean {
  return HUB_EXERCISE_TYPE[hub] === 'breathing';
}

export const DURATION_PICKER_COPY: Record<
  Extract<MabraSymptomHub, 'panic_rsd' | 'self_critical'>,
  { question: string; startLabel: string; hint?: string }
> = {
  panic_rsd: {
    question: 'Hur länge vill du andas?',
    startLabel: 'Starta andning',
    hint: 'Standard — 3 minuter räcker ofta.',
  },
  self_critical: {
    question: 'Landa kroppen först — sedan kan tankarna följa.',
    startLabel: 'Starta lugn andning',
    hint: 'Ingen prestation. Bara andas.',
  },
};

export const BREATHING_VARIANT_COPY: Record<
  Extract<MabraSymptomHub, 'panic_rsd' | 'self_critical'>,
  { label: string; subtitle: string }
> = {
  panic_rsd: {
    label: '4–7–8',
    subtitle: 'Lugna nervsystemet — ett andetag i taget.',
  },
  self_critical: {
    label: '4–7–8',
    subtitle: 'Du behöver inte fixa något just nu. Bara andas.',
  },
};

export const GROUNDING_STEPS = [
  {
    sense: 'Se',
    count: 5,
    prompt: 'Hitta 5 saker du kan se runt dig.',
    detail: 'Färger, former, ljus — vad som helst.',
  },
  {
    sense: 'Hör',
    count: 4,
    prompt: 'Lyssna efter 4 ljud.',
    detail: 'Nära eller långt borta. Inget behöver namnges högt.',
  },
  {
    sense: 'Känna',
    count: 3,
    prompt: 'Märk 3 saker kroppen känner.',
    detail: 'Fötter mot golvet, kläder, temperaturen.',
  },
  {
    sense: 'Lukta',
    count: 2,
    prompt: 'Finns 2 dofter du kan märka?',
    detail: 'Om inget kommer — det är okej. Hoppa vidare.',
  },
  {
    sense: 'Smaka',
    count: 1,
    prompt: 'En smak — eller bara munnen som den är.',
    detail: 'Du är här. Det räcker.',
  },
] as const;

export const BREATH_PHASE_SECONDS = {
  inhale: 4,
  hold: 7,
  exhale: 8,
} as const;
