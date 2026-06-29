import { describe, expect, it } from 'vitest';
import { formatAgentRoutingLabel } from './routingBadgeText';

describe('formatAgentRoutingLabel', () => {
  it('returnerar null när inga namn', () => {
    expect(formatAgentRoutingLabel({})).toBeNull();
    expect(formatAgentRoutingLabel({ productAgentName: '  ' })).toBeNull();
  });

  it('visar produkt + executor', () => {
    expect(
      formatAgentRoutingLabel({
        productAgentName: 'Brusfiltret',
        executorName: 'Gräns-Arkitekten',
      }),
    ).toBe('Dirigerad av Brusfiltret via Gräns-Arkitekten');
  });

  it('visar legacy agentName', () => {
    expect(formatAgentRoutingLabel({ agentName: 'Gräns-Arkitekten' })).toBe(
      'Dirigerad av Gräns-Arkitekten',
    );
  });

  it('visar legacy agentName med executor', () => {
    expect(
      formatAgentRoutingLabel({
        agentName: 'Hamn',
        executorName: 'Gräns-Arkitekten',
      }),
    ).toBe('Dirigerad av Hamn via Gräns-Arkitekten');
  });

  it('hoppar över via när produkt och executor är samma', () => {
    expect(
      formatAgentRoutingLabel({
        productAgentName: 'Gräns-Arkitekten',
        executorName: 'Gräns-Arkitekten',
      }),
    ).toBe('Dirigerad av Gräns-Arkitekten');
  });
});
