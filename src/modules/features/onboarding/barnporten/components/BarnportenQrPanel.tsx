import './barnporten.css';
import { Button } from '@/design-system';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { Loader2, Smartphone } from 'lucide-react';
import { db } from '@/core/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@/core/types/firestore';
import { useStore } from '@/core/store';
import { CHILD_ALIASES, type ChildAlias } from '@/features/family/children/constants';
import type { FunctionsError } from 'firebase/functions';
import { createBarnportenPairing } from '../api/barnportenPairingService';

function extractCallableErrorMessage(error: unknown): string {
  const fnError = error as FunctionsError & { details?: unknown };
  if (typeof fnError.message === 'string' && fnError.message.trim()) {
    return fnError.message;
  }
  if (typeof fnError.details === 'string' && fnError.details.trim()) {
    return fnError.details;
  }
  return 'Kunde inte skapa QR. Kontrollera nät och att functions är deployade.';
}

type DeviceRow = {
  id: string;
  childAlias: string;
  deviceLabel: string;
  deviceId: string;
  approvedAt?: string;
};

/** Förälder — QR enhetskoppling (Våg B). */
export function BarnportenQrPanel() {
  const user = useStore((s) => s.user);
  const [childAlias, setChildAlias] = useState<ChildAlias>('Kasper');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pairUrl, setPairUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pairUrl || !zoneRef.current) {
      setQrDataUrl(null);
      return;
    }
    const style = getComputedStyle(zoneRef.current);
    const dark = style.getPropertyValue('--barnporten-qr-dark').trim();
    const light = style.getPropertyValue('--barnporten-qr-light').trim();
    if (!dark || !light) {
      setQrDataUrl(null);
      return;
    }
    void QRCode.toDataURL(pairUrl, {
      margin: 2,
      width: 220,
      color: { dark, light },
    }).then(setQrDataUrl);
  }, [pairUrl]);

  useEffect(() => {
    if (!user) {
      setDevices([]);
      return;
    }
    const ref = collection(db, FIRESTORE_COLLECTIONS.barnporten_devices);
    const q = query(ref, where('ownerId', '==', user.uid), limit(20));
    return onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => {
        const data = d.data();
        const approved = data.parentApprovedAt;
        return {
          id: d.id,
          childAlias: String(data.childAlias ?? ''),
          deviceLabel: String(data.deviceLabel ?? 'Barnenhet'),
          deviceId: String(data.deviceId ?? ''),
          approvedAt:
            approved && typeof approved === 'object' && 'toDate' in approved
              ? (approved as { toDate: () => Date }).toDate().toLocaleString('sv-SE')
              : undefined,
        };
      });
      setDevices(rows.sort((a, b) => (b.approvedAt ?? '').localeCompare(a.approvedAt ?? '')));
    });
  }, [user]);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createBarnportenPairing(childAlias);
      setPairUrl(result.pairUrl);
      setToken(result.token);
      setExpiresAt(
        new Date(result.expiresAt).toLocaleTimeString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    } catch (error) {
      setError(extractCallableErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div ref={zoneRef} className="barnporten-zone familjen-tab-surface space-y-3">
      <div className="flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-accent" aria-hidden />
        <p className="text-[10px] uppercase tracking-widest text-accent/90">Koppla barns telefon</p>
      </div>
      <p className="text-xs text-text-dim">
        Skanna QR på barnens enhet (samma Google-konto inloggat). Koden gäller 15 min.
      </p>

      <div className="flex flex-wrap gap-2">
        {CHILD_ALIASES.map((alias) => (
          <Button
            key={alias}
            type="button"
            variant={childAlias === alias ? 'accent' : 'ghost'}
            className="text-xs"
            onClick={() => setChildAlias(alias)}
          >
            {alias}
          </Button>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full text-sm"
        disabled={loading}
        onClick={() => void handleCreate()}
      >
        {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Skapa QR-kod'}
      </Button>

      {error ? <p className="text-xs text-danger">{error}</p> : null}

      {qrDataUrl && token ? (
        <div className="barnporten-qr-panel flex flex-col items-center gap-2 rounded-xl border border-amber-400/15 p-3">
          <img src={qrDataUrl} alt={`QR för ${childAlias}`} className="rounded-lg" width={220} height={220} />
          <p className="text-center text-xs text-text-muted">
            Kod: <span className="font-mono text-accent">{token}</span>
            {expiresAt ? ` · gäller till ${expiresAt}` : null}
          </p>
          <p className="break-all text-center text-[10px] text-text-dim">{pairUrl}</p>
        </div>
      ) : null}

      {devices.length > 0 ? (
        <div className="space-y-2 border-t border-white/10 pt-3">
          <p className="text-[10px] uppercase tracking-widest text-text-dim">Kopplade enheter</p>
          <ul className="space-y-1 text-xs text-text-muted">
            {devices.map((d) => (
              <li key={d.id}>
                {d.childAlias} · {d.deviceLabel}
                {d.approvedAt ? ` · ${d.approvedAt}` : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
