import type { LucideIcon } from 'lucide-react';
import { Check, Moon } from 'lucide-react';
import type { CompassOptionTone } from './compassOptionMeta';

export type EveningCheckInSnapshot = {
  optionSelected?: string;
  taskNote?: string;
} | null;

export type EveningFlowTabPresentation = {
  label: string;
  ariaLabel: string;
  icon: LucideIcon;
  tone: CompassOptionTone | null;
};

const KASAM_TAB_LABELS: Record<string, string> = {
  comprehensible: 'Begriplighet',
  manageable: 'Hanterbarhet',
  meaningful: 'Meningsfullhet',
};

function weakestKasamLabel(taskNote?: string): string | null {
  if (!taskNote) return null;
  try {
    const parsed = JSON.parse(taskNote) as { kasam?: Record<string, string> };
    const k = parsed.kasam;
    if (!k) return null;
    const order = ['meaningful', 'manageable', 'comprehensible'] as const;
    const weak = order.find((key) => !(k[key]?.trim().length >= 2));
    return weak ? (KASAM_TAB_LABELS[weak] ?? null) : null;
  } catch {
    return null;
  }
}

/** Flik för kvällskompass — neutral tills KASAM är sparad idag. */
export function getEveningFlowTabPresentation(
  checkIn: EveningCheckInSnapshot,
): EveningFlowTabPresentation {
  if (!checkIn || checkIn.optionSelected !== 'kasam') {
    return {
      label: 'Kväll',
      ariaLabel: 'Kvällskompass — KASAM',
      icon: Moon,
      tone: null,
    };
  }

  const focus = weakestKasamLabel(checkIn.taskNote);
  if (focus) {
    return {
      label: focus,
      ariaLabel: `Kvällskompass — ${focus}`,
      icon: Moon,
      tone: 'gold',
    };
  }

  return {
    label: 'Klar',
    ariaLabel: 'Kvällskompass — KASAM sparad',
    icon: Check,
    tone: 'gold',
  };
}
