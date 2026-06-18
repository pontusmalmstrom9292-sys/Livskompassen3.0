import type { MabraDurationMinutes, MabraExerciseType, MabraSymptomHub } from './types';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { MB_REF_RSD_04_TEXT_SV } from './content/rsdErrorCopy';

export const MABRA_DURATION_OPTIONS: MabraDurationMinutes[] = [1, 3, 5];

export const DEFAULT_MABRA_DURATION: MabraDurationMinutes = 3;

export const SYMPTOM_HUB_OPTIONS: {
  id: MabraSymptomHub;
  label: string;
  hint: string;
}[] = [
  {
    id: 'panic_rsd',
    label: 'Panik / RSD',
    hint: 'Nervsystemet går på högvarv',
  },
  {
    id: 'self_critical',
    label: 'Självkritik',
    hint: 'Tungt självprat — ett steg i taget, bara för dig',
  },
  {
    id: 'find_self',
    label: 'Hitta mig',
    hint: 'Här och nu, utan krav',
  },
];

export const HUB_EXERCISE_TYPE: Record<MabraSymptomHub, MabraExerciseType> = {
  panic_rsd: 'breathing',
  self_critical: 'reframing',
  find_self: 'grounding',
};

export function exerciseTypeForHub(hub: MabraSymptomHub): MabraExerciseType {
  return HUB_EXERCISE_TYPE[hub];
}

export function hubUsesDurationPicker(hub: MabraSymptomHub): boolean {
  return hub === 'panic_rsd';
}

export const AKUT_LANDING_COPY = {
  title: 'Det här är en reaktion i kroppen — inte ett misslyckande.',
  body: 'Nervsystemet kör på högvarv. Det är biologiskt, inte karaktär. Du behöver inte förklara eller fixa något nu.',
  hint: 'En minut räcker om det känns tungt att börja.',
  continueLabel: 'Gå vidare',
  exitLabel: 'Avsluta nu',
} as const;

export const PANIC_BREATH_PHASE_LABEL = {
  inhale: 'Andas in, 4',
  hold: 'Stilla, 7',
  exhale: 'Ut långsamt, 8',
} as const;

export const DURATION_PICKER_COPY: Record<
  Extract<MabraSymptomHub, 'panic_rsd'>,
  { question: string; startLabel: string; hint?: string }
> = {
  panic_rsd: {
    question: 'Hur länge vill du andas?',
    startLabel: 'Starta andning',
    hint: '1 min om start känns tungt. 3 min ger ofta mer lugn.',
  },
};

export const BREATHING_VARIANT_COPY: Record<
  Extract<MabraSymptomHub, 'panic_rsd' | 'self_critical'>,
  { label: string; subtitle: string }
> = {
  panic_rsd: {
    label: '4–7–8',
    subtitle: 'Kroppen får sakta ner. Följ cirkeln — inget att prestera.',
  },
  self_critical: {
    label: '4–7–8',
    subtitle: '4–7–8, valfritt. Hoppa över om du redan känner dig lugn.',
  },
};

export const REFRAMING_STEPS = [
  {
    stepKey: 'voice',
    label: 'Rösten',
    prompt: 'Vad säger den kritiska rösten just nu?',
    detail: 'Skriv en kort mening — eller bara ett ord. Inget behöver vara snyggt.',
    inputMode: 'text' as const,
  },
  {
    stepKey: 'body',
    label: 'Kroppen',
    prompt: 'Var märker du det i kroppen?',
    detail: 'Bröst, mage, hals, spänning — eller "vet inte". Det räcker.',
    inputMode: 'text_optional' as const,
  },
  {
    stepKey: 'reframe',
    label: 'Milt perspektiv',
    prompt: 'Om en trygg vän såg samma situation — vad kunde hen säga?',
    detail: 'En mildare mening, inte sanningen. Du behöver inte tro den fullt ut.',
    inputMode: 'text' as const,
  },
  {
    stepKey: 'anchor',
    label: 'Till dig',
    prompt: 'En mening du vill ha med dig nu.',
    detail: 'Till dig själv — inte till någon annan. Kort räcker.',
    inputMode: 'text' as const,
  },
] as const;

export const BREATHING_ADDON_COPY = {
  prompt: 'Vill du landa kroppen en minut?',
  detail: '4–7–8, valfritt. Hoppa över om du redan känner dig lugn.',
  startLabel: 'Andas 1 min',
  skipLabel: 'Hoppa över',
} as const;

export const COMPLETE_COPY: Record<
  MabraExerciseType,
  { title: string; subtitle: string }
> = {
  breathing: {
    title: 'Du har landat.',
    subtitle: 'Du tog ett steg för kroppen.',
  },
  grounding: {
    title: 'Du är här. Det räcker.',
    subtitle: 'Du tog hand om dig.',
  },
  reframing: {
    title: 'Du har landat.',
    subtitle: 'Du gav dig ett ögonblick — inget att prestera.',
  },
  daglig_mix: {
    title: 'Bra jobbat',
    subtitle: 'Dagens mix är klar — inga poäng, ingen missad dag.',
  },
};

