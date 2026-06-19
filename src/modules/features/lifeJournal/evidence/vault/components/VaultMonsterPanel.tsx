/** @locked-ux Valv Mönster — do not remove; see `.context/locked-ux-features.md` */
import { useMemo, useState } from 'react';
import { BarChart3, Loader2, RefreshCw } from 'lucide-react';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import type { VaultLog } from '@/core/types/firestore';
import { buildVaultFrequencyReport } from '../utils/vaultPatternScan';
import { usePatternScanMetadata } from '../hooks/usePatternScanMetadata';
import { rescanPatternMetadata, assistPatternMetadata } from '../api/patternScanService';

type Props = {
  logs: (VaultLog & { id: string })[];
  userId?: string;
};

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const width = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-text-dim">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-3/50">
        <div
          className="h-full rounded-full bg-accent/70 transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function VaultMonsterPanel({ logs, userId }: Props) {
  const { techniquesByLogId, libraryVersion, reload } = usePatternScanMetadata(userId);
  const [rescanning, setRescanning] = useState(false);
  const [assisting, setAssisting] = useState(false);
  const [rescanMsg, setRescanMsg] = useState<string | null>(null);

  const report = useMemo(
    () => buildVaultFrequencyReport(logs, techniquesByLogId),
    [logs, techniquesByLogId],
  );
  const maxTechnique = report.topTechniques[0]?.count ?? 0;
  const maxMonth = Math.max(...report.monthlyCounts.map((m) => m.count), 1);

  const handleRescan = async () => {
    if (!userId || rescanning || assisting) return;
    setRescanning(true);
    setRescanMsg(null);
    try {
      const { written } = await rescanPatternMetadata();
      await reload();
      setRescanMsg(written > 0 ? `${written} nya sidecar-poster sparade.` : 'Inga nya träffar att spara.');
    } catch {
      setRescanMsg('Skanna om misslyckades — kontrollera Valv-session.');
    } finally {
      setRescanning(false);
    }
  };

  const handleFlowAssist = async () => {
    if (!userId || rescanning || assisting) return;
    setAssisting(true);
    setRescanMsg(null);
    try {
      const { written } = await assistPatternMetadata();
      await reload();
      setRescanMsg(
        written > 0
          ? `Flow-assist: ${written} kompletterande sidecar-poster.`
          : 'Flow-assist: inga nya mönster utöver regex.',
      );
    } catch {
      setRescanMsg('Flow-assist misslyckades — kontrollera Valv-session.');
    } finally {
      setAssisting(false);
    }
  };

  if (logs.length === 0) {
    return (
      <BentoCard title="Mönster" description="Pansaret · deterministisk frekvens" icon={<BarChart3 className="h-4 w-4" />} glow="gold">
        <EmptyState message="Inga valvposter ännu. Spara under Arkiv — frekvensen visas här." />
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ModuleHelpFromRegistry moduleId="valv_monster" />
      </div>
      <BentoCard
        title="Frekvensanalys"
        description="Pansaret · regex + valfri Flow-assist (metadata)"
        icon={<BarChart3 className="h-4 w-4" />}
        glow="gold"
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
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
          <button
            type="button"
            disabled={!userId || rescanning || assisting}
            onClick={() => void handleRescan()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent hover:bg-accent/10 disabled:opacity-40"
          >
            {rescanning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            )}
            Skanna om (batch)
          </button>
          <button
            type="button"
            disabled={!userId || rescanning || assisting}
            onClick={() => void handleFlowAssist()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-surface-3/40 px-3 py-1.5 text-xs text-text-muted hover:border-accent/30 hover:text-accent disabled:opacity-40"
          >
            {assisting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : null}
            Flow-assist (kompletterande)
          </button>
          <span className="text-[10px] text-text-dim">Bibliotek {libraryVersion}</span>
          {rescanMsg ? <span className="text-[10px] text-text-muted">{rescanMsg}</span> : null}
        </div>
      </BentoCard>

      <BentoCard title="Poster per månad" description="Systematisk tidsfrekvens" glow="gold">
        <div className="space-y-3">
          {report.monthlyCounts.map(({ month, count }) => (
            <BarRow key={month} label={month} count={count} max={maxMonth} />
          ))}
        </div>
      </BentoCard>

      <BentoCard title="Kategorier i valvet" description="Fördelning" glow="gold">
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

export { buildVaultFrequencyReport };
