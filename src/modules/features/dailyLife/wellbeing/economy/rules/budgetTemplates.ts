/**
 * Pure budget helpers — ported patterns from envelope / 50-30-20 templates (no I/O).
 */

export type Budget503020Split = {
  needsSek: number;
  wantsSek: number;
  savingsSek: number;
};

/** 50/30/20 rule: needs 50%, wants 30%, savings 20%. */
export function split503020(incomeSek: number): Budget503020Split {
  const income = Math.max(0, Math.round(incomeSek));
  return {
    needsSek: Math.round(income * 0.5),
    wantsSek: Math.round(income * 0.3),
    savingsSek: Math.round(income * 0.2),
  };
}

export type EnvelopeLike = {
  allocatedSek: number;
  spentSek: number;
};

/** Remaining spend room in an envelope (never below zero). */
export function envelopeRemaining(envelope: EnvelopeLike): number {
  const allocated = Math.max(0, envelope.allocatedSek);
  const spent = Math.max(0, envelope.spentSek);
  return Math.max(0, allocated - spent);
}

/** ISO week start (Monday 00:00 local) for transaction filtering. */
export function startOfIsoWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export type EconomyTxLike = { amountSek: number; createdAt: string };

/** Sum of spending (negative amounts) in the current ISO week. */
export function weeklySpentSek(transactions: EconomyTxLike[], now: Date = new Date()): number {
  const weekStart = startOfIsoWeek(now).getTime();
  return transactions.reduce((sum, tx) => {
    const ts = Date.parse(tx.createdAt);
    if (Number.isNaN(ts) || ts < weekStart) return sum;
    if (tx.amountSek >= 0) return sum;
    return sum + Math.abs(tx.amountSek);
  }, 0);
}

export function weeklyBudgetLeft(weeklyBudgetSek: number, spentSek: number): number {
  return Math.max(0, Math.max(0, weeklyBudgetSek) - Math.max(0, spentSek));
}

export function weeklyProgressPercent(weeklyBudgetSek: number, spentSek: number): number {
  if (weeklyBudgetSek <= 0) return 0;
  return Math.min(100, Math.round((spentSek / weeklyBudgetSek) * 100));
}
