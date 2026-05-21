import type { VaultLog } from '../../core/types/firestore';
import type { VaultMatch } from '../utils/matchVaultEvidence';

interface Props {
  feeling: string;
  vivirSummary: string;
  matches: VaultMatch[];
  vaultLocked: boolean;
}

export function EvidenceCompareView({ feeling, vivirSummary, matches, vaultLocked }: Props) {
  if (vaultLocked) {
    return (
      <div className="glass-card border-warning/30 p-4 text-sm text-text-muted">
        Valvet är låst. Lås upp valv: håll Shield (Fyren) 3 sek → biometri → PIN.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="glass-card border-accent/30 p-3">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">Känsla + VIVIR</p>
        {feeling && <p className="mb-2 text-sm text-text-muted">{feeling}</p>}
        <p className="whitespace-pre-wrap text-sm text-text">{vivirSummary}</p>
      </div>

      <div className="glass-card p-3">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">Bevisankare (valv)</p>
        {matches.length === 0 ? (
          <p className="text-sm text-text-dim">Inga matchande poster i Verklighetsvalvet.</p>
        ) : (
          <ul className="space-y-2">
            {matches.slice(0, 5).map(({ log, score }) => (
              <VaultItem key={(log as VaultLog & { id: string }).id ?? score} log={log} score={score} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function VaultItem({ log, score }: { log: VaultLog & { id: string }; score: number }) {
  return (
    <li className="rounded-lg border border-border-strong p-2 text-sm">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">
        {log.category ?? 'bevis'} · {(log.createdAt ?? '').slice(0, 10)} · träff {score}
      </p>
      <p className="mt-1 text-text-muted">{log.truth}</p>
    </li>
  );
}
