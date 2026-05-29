import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Mail } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { TabBar } from '../../../core/ui/TabBar';
import { InboxReviewQueue } from '../../../inkast/components/InboxReviewQueue';
import { useStore } from '../../../core/store';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import { usePlaneringInboxConnections } from '../hooks/usePlaneringInboxConnections';
import {
  parsePlaneringInkorgView,
  planeringInkorgHref,
  PLANERING_INKORG_VIEWS,
  type PlaneringInkorgView,
} from '../planeringInkorgViews';
import { PlaneringInboxConnectionCard } from './PlaneringInboxConnectionCard';
import { PlaneringInkorgCalendarPanel } from './PlaneringInkorgCalendarPanel';

/** Inkorg — Gmail + Google Kalender (förbered) · G10-kö · klistra-in mejl. */
export function PlaneringInkorgPanel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = parsePlaneringInkorgView(searchParams.get('inbox'));
  const user = useStore((s) => s.user);
  const { connections, prepare, disconnect, bothPrepared } = usePlaneringInboxConnections();
  const { addTask, error, setError } = usePlanningTasks();
  const [paste, setPaste] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const firstLine = text.split('\n')[0]?.slice(0, 120) ?? 'Inkorg';
      await addTask({
        title: firstLine,
        status: 'todo',
        source: 'email',
        summary: text.slice(0, 500),
      });
      setPaste('');
      setSaved(true);
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

          <InboxReviewQueue compact />
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
              Skapa uppgift i Att göra
            </button>
            {saved && (
              <p className="mt-2 text-xs text-success">Sparat — se Handling-fliken.</p>
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

          <InboxReviewQueue compact />
        </div>
      )}

      {view === 'kalender' && (
        <PlaneringInkorgCalendarPanel
          calendar={connections.google_calendar}
          disabled={!canPrepare}
          onPrepare={() => handlePrepare('google_calendar')}
          onDisconnect={() => disconnect('google_calendar')}
        />
      )}
    </div>
  );
}
