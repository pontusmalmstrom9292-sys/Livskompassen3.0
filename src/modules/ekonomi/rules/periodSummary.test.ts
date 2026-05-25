import { describe, expect, it } from 'vitest';
import { computePeriodEconomySummary, filterLedgerInPeriod } from './periodSummary';

describe('periodSummary', () => {
  it('filtrerar ledger i period', () => {
    const rows = [
      { date: '2026-04-10', category: 'Mat', amountSek: 100, type: 'utgift' as const },
      { date: '2026-04-20', category: 'Mat', amountSek: 50, type: 'utgift' as const },
      { date: '2026-05-10', category: 'Mat', amountSek: 200, type: 'utgift' as const },
    ];
    const inPeriod = filterLedgerInPeriod(rows, '2026-04-16', '2026-05-15');
    expect(inPeriod).toHaveLength(2);
  });

  it('summerar period enligt I-lik logik', () => {
    const summary = computePeriodEconomySummary({
      period: { from: '2026-04-16', to: '2026-05-15', label: 'test' },
      monthlySalarySek: 36470,
      fixedBillsSumSek: 10000,
      ledgerRows: [
        { date: '2026-05-01', category: 'Rörliga', amountSek: 500, type: 'utgift' },
        { date: '2026-05-02', category: 'Swish', amountSek: 200, type: 'inkomst' },
      ],
    });
    expect(summary.ledgerExpensesSek).toBe(500);
    expect(summary.ledgerIncomeSek).toBe(200);
    expect(summary.variableExpensesSek).toBe(500);
    expect(summary.estimatedBalanceSek).toBe(36470 - 10000 - 500 + 200);
  });
});
