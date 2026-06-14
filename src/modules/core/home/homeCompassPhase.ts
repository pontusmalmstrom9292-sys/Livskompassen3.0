import {
  getDefaultCompassByTime,
  type CompassFlow,
} from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';

/** Svensk fas-etikett — synkad med `getDefaultCompassByTime` (De-3-Kompasserna §3). */
export type HomeCompassPhase = 'morgon' | 'dag' | 'kvall';

function flowToPhase(flow: CompassFlow): HomeCompassPhase {
  if (flow === 'morning') return 'morgon';
  if (flow === 'day') return 'dag';
  return 'kvall';
}

export function getHomeCompassPhase(date = new Date()): HomeCompassPhase {
  return flowToPhase(getDefaultCompassByTime(date));
}

export function compassFlowToPhase(flow: CompassFlow): HomeCompassPhase {
  return flowToPhase(flow);
}

export function phaseToCompassFlow(phase: HomeCompassPhase): CompassFlow {
  if (phase === 'morgon') return 'morning';
  if (phase === 'dag') return 'day';
  return 'evening';
}

export function phaseGlowClasses(phase: HomeCompassPhase): string {
  if (phase === 'morgon') {
    return 'home-adaptive-compass__card--phase-morgon';
  }
  if (phase === 'dag') {
    return 'home-adaptive-compass__card--phase-dag';
  }
  return 'home-adaptive-compass__card--phase-kvall';
}

export function phaseHeaderClasses(phase: HomeCompassPhase): string {
  if (phase === 'morgon') return 'home-adaptive-compass__head--morgon';
  if (phase === 'dag') return 'home-adaptive-compass__head--dag';
  return 'home-adaptive-compass__head--kvall';
}

export function phaseTitleClasses(phase: HomeCompassPhase): string {
  if (phase === 'morgon') return 'text-accent-light';
  if (phase === 'dag') return 'text-accent';
  return 'text-accent-light';
}

export function phaseLabel(phase: HomeCompassPhase): string {
  if (phase === 'morgon') return 'God morgon';
  if (phase === 'dag') return 'Dagens fokus';
  return 'God kväll';
}

export function phaseLead(phase: HomeCompassPhase): string {
  if (phase === 'morgon') return 'Sätt ditt ankare för dagen.';
  if (phase === 'dag') return 'Ett mikrosteg i taget.';
  return 'Töm hjärnan och checka ut.';
}
