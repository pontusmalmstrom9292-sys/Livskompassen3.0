import { BALANS_WINDOW_DAYS } from '../constants';
import type { BalansResult, ChildrenLogEntry } from '../types';

function normalize(scale: number): number {
  return (scale - 1) / 4;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function computeBalansIndex(
  logs: ChildrenLogEntry[],
  childAlias: string
): BalansResult {
  const physio = logs.filter(
    (l) => l.childAlias === childAlias && l.action === 'fysiologi' && l.signals
  );

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - BALANS_WINDOW_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const byDay = new Map<string, { somn: number[]; angest: number[]; aptit: number[] }>();

  for (const log of physio) {
    const dk = dayKey(log.createdAt ?? '');
    if (dk < cutoffStr || !log.signals) continue;
    const bucket = byDay.get(dk) ?? { somn: [], angest: [], aptit: [] };
    bucket.somn.push(log.signals.somn);
    bucket.angest.push(log.signals.angest);
    bucket.aptit.push(log.signals.aptit);
    byDay.set(dk, bucket);
  }

  const days = [...byDay.values()];
  if (days.length === 0) {
    return {
      index: 0,
      label: 'Otillräcklig data — logga minst en dag',
      daysWithData: 0,
      avgSomn: 0,
      avgAngest: 0,
      avgAptit: 0,
    };
  }

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const dayAvgs = days.map((d) => ({
    somn: avg(d.somn),
    angest: avg(d.angest),
    aptit: avg(d.aptit),
  }));

  const avgSomn = avg(dayAvgs.map((d) => d.somn));
  const avgAngest = avg(dayAvgs.map((d) => d.angest));
  const avgAptit = avg(dayAvgs.map((d) => d.aptit));

  const somnNorm = normalize(avgSomn);
  const aptitNorm = normalize(avgAptit);
  const angestNorm = 1 - normalize(avgAngest);

  const index = Math.round(100 * (somnNorm + aptitNorm + angestNorm) / 3);

  let label: string;
  if (index >= 70) label = 'Stabil period — trygg hamn dokumenterad';
  else if (index >= 40) label = 'Blandad balans — fortsatt observation';
  else label = 'Ökad belastning — fakta kvar i logg';

  return {
    index,
    label,
    daysWithData: days.length,
    avgSomn,
    avgAngest,
    avgAptit,
  };
}
