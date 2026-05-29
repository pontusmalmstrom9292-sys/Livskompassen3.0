export type MabraSymptomHub = 'panic_rsd' | 'self_critical' | 'find_self';

export type MabraExerciseType = 'breathing' | 'grounding' | 'reframing' | 'daglig_mix';

export type MabraDurationMinutes = 1 | 3 | 5;

export type MabraToolState =
  | { kind: 'feeling_cards' }
  | { kind: 'reflection_deck'; initialBankId?: string }
  | { kind: 'self_quiz' }
  | { kind: 'micro_play'; playBankId: string }
  | { kind: 'kbt' }
  | { kind: 'daglig_mix' };

export type MabraFlowStep =
  | 'hub'
  | 'tool'
  | 'project_plan'
  | 'akut'
  | 'duration'
  | 'exercise'
  | 'breathing_addon'
  | 'values'
  | 'complete';
