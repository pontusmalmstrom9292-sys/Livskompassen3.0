import type { ProjectAutomationAction } from '../types';

export type ProjectRule = {
  id: string;
  label: string;
  matchPattern: string;
  action: ProjectAutomationAction;
  targetProjectId?: string;
  enabled: boolean;
};

export type ProjectRuleInput = {
  label: string;
  matchPattern: string;
  action: ProjectAutomationAction;
  targetProjectId?: string;
  enabled: boolean;
};
