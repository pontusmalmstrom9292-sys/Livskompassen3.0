/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  loadNotifPrefs,
  saveNotifPrefs,
  isInCravingWindow,
  pickNotisForNow,
  type NotificationPrefsLocal,
} from '../lib/notifPrefsLocal';
import { DF_NOTIS_BANK } from '../content/dfNotisBank';
import {
  getNativeDfBridge,
  scheduleNativeNudges,
  sendDrogfrihetNudge,
  syncDrogfrihetPushPrefs,
} from '../api/drogfrihetPushApi';
import { loadBuddyContact, saveBuddyContact } from '../lib/buddyContactLocal';

type Props = {
  uid?: string;
};

export function NotifPrefsPanel({ uid }: Props) {
  const [prefs, setPrefs] = useState<NotificationPrefsLocal>(() => loadNotifPrefs(uid));
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const soft = prefs.optIn && isInCravingWindow(prefs);
  const hasNative = Boolean(getNativeDfBridge()?.scheduleDrogfrihetNudges);

  return (
    <BentoCard title="Påminnelser (opt-in)" icon={<Bell className="h-4 w-4" />} glow="green">
      <p className="text-xs text-text-dim">
        Opt-in. Quiet hours default 22–07. Android: lokal schemaläggning + FCM. Ingen jakt, max en
        mjuk nudge per dag.
      </p>
      <label className="mt-3 flex min-h-[44px] items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={prefs.optIn}
          onChange={(e) => setPrefs((p) => ({ ...p, optIn: e.target.checked }))}
        />
        Aktivera craving-fönster (push + lokal)
      </label>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-text-muted">
        <label>
          Quiet start
          <input
            type="number"
            min={0}
            max={23}
            value={prefs.quietStartHour}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, quietStartHour: Number(e.target.value) || 0 }))
            }
            className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-2"
          />
        </label>
        <label>
          Quiet slut
          <input
            type="number"
            min={0}
            max={23}
            value={prefs.quietEndHour}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, quietEndHour: Number(e.target.value) || 0 }))
            }
            className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-2"
          />
        </label>
      </div>
      {soft ? (
        <p className="mt-3 rounded-xl border-[0.5px] border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          {pickNotisForNow(DF_NOTIS_BANK)}
        </p>
      ) : null}
      <Button
        type="button"
        variant="secondary"
        className="mt-3 w-full min-h-[48px]"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          saveNotifPrefs(prefs, uid);
          scheduleNativeNudges(prefs);
          void syncDrogfrihetPushPrefs(prefs)
            .then((r) => {
              const buddy = loadBuddyContact(uid);
              saveBuddyContact({ ...buddy, buddyCodeMine: r.buddyCode }, uid);
              setStatus(hasNative ? 'Sparat + FCM synkad.' : 'Sparat + FCM synkad (web).');
              setSaved(true);
              window.setTimeout(() => setSaved(false), 2000);
            })
            .catch(() => {
              setStatus('Sparat lokalt. FCM-synk kräver inloggning + deploy.');
              setSaved(true);
            })
            .finally(() => setBusy(false));
        }}
      >
        Spara preferenser
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="mt-2 w-full min-h-[44px] text-xs"
        disabled={busy || !prefs.optIn}
        onClick={() => {
          setBusy(true);
          void sendDrogfrihetNudge()
            .then((r) =>
              setStatus(
                r.ok
                  ? 'FCM-nudge skickad.'
                  : r.reason === 'quiet_hours'
                    ? 'Quiet hours — ingen nudge.'
                    : r.reason === 'outside_window'
                      ? 'Utanför craving-fönster.'
                      : 'Redan skickad idag.',
              ),
            )
            .catch(() => {
              const native = getNativeDfBridge();
              if (native?.triggerPremiumNotification) {
                native.triggerPremiumNotification(
                  'Livskompassen',
                  pickNotisForNow(DF_NOTIS_BANK),
                  'daily_reminders',
                );
                setStatus('Lokal Android-notis (FCM ej tillgänglig).');
              } else {
                setStatus('Kunde inte skicka nudge.');
              }
            })
            .finally(() => setBusy(false));
        }}
      >
        Testa nudge nu
      </Button>
      {saved || status ? (
        <p className="mt-2 text-center text-xs text-accent">{status ?? 'Sparat.'}</p>
      ) : null}
    </BentoCard>
  );
}
