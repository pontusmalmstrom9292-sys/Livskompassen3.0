export type BreathPhase = 'idle' | 'in' | 'hold_in' | 'out' | 'hold_out';

export type BreathingPhaseStep = {
  phase: BreathPhase;
  duration: number;
  text: string;
};

export type BreathingExercise = {
  id: string;
  label: string;
  name: string;
  description: string;
  phases: BreathingPhaseStep[];
};

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'box',
    label: 'Fokus',
    name: 'Fokus (Box Breathing)',
    description: 'Skapar mental klarhet och samlar ditt fokus.',
    phases: [
      { phase: 'in', duration: 4000, text: 'Andas in' },
      { phase: 'hold_in', duration: 4000, text: 'Håll andan' },
      { phase: 'out', duration: 4000, text: 'Andas ut' },
      { phase: 'hold_out', duration: 4000, text: 'Håll andan' },
    ],
  },
  {
    id: '478',
    label: 'Avslappning',
    name: 'Djup avslappning (4-7-8)',
    description: 'Dämpar stress och sänker pulsen. Valfritt — hoppa över om det känns för mycket.',
    phases: [
      { phase: 'in', duration: 4000, text: 'Andas in' },
      { phase: 'hold_in', duration: 7000, text: 'Håll andan' },
      { phase: 'out', duration: 8000, text: 'Andas ut långsamt' },
    ],
  },
  {
    id: '426',
    label: 'Lugnande',
    name: 'Lugnande (4-2-6)',
    description: 'En mjuk rytm för att landa i nuet.',
    phases: [
      { phase: 'in', duration: 4000, text: 'Andas in' },
      { phase: 'hold_in', duration: 2000, text: 'Håll andan' },
      { phase: 'out', duration: 6000, text: 'Andas ut' },
    ],
  },
];

export const DEFAULT_BREATHING_EXERCISE_ID = BREATHING_EXERCISES[0].id;

export function getBreathingExercise(id: string): BreathingExercise {
  return BREATHING_EXERCISES.find((e) => e.id === id) ?? BREATHING_EXERCISES[0];
}
