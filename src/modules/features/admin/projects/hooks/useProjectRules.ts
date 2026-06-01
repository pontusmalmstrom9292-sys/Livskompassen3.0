import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/core/store';
import {
  loadProjectAutomationRules,
  saveProjectAutomationRules,
} from '../api/projectAutomationApi';
import {
  createProjectRule,
  deleteProjectRule,
  listenProjectRules,
  updateProjectRule,
} from '../api/projectRulesApi';
import type { ProjectAutomationRule } from '../types';
import type { ProjectRule, ProjectRuleInput } from '../types/projectRule';

function toInput(rule: ProjectAutomationRule): ProjectRuleInput {
  return {
    label: rule.label,
    matchPattern: rule.matchPattern,
    action: rule.action,
    targetProjectId: rule.targetProjectId,
    enabled: rule.enabled,
  };
}

export function useProjectRules() {
  const user = useStore((s) => s.user);
  const [rules, setRules] = useState<ProjectRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const migratedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      setRules([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const unsub = listenProjectRules(user.uid, (rows) => {
      setRules(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user || loading || migratedRef.current) return;
    if (rules.length > 0) {
      migratedRef.current = true;
      return;
    }
    const local = loadProjectAutomationRules(user.uid);
    if (local.length === 0) {
      migratedRef.current = true;
      return;
    }
    migratedRef.current = true;
    void (async () => {
      try {
        for (const row of local.slice(0, 32)) {
          await createProjectRule(user.uid, toInput(row));
        }
        saveProjectAutomationRules(user.uid, []);
      } catch (err) {
        migratedRef.current = false;
        setError(err instanceof Error ? err.message : 'Kunde inte flytta lokala regler till molnet.');
      }
    })();
  }, [user, loading, rules.length]);

  const addRule = async (input: ProjectRuleInput) => {
    if (!user) throw new Error('Inte inloggad');
    await createProjectRule(user.uid, input);
  };

  const patchRule = async (ruleId: string, patch: Partial<ProjectRuleInput>) => {
    if (!user) return;
    await updateProjectRule(user.uid, ruleId, patch);
  };

  const removeRule = async (ruleId: string) => {
    if (!user) return;
    await deleteProjectRule(user.uid, ruleId);
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
  };
}
