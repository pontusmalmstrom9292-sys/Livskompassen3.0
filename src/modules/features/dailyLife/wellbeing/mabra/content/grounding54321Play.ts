/** Våg 28.1 — prod-wire för 5-4-3-2-1 grounding (MåBra PLAY). */
export const MB_PLAY_54321_BANK_ID = 'MB-PLAY-54321';

export const MB_PLAY_54321_STEPS = [
  { count: 5, sense: 'Se', prompt: 'Hitta fem saker du kan se', detail: 'Form, färg eller skugga räknas.' },
  { count: 4, sense: 'Känna', prompt: 'Fyra saker du kan känna', detail: 'Kläder, stol, golv eller luft mot huden.' },
  { count: 3, sense: 'Höra', prompt: 'Tre ljud runt dig', detail: 'Nära eller långt borta — utan att döma.' },
  { count: 2, sense: 'Lukta', prompt: 'Två dofter', detail: 'Om svårt: minns en trygg doft.' },
  { count: 1, sense: 'Smaka', prompt: 'En smak', detail: 'I munnen nu, eller en klunk vatten.' },
] as const;
