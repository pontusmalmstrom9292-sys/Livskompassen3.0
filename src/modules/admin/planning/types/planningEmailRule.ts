export const PLANNING_EMAIL_MATCH_TYPES = [
  'from_email',
  'from_domain',
  'subject_contains',
  'label',
] as const;

export type PlanningEmailMatchType = (typeof PLANNING_EMAIL_MATCH_TYPES)[number];

export const PLANNING_EMAIL_ROUTES = [
  'planering',
  'hamn',
  'inbox_queue',
  'vault',
  'kunskap',
  'ignore',
] as const;

export type PlanningEmailRoute = (typeof PLANNING_EMAIL_ROUTES)[number];

export type PlanningEmailRule = {
  id: string;
  label: string;
  matchType: PlanningEmailMatchType;
  pattern: string;
  route: PlanningEmailRoute;
  priority: number;
  enabled: boolean;
  createdAt?: string;
};

export type PlanningEmailRuleInput = {
  label: string;
  matchType: PlanningEmailMatchType;
  pattern: string;
  route: PlanningEmailRoute;
  priority: number;
  enabled: boolean;
};
