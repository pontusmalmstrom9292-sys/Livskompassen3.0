/** M3.0-C Kat 2 — kuraterade mikroprogram (bankId KEEP, ingen ny FACT). */

export type MovementProgramId = 'movement_micro' | 'walk_reset' | 'stretch_478';

export type MovementProgram = {
  id: MovementProgramId;
  exerciseType: MovementProgramId;
  title: string;
  lead: string;
  durationMinutes: number;
  bankId: string;
  instruction: string;
  minCapacityLevel: 1 | 2 | 3;
};

export const MOVEMENT_PROGRAMS: readonly MovementProgram[] = [
  {
    id: 'movement_micro',
    exerciseType: 'movement_micro',
    title: 'Mikrosteg',
    lead: '2 min — axlar, nacke, händer',
    durationMinutes: 2,
    bankId: 'MB-PLAY-03',
    instruction:
      'Rulla axlarna sakta. Sträck nacken åt sidorna. Öppna och stäng händerna. Inget mål — bara att kroppen rör sig lite.',
    minCapacityLevel: 1,
  },
  {
    id: 'walk_reset',
    exerciseType: 'walk_reset',
    title: 'Promenad-reset',
    lead: '5 min — inomhus eller ut',
    durationMinutes: 5,
    bankId: 'MB-PLAY-JOY-02',
    instruction:
      'Gå i valfritt tempo. Titta på tre saker längs vägen. Du behöver inte någonstans — bara byta rum eller riktning.',
    minCapacityLevel: 2,
  },
  {
    id: 'stretch_478',
    exerciseType: 'stretch_478',
    title: 'Stretch + andning',
    lead: '4 min — kropp och utandning',
    durationMinutes: 4,
    bankId: 'MB-PLAY-GAD-01',
    instruction:
      'Sträck armar uppåt vid inandning. Släpp axlarna vid utandning. Räkna utandningar till fyra om det känns bra.',
    minCapacityLevel: 2,
  },
] as const;

export function programsForCapacity(level: 1 | 2 | 3): MovementProgram[] {
  return MOVEMENT_PROGRAMS.filter((p) => p.minCapacityLevel <= level);
}
