import { useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import {
  createInboxRule,
  deleteInboxRule,
  listenInboxRules,
  updateInboxRule,
} from '../api/inboxRulesApi';
import type { InboxCategorizationRule, InboxCategorizationRuleInput } from '../types/inboxRule';

export function useInboxRules() {
  const user = useStore((s) => s.user);
  const [rules, setRules] = useState<InboxCategorizationRule[]>([]);
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
    const unsub = listenInboxRules(user.uid, (rows) => {
      setRules(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const addRule = async (input: InboxCategorizationRuleInput) => {
    if (!user) throw new Error('Inte inloggad');
    await createInboxRule(user.uid, input);
  };

  const patchRule = async (ruleId: string, patch: Partial<InboxCategorizationRuleInput>) => {
    if (!user) return;
    await updateInboxRule(user.uid, ruleId, patch);
  };

  const removeRule = async (ruleId: string) => {
    if (!user) return;
    await deleteInboxRule(user.uid, ruleId);
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
