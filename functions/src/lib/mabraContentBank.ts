/**
 * Mabra-CONTENT-BANK (server) — KEEP-rader för prod-coach parafras (U6).
 * Ingen Kunskap-RAG; REFLECTION/PLAY endast från denna lista.
 */

import type { CoachTone } from '../../../shared/adaptation/adaptationTypes';

export type MabraCoachHub = 'panic_rsd' | 'self_critical' | 'find_self';
export type MabraCoachVitHub = MabraCoachHub | 'who_am_i' | 'emotional_memory' | 'learn_together';
export type MabraCoachExercise = 'breathing' | 'grounding' | 'reframing';

export type MabraCoachBankEntry = {
  bankId: string;
  content_class: 'REFLECTION';
  source_tier: 'P1' | 'product_copy' | 'psychoeducation_general';
  status: 'KEEP';
  hub?: MabraCoachVitHub;
  lens: string;
  text_sv: string;
};

/** Post-övning coach-pool — MB-REF-01..06 + utvalda C-* för vit_chat-seed. */
export const MABRA_COACH_BANK: readonly MabraCoachBankEntry[] = [
  {
    bankId: 'MB-REF-01',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'act',
    text_sv:
      'Vilket värde är lättast att bära idag — inte det svåraste, bara det som finns nära?',
  },
  {
    bankId: 'MB-REF-02',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'act',
    text_sv:
      'En handling under fem minuter som stämmer med ett värde du redan valt — vad skulle den vara?',
  },
  {
    bankId: 'MB-REF-03',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'rsd',
    text_sv:
      'Om kroppen fortfarande reagerar på en upplevelse av "nej" — vilken behovssignal kan den bära, utan att du måste agera?',
  },
  {
    bankId: 'MB-REF-04',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'rsd',
    text_sv:
      'Tre neutrala fakta om din upplevelse just nu — inga domar om dig eller någon annan.',
  },
  {
    bankId: 'MB-REF-05',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'find_self',
    lens: 'vagus',
    text_sv: 'Vad är det minsta som räknas som "nog" idag — ett andetag, en paus, en rad?',
  },
  {
    bankId: 'MB-REF-06',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'find_self',
    lens: 'vagus',
    text_sv:
      'Efter att pulsen legat högt — var i kroppen känns det lugnast just nu, även lite?',
  },
  {
    bankId: 'MB-REF-ACT-01',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'act',
    text_sv: 'Ett värde som är viktigt idag — ett ord.',
  },
  {
    bankId: 'C-rsd-03',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'rsd',
    text_sv: 'En mening till dig: "Det här är en reaktion, inte hela jag."',
  },
  {
    bankId: 'MB-REF-rsd-04',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'rsd_copy',
    text_sv:
      'När något går fel i appen: det är ett tekniskt avbrott — inte ett meddelande om dig som person.',
  },
  {
    bankId: 'C-kbt-03',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    hub: 'self_critical',
    lens: 'kbt',
    text_sv: 'En mildare mening en trygg vän kunde säga — du behöver inte tro den fullt.',
  },
  {
    bankId: 'C-goal-01',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'paralys',
    text_sv: 'Ett litet mål denna vecka — inte prestation, max en mening.',
  },
  {
    bankId: 'C-goal-02',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'paralys',
    text_sv: 'Vad skulle "tillräckligt bra" se ut idag?',
  },
  {
    bankId: 'MB-REF-JOY-01',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'teman',
    text_sv: 'Ett intresse eller tema som känns mitt — inte någons förväntan. Ett ord räcker.',
  },
  {
    bankId: 'MB-REF-JOY-02',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'gladje',
    text_sv: 'Sim, klättra, vila, eller något helt annat — vad känns lätt att tänka på idag, utan att boka?',
  },
  {
    bankId: 'MB-REF-JOY-03',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'gladje',
    text_sv: 'När gjorde jag senast något bara för att det var skönt — inte för att bli bra på det?',
  },
  {
    bankId: 'MB-REF-JOY-04',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'teman',
    text_sv: 'Ett lugn som inte behöver att någon annan ser det — var eller hur, ungefär?',
  },
  {
    bankId: 'MB-REF-JOY-05',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'teman',
    text_sv: 'Vilken hobby eller aktivitet har jag pausat — och vad skulle minsta steget tillbaka vara?',
  },
  {
    bankId: 'MB-REF-JOY-06',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'gladje',
    text_sv: 'Vad är meningsfullt för mig just nu — inte vad jag borde tycka om?',
  },
  {
    bankId: 'MB-REF-MIRROR-01',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'spegling',
    text_sv: 'Vilken del av min egen upplevelse just nu är jag säker på — utan att behöva förklara den för någon?',
  },
  {
    bankId: 'MB-REF-MIRROR-02',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'spegling',
    text_sv: 'Ett minne eller en egenskap som jag vet är sann, oavsett vad som händer — vad är det?',
  },
  {
    bankId: 'MB-REF-MIRROR-03',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'emotional_memory',
    lens: 'spegling',
    text_sv: 'När kände jag mig senast trygg i ett eget beslut — ett litet vardagsbeslut räcker?',
  },
  {
    bankId: 'MB-REF-MIRROR-04',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'find_self',
    lens: 'spegling',
    text_sv: 'Vilken känsla bär jag på som är fullt logisk och begriplig utifrån min situation?',
  },
  {
    bankId: 'MB-REF-GEN-01',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'allmant',
    text_sv: 'Vad är något jag gör idag som mitt yngre jag skulle tycka om?',
  },
  {
    bankId: 'MB-REF-GEN-02',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'allmant',
    text_sv: 'Om jag fick ge mig själv ett frikort från en förväntning idag — vilken skulle det vara?',
  },
  {
    bankId: 'C-joy-01',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'gladje',
    text_sv: 'Vad tycker jag är kul, lugnt eller meningsfullt just nu?',
  },
  {
    bankId: 'C-joy-02',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    hub: 'who_am_i',
    lens: 'gladje',
    text_sv: 'En aktivitet utan krav — vad lockar idag?',
  },
  {
    bankId: 'MB-REF-GAD-07',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'oro_tid',
    text_sv:
      'Om oron dyker upp nu — kan du skriva en rad och spara den till din oro-tid, i stället för att lösa allt direkt?',
  },
  {
    bankId: 'MB-REF-GAD-08',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'oro_tree',
    text_sv:
      'Den här oron — kan du göra något praktiskt om den just nu, eller är den hypotetisk och bättre sparad till din oro-tid?',
  },
  {
    bankId: 'MB-REF-ADHD-05',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'find_self',
    lens: 'body_double',
    text_sv:
      'Vilken uppgift skjuter du upp mest — och vem eller vad skulle kunna sitta bredvid dig (utan att prata) i fem minuter?',
  },
  {
    bankId: 'MB-REF-ADHD-06',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'rsd_paus',
    text_sv:
      'När kroppen reagerar starkt på kritik eller tystnad — vad skulle hända om du pausade 60 sekunder innan du svarar eller agerar?',
  },
  {
    bankId: 'MB-REF-ADHD-07',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'rsd_tolkning',
    text_sv:
      'En neutral reaktion (t.ex. kort svar) — är det säkert avvisning, eller finns andra förklaringar du inte ser än?',
  },
  {
    bankId: 'MB-REF-REST-01',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'aterhamtning',
    text_sv:
      'Ett andetag innan du svarar myndighet eller skola — vad är ett sakligt nästa steg, inte hela lösningen?',
  },
  {
    bankId: 'MB-REF-REST-02',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'find_self',
    lens: 'aterhamtning',
    text_sv:
      'Kroppen har burit mycket länge. Vad skulle vara den minsta återhämtande handlingen de närmaste tio minuterna?',
  },
  {
    bankId: 'MB-REF-REST-03',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    hub: 'panic_rsd',
    lens: 'aterhamtning',
    text_sv:
      'Hypervigilans är en normal reaktion på långvarig stress — inte ett personlighetsfel. Vad signalerar kroppen just nu?',
  },
] as const;

