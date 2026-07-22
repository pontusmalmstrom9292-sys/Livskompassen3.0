import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2, Mic, MicOff, Plus } from 'lucide-react';
import { Button } from '@/design-system';
import { uploadVaultEvidence } from '@/core/firebase/storage';
import { useSpeechToText } from '@/core/hooks/useSpeechToText';
import { shouldSuggestVaultPatternScan } from '@/core/triggers/valvHandoff';
import { BODY_SIGNALS, SHIELD_STEPS, VAULT_ENTRY_MODES } from '../constants/vaultEntry';
import type { VaultEntryType, VaultLogInput } from '../types/vaultEntry';
import { HandoffBox } from '@/features/lifeJournal/diary/diary/components/HandoffBox';
import { shouldShowValvHandoff } from '@/core/triggers/valvHandoff';
import { OfflineWriteBlockedError } from '@/core/firebase/offlineWritePolicy';
import { WormSaveConfirmSheet } from '@/core/security/WormSaveConfirmSheet';
import { VaultPatternHandoff } from './VaultPatternHandoff';
import { parseSmsThreadToTwoColumn } from '../utils/smsThreadParse';
import {
  MediaAttachWithCaption,
  type PendingCaptionedMedia,
} from '@/modules/shared/media';

type VaultEntryFormProps = {
  userId: string;
  saving: boolean;
  onSave: (input: VaultLogInput) => Promise<void>;
};

