/**
 * ArbetslivFranvaroPanel — Arbetsliv-domänens ägda komponent för frånvaro och tidshistorik.
 *
 * Innehåller ALL CRUD-logik för manuella tidsposter (frånvaro, VAB, sjuk, semester)
 * och historikvisning. Publiceras via features/dailyLife/arbetsliv/index.ts
 * och renderas som en opak box av valv_ekonomi/VaultEconomyPanel.
 *
 * ✅ Importerar: arbetslivFirestore (korrekt domän)
 * ❌ Importera INTE från economyFirestore härifrån.
 */

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { useStore } from '@/core/store';
import {
  addManualTimeEntries,
  deleteTimeEntry,
  getRecentTimeEntries,
} from '@/core/firebase/arbetslivFirestore';
import type { TimeEntryRow } from '@/core/types/firestore';
import { formatDateLocal } from '@/shared/utils/dateHelpers';
import { DEFAULT_HELDAG } from '@/core/utils/timeMath';

const ABSENCE_CATS = ['Sjuk', 'Sjuk dag 15+', 'VAB', 'Semester', 'Arbete'] as const;

/**
 * Renderar frånvaroinmatning (manuella pass) och tidshistorik.
 * Styrs av `activeTab` som skickas in utifrån — valvet kontrollerar navigering,
 * denna komponent kontrollerar data.
 */
export function ArbetslivFranvaroPanel({
  activeTab,
}: {
  activeTab: 'franvaro' | 'historik';
}) {
  const user = useStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLogs, setTimeLogs] = useState<TimeEntryRow[]>([]);

  // ─── Formulärstate för manuellt pass ─────────────────────────────────────────
  const [mFrom, setMFrom] = useState(formatDateLocal());
  const [mTo, setMTo] = useState(formatDateLocal());
  const [mKat, setMKat] = useState<string>('Sjuk');
  const [mMode, setMMode] = useState<'heldag' | 'timmar'>('heldag');
  const [mIn, setMIn] = useState<string>(DEFAULT_HELDAG.in);
  const [mOut, setMOut] = useState<string>(DEFAULT_HELDAG.out);
  const [mRast, setMRast] = useState('30');
  const [mPct, setMPct] = useState('100');
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setTimeLogs(await getRecentTimeEntries(user.uid, 50));
    } catch {
      setError('Kunde inte läsa tidshistorik.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveManual = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      await addManualTimeEntries(user.uid, {
        fromDate: mFrom,
        toDate: mTo,
        clockIn: mMode === 'timmar' ? mIn : DEFAULT_HELDAG.in,
        clockOut: mMode === 'timmar' ? mOut : DEFAULT_HELDAG.out,
        category: mKat,
        breakMinutes: Number(mRast) || 30,
        scopePercent: Number(mPct) || 100,
      });
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kunde inte spara pass.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!user) return;
    setError(null);
    try {
      await deleteTimeEntry(user.uid, entryId);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kunde inte radera post.');
    }
  };

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-text-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
      </p>
    );
  }

  return (
    <div className="arbetsliv-franvaro-shell space-y-4">
      {error && <p className="text-sm text-danger">{error}</p>}

      {activeTab === 'franvaro' && (
        <BentoCard title="Frånvaro / manuellt pass" className="overflow-hidden">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className="input-glass"
                value={mFrom}
                onChange={(e) => setMFrom(e.target.value)}
              />
              <input
                type="date"
                className="input-glass"
                value={mTo}
                onChange={(e) => setMTo(e.target.value)}
              />
            </div>

            <select
              className="input-glass w-full"
              value={mKat}
              onChange={(e) => setMKat(e.target.value)}
            >
              {ABSENCE_CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={[mMode === 'heldag' ? 'ring-1 ring-accent-primary' : '', 'min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'].filter(Boolean).join(' ')}
                onClick={() => setMMode('heldag')}
              >
                Heldag
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={[mMode === 'timmar' ? 'ring-1 ring-accent-primary' : '', 'min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'].filter(Boolean).join(' ')}
                onClick={() => setMMode('timmar')}
              >
                Timmar
              </Button>
            </div>

            {mMode === 'timmar' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  className="input-glass"
                  value={mIn}
                  onChange={(e) => setMIn(e.target.value)}
                />
                <input
                  type="time"
                  className="input-glass"
                  value={mOut}
                  onChange={(e) => setMOut(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className="input-glass"
                placeholder="Rast min"
                value={mRast}
                onChange={(e) => setMRast(e.target.value)}
              />
              <select
                className="input-glass"
                value={mPct}
                onChange={(e) => setMPct(e.target.value)}
              >
                <option value="100">100%</option>
                <option value="75">75%</option>
                <option value="50">50%</option>
                <option value="25">25%</option>
              </select>
            </div>

            <Button disabled={busy} className="w-full min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={() => void saveManual()}>
              {busy ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Spara i loggen'}
            </Button>
          </div>
        </BentoCard>
      )}

      {activeTab === 'historik' && (
        <BentoCard title="Aktivitetslogg (tid)" className="overflow-hidden">
          {timeLogs.length === 0 ? (
            <EmptyState message="Inga pass." />
          ) : (
            <div className="space-y-2">
              {timeLogs.map((t) => (
                <div key={t.id} className="flex items-start justify-between gap-2">
                  <TimelineEntry
                    meta={t.date}
                    body={`${t.category} ${t.clockIn}–${t.clockOut ?? '…'} · ${t.hoursWorked} h`}
                  />
                  <button
                    type="button"
                    className="shrink-0 text-xs text-danger min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    onClick={() => void handleDelete(t.id)}
                  >
                    Radera
                  </button>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      )}
    </div>
  );
}
