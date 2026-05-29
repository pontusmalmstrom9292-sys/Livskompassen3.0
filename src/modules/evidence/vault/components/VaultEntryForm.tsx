import { useCallback, useState } from 'react';
import { ImagePlus, Loader2, Mic, MicOff, Plus } from 'lucide-react';
import { uploadVaultEvidence } from '../../../core/firebase/storage';
import { useSpeechToText } from '../../../core/hooks/useSpeechToText';
import { shouldSuggestVaultPatternScan } from '../../../core/triggers/valvHandoff';
import { BODY_SIGNALS, SHIELD_STEPS, VAULT_ENTRY_MODES } from '../constants/vaultEntry';
import type { VaultEntryType, VaultLogInput } from '../types/vaultEntry';
import { HandoffBox } from '../../../diary/diary/components/HandoffBox';
import { shouldShowValvHandoff } from '../../../core/triggers/valvHandoff';
import { OfflineWriteBlockedError } from '../../../core/firebase/offlineWritePolicy';
import { VaultPatternHandoff } from './VaultPatternHandoff';
import { parseSmsThreadToTwoColumn } from '../utils/smsThreadParse';

type VaultEntryFormProps = {
  userId: string;
  saving: boolean;
  onSave: (input: VaultLogInput) => Promise<void>;
};

export function VaultEntryForm({ userId, saving, onSave }: VaultEntryFormProps) {
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
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [smsThreadPaste, setSmsThreadPaste] = useState('');

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
    setPendingFile(null);
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
      if (pendingFile) {
        evidenceUrl = await uploadVaultEvidence(userId, pendingFile);
      }
      const payload = buildPayload(evidenceUrl);
      if (!payload) return;
      await onSave(payload);
      resetForm();
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

  const canSaveSimple = truth.trim().length > 0 || Boolean(pendingFile);
  const canSaveTwo = theirVersion.trim() || myReality.trim() || Boolean(pendingFile);
  const canSaveShield =
    shieldStep === 2 && shieldWhat.trim() && shieldFeeling.trim() && shieldBoundary.trim();
  const canSaveBody = selectedSignals.length > 0 || truth.trim() || Boolean(pendingFile);

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
            <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">
              Klistra hel sms-tråd
            </p>
            <textarea
              value={smsThreadPaste}
              onChange={(e) => setSmsThreadPaste(e.target.value)}
              placeholder="Klistra hela konversationen — rader med «Namn:» delas automatiskt"
              rows={3}
              className="input-glass w-full resize-none rounded-xl px-3 py-2 text-sm"
            />
            <button
              type="button"
              className="btn-pill--ghost mt-2 text-xs"
              disabled={smsThreadPaste.trim().length < 20}
              onClick={() => {
                const parsed = parseSmsThreadToTwoColumn(smsThreadPaste);
                if (parsed) {
                  setTheirVersion(parsed.theirVersion);
                  setMyReality(parsed.myReality);
                  setSmsThreadPaste('');
                }
              }}
            >
              Dela i två kolumner
            </button>
          </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-text-dim">Hens version</p>
            <textarea
              value={theirVersion}
              onChange={(e) => setTheirVersion(e.target.value)}
              placeholder="Agerande / påstående..."
              rows={4}
              className="input-glass rounded-xl px-3 py-2 resize-none w-full"
            />
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-text-dim">Min verklighet</p>
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
                    <button
                      type="button"
                      onClick={() => setShieldStep(idx - 1)}
                      className="btn-pill--ghost"
                    >
                      Tillbaka
                    </button>
                  )}
                  {idx < 2 ? (
                    <button
                      type="button"
                      disabled={!value.trim()}
                      onClick={() => setShieldStep(idx + 1)}
                      className="btn-pill--secondary disabled:opacity-50"
                    >
                      Fortsätt
                    </button>
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
            <p className="text-xs text-text-dim">
              Valda: {selectedSignals.join(', ')}{' '}
              <button
                type="button"
                className="text-accent/80 underline"
                onClick={() => setSelectedSignals([])}
              >
                Rensa
              </button>
            </p>
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
        <p className="text-[10px] uppercase tracking-widest text-text-dim">Bifoga bevis</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="btn-pill--ghost cursor-pointer">
            <ImagePlus className="h-4 w-4" />
            Skärmdump
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {supported && (
            <button
              type="button"
              onClick={isListening ? stop : start}
              className="btn-pill--ghost"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              Röstmemo
            </button>
          )}
        </div>
        {pendingFile && (
          <p className="text-xs text-text-muted">Vald fil: {pendingFile.name}</p>
        )}
        {attachError && <p className="text-xs text-danger">{attachError}</p>}
      </div>

      <label className="flex items-center gap-2 text-xs text-text-dim">
        <input
          type="checkbox"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}
          className="rounded border-border-strong"
        />
        Sanningens Ankare — fäst post (read-only i Morgonkompassen)
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={busy || !canSave}
        className="btn-pill--success disabled:opacity-50 flex items-center gap-2"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Spara bevis
      </button>
    </div>
  );
}
