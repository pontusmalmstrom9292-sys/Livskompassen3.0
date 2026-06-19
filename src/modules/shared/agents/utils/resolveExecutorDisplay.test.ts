import { describe, expect, it } from 'vitest';
import { resolveExecutorId } from './resolveExecutorDisplay';

/** Speglar functions/src/agents/cards/index.ts resolveExecutorId */
describe('resolveExecutorId', () => {
  it('dirigerar BIFF/Brusfilter/Sannings till Gräns-Arkitekten', () => {
    expect(resolveExecutorId('agent_biff_skolden')).toBe('agent_grans_arkitekten');
    expect(resolveExecutorId('agent_brusfiltret')).toBe('agent_grans_arkitekten');
    expect(resolveExecutorId('agent_sannings_analytikern')).toBe('agent_grans_arkitekten');
  });

  it('dirigerar Livs-Arkivarien-produkter till agent_livs_arkivarien', () => {
    expect(resolveExecutorId('agent_monster_arkivarien')).toBe('agent_livs_arkivarien');
    expect(resolveExecutorId('agent_paralys_brytaren')).toBe('agent_livs_arkivarien');
    expect(resolveExecutorId('agent_uppgifts_krossaren')).toBe('agent_livs_arkivarien');
    expect(resolveExecutorId('agent_rsd_kylaren')).toBe('agent_livs_arkivarien');
    expect(resolveExecutorId('agent_speglings_coachen')).toBe('agent_livs_arkivarien');
  });

  it('returnerar okänd id oförändrad', () => {
    expect(resolveExecutorId('agent_grans_arkitekten')).toBe('agent_grans_arkitekten');
    expect(resolveExecutorId('custom_agent')).toBe('custom_agent');
  });
});
