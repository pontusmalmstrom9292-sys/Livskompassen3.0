import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '@/core/store';
import { getChildrenLogs, saveChildrenLog } from '@/core/firebase/firestore';
import { CHILD_ALIASES, type BarnfokusQuestion, type ChildAlias } from '../constants';
import type { ChildrenLogEntry, PhysiologicalSignals } from '../types';
import { computeBalansIndex } from '../utils/balansIndex';

const defaultSignals: PhysiologicalSignals = { somn: 3, angest: 3, aptit: 3 };

export type FamiljenLogFilter = 'all' | 'skola' | 'livslogg';

/** Familjen shell — publikt utan separat PIN; forensic-flikar gateas via VaultZoneGate. */
export function useFamiljenShell() {
  const user = useStore((s) => s.user);

  const [activeChild, setActiveChild] = useState<ChildAlias>('Kasper');
  const [signals, setSignals] = useState<PhysiologicalSignals>(defaultSignals);
  const [logs, setLogs] = useState<ChildrenLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<FamiljenLogFilter>('all');
  const [evidenceForLogId, setEvidenceForLogId] = useState<string | null>(null);

  const unlocked = !!user;

  useEffect(() => {
    return () => {
      setEvidenceForLogId(null);
    };
  }, []);

  const refreshLogs = useCallback(async () => {
    if (!user) return;
    const data = await getChildrenLogs(user.uid);
    setLogs(data as ChildrenLogEntry[]);
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshLogs().catch(() => setError('Kunde inte hämta loggar.'));
    }
  }, [user, refreshLogs]);

  useEffect(() => {
    setSignals(defaultSignals);
    setError(null);
    setEvidenceForLogId(null);
  }, [activeChild]);

  const balans = useMemo(
    () => computeBalansIndex(logs, activeChild),
    [logs, activeChild],
  );

  const barnfokusMemory = useMemo(
    () =>
      logs
        .filter(
          (l) =>
            l.childAlias === activeChild &&
            l.action === 'livslogg' &&
            (l.category === 'barnfokus' || l.category === 'middag'),
        )
        .slice(0, 8),
    [logs, activeChild],
  );

  const childLogs = useMemo(() => {
    let rows = logs.filter((l) => l.childAlias === activeChild);
    if (logFilter === 'skola') {
      rows = rows.filter(
        (l) =>
          l.action === 'livslogg' &&
          (l.category === 'skola' || l.category === 'tredjepart'),
      );
    } else if (logFilter === 'livslogg') {
      rows = rows.filter((l) => l.action === 'livslogg');
    }
    return rows;
  }, [logs, activeChild, logFilter]);

  const familyWeekStats = useMemo(() => {
    const now = Date.now();
    const weekMs = 7 * 86_400_000;
    const byDay: number[] = [0, 0, 0, 0, 0, 0, 0];
    for (const log of logs) {
      if (log.action !== 'livslogg') continue;
      const t = Date.parse(log.createdAt ?? '');
      if (Number.isNaN(t) || now - t > weekMs) continue;
      const d = new Date(t).getDay();
      const idx = d === 0 ? 6 : d - 1;
      byDay[idx] += 1;
    }
    return {
      total: byDay.reduce((a, b) => a + b, 0),
      byDay,
      labels: ['M', 'T', 'O', 'T', 'F', 'L', 'S'] as const,
    };
  }, [logs]);

  const handleSavePhysio = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await saveChildrenLog(user.uid, {
        childAlias: activeChild,
        observation: '',
        action: 'fysiologi',
        signals,
      });
      await refreshLogs();
    } catch {
      setError('Kunde inte spara signaler.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveObservation = async (data: {
    observation: string;
    category: string;
    childrenImpact?: string;
  }) => {
    if (!user) throw new Error('Ej inloggad');
    setError(null);
    const id = await saveChildrenLog(user.uid, {
      childAlias: activeChild,
      ...data,
      action: 'livslogg',
    });
    await refreshLogs();
    return id;
  };

  const handleSaveBarnfokus = async (observation: string, question: BarnfokusQuestion) => {
    if (!user) throw new Error('Ej inloggad');
    const stored = `[${question.kind}] ${observation}`;
    const optimisticId = `pending-${Date.now()}`;
    const optimistic: ChildrenLogEntry = {
      id: optimisticId,
      childAlias: activeChild,
      action: 'livslogg',
      category: 'barnfokus',
      observation: stored,
      truth: stored,
      createdAt: new Date().toISOString(),
    };
    setLogs((prev) => [optimistic, ...prev]);
    setError(null);
    try {
      const id = await saveChildrenLog(user.uid, {
        childAlias: activeChild,
        observation: stored,
        category: 'barnfokus',
        action: 'livslogg',
        ...(question.bankId ? { bankId: question.bankId } : {}),
      });
      setLogs((prev) =>
        prev.map((row) => (row.id === optimisticId ? { ...row, id } : row)),
      );
      return id;
    } catch {
      setLogs((prev) => prev.filter((row) => row.id !== optimisticId));
      throw new Error('Kunde inte spara barnfokus-svar.');
    }
  };

  return {
    user,
    unlocked,
    error,
    setError,
    activeChild,
    setActiveChild,
    childAliases: CHILD_ALIASES,
    signals,
    setSignals,
    logs,
    loading,
    logFilter,
    setLogFilter,
    evidenceForLogId,
    setEvidenceForLogId,
    balans,
    barnfokusMemory,
    childLogs,
    familyWeekStats,
    handleSavePhysio,
    handleSaveObservation,
    handleSaveBarnfokus,
    refreshLogs,
  };
}

export type FamiljenShell = ReturnType<typeof useFamiljenShell>;
