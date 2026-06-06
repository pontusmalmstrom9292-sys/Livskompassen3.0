import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ensureVitHub, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import type { MabraProjectId } from '../constants/mabraProjects';
import { pickVitProjectCard } from '../lib/pickVitProjectCard';
import { writeVitProjectLastSeen } from '../lib/vitProjectLastSeen';

type Props = {
  userId: string | undefined;
  projectId: MabraProjectId;
  onSaved?: () => void;
};

const COPY = {
  hint: 'Inget fel svar. Ett ord räcker om du vill skriva.',
  placeholder: 'Skriv här om du vill…',
  save: 'Spara till Vit hub',
  saved: 'Sparat i din Vit hub.',
  login: 'Logga in för att spara i Vit hub.',
  error: 'Kunde inte spara just nu. Försök igen när nätverket finns.',
} as const;

export function VitCardFlowPanel({ userId, projectId, onSaved }: Props) {
  const pick = useMemo(() => pickVitProjectCard({ uid: userId, projectId }), [userId, projectId]);
  const [response, setResponse] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      await ensureVitHub(userId, projectId);
      await saveVitEntry(userId, {
        projectId,
        kind: 'card',
        bankId: pick.card.bankId,
        content_class: pick.card.content_class,
        responseText: response.trim() || undefined,
        cardDateKey: pick.dateKey,
      });
      writeVitProjectLastSeen(projectId);
      setSaved(true);
      onSaved?.();
    } catch {
      setError(COPY.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="home-module-panel__question-box">
        <p className="text-base leading-relaxed text-accent">{pick.card.text_sv}</p>
        <p className="mt-2 text-xs text-text-dim">{COPY.hint}</p>
      </div>
      <p className="text-center text-[10px] uppercase tracking-wider text-text-dim">
        {pick.card.lens} · {pick.card.bankId}
      </p>

      <label className="block text-xs text-text-muted">
        Ditt svar (valfritt)
        <textarea
          value={response}
          onChange={(e) => {
            setResponse(e.target.value);
            setSaved(false);
          }}
          rows={3}
          className="input-glass mt-2 w-full text-sm"
          placeholder={COPY.placeholder}
          aria-label="Ditt svar på frågekortet"
          disabled={!userId || saving}
        />
      </label>

      {!userId ? (
        <p className="text-xs text-text-dim">{COPY.login}</p>
      ) : (
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="btn-pill--accent w-full text-sm"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden />
              Sparar…
            </>
          ) : (
            COPY.save
          )}
        </button>
      )}

      {saved ? <p className="text-xs text-success">{COPY.saved}</p> : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
