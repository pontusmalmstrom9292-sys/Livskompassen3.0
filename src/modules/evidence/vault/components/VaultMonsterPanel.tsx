/** @locked-ux Valv Mönster — do not remove; see `.context/locked-ux-features.md` */
import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { EmptyState } from '../../../core/ui/EmptyState';
import type { VaultLog } from '../../../core/types/firestore';
import { buildVaultFrequencyReport } from '../utils/vaultPatternScan';

type Props = {
  logs: (VaultLog & { id: string })[];
};

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const width = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-text-dim">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-accent/70 transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function VaultMonsterPanel({ logs }: Props) {
  const report = useMemo(() => buildVaultFrequencyReport(logs), [logs]);
  const maxTechnique = report.topTechniques[0]?.count ?? 0;
  const maxMonth = Math.max(...report.monthlyCounts.map((m) => m.count), 1);

  if (logs.length === 0) {
    return (
      <BentoCard title="Mönster" description="Pansaret · deterministisk frekvens" icon={<BarChart3 className="h-4 w-4" />}>
        <EmptyState message="Inga valvposter ännu. Spara under Arkiv — frekvensen visas här." />
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      <BentoCard
        title="Frekvensanalys"
        description="Pansaret · regex-lager (ingen LLM som sanning)"
        icon={<BarChart3 className="h-4 w-4" />}
      >
        <p className="text-sm text-text-muted">
          {report.totalPosts} poster · {report.smsLikePosts} kommunikationsrelaterade ·
          deterministisk skanning av dina låsta texter i arkivet.
        </p>
        <div className="mt-4 space-y-3">
          {report.topTechniques.length === 0 ? (
            <p className="text-sm text-text-dim">
              Inga kända manipulationstaktiker hittades i befintliga poster (bra tecken, eller
              kortare texter).
            </p>
          ) : (
            report.topTechniques.map(({ technique, count }) => (
              <BarRow key={technique} label={technique} count={count} max={maxTechnique} />
            ))
          )}
        </div>
      </BentoCard>

      <BentoCard title="Poster per månad" description="Systematisk tidsfrekvens">
        <div className="space-y-3">
          {report.monthlyCounts.map(({ month, count }) => (
            <BarRow key={month} label={month} count={count} max={maxMonth} />
          ))}
        </div>
      </BentoCard>

      <BentoCard title="Kategorier i valvet" description="Fördelning">
        <div className="space-y-2 text-sm text-text-muted">
          {Object.entries(report.categoryCounts).map(([cat, count]) => (
            <p key={cat}>
              {cat}: <span className="text-accent">{count}</span>
            </p>
          ))}
        </div>
      </BentoCard>
    </div>
  );
}
