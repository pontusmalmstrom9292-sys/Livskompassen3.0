import type { PlanningTaskStatus } from '../types';
import type { PlanningEmailRule } from '../types/planningEmailRule';

const EX_PATTERNS = [
  /\bmamma\b/i,
  /\bpappa\b/i,
  /\bex\b/i,
  /\bvårdnad\b/i,
  /\bkonflikt\b/i,
];

/** Todoist-liknande: titel först, valfritt datum i slutet (YYYY-MM-DD). */
export function parseQuickAddTitle(text: string): { title: string; dueAt?: string } {
  const trimmed = text.trim();
  const dateMatch = trimmed.match(/\s(\d{4}-\d{2}-\d{2})\s*$/);
  if (dateMatch) {
    return {
      title: trimmed.slice(0, dateMatch.index).trim() || trimmed,
      dueAt: dateMatch[1],
    };
  }
  return { title: trimmed.split('\n')[0]?.slice(0, 120) || trimmed };
}

/** Deterministisk — ex-brus ska till Hamn, inte planering. */
export function routeExContentToHamn(text: string): boolean {
  const lower = text.toLowerCase();
  return EX_PATTERNS.some((re) => re.test(lower));
}

export type PasteClassification = {
  title: string;
  summary: string;
  suggestedStatus: PlanningTaskStatus;
  dueAt?: string;
  routeToHamn: boolean;
  matchedRuleLabel?: string;
};

function ruleMatches(text: string, rule: PlanningEmailRule): boolean {
  if (!rule.enabled) return false;
  const lower = text.toLowerCase();
  const pattern = rule.pattern.toLowerCase();
  switch (rule.matchType) {
    case 'subject_contains':
    case 'label':
      return lower.includes(pattern);
    case 'from_domain':
      return lower.includes(`@${pattern}`) || lower.includes(pattern);
    case 'from_email':
      return lower.includes(pattern);
    default:
      return lower.includes(pattern);
  }
}

/** Client-side regelmatch — ingen LLM. */
export function classifyPasteText(
  text: string,
  rules: PlanningEmailRule[] = [],
): PasteClassification {
  const trimmed = text.trim();
  const { title, dueAt } = parseQuickAddTitle(trimmed);

  if (routeExContentToHamn(trimmed)) {
    return {
      title,
      summary: trimmed.slice(0, 500),
      suggestedStatus: 'waiting',
      dueAt,
      routeToHamn: true,
    };
  }

  const sorted = [...rules].filter((r) => r.enabled).sort((a, b) => a.priority - b.priority);
  for (const rule of sorted) {
    if (!ruleMatches(trimmed, rule)) continue;
    if (rule.route === 'hamn') {
      return {
        title,
        summary: trimmed.slice(0, 500),
        suggestedStatus: 'waiting',
        dueAt,
        routeToHamn: true,
        matchedRuleLabel: rule.label,
      };
    }
    if (rule.route === 'planering') {
      return {
        title,
        summary: trimmed.slice(0, 500),
        suggestedStatus: dueAt ? 'todo' : 'waiting',
        dueAt,
        routeToHamn: false,
        matchedRuleLabel: rule.label,
      };
    }
  }

  const parentLogistics =
    /\bhämtning\b/i.test(trimmed) ||
    /\bskolmejl\b/i.test(trimmed) ||
    /\bterminsstart\b/i.test(trimmed);

  return {
    title,
    summary: trimmed.slice(0, 500),
    suggestedStatus: parentLogistics || !dueAt ? 'waiting' : 'todo',
    dueAt,
    routeToHamn: false,
  };
}

export function suggestColumnFromPaste(
  text: string,
  rules: PlanningEmailRule[] = [],
): PlanningTaskStatus {
  return classifyPasteText(text, rules).suggestedStatus;
}