export const HUB_COMPLETE_COPY: Record<
  MabraSymptomHub,
  { title: string; subtitle: string; dagbokLabel: string }
> = {
  panic_rsd: {
    title: 'Du har landat.',
    subtitle: 'Kroppen fick sakta ner. Inget att prestera.',
    dagbokLabel: 'Spara hur det känns nu',
  },
  self_critical: {
    title: 'Du har landat.',
    subtitle: 'Du gav dig ett ögonblick — inget att prestera.',
    dagbokLabel: 'Spara insikt till Dagbok',
  },
  find_self: {
    title: 'Du är här. Det räcker.',
    subtitle: 'Du tog hand om dig.',
    dagbokLabel: 'Spara en kort rad',
  },
};

export function mabraDagbokBridgeUrl(hub: MabraSymptomHub): string {
  const params = new URLSearchParams({
    from: 'mabra',
    hub,
    energy: 'low',
  });
  return `${NAV_PATHS.HJARTAT}?${params.toString()}`;
}

export const MIN_CORE_VALUES = 3;
export const MAX_CORE_VALUES = 5;

export const ACT_VALUES = [
  { id: 'narmhet', label: 'Närhet' },
  { id: 'omsorg', label: 'Omsorg' },
  { id: 'arlighet', label: 'Ärlighet' },
  { id: 'mod', label: 'Mod' },
  { id: 'medkansla', label: 'Medkänsla' },
  { id: 'lugn', label: 'Lugn' },
  { id: 'larande', label: 'Lärande' },
  { id: 'halsa', label: 'Hälsa' },
  { id: 'balans', label: 'Balans' },
  { id: 'frihet', label: 'Frihet' },
  { id: 'ansvar', label: 'Ansvar' },
  { id: 'lekfullhet', label: 'Lekfullhet' },
] as const;

export type ActValueId = (typeof ACT_VALUES)[number]['id'];

const ACT_VALUE_ID_SET = new Set<string>(ACT_VALUES.map((v) => v.id));
const ACT_LABEL_TO_ID = Object.fromEntries(ACT_VALUES.map((v) => [v.label, v.id]));

/** Map stored labels/ids → canonical ids (max 5). Fixes legacy/corrupt progress docs. */
export function normalizeCoreValues(raw: string[]): ActValueId[] {
  const ids: ActValueId[] = [];
  for (const entry of raw) {
    if (ACT_VALUE_ID_SET.has(entry)) {
      ids.push(entry as ActValueId);
    } else if (entry in ACT_LABEL_TO_ID) {
      ids.push(ACT_LABEL_TO_ID[entry] as ActValueId);
    }
    if (ids.length >= MAX_CORE_VALUES) break;
  }
  return [...new Set(ids)];
}

export const MABRA_COACH_COPY = {
  hint: 'Valfritt — ett kort svar efter övningen. Inriktat på dig, inte mot någon annan.',
  notePlaceholder: 'Valfri rad — hur det känns nu (inte om ex eller konflikt).',
  noteHint: 'Max 500 tecken. Konflikt eller gaslighting → Speglar.',
  buttonLabel: 'Få ett kort svar',
  loading: 'Ett ögonblick…',
  responseLabel: 'Måbra-coach',
  speglarLinkLabel: 'Öppna Speglar',
  offlineFallback:
    'Övningen är gjord. Du behöver inte prestera mer just nu — det du tog hand om räcker som steg.',
  offlineHint: MB_REF_RSD_04_TEXT_SV,
} as const;

export const MABRA_SPEGLAR_REDIRECT_MESSAGE =
  'Det här passar bättre i Speglar — validering och spegling kring konflikt och gaslighting. Måbra fokuserar på inåtvänd återhämtning efter övningen.';

export const MABRA_SPEGLAR_GUARD_COPY = {
  ariaLabel: 'Förslag om Speglar',
  message: 'Det här passar bättre i Speglar — vill du öppna?',
  stayLabel: 'Stanna här',
  goLabel: 'Ja, öppna Speglar',
} as const;

export const LOW_ENERGY_COPY = {
  toggleLabel: 'Jag orkar lite idag',
  breathTitle: 'Andning 1 min',
  breathLead: '4-7-8 — låg tröskel',
  reflectionTitle: 'Ett frågekort',
  reflectionLead: 'Ett kort idag — inget fel svar',
} as const;

export const COMPLETE_LANDING_STRIP = {
  dagbok: 'Spara insikt till Dagbok',
  reflection: 'Ett frågekort',
  evening: 'Gå till kväll',
} as const;

export const VALUES_COMPASS_COPY = {
  title: 'Vad är viktigt för dig?',
  detail: 'Välj 3–5 ord som beskriver vad du vill stå för — inte prestation.',
  saveLabel: 'Spara mina värderingar',
  hubLinkLabel: 'Mina värderingar (ACT)',
  savedHint: 'Sparat. Du kan ändra när som helst.',
} as const;

/** @deprecated import MB_PLAY_54321_STEPS — single bank source */
export { MB_PLAY_54321_STEPS as GROUNDING_STEPS } from './content/grounding54321Play';

export const BREATH_PHASE_SECONDS = {
  inhale: 4,
  hold: 7,
  exhale: 8,
} as const;
