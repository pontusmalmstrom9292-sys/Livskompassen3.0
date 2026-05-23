import { useMemo, type ReactNode } from 'react';
import { FileText, Lock, ScanSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { EmptyState } from '../../core/ui/EmptyState';
import type { VaultLog } from '../../core/types/firestore';
import { formatVaultLogBody, formatVaultLogDate } from '../utils/formatVaultLogBody';

type VaultOrkesternPanelProps = {
  logs: (VaultLog & { id: string })[];
  loading: boolean;
};

type AgentCard = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  statusTone: 'success' | 'idle' | 'accent';
  icon: ReactNode;
};

function deriveDocLabel(log: VaultLog & { id: string }): string {
  const cat = log.category ?? 'bevis';
  const action = log.action ?? 'post';
  const excerpt = formatVaultLogBody(log).slice(0, 48);
  return `${cat} · ${action}${excerpt ? ` — ${excerpt}…` : ''}`;
}

function deriveTags(log: VaultLog & { id: string }): string[] {
  const tags = [log.category ?? 'valv', log.entryType ?? 'post', 'WORM'];
  if (log.biffUsed) tags.push('BIFF');
  if (log.pinned) tags.push('ANKARE');
  return tags.map((t) => t.toUpperCase());
}

export function VaultOrkesternPanel({ logs, loading }: VaultOrkesternPanelProps) {
  const evidenceLogs = useMemo(
    () => logs.filter((log) => log.category !== 'vävaren_metadata'),
    [logs],
  );
  const weaverCount = useMemo(
    () => logs.filter((log) => log.category === 'vävaren_metadata').length,
    [logs],
  );

  const agents: AgentCard[] = useMemo(
    () => [
      {
        id: 'vavaren',
        title: 'Vävaren',
        subtitle: 'Indexerar PDF & OCR · metadata till valv',
        status: weaverCount > 0 ? `Aktiv · ${weaverCount} metadata` : 'Redo',
        statusTone: weaverCount > 0 ? 'success' : 'idle',
        icon: <Sparkles className="h-4 w-4 text-indigo-300" />,
      },
      {
        id: 'spejaren',
        title: 'Spejaren',
        subtitle: 'Söker beteendemönster över tid',
        status: 'Redo · mönstersökning (GAP G21)',
        statusTone: 'idle',
        icon: <ScanSearch className="h-4 w-4 text-accent-secondary" />,
      },
      {
        id: 'sakraren',
        title: 'Säkraren',
        subtitle: 'WORM-sigill på reality_vault',
        status: `${evidenceLogs.length} säkrade dokument`,
        statusTone: 'accent',
        icon: <ShieldCheck className="h-4 w-4 text-success" />,
      },
    ],
    [weaverCount, evidenceLogs.length],
  );

  return (
    <div className="space-y-4">
      <BentoCard
        title="Orkestern av AI-agenter"
        description="Dokument dekonstrueras och säkras utan kognitiv belastning"
        icon={<Lock className="h-4 w-4" />}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="glass-card rounded-2xl border border-white/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                {agent.icon}
                <p className="font-display text-sm text-text">{agent.title}</p>
              </div>
              <p className="text-xs text-text-dim">{agent.subtitle}</p>
              <p
                className={`mt-2 text-[10px] uppercase tracking-widest ${
                  agent.statusTone === 'success'
                    ? 'text-success'
                    : agent.statusTone === 'accent'
                      ? 'text-accent'
                      : 'text-text-dim'
                }`}
              >
                {agent.status}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl border border-white/10 bg-surface/40 px-3 py-2 text-xs text-text-dim">
          Mönstersökning i hela arkivet planeras via G21 — ingen batch-körning i denna vy.
        </p>
      </BentoCard>

      <BentoCard title="Registrerade dokument" icon={<FileText className="h-4 w-4" />}>
        {loading ? (
          <p className="text-sm text-text-dim">Laddar dokument…</p>
        ) : evidenceLogs.length === 0 ? (
          <EmptyState message="Inga säkrade dokument i valvet ännu." />
        ) : (
          <ul className="space-y-3">
            {evidenceLogs.map((log) => (
              <li key={log.id} className="glass-card rounded-2xl border border-white/5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-text-muted">{log.id.slice(0, 12)}…</p>
                    <p className="mt-1 font-display text-sm text-text">{deriveDocLabel(log)}</p>
                  </div>
                  <span className="badge-worm shrink-0">WORM</span>
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-text-dim">
                  {formatVaultLogDate(log.createdAt)} · {log.entryType ?? 'simple'}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {deriveTags(log).map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-text-dim"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
    </div>
  );
}
