import type { ChildAlias } from './constants';

export type SignalScale = 1 | 2 | 3 | 4 | 5;

export interface PhysiologicalSignals {
  somn: SignalScale;
  angest: SignalScale;
  aptit: SignalScale;
}

export interface ChildrenLogEntry {
  id: string;
  childAlias?: string;
  action?: string;
  observation?: string;
  truth?: string;
  category?: string;
  childrenImpact?: string;
  signals?: PhysiologicalSignals;
  createdAt?: string;
}

export interface BalansResult {
  index: number;
  label: string;
  daysWithData: number;
  avgSomn: number;
  avgAngest: number;
  avgAptit: number;
}

export type { ChildAlias };
