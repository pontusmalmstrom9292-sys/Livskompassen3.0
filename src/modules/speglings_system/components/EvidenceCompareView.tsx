import type { VaultLog } from '../../core/types/firestore';
import type { VaultMatch } from '../utils/matchVaultEvidence';
import { SYNAPSE_INDIGO } from '../constants/vivirSteps';

interface Props {
  feeling: string;
  vivirSummary: string;
  matches: VaultMatch[];
  vaultLocked: boolean;
}

export function EvidenceCompareView({ feeling, vivirSummary, matches, vaultLocked }: Props) {
  if (vaultLocked) {
    return (
      <div className="rounded-xl border border-amber-500/30 p-4 text-sm text-slate-300">
        Valvet är låst. Lås upp valv: håll Shield (Fyren) 3 sek → biometri → PIN.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-[#0f172a]/40 backdrop-blur-md p-3" style={{ borderColor: `${SYNAPSE_INDIGO}44` }}>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Känsla + VIVIR</p>
        {feeling && <p className="text-sm text-slate-300 mb-2">{feeling}</p>}
        <p className="text-sm text-slate-200 whitespace-pre-wrap">{vivirSummary}</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0f172a]/40 backdrop-blur-md p-3">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Bevisankare (valv)</p>
        {matches.length === 0 ? (
          <p className="text-sm text-slate-500">Inga matchande poster i Verklighetsvalvet.</p>
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
    <li className="rounded-lg border border-white/10 p-2 text-sm">
      <p className="text-[10px] uppercase tracking-widest text-white/40">
        {log.category ?? 'bevis'} · {(log.createdAt ?? '').slice(0, 10)} · träff {score}
      </p>
      <p className="text-slate-200 mt-1">{log.truth}</p>
    </li>
  );
}
