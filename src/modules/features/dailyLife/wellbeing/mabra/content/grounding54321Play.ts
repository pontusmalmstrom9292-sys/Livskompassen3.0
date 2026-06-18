/** Våg 28 — prod-wire för 5-4-3-2-1 grounding (MåBra PLAY). Kanon: Mabra-CONTENT-BANK MB-PLAY-54321 */
export const MB_PLAY_54321_BANK_ID = 'MB-PLAY-54321';

export type GroundingStep = {
  count: number;
  sense: string;
  prompt: string;
  detail: string;
};

/** Se → höra → känna → lukta → smaka (bank copy, max ~2 min). */
export const MB_PLAY_54321_STEPS: readonly GroundingStep[] = [
  {
    count: 5,
    sense: 'Se',
    prompt: 'Hitta fem saker du kan se runt dig.',
    detail: 'Färger, former, ljus — vad som helst.',
  },
  {
    count: 4,
    sense: 'Höra',
    prompt: 'Lyssna efter fyra ljud.',
    detail: 'Nära eller långt borta. Inget behöver namnges högt.',
  },
  {
    count: 3,
    sense: 'Känna',
    prompt: 'Märk tre saker kroppen känner.',
    detail: 'Fötter mot golvet, kläder, temperaturen.',
  },
  {
    count: 2,
    sense: 'Lukta',
    prompt: 'Finns två dofter du kan märka?',
    detail: 'Om inget kommer — det är okej. Hoppa vidare.',
  },
  {
    count: 1,
    sense: 'Smaka',
    prompt: 'En smak — eller bara munnen som den är.',
    detail: 'Du är här. Det räcker.',
  },
] as const;
