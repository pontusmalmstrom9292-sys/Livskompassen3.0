import type { MabraSymptomHub } from '../../../wellbeing/mabra/types';

export type MabraBridgeHub = MabraSymptomHub;

export function parseMabraBridgeHub(raw: string | null): MabraBridgeHub | null {
  if (raw === 'panic_rsd' || raw === 'self_critical' || raw === 'find_self') {
    return raw;
  }
  return null;
}

export function isMabraLowEnergyBridge(
  from: string | null,
  energy: string | null,
): boolean {
  return from === 'mabra' && energy === 'low';
}

export const MABRA_BRIDGE_INTRO: Record<
  MabraBridgeHub,
  { title: string; detail: string }
> = {
  panic_rsd: {
    title: 'Du kom från Måbra.',
    detail: 'Välj humör — en kort rad är valfritt.',
  },
  self_critical: {
    title: 'Du kom från Måbra.',
    detail: 'En kort insikt räcker. Eller spara bara humör.',
  },
  find_self: {
    title: 'Du kom från Måbra.',
    detail: 'Humör räcker om du är trött.',
  },
};

export const MABRA_MOOD_ONLY_TEXT: Record<MabraBridgeHub, string> = {
  panic_rsd: 'Måbra — panik/RSD (humör)',
  self_critical: 'Måbra — självkritik (humör)',
  find_self: 'Måbra — hitta mig (humör)',
};

export const MABRA_BRIDGE_LABELS = {
  saveMoodOnly: 'Spara bara humör',
  skipText: 'Spara utan text',
  continueOptional: 'Lägg till kort rad (valfritt)',
} as const;
