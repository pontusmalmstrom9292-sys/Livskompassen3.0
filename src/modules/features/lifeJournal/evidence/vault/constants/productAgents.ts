/** Produktroller (AGENTS.md) — UI-register för Orkester-fliken; routing sker i functions. */
export const PRODUCT_AGENTS = [
  {
    id: 'agent_sannings_analytikern',
    name: 'Sannings-Analytikern',
    role: 'Bevis & VIVIR',
    focus: 'Valv, strikt JSON',
  },
  {
    id: 'agent_monster_arkivarien',
    name: 'Mönster-Arkivarien',
    role: 'Frekvens & makro',
    focus: 'SMS-trådar, långsiktiga mönster',
  },
  {
    id: 'agent_grans_arkitekten',
    name: 'Gräns-Arkitekten',
    role: 'BIFF + DCAP',
    focus: 'Hamn, Grey Rock',
  },
  {
    id: 'agent_biff_skolden',
    name: 'BIFF-Skölden',
    role: 'Neutralt svar',
    focus: 'Kort, fast kommunikation',
  },
  {
    id: 'agent_brusfiltret',
    name: 'Brusfiltret',
    role: 'Clean Input',
    focus: 'Fakta ur manipulation',
  },
  {
    id: 'agent_livs_arkivarien',
    name: 'Livs-Arkivarien',
    role: 'Minne & RAG',
    focus: 'Kunskapsvalvet',
  },
  {
    id: 'agent_paralys_brytaren',
    name: 'Paralys-Brytaren',
    role: 'Ett mikrosteg',
    focus: 'Kompasser',
  },
  {
    id: 'agent_rsd_kylaren',
    name: 'RSD-Kylaren',
    role: 'Alternativ',
    focus: 'Kalla triggers',
  },
] as const;
