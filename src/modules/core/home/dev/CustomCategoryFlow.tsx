/**
 * Skapa egen kategori — max 8. USER-TEXT steps eller koppling till pack.
 * Lagras på evolution_hub.customDevCategories (liten payload).
 */
import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button, Input, TextArea } from '@/design-system';
import { useNativeHaptics } from '@/shared/utils/nativeHaptics';
import { mergeEvolutionHub } from '@/core/firebase/evolutionLedgerFirestore';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { resolveUnlockedPackIds, getContentPack } from './contentPackCatalog';
import { MAX_CUSTOM_CATEGORIES, type CustomCategory } from './contentPackTypes';

type Step = 'form' | 'done' | 'full';

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSaved?: () => void;
};

function shortId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}${rand}`;
}

export function CustomCategoryFlow({ open, onClose, userId, onSaved }: Props) {
  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const listenToEvolutionHub = useEvolutionStore((s) => s.listenToEvolutionHub);
  const { success: triggerSuccess } = useNativeHaptics();
  const existing = (evolutionDoc?.customDevCategories ?? []) as CustomCategory[];
  const hubUnlocked = evolutionDoc?.unlockedPacks ?? [];
  const linkablePacks = useMemo(() => {
    return resolveUnlockedPackIds(hubUnlocked)
      .map((id) => getContentPack(id))
      .filter((p): p is NonNullable<ReturnType<typeof getContentPack>> =>
        Boolean(p && p.bankIds.length > 0),
      );
  }, [hubUnlocked]);

  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stepText, setStepText] = useState('');
  const [linkedPackId, setLinkedPackId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !userId) return;
    return listenToEvolutionHub(userId);
  }, [open, userId, listenToEvolutionHub]);

  useEffect(() => {
    if (!open) return;
    setStep(existing.length >= MAX_CUSTOM_CATEGORIES ? 'full' : 'form');
    setName('');
    setDescription('');
    setStepText('');
    setLinkedPackId('');
    setError(null);
    setSaving(false);
  }, [open, existing.length]);

  const handleSave = async () => {
    const trimmedName = name.trim().slice(0, 40);
    if (!trimmedName) {
      setError('Ange ett kategorinamn.');
      return;
    }
    const body = stepText.trim().slice(0, 280);
    if (!body && !linkedPackId) {
      setError('Lägg till minst en fråga eller koppla till ett pack.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const cat: CustomCategory = {
        id: shortId('custom_'),
        name_sv: trimmedName,
        description_sv: description.trim().slice(0, 120) || undefined,
        createdAt: new Date().toISOString(),
        linkedPackId: linkedPackId || undefined,
        steps: body
          ? [{ bankId: shortId('uc_').slice(0, 32), body_sv: body }]
          : [],
      };
      const next = [...existing, cat].slice(0, MAX_CUSTOM_CATEGORIES);
      await mergeEvolutionHub(userId, { customDevCategories: next });
      triggerSuccess();
      setStep('done');
      onSaved?.();
    } catch {
      setError('Kunde inte spara. Försök igen.');
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
      aria-label="Lägg till kategori"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/40 bg-surface-1 p-4 shadow-xl">
        <div className="mb-3 flex items-center gap-2">
          <Plus className="h-4 w-4 text-accent" aria-hidden />
          <h2 className="text-sm font-semibold text-text">Lägg till kategori</h2>
        </div>

        {step === 'full' ? (
          <div className="space-y-3">
            <p className="text-sm text-text-muted">
              Max {MAX_CUSTOM_CATEGORIES} egna kategorier. Ta bort en senare om du vill lägga till ny.
            </p>
            <Button type="button" variant="ghost" className="min-h-[44px] w-full" onClick={onClose}>
              Stäng
            </Button>
          </div>
        ) : null}

        {step === 'form' ? (
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-dim">
                Namn
              </span>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="min-h-[44px] w-full rounded-xl border-border/30 bg-surface-2/60 px-3 text-sm text-text"
                placeholder="T.ex. Simning"
                aria-label="Kategorinamn"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-dim">
                Kort beskrivning (valfritt)
              </span>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={120}
                className="min-h-[44px] w-full rounded-xl border-border/30 bg-surface-2/60 px-3 text-sm text-text"
                placeholder="Vad vill du lära dig?"
                aria-label="Beskrivning"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-dim">
                Första mikrosteg / fråga (valfritt om pack)
              </span>
              <TextArea
                value={stepText}
                onChange={(e) => setStepText(e.target.value)}
                rows={2}
                className="w-full text-sm"
                placeholder="Skriv en fråga du vill kunna svara på"
                aria-label="Eget mikrosteg"
              />
            </label>
            {linkablePacks.length > 0 ? (
              <label className="block space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-text-dim">
                  Koppla till pack (valfritt)
                </span>
                <select
                  value={linkedPackId}
                  onChange={(e) => setLinkedPackId(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-border/30 bg-surface-2/60 px-3 text-sm text-text"
                  aria-label="Koppla till pack"
                >
                  <option value="">Ingen koppling</option>
                  {linkablePacks.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title_sv}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                className="min-h-[44px] flex-1"
                disabled={saving}
                onClick={() => void handleSave()}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden />
                    Sparar …
                  </>
                ) : (
                  'Spara kategori'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="min-h-[44px] flex-1"
                disabled={saving}
                onClick={onClose}
              >
                Avbryt
              </Button>
            </div>
          </div>
        ) : null}

        {step === 'done' ? (
          <div className="space-y-3">
            <p className="text-sm text-accent" role="status">
              Kategori sparad — den ingår i mixen.
            </p>
            <Button type="button" variant="secondary" className="min-h-[44px] w-full" onClick={onClose}>
              Klar
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
