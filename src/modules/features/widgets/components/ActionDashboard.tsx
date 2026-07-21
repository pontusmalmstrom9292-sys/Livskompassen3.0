import { useCallback, useEffect, useRef, useState } from 'react';
import { TextArea, textStyles } from '@/design-system';
import {
  Camera,
  Check,
  Clock,
  Loader2,
  Lock,
  Mic,
  MicOff,
  PenLine,
  Plus,
  Sparkles,
  Square,
  Users,
} from 'lucide-react';
import { useAudioRecorder } from '@/core/hooks/useAudioRecorder';
import { useSpeechToText } from '@/core/hooks/useSpeechToText';
import { StampClockControls } from '@/features/admin/stampla/components/StampClockControls';
import { useStampClock } from '@/features/admin/stampla/hooks/useStampClock';
import {
  CHILD_ALIASES,
  LIVSLOGG_CATEGORIES,
  type ChildAlias,
  type LivsloggCategory,
} from '@/features/family/children/constants';
import { STUND_MAX_CHARS } from '@/features/family/children/utils/childMomentHelpers';
import { WidgetDashboardSection } from './WidgetDashboardSection';
import {
  saveActionChildLog,
  saveActionReflection,
  saveActionVaultRecording,
} from '../api/actionDashboardApi';
import { pendingActionDashboardCount } from '../api/actionDashboardOfflineQueue';
import {
  useWidgetRecordingEthicsAccepted,
  WidgetRecordingEthicsGate,
} from './WidgetRecordingEthicsGate';
import { WidgetButton } from './WidgetButton';
import { WidgetActionGrid } from './WidgetActionTile';

const REFLECTION_MAX_CHARS = 500;

type Props = {
  userId: string | undefined;
  onQueueChange?: () => void;
  flushTick?: number;
};

