import type { PlanningEmailMatchType, PlanningEmailRoute } from '../types/planningEmailRule';

export const MATCH_TYPE_LABELS: Record<PlanningEmailMatchType, string> = {
  from_email: 'Avsändare (e-post)',
  from_domain: 'Domän i avsändare',
  subject_contains: 'Ämnesrad innehåller',
  label: 'Gmail-etikett',
};

export const ROUTE_LABELS: Record<PlanningEmailRoute, string> = {
  planering: 'Planering (Handling)',
  hamn: 'Hamn (BIFF — ex/konflikt)',
  inbox_queue: 'Granskningskö',
  vault: 'Reality Vault (bevis)',
  kunskap: 'Kunskapsvalvet',
  ignore: 'Ignorera',
};

/** Föreslagna mallar — användaren väljer vilka som läggs till (ingen auto-ex-adress). */
export const SUGGESTED_EMAIL_RULE_TEMPLATES = [
  {
    label: 'Skola / förskola',
    matchType: 'from_domain' as const,
    pattern: 'skola',
    route: 'planering' as const,
    priority: 20,
  },
  {
    label: 'Advokat / jurist',
    matchType: 'subject_contains' as const,
    pattern: 'advokat',
    route: 'planering' as const,
    priority: 25,
  },
  {
    label: 'Myndighet (Försäkringskassa m.fl.)',
    matchType: 'subject_contains' as const,
    pattern: 'försäkringskassa',
    route: 'planering' as const,
    priority: 30,
  },
];
