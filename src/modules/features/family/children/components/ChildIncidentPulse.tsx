import { Link } from 'react-router-dom';
import { Activity, Sparkles } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import {
  BARN_INCIDENT_PATTERN_DEFS,
  BARN_INCIDENT_TAG_LABELS,
  type BarnIncidentTag,
} from '@/shared/patterns/barnIncidentPatternLibrary';
import type { ChildrenLogEntry } from '../types';
import {
  countRecentIncidents,
  extractIncidentTagIds,
  recentIncidentThemeTagIds,
} from '../lib/incidentThemeFromLogs';

type Props = {
  childAlias: string;
  logs: ChildrenLogEntry[];
  balansIndex: number;
  balansDays: number;
};

function patternIdToTag(patternId: string): BarnIncidentTag | null {
  return BARN_INCIDENT_PATTERN_DEFS.find((d) => d.id === patternId)?.tag ?? null;
}

/**
 * Fas B — per-barn puls: balans + senaste incidenter + tematik (7 dagar).
 */
export function ChildIncidentPulse({ childAlias, logs, balansIndex, balansDays }: Props) {
  const incidentCount = countRecentIncidents(logs, childAlias, 7);
  const themeIds = recentIncidentThemeTagIds(logs, childAlias, 7);
  const themeLabels = themeIds
    .map((id) => {
      const tag = patternIdToTag(id);
      return tag ? BARN_INCIDENT_TAG_LABELS[tag] : null;
    })
    .filter(Boolean)
    .slice(0, 3);

  const latest = logs.find(
    (l) =>
      l.childAlias === childAlias &&
      (l.category === 'incident' || l.action === 'incident_analys'),
  );
  const latestTags = extractIncidentTagIds(latest?.truth);

  return (
    <BentoCard
      glow="blue"
      title={`${childAlias} — signaler just nu`}
      icon={<Activity className="h-4 w-4" />}
    >
      <div className="space-y-3 text-sm">
        <p className="text-text-muted">
          Balans {balansDays > 0 ? `${balansIndex}/100` : '—'} · Incidenter senaste 7 dagar:{' '}
          <span className="tabular-nums text-text">{incidentCount}</span>
        </p>

        {themeLabels.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Tematik (7 dagar)</p>
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {themeLabels.map((label) => (
                <li
                  key={label as string}
                  className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] text-text-muted"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {latest && (
          <p className="text-xs text-text-muted line-clamp-2">
            Senaste:{' '}
            {(latest.observation ?? '').replace(/^\[(citat|tolkning)\]\s*/i, '').slice(0, 120)}
            {latestTags.length > 0 ? ` · ${latestTags.length} tagg(ar)` : ''}
          </p>
        )}

        <Link
          to={`${NAV_PATHS.FAMILJEN}?tab=reflektion&inputMode=incident`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border/50 px-3 text-xs font-medium text-text hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Skriv vad som hände
        </Link>
      </div>
    </BentoCard>
  );
}