const BANK_BY_ID = new Map(MABRA_COACH_BANK.map((row) => [row.bankId, row]));

/** Hub × övning → bankId (deterministisk, ingen LLM). */
const COACH_BANK_MATRIX: Record<MabraCoachHub, Record<MabraCoachExercise, string>> = {
  panic_rsd: {
    breathing: 'MB-REF-03',
    grounding: 'MB-REF-04',
    reframing: 'MB-REF-04',
  },
  self_critical: {
    breathing: 'MB-REF-01',
    grounding: 'MB-REF-02',
    reframing: 'C-kbt-03',
  },
  find_self: {
    breathing: 'MB-REF-05',
    grounding: 'MB-REF-06',
    reframing: 'MB-REF-05',
  },
};

export function getMabraCoachBankEntry(bankId: string): MabraCoachBankEntry | undefined {
  return BANK_BY_ID.get(bankId);
}

export function resolveCoachBankId(
  hubSymptom: MabraCoachHub,
  exerciseType: MabraCoachExercise,
  requestedBankId?: string,
): string {
  if (requestedBankId) {
    const entry = getMabraCoachBankEntry(requestedBankId);
    if (!entry) {
      throw new Error(`Okänd bankId: ${requestedBankId}`);
    }
    return entry.bankId;
  }
  return COACH_BANK_MATRIX[hubSymptom][exerciseType];
}

/** Matcha seedPrompt mot banktext (vit_chat). */
export function resolveVitChatBankId(seedPrompt?: string, requestedBankId?: string): string | undefined {
  if (requestedBankId) {
    const entry = getMabraCoachBankEntry(requestedBankId);
    if (!entry) {
      throw new Error(`Okänd bankId: ${requestedBankId}`);
    }
    return entry.bankId;
  }
  const trimmed = seedPrompt?.trim();
  if (!trimmed) return undefined;
  const exact = MABRA_COACH_BANK.find((row) => row.text_sv.trim() === trimmed);
  if (exact) return exact.bankId;
  const partial = MABRA_COACH_BANK.find(
    (row) => trimmed.includes(row.text_sv.slice(0, 24)) || row.text_sv.includes(trimmed.slice(0, 24)),
  );
  return partial?.bankId;
}

