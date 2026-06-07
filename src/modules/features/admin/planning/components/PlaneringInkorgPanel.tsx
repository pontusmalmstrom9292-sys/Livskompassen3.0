import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Mail } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar } from '@/core/ui/TabBar';
import { ReviewQueuePipelinePanel } from '@/modules/capture/ReviewQueuePipelinePanel';
import { shouldDualWritePlaneringToCapture, submitCaptureDraft } from '@/modules/capture';
import { useStore } from '@/core/store';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import { usePlanningEmailRules } from '../hooks/usePlanningEmailRules';
import { usePlaneringInboxConnections } from '../hooks/usePlaneringInboxConnections';
import {
  parsePlaneringInkorgView,
  planeringInkorgHref,
  PLANERING_INKORG_VIEWS,
  type PlaneringInkorgView,
} from '../planeringInkorgViews';
import { classifyPasteText } from '../rules/pasteClassifier';
import { PlaneringInboxConnectionCard } from './PlaneringInboxConnectionCard';
import { PlaneringInkorgCalendarPanel } from './PlaneringInkorgCalendarPanel';
import { PlaneringSuperModule } from './PlaneringSuperModule';
import { InkorgPreviewSheet } from './InkorgPreviewSheet';
import type { PasteClassification } from '../rules/pasteClassifier';

/** Inkorg — Gmail + Google Kalender (förbered) · G10-kö · klistra-in mejl. */
export function PlaneringInkorgPanel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = parsePlaneringInkorgView(searchParams.get('inbox'));
  const user = useStore((s) => s.user);
  const { connections, prepare, disconnect, bothPrepared } = usePlaneringInboxConnections();
  const { addTask, error, setError, tasks } = usePlanningTasks();
  const { rules } = usePlanningEmailRules();
  const [paste, setPaste] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [captureNote, setCaptureNote] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingClassification, setPendingClassification] = useState<PasteClassification | null>(
    null,
  );
  const [queueRefresh, setQueueRefresh] = useState(0);

  const handleCaptureSaved = useCallback(() => {
    setQueueRefresh((k) => k + 1);
    requestAnimationFrame(() => {
      document.getElementById('planering-inkast-ko')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, []);

  const accountHint = user?.email ?? '';
  const canPrepare = Boolean(user && accountHint);

  const setView = (next: PlaneringInkorgView) => {
    navigate(planeringInkorgHref(next));
  };

  const handlePrepare = (provider: 'gmail' | 'google_calendar') => {
    if (!canPrepare) return;
    prepare(provider, accountHint);
  };

  const handleCreate = async () => {
    const text = paste.trim();
    if (!text || !user) return;
    const classification = classifyPasteText(text, rules);
    setPendingClassification(classification);
    setPreviewOpen(true);
  };

  const confirmCreate = async () => {
    if (!pendingClassification || !user) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    setCaptureNote(null);
    try {
      const { title, summary, suggestedStatus, dueAt } = pendingClassification;
      await addTask({
        title,
        status: suggestedStatus,
        source: 'email',
        summary,
        dueAt,
      });
      const fullText = paste.trim();
      if (shouldDualWritePlaneringToCapture(fullText)) {
        try {
          const { message } = await submitCaptureDraft({
            text: fullText,
            fileName: 'planering_inkorg.txt',
            sourceModule: 'planering_inkorg',
          });
          setCaptureNote(message);
        } catch {
          setCaptureNote('Uppgift sparad — autosort till arkiv misslyckades (försök från Hem).');
        }
      }
      setPaste('');
      setSaved(true);
      setPreviewOpen(false);
      setPendingClassification(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skapa uppgift.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <TabBar
        size="compact"
        tabs={PLANERING_INKORG_VIEWS}
        active={view}
        onChange={setView}
      />

      {view === 'oversikt' && (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Koppla mejl och kalender hit — en plats att sortera innan Handling. Synk med Google
            aktiveras i nästa fas; du kan förbereda med ditt inloggade konto nu.
          </p>

          <PlaneringSuperModule variant="capture" onSaved={handleCaptureSaved} />

          <div className="planering-inbox-connect-grid">
            <PlaneringInboxConnectionCard
              provider="gmail"
              icon={Mail}
              connection={connections.gmail}
              disabled={!canPrepare}
              onPrepare={() => handlePrepare('gmail')}
              onDisconnect={() => disconnect('gmail')}
            />
            <PlaneringInboxConnectionCard
              provider="google_calendar"
              icon={Calendar}
              connection={connections.google_calendar}
              disabled={!canPrepare}
              onPrepare={() => handlePrepare('google_calendar')}
              onDisconnect={() => disconnect('google_calendar')}
            />
          </div>

          {bothPrepared && (
            <p className="text-xs text-success">
              Båda förberedda — du får besked i appen när read-only synk är på.
            </p>
          )}

        </div>
      )}

      {view === 'mejl' && (
        <div className="space-y-4">
          <PlaneringInboxConnectionCard
            provider="gmail"
            icon={Mail}
            connection={connections.gmail}
            disabled={!canPrepare}
            onPrepare={() => handlePrepare('gmail')}
            onDisconnect={() => disconnect('gmail')}
          />

          <BentoCard
            title="Mejl → uppgift"
            description={
              connections.gmail.phase === 'prepared'
                ? 'Klistra in tills Gmail-synk är live'
                : 'Förbered Gmail ovan — eller klistra in manuellt'
            }
            icon={<Mail className="h-4 w-4" />}
          >
            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="Klistra in ämne och text från mejl…"
              rows={5}
              className="input-glass w-full text-sm"
              disabled={!user || saving}
            />
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
            <button
              type="button"
              disabled={!user || saving || !paste.trim()}
              onClick={() => void handleCreate()}
              className="btn-pill--accent mt-3 w-full disabled:opacity-50"
            >
              Granska och skapa
            </button>
            {saved && (
              <p className="mt-2 text-xs text-success">Sparat — se Handling-fliken.</p>
            )}
            {captureNote && (
              <p className="mt-2 text-xs text-gold/90" role="status">
                {captureNote}
              </p>
            )}
            <p className="mt-3 text-xs text-text-dim">
              Ex-brus och konflikt → Hamn (BIFF).{' '}
              <button
                type="button"
                className="text-accent underline"
                onClick={() => navigate('/planering?tab=regler')}
              >
                E-postregler
              </button>{' '}
              (sparade i molnet; Gmail-synk i senare fas).
            </p>
            <button
              type="button"
              className="btn-pill--ghost mt-3 w-full text-xs"
              onClick={() => navigate('/projekt/ny?from=inkast')}
            >
              Skapa projekt från inkorg (fas 3)
            </button>
          </BentoCard>

          <ReviewQueuePipelinePanel mode="summary" refreshToken={queueRefresh} showWhenEmpty />
        </div>
      )}

      {view === 'kalender' && (
        <PlaneringInkorgCalendarPanel
          calendar={connections.google_calendar}
          disabled={!canPrepare}
          onPrepare={() => handlePrepare('google_calendar')}
          onDisconnect={() => disconnect('google_calendar')}
          tasks={tasks}
        />
      )}

      <InkorgPreviewSheet
        open={previewOpen}
        classification={pendingClassification}
        saving={saving}
        onConfirm={() => void confirmCreate()}
        onCancel={() => {
          setPreviewOpen(false);
          setPendingClassification(null);
        }}
      />
    </div>
  );
}
