import {
  ADHD_COACH_SYSTEM_PROMPT,
  KOMPIS_SYSTEM_PROMPT,
  REALITY_CHECKER_SYSTEM_PROMPT,
} from './sharedRules';

export const EXPERT_PROMPTS: Record<string, string> = {
  default: KOMPIS_SYSTEM_PROMPT,
  reality_checker: REALITY_CHECKER_SYSTEM_PROMPT,
  adhd_coach: ADHD_COACH_SYSTEM_PROMPT,
};
