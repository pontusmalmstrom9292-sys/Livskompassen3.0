import { useCallback, useEffect, useState } from 'react';
import { Loader2, Wallet } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { SaldoHero } from '../../core/ui/SaldoHero';
import { TabBar, type TabBarItem } from '../../core/ui/TabBar';
import { EmptyState } from '../../core/ui/EmptyState';
import { TimelineEntry } from '../../core/ui/TimelineEntry';
import { useStore } from '../../core/store';
import {
  addEconomyLedgerEntry,
  addManualTimeEntries,
  deleteEconomyFixedBill,
  deleteEconomyLedgerEntry,
  deleteTimeEntry,
  getEconomyFixedBills,
  getEconomyLedgerEntries,
  getEconomyOverview,
  getEconomyProfileExtended,
  getMonthEconomySummary,
  getRecentTimeEntries,
  getWeekTimeStats,
  setEconomyFixedBill,
  setEconomyProfileExtended,
} from '../../core/firebase/timeEconomyFirestore';
import type { TimeEntryRow } from '../../core/types/firestore';
import { DEFAULT_HELDAG, formatDateLocal } from '../../core/utils/timeMath';

type VaultEcoTab = 'oversikt' | 'logga' | 'fasta' | 'franvaro' | 'historik';

const TABS: TabBarItem<VaultEcoTab>[] = [
  { id: 'oversikt', label: 'Översikt' },
  { id: 'logga', label: 'Logga' },
  { id: 'fasta', label: 'Fasta' },
  { id: 'franvaro', label: 'Frånvaro' },
  { id: 'historik', label: 'Historik' },
];

const ABSENCE_CATS = ['Sjuk', 'Sjuk dag 15+', 'VAB', 'Semester', 'Arbete'] as const;