export function VaultEntryForm({ userId, saving, onSave }: VaultEntryFormProps) {
  const location = useLocation();
  const [mode, setMode] = useState<VaultEntryType>('simple');
  const [category, setCategory] = useState('');
  const [truth, setTruth] = useState('');
  const [theirVersion, setTheirVersion] = useState('');
  const [myReality, setMyReality] = useState('');
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [shieldStep, setShieldStep] = useState(0);
  const [shieldWhat, setShieldWhat] = useState('');
  const [shieldFeeling, setShieldFeeling] = useState('');
  const [shieldBoundary, setShieldBoundary] = useState('');
  const [pendingMediaItems, setPendingMediaItems] = useState<PendingCaptionedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [smsThreadPaste, setSmsThreadPaste] = useState('');
  const [smsThreadSplitNotice, setSmsThreadSplitNotice] = useState(false);
  const [wormConfirmOpen, setWormConfirmOpen] = useState(false);

  useEffect(() => {
    const handoff = (location.state as { vaultHandoffText?: string } | null)?.vaultHandoffText;
    if (!handoff?.trim()) return;
    setTruth((prev) => (prev.trim() ? prev : handoff.trim()));
  }, [location.state]);

  const appendVoice = useCallback(
    (chunk: string) => {
      if (!chunk) return;
      const line = `Röstmemo: ${chunk}`;
      setTruth((prev) => (prev.trim() ? `${prev.trim()}\n${line}` : line));
    },
    [],
  );

  const { supported, isListening, start, stop } = useSpeechToText({
    lang: 'sv-SE',
    onFinal: appendVoice,
  });

  const resetForm = () => {
    setTruth('');
    setTheirVersion('');
    setMyReality('');
    setSelectedSignals([]);
    setShieldStep(0);
    setShieldWhat('');
    setShieldFeeling('');
    setShieldBoundary('');
    setPendingMediaItems([]);
    setAttachError(null);
    setPinned(false);
  };

  const toggleSignal = (signal: string) => {
    setSelectedSignals((prev) =>
      prev.includes(signal) ? prev.filter((s) => s !== signal) : [...prev, signal],
    );
  };

  const withEvidence = (payload: VaultLogInput, evidenceUrl?: string): VaultLogInput => {
    let next = evidenceUrl ? { ...payload, evidenceUrl } : payload;
    if (pinned) next = { ...next, pinned: true };
    return next;
  };

  const buildPayload = (evidenceUrl?: string): VaultLogInput | null => {
    const cat = category.trim() || 'allmänt';

    if (mode === 'simple') {
      if (!truth.trim() && !evidenceUrl) return null;
      return withEvidence(
        { action: 'bevis', category: cat, truth: truth.trim() || 'Bifogat bevis', entryType: 'simple' },
        evidenceUrl,
      );
    }

    if (mode === 'two_column') {
      if (!theirVersion.trim() && !myReality.trim() && !evidenceUrl) return null;
      const combined = `Hens version: ${theirVersion.trim() || '—'}\nMin verklighet: ${myReality.trim() || '—'}`;
      return withEvidence(
        {
          action: 'bevis',
          category: cat,
          truth: combined,
          entryType: 'two_column',
          theirVersion: theirVersion.trim(),
          myReality: myReality.trim(),
        },
        evidenceUrl,
      );
    }

    if (mode === 'three_shield') {
      if (!shieldWhat.trim() || !shieldFeeling.trim() || !shieldBoundary.trim()) return null;
      const combined = `${shieldWhat.trim()} | ${shieldFeeling.trim()} | ${shieldBoundary.trim()}`;
      return withEvidence(
        {
          action: 'bevis',
          category: cat,
          truth: combined,
          entryType: 'three_shield',
          shieldWhat: shieldWhat.trim(),
          shieldFeeling: shieldFeeling.trim(),
          shieldBoundary: shieldBoundary.trim(),
        },
        evidenceUrl,
      );
    }

    if (mode === 'body_signal') {
      if (selectedSignals.length === 0 && !truth.trim() && !evidenceUrl) return null;
      const note = truth.trim();
      const combined = [...selectedSignals, note].filter(Boolean).join(' — ');
      return withEvidence(
        {
          action: 'bevis',
          category: cat,
          truth: combined || selectedSignals.join(', ') || 'Magkänsel + bevis',
          entryType: 'body_signal',
          bodySignals: selectedSignals,
        },
        evidenceUrl,
      );
    }

    return null;
  };

  const handleSubmit = async () => {
    setAttachError(null);
    setUploading(true);
    try {
      let evidenceUrl: string | undefined;
      const captionNotes: string[] = [];
      for (let i = 0; i < pendingMediaItems.length; i++) {
        const item = pendingMediaItems[i];
        const url = await uploadVaultEvidence(userId, item.file);
        if (i === 0) evidenceUrl = url;
        const cap = item.caption.trim();
        captionNotes.push(
          cap
            ? `Bild ${i + 1} (${item.file.name}): ${cap}${i > 0 ? ` — ${url}` : ''}`
            : i > 0
              ? `Bild ${i + 1}: ${item.file.name} — ${url}`
              : '',
        );
      }
      const notes = captionNotes.filter(Boolean).join('\n');
      const payload = buildPayload(evidenceUrl);
      if (!payload) return;
      const withNotes =
        notes && payload.truth
          ? { ...payload, truth: `${payload.truth}\n\n${notes}`.slice(0, 50000) }
          : notes
            ? { ...payload, truth: notes.slice(0, 50000) }
            : payload;
      await onSave(withNotes);
      resetForm();
      setWormConfirmOpen(false);
    } catch (err) {
      if (err instanceof Error && err.message === 'vault-save-failed') {
        setAttachError('Kunde inte spara till valvet. Försök igen.');
      } else if (err instanceof OfflineWriteBlockedError) {
        setAttachError(err.message);
      } else {
        setAttachError('Kunde inte ladda upp bilaga. Försök igen.');
      }
    } finally {
      setUploading(false);
    }
  };

  const requestSave = () => {
    if (!canSave) return;
    setWormConfirmOpen(true);
  };

  const canSaveSimple = truth.trim().length > 0 || pendingMediaItems.length > 0;
  const canSaveTwo = theirVersion.trim() || myReality.trim() || pendingMediaItems.length > 0;
  const canSaveShield =
    shieldStep === 2 && shieldWhat.trim() && shieldFeeling.trim() && shieldBoundary.trim();
  const canSaveBody = selectedSignals.length > 0 || truth.trim() || pendingMediaItems.length > 0;

  const canSave =
    mode === 'simple'
      ? canSaveSimple
      : mode === 'two_column'
        ? Boolean(canSaveTwo)
        : mode === 'three_shield'
          ? canSaveShield
          : canSaveBody;

  const busy = saving || uploading;
  const handoffText = [truth, theirVersion, myReality, shieldWhat].join(' ');
  const showPatternHandoff = shouldSuggestVaultPatternScan(handoffText);
  const showValvHandoff = shouldShowValvHandoff(handoffText);

  return (
    <div className="space-y-4">
      <label className="block text-xs text-text-muted">
        Typ av post
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as VaultEntryType);
            setShieldStep(0);
          }}
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
        >
          {VAULT_ENTRY_MODES.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Kategori (valfritt)"
        className="input-glass rounded-xl px-3 py-2 w-full"
        list="vault-category-suggestions"
      />
      <datalist id="vault-category-suggestions">
        <option value="kommunikation" />
        <option value="vårdnad" />
        <option value="skola" />
        <option value="ekonomi" />
        <option value="allmänt" />
      </datalist>

      {showValvHandoff && <HandoffBox />}
      {showPatternHandoff && <VaultPatternHandoff />}

      {mode === 'simple' && (
        <textarea
          value={truth}
          onChange={(e) => setTruth(e.target.value)}
          placeholder="Sanning / bevis (fakta, datum, händelse)..."
          rows={4}
          className="input-glass rounded-xl px-3 py-2 resize-none w-full"
        />
      )}

      {mode === 'two_column' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border-subtle bg-surface/30 p-3">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-text-muted">
              Klistra hel sms-tråd
            </p>
            <textarea
              value={smsThreadPaste}
              onChange={(e) => {
                setSmsThreadPaste(e.target.value);
                if (smsThreadSplitNotice) setSmsThreadSplitNotice(false);
              }}
              placeholder="Klistra hela konversationen — rader med «Namn:» delas automatiskt"
              rows={3}
              className="input-glass w-full resize-none rounded-xl px-3 py-2 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              disabled={smsThreadPaste.trim().length < 20}
              onClick={() => {
                const parsed = parseSmsThreadToTwoColumn(smsThreadPaste);
                if (parsed) {
                  setTheirVersion(parsed.theirVersion);
                  setMyReality(parsed.myReality);
                  setSmsThreadPaste('');
                  setSmsThreadSplitNotice(true);
                }
              }}
            >
              Dela i två kolumner
            </Button>
            {smsThreadSplitNotice ? (
              <p className="mt-2 text-xs text-accent/90" role="status">
                Tråden är uppdelad i två kolumner. Granska innan du sparar.
              </p>
            ) : null}
          </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-text-muted">Hens version</p>
            <textarea
              value={theirVersion}
              onChange={(e) => setTheirVersion(e.target.value)}
              placeholder="Agerande / påstående..."
              rows={4}
              className="input-glass rounded-xl px-3 py-2 resize-none w-full"
            />
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-text-muted">Min verklighet</p>
            <textarea
              value={myReality}
              onChange={(e) => setMyReality(e.target.value)}
              placeholder="Fakta jag dokumenterar..."
              rows={4}
              className="input-glass rounded-xl px-3 py-2 resize-none w-full"
            />
          </div>
        </div>
        </div>
      )}

      {mode === 'three_shield' && (
        <div className="space-y-3">
          {SHIELD_STEPS.map((step, idx) => {
            if (idx !== shieldStep) return null;
            const value =
              idx === 0 ? shieldWhat : idx === 1 ? shieldFeeling : shieldBoundary;
            const setValue =
              idx === 0 ? setShieldWhat : idx === 1 ? setShieldFeeling : setShieldBoundary;
            return (
              <div key={step.key}>
                <p className="mb-2 text-xs uppercase tracking-widest text-accent">
                  Steg {idx + 1} — {step.label}
                </p>
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={step.placeholder}
                  rows={3}
                  className="input-glass rounded-xl px-3 py-2 resize-none w-full"
                />
                <div className="mt-2 flex gap-2">
                  {idx > 0 && (
                    <Button type="button" variant="ghost" onClick={() => setShieldStep(idx - 1)} className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
                      Tillbaka
                    </Button>
                  )}
                  {idx < 2 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={!value.trim()}
                      onClick={() => setShieldStep(idx + 1)} className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
                      Fortsätt
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode === 'body_signal' && (
        <div className="space-y-3">
          <label className="block text-xs text-text-muted">
            Magkänsel — lägg till signal
            <select
              className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
              value=""
              onChange={(e) => {
                const v = e.target.value;
                if (v) toggleSignal(v);
              }}
            >
              <option value="">Välj signal…</option>
              {BODY_SIGNALS.filter((s) => !selectedSignals.includes(s)).map((signal) => (
                <option key={signal} value={signal}>
                  {signal}
                </option>
              ))}
            </select>
          </label>
          {selectedSignals.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
              <span>Valda: {selectedSignals.join(', ')}</span>
              <button
                type="button"
                className="text-accent/80 underline min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                onClick={() => setSelectedSignals([])}
              >
                Rensa
              </button>
            </div>
          )}
          <textarea
            value={truth}
            onChange={(e) => setTruth(e.target.value)}
            placeholder="Valfri kort notering..."
            rows={2}
            className="input-glass rounded-xl px-3 py-2 resize-none w-full"
          />
        </div>
      )}

      <div className="glass-card space-y-2 p-3">
        <p className="text-[10px] uppercase tracking-widest text-text-muted">Bifoga bevis</p>
        <MediaAttachWithCaption
          disabled={busy}
          items={pendingMediaItems}
          onChange={setPendingMediaItems}
          onValidationError={setAttachError}
          accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif"
          helperText="Skärmdump med valfri bildtext. Max två (t.ex. motsägelse)."
          captionPlaceholder="t.ex. Isabelle skickade detta; igår sa hon…"
        />
        {supported && (
          <Button type="button" variant="ghost" onClick={isListening ? stop : start} disabled={busy} className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            Röstmemo
          </Button>
        )}
        {attachError && <p className="text-xs text-danger">{attachError}</p>}
      </div>

      <label className="flex items-center gap-2 text-xs text-text-muted">
        <input
          type="checkbox"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}
          className="rounded border-border-strong"
        />
        Sanningens Ankare — fäst post (read-only i Morgonkompassen)
      </label>

      {wormConfirmOpen ? (
        <WormSaveConfirmSheet
          busy={busy || uploading}
          onConfirm={() => void handleSubmit()}
          onCancel={() => setWormConfirmOpen(false)}
        />
      ) : (
        <Button
          type="button"
          variant="success"
          onClick={requestSave}
          disabled={busy || !canSave} className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
              {busy || uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </span>
            <span>Spara bevis</span>
          </span>
        </Button>
      )}
    </div>
  );
}
