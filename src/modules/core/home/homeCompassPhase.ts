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
    return 'border-b-2 border-b-amber-500/60 shadow-[0_8px_30px_-4px_rgba(245,158,11,0.2)]';
  }
  if (phase === 'dag') {
    return 'border-b-2 border-b-accent/60 shadow-[0_8px_30px_-4px_rgba(212,175,55,0.2)]';
  }
  return 'border-b-2 border-b-indigo-500/60 shadow-[0_8px_30px_-4px_rgba(99,102,241,0.2)]';
}

export function phaseHeaderClasses(phase: HomeCompassPhase): string {
  if (phase === 'morgon') return 'border-amber-500/20 bg-amber-500/5';
  if (phase === 'dag') return 'border-accent/20 bg-accent/5';
  return 'border-indigo-500/20 bg-indigo-500/5';
}

export function phaseTitleClasses(phase: HomeCompassPhase): string {
  if (phase === 'morgon') return 'text-amber-400';
  if (phase === 'dag') return 'text-accent';
  return 'text-indigo-400';
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
