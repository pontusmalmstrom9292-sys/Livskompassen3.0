/** Kat 8 — 12-stegs-inspirerade journalprompter (DF-STEP-*). */
export type RecoveryStepPrompt = {
  stepNumber: number;
  bankId: string;
  title: string;
  prompt: string;
};

export const RECOVERY_TWELVE_STEP_PROMPTS: readonly RecoveryStepPrompt[] = [
  {
    stepNumber: 1,
    bankId: 'DF-STEP-01',
    title: 'Erkännande',
    prompt: 'Vad är det svåraste att erkänna just nu — utan att fixa det?',
  },
  {
    stepNumber: 2,
    bankId: 'DF-STEP-02',
    title: 'Hopp',
    prompt: 'Vad skulle ge dig tillräckligt hopp för ett litet steg idag?',
  },
  {
    stepNumber: 3,
    bankId: 'DF-STEP-03',
    title: 'Överlåtelse',
    prompt: 'Vad kan du släppa kontrollen över idag — bara till i kväll?',
  },
  {
    stepNumber: 4,
    bankId: 'DF-STEP-04',
    title: 'Inventering',
    prompt: 'En sak du gjort som visar att du kan förändring — utan skam.',
  },
  {
    stepNumber: 5,
    bankId: 'DF-STEP-05',
    title: 'Delning',
    prompt: 'Vem skulle du kunna vara ärlig mot — även om du inte gör det än?',
  },
  {
    stepNumber: 6,
    bankId: 'DF-STEP-06',
    title: 'Beredskap',
    prompt: 'Vad behöver du sluta göra idag för att skydda nykterheten?',
  },
  {
    stepNumber: 7,
    bankId: 'DF-STEP-07',
    title: 'Ödmjukhet',
    prompt: 'Var behöver du be om hjälp — ett ord räcker?',
  },
  {
    stepNumber: 8,
    bankId: 'DF-STEP-08',
    title: 'Skadegörelse',
    prompt: 'Finns en person du vill reparera relation med — ett steg?',
  },
  {
    stepNumber: 9,
    bankId: 'DF-STEP-09',
    title: 'Gottgörelse',
    prompt: 'Vilket konkret mikrosteg skulle vara gottgörelse — inte hela skulden?',
  },
  {
    stepNumber: 10,
    bankId: 'DF-STEP-10',
    title: 'Inventering 2',
    prompt: 'Vilket mönster ser du hos dig själv — beskriv, döm inte?',
  },
  {
    stepNumber: 11,
    bankId: 'DF-STEP-11',
    title: 'Kontakt',
    prompt: 'Vad hjälper dig känna närvaro — utan substans?',
  },
  {
    stepNumber: 12,
    bankId: 'DF-STEP-12',
    title: 'Service',
    prompt: 'Hur kan du tjäna din nykterhet idag — ett litet sätt?',
  },
] as const;
