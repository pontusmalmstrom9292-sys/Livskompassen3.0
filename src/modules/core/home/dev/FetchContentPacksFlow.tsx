/**
 * @locked MOD-CORE-UTV — låst modul; unlock via docs/evaluations/*-unlock-MOD-CORE-UTV.md
 * Delat flöde: Hämta / uppdatera faktapack (widget + Inställningar).
 * 1 steg i taget — lista → bekräfta → unlock. 0 AI-kostnad.
 */
import { useEffect, useMemo, useState } from 'react';
import { Loader2, Package } from 'lucide-react';
import { Button } from '@/design-system';
import { useNativeHaptics } from '@/shared/utils/nativeHaptics';
import { mergeEvolutionHub } from '@/core/firebase/evolutionLedgerFirestore';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import {
  listComingPacks,
  listFetchablePacks,
  packHasNewerVersion,
} from './contentPackCatalog';
import type { ContentPack } from './contentPackTypes';

type Step = 'list' | 'confirm' | 'done' | 'empty';

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  /** Efter lyckad aktivering (t.ex. rebuild mix). */
  onActivated?: (packId: string) => void;
  /** Öppna skapa-egen-kategori från tom-state. */
  onRequestCustomCategory?: () => void;
};

export function FetchContentPacksFlow({
  open,
  onClose,
  userId,
  onActivated,
  onRequestCustomCategory,
}: Props) {
  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const listenToEvolutionHub = useEvolutionStore((s) => s.listenToEvolutionHub);
  const hubUnlocked = evolutionDoc?.unlockedPacks ?? [];
  const versions = evolutionDoc?.contentPackVersions;
  const { success: triggerSuccess } = useNativeHaptics();

  const fetchable = useMemo(() => listFetchablePacks(hubUnlocked), [hubUnlocked]);
  const coming = useMemo(() => listComingPacks(), []);

  const [step, setStep] = useState<Step>('list');
  const [selected, setSelected] = useState<ContentPack | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneTitle, setDoneTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !userId) return;
    return listenToEvolutionHub(userId);
  }, [open, userId, listenToEvolutionHub]);

  useEffect(() => {
    if (!open) return;
    setStep(fetchable.length === 0 ? 'empty' : 'list');
    setSelected(null);
    setError(null);
    setDoneTitle(null);
    setSaving(false);
  }, [open, fetchable.length]);

  const handlePick = (pack: ContentPack) => {
    setSelected(pack);
    setStep('confirm');
    setError(null);
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const nextUnlocked = [...new Set([...hubUnlocked, selected.id])];

      await mergeEvolutionHub(userId, {
        unlockedPacks: nextUnlocked,
        contentPackVersions: {
          ...(versions ?? {}),
          [selected.id]: selected.version,
        },
      });
      triggerSuccess();
      setDoneTitle(selected.title_sv);
      setStep('done');
      onActivated?.(selected.id);
    } catch {
      setError('Kunde inte aktivera pack. Försök igen.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Hämta faktapack"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/40 bg-surface-1 p-4 shadow-xl">
        <div className="mb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-accent" aria-hidden />
          <h2 className="text-sm font-semibold text-text">Hämta faktapack</h2>
        </div>

        {step === 'list' ? (
          <div className="space-y-3">
            <p className="text-xs text-text-muted">
              Gratis · i appen. Välj ett pack — mixen fylls på direkt.
            </p>
            <ul className="space-y-2" aria-label="Tillgängliga pack">
              {fetchable.map((pack) => {
                const newer = packHasNewerVersion(pack, versions);
                return (
                  <li key={pack.id}>
                    <button
                      type="button"
                      className="flex min-h-[44px] w-full flex-col items-start rounded-xl border border-border/30 bg-surface-2/60 px-3 py-2.5 text-left transition-colors hover:border-accent/35"
                      onClick={() => handlePick(pack)}
                    >
                      <span className="text-sm font-medium text-text">
                        {pack.title_sv}
                        {newer ? (
                          <span className="ml-2 text-[10px] uppercase tracking-widest text-accent">
                            Uppdatering
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 text-xs text-text-muted">{pack.lead_sv}</span>
                      <span className="mt-1 text-[10px] uppercase tracking-widest text-text-dim">
                        gratis · i appen
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {coming.length > 0 ? (
              <div className="space-y-1 border-t border-border/20 pt-3">
                <p className="text-[10px] uppercase tracking-widest text-text-dim">Kommer snart</p>
                {coming.map((pack) => (
                  <div
                    key={pack.id}
                    className="rounded-xl border border-border/20 bg-surface-2/30 px-3 py-2 opacity-60"
                  >
                    <p className="text-sm text-text-muted">{pack.title_sv}</p>
                    <p className="text-xs text-text-dim">{pack.lead_sv}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <Button type="button" variant="ghost" className="min-h-[44px] w-full" onClick={onClose}>
              Stäng
            </Button>
          </div>
        ) : null}

        {step === 'confirm' && selected ? (
          <div className="space-y-3">
            <p className="text-sm text-text">Aktivera «{selected.title_sv}»?</p>
            <p className="text-xs text-text-muted">{selected.lead_sv}</p>
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                className="min-h-[44px] flex-1"
                disabled={saving}
                onClick={() => void handleConfirm()}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden />
                    Aktiverar …
                  </>
                ) : (
                  'Aktivera'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="min-h-[44px] flex-1"
                disabled={saving}
                onClick={() => {
                  setSelected(null);
                  setStep('list');
                }}
              >
                Tillbaka
              </Button>
            </div>
          </div>
        ) : null}

        {step === 'done' ? (
          <div className="space-y-3">
            <p className="text-sm text-accent" role="status">
              Pack aktiverat{doneTitle ? `: ${doneTitle}` : ''}. Syns under Mer för dig.
            </p>
            <Button type="button" variant="secondary" className="min-h-[44px] w-full" onClick={onClose}>
              Klar
            </Button>
          </div>
        ) : null}

        {step === 'empty' ? (
          <div className="space-y-3">
            <p className="text-sm text-text-muted">
              Inga nya pack just nu — fler kommer i app-uppdatering.
            </p>
            {coming.length > 0 ? (
              <ul className="space-y-1">
                {coming.map((p) => (
                  <li key={p.id} className="text-xs text-text-dim">
                    · {p.title_sv}
                  </li>
                ))}
              </ul>
            ) : null}
            {onRequestCustomCategory ? (
              <Button
                type="button"
                variant="secondary"
                className="min-h-[44px] w-full"
                onClick={() => {
                  onClose();
                  onRequestCustomCategory();
                }}
              >
                Skapa egen kategori
              </Button>
            ) : null}
            <Button type="button" variant="ghost" className="min-h-[44px] w-full" onClick={onClose}>
              Stäng
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type { Props as FetchContentPacksFlowProps };
