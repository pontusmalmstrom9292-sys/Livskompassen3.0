import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';
import type { ProductAgentUiMeta } from '../types/agentRegistry';

/** UI-etiketter per produktroll — kompletterar backend AgentCard.description. */
export const PRODUCT_AGENT_UI_META: Record<string, ProductAgentUiMeta> = {
  agent_sannings_analytikern: {
    role: 'Bevis & VIVIR',
    focus: 'Valv Sök, strikt JSON',
    zoneLabel: 'Valv · Sök',
  },
  agent_monster_arkivarien: {
    role: 'Frekvens & makro',
    focus: 'SMS-trådar, långsiktiga mönster',
    zoneLabel: 'Valv · Mönster',
  },
  agent_grans_arkitekten: {
    role: 'BIFF + DCAP',
    focus: 'Hamn, Grey Rock',
    zoneLabel: 'Runtime-executor',
  },
  agent_biff_skolden: {
    role: 'Neutralt svar',
    focus: 'Kort, fast kommunikation',
    zoneLabel: 'Orkester · Brusfilter',
  },
  agent_brusfiltret: {
    role: 'Clean Input',
    focus: 'Fakta ur manipulation',
    zoneLabel: 'Orkester · Brusfilter',
  },
  agent_livs_arkivarien: {
    role: 'Minne & sök',
    focus: 'Kunskapsvalvet',
    zoneLabel: 'Runtime-executor',
  },
  agent_paralys_brytaren: {
    role: 'Ett mikrosteg',
    focus: 'Kompasser',
    zoneLabel: 'Vardagen · Kompasser',
  },
  agent_rsd_kylaren: {
    role: 'Alternativ',
    focus: 'Kalla triggers',
    zoneLabel: 'Vardagen · MåBra',
  },
  agent_uppgifts_krossaren: {
    role: 'Atomisering',
    focus: 'Uppgifter ≤30 sek',
    zoneLabel: 'Vardagen · Planering',
  },
  agent_speglings_coachen: {
    role: 'Validering',
    focus: 'Speglar, Zero Footprint',
    zoneLabel: 'Hjärtat · Speglar',
  },
};

export function getProductAgentUiMeta(agentId: string): ProductAgentUiMeta | undefined {
  const meta = PRODUCT_AGENT_UI_META[agentId];
  if (!meta) return undefined;
  if (agentId === 'agent_paralys_brytaren') {
    return { ...meta, role: MICRO_STEP_PANEL_TITLE };
  }
  return meta;
}
