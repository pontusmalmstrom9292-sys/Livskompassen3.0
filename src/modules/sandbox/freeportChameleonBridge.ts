import type { HemV3DevCard } from '@/core/home/hemV3DevelopmentCards';
import type { DagbokInputMode } from '@/features/lifeJournal/diary/supermodule/dagbokInputModes';
import type { PlaneringInputMode } from '@/features/admin/planning/supermodule/planeringInputModes';
import type { MabraInputMode } from '@/features/dailyLife/wellbeing/mabra/supermodule/mabraInputModes';
import type { FamiljenInputMode } from '@/features/family/children/supermodule/familjenInputModes';
import type { FreeportZoneId } from './freeportZones';

export type FreeportChameleonModule = 'dagbok' | 'planering' | 'mabra' | 'familjen';

export type FreeportChameleonTarget = {
  zone: FreeportZoneId;
  module: FreeportChameleonModule;
  mode: string;
};

export function getDefaultTarget(zone: FreeportZoneId): FreeportChameleonTarget {
  switch (zone) {
    case 'hjartat':
      return { zone, module: 'dagbok', mode: 'reflektion' satisfies DagbokInputMode };
    case 'vardagen':
      return { zone, module: 'planering', mode: 'task_quick' satisfies PlaneringInputMode };
    case 'familjen':
      return { zone, module: 'familjen', mode: 'barnfokus' satisfies FamiljenInputMode };
  }
}

/** Kort → chameleon-target (max 2 klick, Modell A). */
export function resolveCardToChameleon(card: HemV3DevCard): FreeportChameleonTarget {
  switch (card.actionLabel) {
    case 'Dagbok':
      return { zone: 'hjartat', module: 'dagbok', mode: 'reflektion' };
    case 'Speglar':
      return { zone: 'hjartat', module: 'dagbok', mode: 'quick_mirror' };
    case 'MåBra':
      return { zone: 'vardagen', module: 'mabra', mode: 'checkin' satisfies MabraInputMode };
    case 'Planering':
      return { zone: 'vardagen', module: 'planering', mode: 'task_quick' };
    case 'Barnfokus':
    case 'Familjen':
      return { zone: 'familjen', module: 'familjen', mode: 'barnfokus' };
    case 'Trygg Hamn':
      return { zone: 'familjen', module: 'familjen', mode: 'barnfokus' };
    default:
      return getDefaultTarget('hjartat');
  }
}

export function resolveSuperModToChameleon(
  modId: string,
): FreeportChameleonTarget | null {
  switch (modId) {
    case 'Dagbok':
      return { zone: 'hjartat', module: 'dagbok', mode: 'reflektion' };
    case 'Check-in':
      return { zone: 'vardagen', module: 'mabra', mode: 'checkin' };
    case 'Anteckning':
      return { zone: 'vardagen', module: 'planering', mode: 'inkast' };
    case 'Kompass':
      return { zone: 'vardagen', module: 'planering', mode: 'task_quick' };
    default:
      return null;
  }
}

export function isModeValidForZone(zone: FreeportZoneId, module: FreeportChameleonModule): boolean {
  if (zone === 'hjartat') return module === 'dagbok';
  if (zone === 'familjen') return module === 'familjen';
  if (zone === 'vardagen') return module === 'planering' || module === 'mabra';
  return false;
}
