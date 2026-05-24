export type MabraSymptomHub = 'panic_rsd' | 'self_critical' | 'find_self';

export type MabraExerciseType = 'breathing' | 'grounding' | 'reframing';

export type MabraDurationMinutes = 1 | 3 | 5;

export type MabraFlowStep =
  | 'hub'
  | 'project_plan'
  | 'akut'
  | 'duration'
  | 'exercise'
  | 'breathing_addon'
  | 'values'
  | 'complete';
