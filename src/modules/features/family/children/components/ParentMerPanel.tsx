import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Anchor, Download, Flag } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import type { ChildrenLogEntry } from '../types';
import {
  PARENT_MILESTONE_DEFS,
  greyRockStreakDays,
  isMilestoneDoneToday,
  markHamnVisitedFromBarnhub,
  milestonesDoneTodayCount,
  toggleMilestoneToday,
  type ParentMilestoneId,
} from '../lib/parentMilestones';
import {
  downloadCuratorChildReportJson,
  exportCuratorChildReport,
  printCuratorChildReport,
} from '../utils/exportCuratorChildReport';

type Props = {
  childAlias: string;
  logs: ChildrenLogEntry[];
};

/**
 * Fas C — progressive disclosure «Mer»: milstolpar + avidentifierad export.
 */
export function ParentMerPanel({ childAlias, logs }: Props) {
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);

  const streak = useMemo(() => greyRockStreakDays(), [tick]);
  const doneToday = useMemo(() => milestonesDoneTodayCount(), [tick]);

  const refresh = () => setTick((n) => n + 1);

  const onToggle = (id: ParentMilestoneId) => {
    toggleMilestoneToday(id);
    refresh();
  };

  const onExportJson = () => {
    const report = exportCuratorChildReport(childAlias, logs, { anonymizeAliases: true });
    downloadCuratorChildReportJson(report);
  };

  const onExportPrint = () => {
    const report = exportCuratorChildReport(childAlias, logs, { anonymizeAliases: true });
    printCuratorChildReport(report);
  };

  return (
    <BentoCard
      glow="blue"
      title="Mer — milstolpar & export"
      icon={<Flag className="h-4 w-4" />}
    >
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between gap-2 text-left text-sm text-text"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-text-muted">
          Idag {doneToday}/{PARENT_MILESTONE_DEFS.length} · streak {streak} dag
          {streak === 1 ? '' : 'ar'}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-text-dim" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-text-dim" aria-hidden />
        )}
      </button>

      {open && (
        <div className="mt-3 space-y-4 border-t border-border/40 pt-3">
          <p className="text-xs text-text-dim">
            Grey Rock / BIFF hör hemma i Hamn. Här kryssar du bara av för dig själv — sparas lokalt
            på enheten.
          </p>

          <ul className="space-y-2">
            {PARENT_MILESTONE_DEFS.map((m) => {
              const checked = isMilestoneDoneToday(m.id);
              return (
                <li key={m.id}>
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-border/40 px-3 py-2 hover:bg-surface/50">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                      checked={checked}
                      onChange={() => onToggle(m.id)}
                    />
                    <span>
                      <span className="block text-sm text-text">{m.label}</span>
                      <span className="block text-xs text-text-dim">{m.hint}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <Link
            to={`${NAV_PATHS.FAMILJEN}?tab=hamn`}
            onClick={() => markHamnVisitedFromBarnhub()}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border/50 px-3 text-xs font-medium text-text hover:bg-surface/60"
          >
            <Anchor className="h-4 w-4" aria-hidden />
            Öppna Hamn
          </Link>

          <div className="space-y-2 border-t border-border/40 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
              Export till kurator/jurist
            </p>
            <p className="text-xs text-text-dim">
              Avidentifierad: Barn 1 / Barn 2. Ingen media. Beteende + datum.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-11"
                onClick={onExportJson}
              >
                <Download className="mr-1.5 h-4 w-4" aria-hidden />
                JSON
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-11"
                onClick={onExportPrint}
              >
                Skriv ut / PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </BentoCard>
  );
}