function formatStampTime(date: Date): string {
  return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

function QueuedBanner({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-accent"
    >
      {count} {count === 1 ? 'post väntar' : 'poster väntar'} på synk — laddas upp när nätet finns.
    </p>
  );
}

function MultiToolCard({ userId, onQueueChange }: Props) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [queued, setQueued] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recPhase, setRecPhase] = useState<'idle' | 'recording' | 'processing' | 'done'>('idle');
  const [recQueued, setRecQueued] = useState(false);
  const [recTitle, setRecTitle] = useState<string | null>(null);
  const [recError, setRecError] = useState<string | null>(null);
  const [showEthicsGate, setShowEthicsGate] = useState(false);
  const { accepted: ethicsOk, accept: acceptEthics } = useWidgetRecordingEthicsAccepted();
  const transcriptParts = useRef<string[]>([]);
  const startedAt = useRef<Date | null>(null);

  const speech = useSpeechToText({
    lang: 'sv-SE',
    onFinal: (line) => {
      if (line.trim()) transcriptParts.current.push(line.trim());
    },
  });

  const onRecorded = useCallback(
    async (file: File) => {
      if (!userId) {
        setRecError('Logga in för att spara i Valvet.');
        setRecPhase('idle');
        return;
      }
      setRecPhase('processing');
      setRecError(null);
      const recordedAt = startedAt.current ?? new Date();
      const durationSeconds = startedAt.current
        ? Math.round((Date.now() - startedAt.current.getTime()) / 1000)
        : undefined;
      const transcript = transcriptParts.current.join(' ').trim();
      try {
        const result = await saveActionVaultRecording(
          userId,
          file,
          transcript,
          recordedAt,
          durationSeconds,
        );
        setRecQueued(result.queued);
        if (result.queued) onQueueChange?.();
        setRecTitle(result.title ?? 'Inspelning');
        setRecPhase('done');
      } catch (err) {
        setRecError(err instanceof Error ? err.message : 'Kunde inte spara inspelning.');
        setRecPhase('idle');
      }
    },
    [userId, onQueueChange],
  );

  const audio = useAudioRecorder({ onRecorded });

  const startRecording = async () => {
    if (!userId) {
      setRecError('Logga in först.');
      return;
    }
    setShowEthicsGate(false);
    setRecError(null);
    setRecTitle(null);
    setRecQueued(false);
    transcriptParts.current = [];
    startedAt.current = new Date();
    speech.start();
    const ok = await audio.start();
    if (!ok) {
      speech.stop();
      setRecError(audio.error ?? 'Kunde inte starta mikrofon.');
      setRecPhase('idle');
      return;
    }
    setRecPhase('recording');
  };

  const handleMicClick = () => {
    if (!ethicsOk) {
      setShowEthicsGate(true);
      return;
    }
    void startRecording();
  };

  const handleEthicsAccept = () => {
    acceptEthics();
    setShowEthicsGate(false);
    void startRecording();
  };

  const stopRecording = () => {
    speech.stop();
    audio.stop();
    window.setTimeout(() => {
      setRecPhase((phase) => {
        if (phase === 'recording') {
          setRecError('Inget ljud fångades. Försök igen.');
          return 'idle';
        }
        return phase;
      });
    }, 2000);
  };

  const handleSaveText = async () => {
    if (!userId || !text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const result = await saveActionReflection(userId, text);
      setQueued(result.queued);
      if (result.queued) onQueueChange?.();
      setDone(true);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara.');
    } finally {
      setSaving(false);
    }
  };

  if (recPhase === 'done') {
    return (
      <WidgetDashboardSection
        title="Multiverktyg"
        description="Kort reflektion"
        icon={<Sparkles className="h-4 w-4" />}
        glow="blue"
        className="overflow-hidden"
      >
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-sm text-success">
            <Lock className="h-4 w-4" aria-hidden />
            {recQueued ? 'Inspelning köad — synkas till Valvet vid nät.' : `Låst i Valvet: ${recTitle}`}
          </p>
          {!recQueued && (
            <p className="text-xs text-text-muted">Sparat i Valvet — öppna appen vid behov.</p>
          )}
          <WidgetButton
            type="button"
            variant="ghost"
            fullWidth
            className="text-xs"
            onClick={() => {
              setRecPhase('idle');
              setRecTitle(null);
            }}
          >
            Ny inspelning
          </WidgetButton>
        </div>
      </WidgetDashboardSection>
    );
  }

  if (done) {
    return (
      <WidgetDashboardSection
        title="Multiverktyg"
        description="Kort reflektion"
        icon={<Sparkles className="h-4 w-4" />}
        glow="blue"
        className="overflow-hidden"
      >
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-sm text-success">
            <Lock className="h-4 w-4" aria-hidden />
            {queued ? 'Reflektion köad — synkas till Valvet vid nät.' : 'Låst i Valvet.'}
          </p>
          {!queued && (
            <p className="text-xs text-text-muted">Sparat i Valvet — öppna appen vid behov.</p>
          )}
          <WidgetButton type="button" variant="ghost" fullWidth className="text-xs" onClick={() => setDone(false)}>
            Ny reflektion
          </WidgetButton>
        </div>
      </WidgetDashboardSection>
    );
  }

  return (
    <WidgetDashboardSection
      title="Multiverktyg"
      description="Kort reflektion"
      icon={<Sparkles className="h-4 w-4" />}
      glow="gold"
      className="overflow-hidden"
    >
      <div className="space-y-3">
        {recPhase === 'recording' && (
          <div className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-3">
            <p className={`flex items-center gap-2 ${textStyles.eyebrow} text-accent`}>
              <span className="widget-record__dot" aria-hidden />
              Spelar in…
            </p>
            {speech.interim ? (
              <p className="mt-2 text-xs text-text-dim">Hör: {speech.interim}</p>
            ) : null}
            <WidgetButton
              type="button"
              variant="accent"
              fullWidth
              onClick={stopRecording}
              className="mt-3 flex min-h-11 items-center justify-center gap-2"
            >
              <Square className="h-4 w-4" aria-hidden />
              Stoppa och spara i Valvet
            </WidgetButton>
          </div>
        )}

        {recPhase === 'processing' && (
          <p className="flex items-center justify-center gap-2 py-4 text-sm text-text-dim">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Transkriberar och låser i Valvet…
          </p>
        )}

        {recPhase === 'idle' && showEthicsGate && !ethicsOk && (
          <WidgetRecordingEthicsGate
            mode="dashboard"
            onAccept={handleEthicsAccept}
            className="rounded-xl border border-accent/30 bg-surface-2/80 p-3"
          />
        )}

        {recPhase === 'idle' && (
          <>
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, REFLECTION_MAX_CHARS))}
              rows={3}
              maxLength={REFLECTION_MAX_CHARS}
              placeholder="En kort tanke eller observation…"
              aria-label="Kort reflektion"
              className="input-glass neu-inset min-h-11 w-full resize-none rounded-xl px-3 py-2 text-sm"
              disabled={saving}
            />
            <p className="text-right text-[10px] text-text-dim">
              {text.length}/{REFLECTION_MAX_CHARS}
            </p>
            <WidgetActionGrid columns={2}>
              <WidgetButton
                type="button"
                variant="ghost"
                onClick={handleMicClick}
                disabled={!speech.supported || !audio.supported || saving}
                className="flex min-h-11 items-center justify-center gap-2 text-sm disabled:opacity-40"
                aria-label="Röstinspelning till Valvet"
              >
                <Mic className="h-4 w-4" aria-hidden />
                Tala in
              </WidgetButton>
              <WidgetButton
                type="button"
                variant="accent"
                onClick={() => void handleSaveText()}
                disabled={saving || !text.trim()}
                className="flex min-h-11 items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <PenLine className="h-4 w-4" aria-hidden />
                )}
                Spara i Valvet
              </WidgetButton>
            </WidgetActionGrid>
          </>
        )}

        {recError && <p className="text-sm text-danger" role="alert">{recError}</p>}
        {speech.error && <p className="text-sm text-danger" role="alert">{speech.error}</p>}
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
      </div>
    </WidgetDashboardSection>
  );
}

