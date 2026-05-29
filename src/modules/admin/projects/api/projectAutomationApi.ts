import type { ProjectAutomationRule } from '../types';

const STORAGE_KEY = 'livskompassen_project_automation_rules_v1';

function storageKey(userId: string): string {
  return `${STORAGE_KEY}:${userId}`;
}

export function loadProjectAutomationRules(userId: string): ProjectAutomationRule[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is ProjectAutomationRule =>
        r &&
        typeof r === 'object' &&
        typeof (r as ProjectAutomationRule).id === 'string' &&
        typeof (r as ProjectAutomationRule).label === 'string',
    );
  } catch {
    return [];
  }
}

export function saveProjectAutomationRules(userId: string, rules: ProjectAutomationRule[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(storageKey(userId), JSON.stringify(rules.slice(0, 32)));
}