const EXERCISE_ACK: Record<MabraCoachExercise, string> = {
  breathing: 'Andningen är gjord.',
  grounding: 'Groundingen är gjord.',
  reframing: 'Reframing-övningen är gjord.',
};

const HUB_ACK: Record<MabraCoachHub, string> = {
  panic_rsd: 'Kroppen fick en paus — det räcker som steg.',
  self_critical: 'Du gav dig ett ögonblick utan att prestera.',
  find_self: 'Du är här nu — det är ett steg i sig.',
};

const CLOSING_STANDARD = 'Inget mer krävs av dig just nu.';
const CLOSING_MINIMAL = 'Klart.';

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]?/);
  const sentence = match?.[0]?.trim() ?? text.trim();
  return sentence.endsWith('.') || sentence.endsWith('!') || sentence.endsWith('?')
    ? sentence
    : `${sentence}.`;
}

function buildAck(
  hubSymptom?: MabraCoachHub,
  exerciseType?: MabraCoachExercise,
  coachTone: CoachTone = 'standard',
): string {
  if (coachTone === 'minimal') {
    if (exerciseType) return EXERCISE_ACK[exerciseType];
    return 'Övningen är gjord.';
  }
  if (hubSymptom && exerciseType) {
    return `${EXERCISE_ACK[exerciseType]} ${HUB_ACK[hubSymptom]}`;
  }
  return 'Övningen är gjord.';
}

const GOAL_ASSIST_BANK_IDS = ['C-goal-01', 'C-goal-02'] as const;

export function resolveGoalAssistBankId(
  draftGoal?: string,
  requestedBankId?: string,
): string {
  if (requestedBankId) {
    const entry = getMabraCoachBankEntry(requestedBankId);
    if (!entry || !entry.bankId.startsWith('C-goal-')) {
      throw new Error(`Okänd bankId: ${requestedBankId}`);
    }
    return entry.bankId;
  }
  const seed = draftGoal?.trim().length ?? 0;
  return GOAL_ASSIST_BANK_IDS[seed % GOAL_ASSIST_BANK_IDS.length];
}

/** Deterministisk målcoach — ingen LLM, inga journal/valv-fält. */
export function parafraseGoalAssist(
  entry: MabraCoachBankEntry,
  draftGoal?: string,
): string {
  const trimmed = draftGoal?.trim();
  const prefix = trimmed
    ? `Du formulerade: «${trimmed.slice(0, 120)}». `
    : '';
  return `${prefix}${entry.text_sv} Bekräfta bara om det känns rätt — inget mål sparas automatiskt.`;
}

export const MB_REF_RSD_04_BANK_ID = 'MB-REF-rsd-04';

/** Våg 28 — RSD-säker produktcopy vid tekniska avbrott (ingen LLM). */
export function parafraseRsdErrorFromBank(entry: MabraCoachBankEntry): string {
  return entry.text_sv;
}

export function resolveRsdErrorBankId(requestedBankId?: string): string {
  if (requestedBankId) {
    const entry = getMabraCoachBankEntry(requestedBankId);
    if (!entry || entry.bankId !== MB_REF_RSD_04_BANK_ID) {
      throw new Error(`Okänd bankId: ${requestedBankId}`);
    }
    return entry.bankId;
  }
  return MB_REF_RSD_04_BANK_ID;
}

/** P4 — validera bankId för deterministisk bank_parafras (ingen LLM). */
export function resolveBankParafrasBankId(bankId: string): string {
  const trimmed = bankId.trim();
  if (!trimmed) {
    throw new Error('bankId saknas');
  }
  const entry = getMabraCoachBankEntry(trimmed);
  if (!entry) {
    throw new Error(`Okänd bankId: ${trimmed}`);
  }
  return entry.bankId;
}

/** Deterministisk parafras utan LLM — endast banktext + övningskontext (U6/L3a). */
export function parafraseCoachFromBank(
  entry: MabraCoachBankEntry,
  hubSymptom?: MabraCoachHub,
  exerciseType?: MabraCoachExercise,
  coachTone: CoachTone = 'standard',
): string {
  const ack = buildAck(hubSymptom, exerciseType, coachTone);
  const closing = coachTone === 'minimal' ? CLOSING_MINIMAL : CLOSING_STANDARD;

  if (coachTone === 'minimal') {
    return `${ack} ${firstSentence(entry.text_sv)} ${closing}`;
  }

  if (coachTone === 'detailed') {
    const lensSuffix = entry.lens ? ` Perspektiv: ${entry.lens}.` : '';
    return `${ack} ${entry.text_sv}${lensSuffix} ${closing}`;
  }

  return `${ack} ${entry.text_sv} ${closing}`;
}
