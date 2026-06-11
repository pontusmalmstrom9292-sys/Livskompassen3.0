import { describe, expect, it } from 'vitest';
import {
  classifyPasteText,
  parseQuickAddTitle,
  routeExContentToHamn,
  suggestColumnFromPaste,
} from './pasteClassifier';

describe('parseQuickAddTitle', () => {
  it('extracts trailing date', () => {
    expect(parseQuickAddTitle('Handla mat 2026-06-10')).toEqual({
      title: 'Handla mat',
      dueAt: '2026-06-10',
    });
  });
});

describe('routeExContentToHamn', () => {
  it('flags ex patterns', () => {
    expect(routeExContentToHamn('Meddelande från mamma om vårdnad')).toBe(true);
  });
});

describe('classifyPasteText', () => {
  it('suggests waiting for hämtning', () => {
    const r = classifyPasteText('Hämtning 15:30');
    expect(r.suggestedStatus).toBe('waiting');
    expect(r.routeToHamn).toBe(false);
  });

  it('routes ex to hamn flag', () => {
    const r = classifyPasteText('Konflikt med ex');
    expect(r.routeToHamn).toBe(true);
    expect(r.matchedRuleLabel).toBe('Brusfilter · ex/konflikt');
  });
});

describe('suggestColumnFromPaste', () => {
  it('returns todo when due date present', () => {
    expect(suggestColumnFromPaste('Rapport 2026-06-12')).toBe('todo');
  });
});
