import type { EntityRole } from '../api/entityProfileService';

export const ENTITY_ROLE_LABELS: Record<EntityRole, string> = {
  ANVANDARE: 'Du',
  MOTPART: 'Motpart',
  BARN: 'Barn',
  NATVERK: 'Nätverk',
  MYNDIGHET: 'Myndighet',
  SKOLA: 'Skola',
};

export const ADDABLE_ENTITY_ROLES: Array<Exclude<EntityRole, 'ANVANDARE'>> = [
  'MOTPART',
  'BARN',
  'NATVERK',
  'MYNDIGHET',
  'SKOLA',
];
