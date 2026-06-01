/**
 * Barnporten-Orkester — barnsäkra agenter (UI-register).
 * Routing/prompts: functions/src/agents/ (delad sharedRules, barn-specifika guards).
 * Får INTE blanda in BIFF, ex-konflikt eller Kunskap-RAG.
 */
export const BARNPORTEN_AGENTS = [
  {
    id: 'agent_trygg_kompisen',
    name: 'Trygg-Kompisen',
    role: 'Validering',
    focus: 'Det är okej att känna så',
  },
  {
    id: 'agent_speglingen_barn',
    name: 'Speglingen',
    role: 'Spegla',
    focus: 'Du sa att… — vill du säga mer?',
  },
  {
    id: 'agent_steg_kompisen',
    name: 'Steg-Kompisen',
    role: 'Ett steg',
    focus: 'Bara en liten sak nu',
  },
  {
    id: 'agent_rost_vannen',
    name: 'Röst-Vännen',
    role: 'Prata av',
    focus: 'Spela in, lyssna, spara när du vill',
  },
] as const;

export type BarnportenAgentId = (typeof BARNPORTEN_AGENTS)[number]['id'];