export function VaultEconomyPanel() {
  const user = useStore((s) => s.user);
  const [tab, setTab] = useState<VaultEcoTab>('oversikt');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState({
    lon: 0,
    fastaSumma: 0,
    saldo: 0,
    appUtgifter: 0,
    appInkomster: 0,
    rorligaUtgifter: 0,
    flex: 40,
    vecka: 0,
  });
  const [profile, setProfile] = useState({
    monthlySalarySek: 0,
    flexHoursTarget: 40,
    hourlyRateSek: 0,
  });
  const [month, setMonth] = useState({ manad: '', inkomster: 0, utgifter: 0, netto: 0, antal: 0 });
  const [week, setWeek] = useState({ total: 0, perKat: [] as { kat: string; timmar: number }[] });
  const [bills, setBills] = useState<{ id: string; name: string; amountSek: number }[]>([]);
  const [ledger, setLedger] = useState<
    { id: string; date: string; category: string; description: string; amountSek: number; type: string }[]
  >([]);
  const [timeLogs, setTimeLogs] = useState<TimeEntryRow[]>([]);

  const [uDate, setUDate] = useState(formatDateLocal());
  const [uKat, setUKat] = useState('Mat/Köp');
  const [uBesk, setUBesk] = useState('');
  const [uBelopp, setUBelopp] = useState('');
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
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
      const [ov, prof, mo, wk, bl, led, tl] = await Promise.all([
        getEconomyOverview(user.uid),
        getEconomyProfileExtended(user.uid),
        getMonthEconomySummary(user.uid),
        getWeekTimeStats(user.uid),
        getEconomyFixedBills(user.uid),
        getEconomyLedgerEntries(user.uid, 80),
        getRecentTimeEntries(user.uid, 50),
      ]);
      setOverview(ov);
      setProfile({
        monthlySalarySek: prof.monthlySalarySek,
        flexHoursTarget: prof.flexHoursTarget,
        hourlyRateSek: prof.hourlyRateSek,
      });
      setMonth(mo);
      setWeek(wk);
      setBills(bl);
      setLedger(led);
      setTimeLogs(tl);
    } catch {
      setError('Kunde inte läsa valv-ekonomi.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveProfile = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await setEconomyProfileExtended(user.uid, profile);
      await reload();
    } catch {
      setError('Kunde inte spara profil.');
    } finally {
      setBusy(false);
    }
  };

  const logMoney = async (type: 'utgift' | 'inkomst') => {
    if (!user || !uBesk.trim()) return;
    const amount = Number(uBelopp);
    if (!amount || amount <= 0) return;
    setBusy(true);
    try {
      await addEconomyLedgerEntry(user.uid, {
        date: uDate,
        category: uKat,
        description: uBesk.trim(),
        amountSek: amount,
        type,
      });
      setUBesk('');
      setUBelopp('');
      await reload();
    } catch {
      setError('Kunde inte spara.');
    } finally {
      setBusy(false);
    }
  };

  const addBill = async () => {
    if (!user || !billName.trim()) return;
    setBusy(true);
    try {
      await setEconomyFixedBill(user.uid, { name: billName.trim(), amountSek: Number(billAmount) || 0 });
      setBillName('');
      setBillAmount('');
      await reload();
    } catch {
      setError('Kunde inte spara fast räkning.');
    } finally {
      setBusy(false);
    }
  };

  const saveManual = async () => {
    if (!user) return;
    setBusy(true);
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

  return (
    <div className="space-y-4">
      <BentoCard title="Lön och räkningar" icon={<Wallet className="h-4 w-4" />} description="PIN-skyddad — Firestore">
        <TabBar<VaultEcoTab> tabs={TABS} active={tab} onChange={setTab} />
      </BentoCard>

      {error && <p className="text-sm text-danger">{error}</p>}
      {loading && (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      )}

      {!loading && tab === 'oversikt' && (
        <div className="space-y-4">
          <SaldoHero
            label="Kvar att leva på"
            amount={`${overview.saldo} kr`}
            hint={`Lön ${overview.lon} kr · fasta ${overview.fastaSumma} kr · v.${overview.vecka}`}
          />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl border border-white/5 p-3">
              <span className="text-text-dim">Utgifter (app)</span>
              <p className="font-medium">{overview.appUtgifter} kr</p>
            </div>
            <div className="rounded-xl border border-white/5 p-3">
              <span className="text-text-dim">Inkomster (app)</span>
              <p className="font-medium">{overview.appInkomster} kr</p>
            </div>
          </div>
          <BentoCard title="Profil" description="Månadslön och flexmål">
            <div className="flex flex-wrap gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-text-dim">Månadslön (kr)</span>
                <input
                  type="number"
                  className="input-glass w-32"
                  value={profile.monthlySalarySek}
                  onChange={(e) => setProfile((p) => ({ ...p, monthlySalarySek: Number(e.target.value) || 0 }))}
                  onBlur={() => void saveProfile()}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-text-dim">Flextimmar/vecka</span>
                <input
                  type="number"
                  className="input-glass w-28"
                  value={profile.flexHoursTarget}
                  onChange={(e) => setProfile((p) => ({ ...p, flexHoursTarget: Number(e.target.value) || 40 }))}
                  onBlur={() => void saveProfile()}
                />
              </label>
            </div>
          </BentoCard>
          <BentoCard title="Denna månad" description={month.manad}>
            <p className="text-sm">
              In: {month.inkomster} kr · Ut: {month.utgifter} kr · Netto: {month.netto} kr
            </p>
          </BentoCard>
          <BentoCard title="Vecka timmar">
            <p className="text-sm font-medium">{week.total} h totalt</p>
            <ul className="mt-2 space-y-1 text-xs text-text-dim">
              {week.perKat.map((k) => (
                <li key={k.kat}>
                  {k.kat}: {k.timmar} h
                </li>
              ))}
            </ul>
          </BentoCard>
        </div>
      )}

      {!loading && tab === 'logga' && (
        <BentoCard title="Logga pengar">
          <div className="space-y-3 text-sm">
            <input type="date" className="input-glass w-full" value={uDate} onChange={(e) => setUDate(e.target.value)} />
            <select className="input-glass w-full" value={uKat} onChange={(e) => setUKat(e.target.value)}>
              <option>Mat/Köp</option>
              <option>Rörliga</option>
              <option>Swish</option>
              <option>Sälj</option>
              <option>Övrigt</option>
            </select>
            <input
              className="input-glass w-full"
              placeholder="Beskrivning"
              value={uBesk}
              onChange={(e) => setUBesk(e.target.value)}
            />
            <input
              type="number"
              className="input-glass w-full"
              placeholder="Belopp"
              value={uBelopp}
              onChange={(e) => setUBelopp(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled={busy} className="btn-pill--ghost" onClick={() => void logMoney('utgift')}>
                Utgift
              </button>
              <button type="button" disabled={busy} className="btn-pill--primary" onClick={() => void logMoney('inkomst')}>
                Inkomst
              </button>
            </div>
          </div>
        </BentoCard>
      )}

      {!loading && tab === 'fasta' && (
        <BentoCard title="Fasta räkningar">
          <ul className="mb-3 space-y-2 text-sm">
            {bills.map((b) => (
              <li key={b.id} className="flex justify-between gap-2">
                <span>{b.name}</span>
                <span>
                  {b.amountSek} kr
                  <button
                    type="button"
                    className="ml-2 text-xs text-danger"
                    onClick={() => void deleteEconomyFixedBill(user!.uid, b.id).then(reload)}
                  >
                    Ta bort
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <input className="input-glass flex-1" placeholder="Namn" value={billName} onChange={(e) => setBillName(e.target.value)} />
            <input
              type="number"
              className="input-glass w-24"
              placeholder="kr"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
            />
            <button type="button" disabled={busy} className="btn-pill--primary text-sm" onClick={() => void addBill()}>
              Lägg till
            </button>
          </div>
        </BentoCard>
      )}

      {!loading && tab === 'franvaro' && (
        <BentoCard title="Frånvaro / manuellt pass">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="input-glass" value={mFrom} onChange={(e) => setMFrom(e.target.value)} />
              <input type="date" className="input-glass" value={mTo} onChange={(e) => setMTo(e.target.value)} />
            </div>
            <select className="input-glass w-full" value={mKat} onChange={(e) => setMKat(e.target.value)}>
              {ABSENCE_CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                className={`btn-pill--ghost text-xs ${mMode === 'heldag' ? 'ring-1 ring-accent-primary' : ''}`}
                onClick={() => setMMode('heldag')}
              >
                Heldag
              </button>
              <button
                type="button"
                className={`btn-pill--ghost text-xs ${mMode === 'timmar' ? 'ring-1 ring-accent-primary' : ''}`}
                onClick={() => setMMode('timmar')}
              >
                Timmar
              </button>
            </div>
            {mMode === 'timmar' && (
              <div className="grid grid-cols-2 gap-2">
                <input type="time" className="input-glass" value={mIn} onChange={(e) => setMIn(e.target.value)} />
                <input type="time" className="input-glass" value={mOut} onChange={(e) => setMOut(e.target.value)} />
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
              <select className="input-glass" value={mPct} onChange={(e) => setMPct(e.target.value)}>
                <option value="100">100%</option>
                <option value="75">75%</option>
                <option value="50">50%</option>
                <option value="25">25%</option>
              </select>
            </div>
            <button type="button" disabled={busy} className="btn-pill--primary w-full" onClick={() => void saveManual()}>
              Spara i loggen
            </button>
          </div>
        </BentoCard>
      )}

      {!loading && tab === 'historik' && (
        <div className="space-y-4">
          <BentoCard title="Aktivitetslogg (tid)">
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
                      className="text-xs text-danger shrink-0"
                      onClick={() => void deleteTimeEntry(user!.uid, t.id).then(reload)}
                    >
                      Radera
                    </button>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
          <BentoCard title="Pengalogg">
            {ledger.length === 0 ? (
              <EmptyState message="Inga rader." />
            ) : (
              <div className="space-y-2">
                {ledger.map((row) => (
                  <div key={row.id} className="flex justify-between gap-2 text-sm">
                    <TimelineEntry
                      meta={`${row.date} · ${row.category}`}
                      body={`${row.description} — ${row.type === 'inkomst' ? '+' : '−'}${row.amountSek} kr`}
                    />
                    <button
                      type="button"
                      className="text-xs text-danger shrink-0"
                      onClick={() => void deleteEconomyLedgerEntry(user!.uid, row.id).then(reload)}
                    >
                      Radera
                    </button>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>
      )}
    </div>
  );
}