function WorkStampCard({ userId }: Props) {
  const clock = useStampClock(userId);
  const { stamp, loading, busy, isClockedIn, status, error, success } = clock;

  return (
    <WidgetDashboardSection
      title="Arbetstid"
      description="Stämpel in / ut"
      icon={<Clock className="h-4 w-4" />}
      glow="gold"
      className="overflow-hidden"
    >
      <div className="space-y-4">
        {error && (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            {success}
          </p>
        )}

        <div
          className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
            isClockedIn ? 'border-success/30 bg-success/10' : 'border-border/30 bg-surface-3/40'
          }`}
        >
          <Clock
            className={`h-5 w-5 shrink-0 ${isClockedIn ? 'text-success' : 'text-text-dim'}`}
            strokeWidth={1.5}
            aria-hidden
          />
          <div>
            <p className={`text-sm font-medium ${isClockedIn ? 'text-success' : 'text-text-dim'}`}>
              {isClockedIn
                ? `Instämplad ${status.inTid || formatStampTime(new Date())}`
                : 'Inte instämplad'}
            </p>
            <p className="text-xs text-text-dim">{status.dagensTimmar} h idag</p>
          </div>
        </div>

        {loading ? (
          <p className="flex items-center justify-center gap-2 py-4 text-sm text-text-dim">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Laddar…
          </p>
        ) : (
          <StampClockControls
            isClockedIn={isClockedIn}
            busy={busy}
            onStampIn={() => void stamp('IN')}
            onStampOut={() => void stamp('UT')}
          />
        )}
      </div>
    </WidgetDashboardSection>
  );
}

function ChildLivsloggCard({ userId, onQueueChange }: Props) {
  const [childAlias, setChildAlias] = useState<ChildAlias>(CHILD_ALIASES[0]);
  const [category, setCategory] = useState<LivsloggCategory>('positivt');
  const [observation, setObservation] = useState('');
  const [attachedPhoto, setAttachedPhoto] = useState<{ file: File; previewUrl: string } | null>(
    null,
  );
  const [photoCaption, setPhotoCaption] = useState('');
  const [saved, setSaved] = useState(false);
  const [queued, setQueued] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const speech = useSpeechToText({
    lang: 'sv-SE',
    onFinal: (chunk) => {
      setObservation((prev) => `${prev} ${chunk}`.trim().slice(0, STUND_MAX_CHARS));
    },
  });

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [saved]);

  useEffect(() => {
    return () => {
      if (attachedPhoto?.previewUrl) {
        URL.revokeObjectURL(attachedPhoto.previewUrl);
      }
    };
  }, [attachedPhoto?.previewUrl]);

  const clearAttachedPhoto = useCallback(() => {
    setAttachedPhoto((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    setPhotoCaption('');
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, []);

  const handlePhotoSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Endast bildfiler kan bifogas.');
      event.target.value = '';
      return;
    }
    clearAttachedPhoto();
    const previewUrl = URL.createObjectURL(file);
    setAttachedPhoto({ file, previewUrl });
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!userId || (!observation.trim() && !attachedPhoto)) return;
    setLoading(true);
    setError(null);
    try {
      const result = await saveActionChildLog(userId, {
        childAlias,
        category,
        observation: observation.trim(),
        contentType: speech.isListening ? 'voice' : 'text',
        photo: attachedPhoto?.file ?? null,
        mediaCaption: attachedPhoto ? photoCaption : undefined,
      });
      setQueued(result.queued);
      if (result.queued) onQueueChange?.();
      setSaved(true);
      setObservation('');
      clearAttachedPhoto();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextFocus = () => {
    textareaRef.current?.focus();
  };

  if (saved) {
    return (
      <WidgetDashboardSection
        title="Livslogg"
        description="Barn — snabbinmatning"
        icon={<Users className="h-4 w-4" />}
        glow="blue"
        className="overflow-hidden"
      >
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" aria-hidden />
          {queued
            ? `Köad — synkas till ${childAlias}s logg vid nät.`
            : `Sparat till ${childAlias}s logg.`}
        </p>
      </WidgetDashboardSection>
    );
  }

  return (
    <WidgetDashboardSection title="Livslogg" description="Barn — snabbinmatning" icon={<Users className="h-4 w-4" />} glow="blue">
      <div className="space-y-3">
        <select
          value={childAlias}
          onChange={(e) => setChildAlias(e.target.value as ChildAlias)}
          className="input-glass w-full rounded-xl px-3 py-2 text-sm"
          aria-label="Välj barn"
        >
          {CHILD_ALIASES.map((alias) => (
            <option key={alias} value={alias}>
              {alias}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as LivsloggCategory)}
          className="input-glass w-full rounded-xl px-3 py-2 text-sm"
          aria-label="Välj kategori"
        >
          {LIVSLOGG_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <TextArea
          ref={textareaRef}
          value={observation}
          onChange={(e) => setObservation(e.target.value.slice(0, STUND_MAX_CHARS))}
          rows={4}
          maxLength={STUND_MAX_CHARS}
          placeholder="Vad hände? En kort observation…"
          className="input-glass neu-inset w-full resize-none rounded-xl px-3 py-2 text-sm"
        />
        {speech.interim ? (
          <p className="text-xs text-text-dim">Hör: {speech.interim}</p>
        ) : null}
        <p className="text-right text-[10px] text-text-dim">
          {observation.length}/{STUND_MAX_CHARS}
        </p>

        <div className="flex items-center justify-center gap-3">
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            onChange={handlePhotoSelected}
          />
          {speech.supported && (
            <button
              type="button"
              onClick={speech.isListening ? speech.stop : speech.start}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition motion-safe:active:scale-[0.97] ${
                speech.isListening
                  ? 'border-accent/50 bg-accent/20 text-accent'
                  : 'border-border/30 bg-surface-3/50 text-accent hover:border-accent/40 hover:bg-surface-3'
              }`}
              aria-label="Röstinmatning för barnlogg"
              aria-pressed={speech.isListening}
            >
              {speech.isListening ? (
                <MicOff className="h-5 w-5" aria-hidden />
              ) : (
                <Mic className="h-5 w-5" aria-hidden />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={handleTextFocus}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/30 bg-surface-3/50 text-accent transition motion-safe:active:scale-[0.97] hover:border-accent/40 hover:bg-surface-3"
            aria-label="Textinmatning för barnlogg"
          >
            <PenLine className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleCameraClick}
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition motion-safe:active:scale-[0.97] ${
              attachedPhoto
                ? 'border-success/50 bg-success/15 text-success'
                : 'border-border/30 bg-surface-3/50 text-accent hover:border-accent/40 hover:bg-surface-3'
            }`}
            aria-label={attachedPhoto ? 'Foto bifogat — byt bild' : 'Ta foto med kamera'}
            aria-pressed={attachedPhoto != null}
          >
            <Camera className="h-5 w-5" aria-hidden />
            {attachedPhoto ? (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] text-surface">
                <Check className="h-3 w-3" aria-hidden />
              </span>
            ) : null}
          </button>
        </div>

        {attachedPhoto ? (
          <div className="space-y-2 rounded-xl border border-border/30 bg-surface-2/60 p-2">
            <div className="flex items-center gap-3">
              <img
                src={attachedPhoto.previewUrl}
                alt="Bifogat foto till barnlogg"
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-success">Foto bifogat</p>
                <p className="truncate text-[10px] text-text-dim">{attachedPhoto.file.name}</p>
              </div>
              <WidgetButton
                type="button"
                variant="ghost"
                onClick={clearAttachedPhoto}
                className="shrink-0 text-[10px]"
              >
                Ta bort
              </WidgetButton>
            </div>
            <textarea
              className="input-glass w-full text-sm"
              rows={2}
              maxLength={500}
              placeholder="Bildtext (valfritt)…"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              aria-label="Bildtext till foto"
            />
          </div>
        ) : null}

        <WidgetButton
          type="button"
          variant="accent"
          fullWidth
          onClick={() => void handleSave()}
          disabled={loading || (!observation.trim() && !attachedPhoto)}
          className="flex min-h-11 items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="h-4 w-4" aria-hidden />
          )}
          Spara till {childAlias}s logg
        </WidgetButton>
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
        {speech.error ? <p className="text-sm text-danger" role="alert">{speech.error}</p> : null}
      </div>
    </WidgetDashboardSection>
  );
}

/** Mobil-först widget-hub med Valv, barnlogg och stämpel — offline-kö + synk. */
export function ActionDashboard({ userId, flushTick = 0 }: Props) {
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPending = useCallback(async () => {
    if (!userId) {
      setPendingCount(0);
      return;
    }
    try {
      const count = await pendingActionDashboardCount(userId);
      setPendingCount(count);
    } catch {
      setPendingCount(0);
    }
  }, [userId]);

  useEffect(() => {
    void refreshPending();
    const onOnline = () => void refreshPending();
    window.addEventListener('online', onOnline);
    const interval = window.setInterval(() => void refreshPending(), 5000);
    return () => {
      window.removeEventListener('online', onOnline);
      window.clearInterval(interval);
    };
  }, [refreshPending, flushTick]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <QueuedBanner count={pendingCount} />
      <MultiToolCard userId={userId} onQueueChange={() => void refreshPending()} />
      <WorkStampCard userId={userId} />
      <ChildLivsloggCard userId={userId} onQueueChange={() => void refreshPending()} />
    </div>
  );
}
