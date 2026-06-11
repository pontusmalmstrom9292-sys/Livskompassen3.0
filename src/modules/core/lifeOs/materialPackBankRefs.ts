/**
 * MaterialPack bankRef-picker (Våg C) — READ-only KEEP-rader från Mabra-bank (U6).
 * bankRef är dokumentation — ingen auto-RAG.
 */

import { DAGLIG_MIX_CARDS } from '@/modules/features/dailyLife/wellbeing/mabra/content/dagligMixCatalog';
import { MABRA_EXTENDED_PLAYS } from '@/modules/features/dailyLife/wellbeing/mabra/content/mabraExtendedPlays';
import { MABRA_REFLECTION_CARDS } from '@/modules/features/dailyLife/wellbeing/mabra/content/mabraReflectionCards';

export type MaterialPackBankRefOption = {
  value: string;
  label: string;
  group: 'panel' | 'reflection' | 'play';
};

const PANEL_REFS: MaterialPackBankRefOption[] = [
  {
    value: 'panel:barnfokus',
    label: 'Panel · Barnfokus',
    group: 'panel',
  },
];

/** G2–G7 i Mabra-bank → kort PLAY:Gn (matchar PACK_ROWS). */
function playRefValue(bankId: string): string {
  const short = /^G(\d)-/.exec(bankId);
  if (short) return `PLAY:G${short[1]}`;
  return `PLAY:${bankId}`;
}

function buildPlayOptions(): MaterialPackBankRefOption[] {
  return MABRA_EXTENDED_PLAYS.map((play) => ({
    value: playRefValue(play.bankId),
    label: `Lek · ${play.title_sv}`,
    group: 'play' as const,
  }));
}

function buildReflectionOptions(): MaterialPackBankRefOption[] {
  const fromCards = MABRA_REFLECTION_CARDS.map((card) => ({
    value: `REFLECTION:${card.bankId}`,
    label: `Reflektion · ${card.bankId}`,
    group: 'reflection' as const,
  }));
  const fromMix = DAGLIG_MIX_CARDS.map((card) => ({
    value: `REFLECTION:${card.bankId}`,
    label: `Daglig mix · ${card.bankId}`,
    group: 'reflection' as const,
  }));
  const seen = new Set<string>();
  return [...fromCards, ...fromMix].filter((row) => {
    if (seen.has(row.value)) return false;
    seen.add(row.value);
    return true;
  });
}

/** Kuraterad lista för editor-dropdown — endast godkända bank-ID:n. */
export const MATERIAL_PACK_BANK_REFS: readonly MaterialPackBankRefOption[] = [
  ...PANEL_REFS,
  ...buildReflectionOptions(),
  ...buildPlayOptions(),
];

const VALID_REFS = new Set(MATERIAL_PACK_BANK_REFS.map((r) => r.value));

export function isValidMaterialPackBankRef(ref: string | undefined): boolean {
  if (!ref) return true;
  return VALID_REFS.has(ref);
}

export function labelForMaterialPackBankRef(ref: string | undefined): string | null {
  if (!ref) return null;
  return MATERIAL_PACK_BANK_REFS.find((r) => r.value === ref)?.label ?? null;
}
