import { describe, expect, it } from 'vitest';
import { buildEdgeWormTags } from '@/modules/shared/utils/intelligenceConsumer';
import { mapEdgeSiloToRouting, type EdgeIntelligenceDetail } from '@/modules/shared/utils/nativeMindAura';

describe('Edge AI → WORM consumer (client)', () => {
  it('maps silo to routing hint without forcing bevis', () => {
    expect(mapEdgeSiloToRouting('tanke')).toBe('dagbok');
    expect(mapEdgeSiloToRouting('handling')).toBe('planning');
    expect(mapEdgeSiloToRouting('idé')).toBe('kunskap');
  });

  it('builds non-PII worm tags', () => {
    const detail: EdgeIntelligenceDetail = {
      silo: 'handling',
      lang: 'sv',
      entities: ['DATE_TIME:2026-07-23'],
      stress: true,
      text: 'måste boka idag',
      receivedAt: Date.now(),
    };
    const tags = buildEdgeWormTags(detail);
    expect(tags).toContain('edge:silo:handling');
    expect(tags).toContain('edge:stress');
    expect(tags).toContain('edge:schedule');
    expect(tags.some((t) => t.includes('måste'))).toBe(false);
  });
});
