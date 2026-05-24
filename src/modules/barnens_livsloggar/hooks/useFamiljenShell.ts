import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../../core/store';
import { getChildrenLogs, saveChildrenLog } from '../../core/firebase/firestore';
import { CHILD_ALIASES, type BarnfokusQuestion, type ChildAlias } from '../constants';
import type { ChildrenLogEntry, PhysiologicalSignals } from '../types';
import { computeBalansIndex } from '../utils/balansIndex';

const CHILDREN_PIN_KEY = 'livskompassen_children_pin_hash';

function hashPin(pin: string): string {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (Math.imul(31, h) + pin.charCodeAt(i)) | 0;
  return String(h);
}

const defaultSignals: PhysiologicalSignals = { somn: 3, angest: 3, aptit: 3 };

export type FamiljenLogFilter = 'all' | 'skola' | 'livslogg';

export function useFamiljenShell() {
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);

  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [needsSetup, setNeedsSetup] = useState(!localStorage.getItem(CHILDREN_PIN_KEY));
  const [confirmPin, setConfirmPin] = useState('');
  const [activeChild, setActiveChild] = useState<ChildAlias>('Kasper');
  const [signals, setSignals] = useState<PhysiologicalSignals>(defaultSignals);
  const [logs, setLogs] = useState<ChildrenLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<FamiljenLogFilter>('all');
  const [evidenceForLogId, setEvidenceForLogId] = useState<string | null>(null);

  useEffect(() => {
    if (!isVaultUnlocked) setUnlocked(false);
  }, [isVaultUnlocked]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') setUnlocked(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    return () => {
      setPin('');
      setConfirmPin('');
      setEvidenceForLogId(null);
    };
  }, []);

  const refreshLogs = useCallback(async () => {
    if (!user) return;
    const data = await getChildrenLogs(user.uid);
    setLogs(data as ChildrenLogEntry[]);
  }, [user]);

  useEffect(() => {
    if (unlocked && user) {
      refreshLogs().catch(() => setError('Kunde inte hämta loggar.'));
    }
  }, [unlocked, user, refreshLogs]);

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

  const handleUnlock = () => {
    if (needsSetup) {
      if (pin.length < 4 || pin !== confirmPin) {
        setError('PIN måste matcha (minst 4 tecken).');
        return;
      }
      localStorage.setItem(CHILDREN_PIN_KEY, hashPin(pin));
      setNeedsSetup(false);
      setUnlocked(true);
      setPin('');
      setConfirmPin('');
      setError(null);
      return;
    }
    if (localStorage.getItem(CHILDREN_PIN_KEY) === hashPin(pin)) {
      setUnlocked(true);
      setPin('');
      setError(null);
    } else {
      setError('Fel PIN.');
    }
  };

  const lockModule = () => {
    setUnlocked(false);
    setVaultUnlocked(false);
  };

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
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    needsSetup,
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
    handleUnlock,
    lockModule,
    handleSavePhysio,
    handleSaveObservation,
    handleSaveBarnfokus,
    refreshLogs,
  };
}

export type FamiljenShell = ReturnType<typeof useFamiljenShell>;
