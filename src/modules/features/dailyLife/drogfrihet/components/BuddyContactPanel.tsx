/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
import { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  buddySmsHref,
  buddyTelHref,
  loadBuddyContact,
  saveBuddyContact,
  type BuddyContactLocal,
} from '../lib/buddyContactLocal';
import { linkDrogfrihetBuddy, pingDrogfrihetBuddy } from '../api/drogfrihetPushApi';

type Props = { uid?: string };

export function BuddyContactPanel({ uid }: Props) {
  const [c, setC] = useState<BuddyContactLocal>(() => loadBuddyContact(uid));
  const [peerCode, setPeerCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const tel = buddyTelHref(c.phoneE164);
  const sms = buddySmsHref(c.phoneE164);

  return (
    <BentoCard title="Trygg person (1:1)" icon={<Users className="h-4 w-4" />} glow="green">
      <p className="text-xs text-text-muted">
        Privat kontaktkort. Telefon stannar på enheten. Ingen feed, ingen Valv-dela.
      </p>
      <label className="mt-3 block text-xs text-text-muted">
        Namn
        <input
          value={c.displayName}
          onChange={(e) => setC((p) => ({ ...p, displayName: e.target.value }))}
          className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm text-text"
          maxLength={40}
          autoComplete="name"
        />
      </label>
      <label className="mt-2 block text-xs text-text-muted">
        Telefon
        <input
          value={c.phoneE164}
          onChange={(e) => setC((p) => ({ ...p, phoneE164: e.target.value }))}
          className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm text-text"
          inputMode="tel"
          placeholder="+46…"
          autoComplete="tel"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          className="min-h-[48px] flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={() => {
            saveBuddyContact(c, uid);
            setMsg('Sparat lokalt.');
            window.setTimeout(() => setMsg(null), 1500);
          }}
        >
          Spara
        </Button>
        {tel ? (
          <a href={tel} className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-[0.5px] border-border bg-surface/50 px-3 text-sm text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            Ring
          </a>
        ) : null}
        {sms ? (
          <a href={sms} className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-[0.5px] border-border bg-surface/50 px-3 text-sm text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            SMS
          </a>
        ) : null}
      </div>

      {c.buddyCodeMine ? (
        <p className="mt-3 text-xs text-text-muted">
          Din kod: <span className="font-medium text-accent">{c.buddyCodeMine}</span>
        </p>
      ) : (
        <p className="mt-3 text-xs text-text-muted">Aktivera påminnelser för att få en buddy-kod.</p>
      )}

      <label className="mt-2 block text-xs text-text-muted">
        Länka buddy (deras kod)
        <input
          value={peerCode}
          onChange={(e) => setPeerCode(e.target.value.toUpperCase())}
          className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm tracking-widest text-text"
          maxLength={8}
          autoCapitalize="characters"
        />
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          className="min-h-[48px] flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          disabled={busy || peerCode.trim().length < 4}
          onClick={() => {
            setBusy(true);
            void linkDrogfrihetBuddy(peerCode.trim())
              .then(() => {
                const next = { ...c, linked: true };
                saveBuddyContact(next, uid);
                setC(next);
                setMsg('Buddy länkad.');
              })
              .catch(() => setMsg('Kunde inte länka. Kontrollera koden.'))
              .finally(() => setBusy(false));
          }}
        >
          Länka
        </Button>
        <Button
          type="button"
          variant="accent"
          className="min-h-[48px] flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          disabled={busy || !c.linked}
          onClick={() => {
            setBusy(true);
            void pingDrogfrihetBuddy()
              .then((r) => setMsg(r.ok ? 'Ping skickad.' : 'Redan pingat idag.'))
              .catch(() => setMsg('Ping misslyckades.'))
              .finally(() => setBusy(false));
          }}
        >
          Ping buddy
        </Button>
      </div>
      {msg ? <p className="mt-2 text-center text-xs text-accent">{msg}</p> : null}
    </BentoCard>
  );
}
