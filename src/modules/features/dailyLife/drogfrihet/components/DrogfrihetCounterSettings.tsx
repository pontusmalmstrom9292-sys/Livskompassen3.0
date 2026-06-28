import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useDrogfrihetCounter } from '../hooks/useDrogfrihetCounter';
import {
  clearDrogfrihetCounter,
  resetDrogfrihetCounter,
  setDrogfrihetStartDateKey,
} from '../lib/drogfrihetCounter';
import { syncRecoveryProfileStartDate } from '../api/recoveryProfileService';

type Props = {
  uid?: string;
};

export function DrogfrihetCounterSettings({ uid }: Props) {
  const counter = useDrogfrihetCounter(uid);
  const [customDate, setCustomDate] = useState(counter.startDateKey ?? '');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setCustomDate(counter.startDateKey ?? '');
  }, [counter.startDateKey]);

  const applyCustomDate = () => {
    if (!customDate) return;
    setDrogfrihetStartDateKey(customDate, uid);
    if (uid) void syncRecoveryProfileStartDate(uid, customDate);
    setConfirmReset(false);
  };

  return (
    <div className="space-y-4">
      <BentoCard title="Drogfrihetsräknare" icon={<CalendarDays className="h-4 w-4" />}>
        {counter.started ? (
          <>
            <p className="text-2xl font-display text-accent tabular-nums">
              {counter.dayCount}{' '}
              <span className="text-sm font-sans text-text-muted">
                {counter.dayCount === 1 ? 'dag' : 'dagar'}
              </span>
            </p>
            <p className="mt-1 text-sm text-text-muted">Startdatum: {counter.startDateKey}</p>
          </>
        ) : (
          <p className="text-sm text-text-muted">Ingen aktiv räknare på den här enheten.</p>
        )}

        <p className="mt-3 text-xs text-text-dim">
          Räknaren sparas lokalt på enheten (kopplat till ditt konto när du är inloggad). Återfall
          utan skam — du väljer själv när du nollställer.
        </p>
      </BentoCard>

      <BentoCard title="Startdatum">
        <label className="block text-xs text-text-muted">
          Ange första nyktra dagen
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border-strong bg-surface/40 px-3 py-2 text-sm text-text"
          />
        </label>
        <button type="button" onClick={applyCustomDate} className="ds-btn ds-btn--secondary mt-3 w-full">
          Spara startdatum
        </button>
        <button
          type="button"
          onClick={() => {
            const today = new Date().toISOString().slice(0, 10);
            resetDrogfrihetCounter(uid);
            setCustomDate(today);
            if (uid) void syncRecoveryProfileStartDate(uid, today);
            setConfirmReset(false);
          }}
          className="ds-btn ds-btn--ghost mt-2 w-full text-sm"
        >
          Starta från idag
        </button>
      </BentoCard>

      <BentoCard title="Nollställ">
        <p className="text-sm text-text-muted">
          Nollställning finns bara här — inte i Drogfrihet-hubben — så du inte råkar trycka fel.
        </p>
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="ds-btn ds-btn--ghost mt-3 w-full text-sm text-danger"
          >
            Nollställ räknare…
          </button>
        ) : (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-danger">
              Detta tar bort räknaren eller sätter om från idag. Är du säker?
            </p>
            <button
              type="button"
              onClick={() => {
                const today = new Date().toISOString().slice(0, 10);
                resetDrogfrihetCounter(uid);
                setCustomDate(today);
                if (uid) void syncRecoveryProfileStartDate(uid, today);
                setConfirmReset(false);
              }}
              className="ds-btn ds-btn--secondary w-full"
            >
              Ja — nollställ och starta från idag
            </button>
            <button
              type="button"
              onClick={() => {
                clearDrogfrihetCounter(uid);
                setCustomDate('');
                setConfirmReset(false);
              }}
              className="ds-btn ds-btn--ghost w-full text-sm"
            >
              Ta bort räknaren helt
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="ds-btn ds-btn--ghost w-full text-sm"
            >
              Avbryt
            </button>
          </div>
        )}
      </BentoCard>
    </div>
  );
}
