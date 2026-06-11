/**
 * Mabra-CONTENT-BANK (server) — KEEP-rader för prod-coach parafras (U6).
 * Ingen Kunskap-RAG; REFLECTION/PLAY endast från denna lista.
 */

export type MabraCoachHub = 'panic_rsd' | 'self_critical' | 'find_self';
export type MabraCoachExercise = 'breathing' | 'grounding' | 'reframing';

export type MabraCoachBankEntry = {
  bankId: string;
  content_class: 'REFLECTION';
  source_tier: 'P1' | 'product_copy' | 'psychoeducation_general';
  status: 'KEEP';
  hub?: MabraCoachHub | 'who_am_i';
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
    bankId: 'C-kbt-03',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    hub: 'self_critical',
    lens: 'kbt',
    text_sv: 'En mildare mening en trygg vän kunde säga — du behöver inte tro den fullt.',
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

/** Deterministisk parafras utan LLM — endast banktext + övningskontext. */
export function parafraseCoachFromBank(
  entry: MabraCoachBankEntry,
  hubSymptom?: MabraCoachHub,
  exerciseType?: MabraCoachExercise,
): string {
  const ack =
    hubSymptom && exerciseType
      ? `${EXERCISE_ACK[exerciseType]} ${HUB_ACK[hubSymptom]}`
      : 'Övningen är gjord.';
  return `${ack} ${entry.text_sv} Inget mer krävs av dig just nu.`;
}
