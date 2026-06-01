import { useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import {
  createPlanningEmailRule,
  deletePlanningEmailRule,
  listenPlanningEmailRules,
  updatePlanningEmailRule,
} from '../api/planningEmailRulesApi';
import { SUGGESTED_EMAIL_RULE_TEMPLATES } from '../constants/planningEmailRuleLabels';
import type { PlanningEmailRule, PlanningEmailRuleInput } from '../types/planningEmailRule';

export function usePlanningEmailRules() {
  const user = useStore((s) => s.user);
  const [rules, setRules] = useState<PlanningEmailRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRules([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const unsub = listenPlanningEmailRules(user.uid, (rows) => {
      setRules(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const addRule = async (input: PlanningEmailRuleInput) => {
    if (!user) throw new Error('Inte inloggad');
    await createPlanningEmailRule(user.uid, input);
  };

  const patchRule = async (ruleId: string, patch: Partial<PlanningEmailRuleInput>) => {
    if (!user) return;
    await updatePlanningEmailRule(user.uid, ruleId, patch);
  };

  const removeRule = async (ruleId: string) => {
    if (!user) return;
    await deletePlanningEmailRule(user.uid, ruleId);
  };

  const addSuggestedTemplates = async () => {
    if (!user) return;
    const existing = new Set(rules.map((r) => `${r.matchType}:${r.pattern}:${r.route}`));
    for (const tpl of SUGGESTED_EMAIL_RULE_TEMPLATES) {
      const key = `${tpl.matchType}:${tpl.pattern}:${tpl.route}`;
      if (existing.has(key)) continue;
      await createPlanningEmailRule(user.uid, { ...tpl, enabled: true });
    }
  };

  return {
    user,
    rules,
    loading,
    error,
    setError,
    addRule,
    patchRule,
    removeRule,
    addSuggestedTemplates,
  };
}
