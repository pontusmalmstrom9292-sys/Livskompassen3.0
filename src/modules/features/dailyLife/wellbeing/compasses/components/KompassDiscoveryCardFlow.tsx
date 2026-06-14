import { clsx } from 'clsx';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ensureVitHub, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import { MabraVitEvidencePrompt } from '@/features/dailyLife/wellbeing/mabra/components/MabraVitEvidencePrompt';
import {
  getDiscoveryCategory,
  type DiscoveryCategoryId,
} from '../content/discoveryBentoCatalog';
import { pickDiscoveryCard } from '../lib/pickDiscoveryCard';
import { recordDiscoveryMilestoneIfNew } from '@/core/firebase/evolutionLedgerFirestore';

type Props = {
  userId?: string;
  categoryId: DiscoveryCategoryId;
  variant?: 'forge' | 'default';
  onBack: () => void;
  onDone: () => void;
  onSaved?: (summary: string) => void;
};

export function KompassDiscoveryCardFlow({
  userId,
  categoryId,
  variant = 'default',
  onBack,
  onDone,
  onSaved,
}: Props) {
  const prefix = variant === 'forge' ? 'od-forge__disc' : 'kompass-disc';
  const category = getDiscoveryCategory(categoryId);
  const pick = useMemo(
    () => pickDiscoveryCard({ categoryId, uid: userId }),
    [categoryId, userId],
  );

  const [responseText, setResponseText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [savedSummary, setSavedSummary] = useState('');

  if (!category || !pick) {
    return (
      <div className={clsx(`${prefix}-flow`)}>
        <p className="text-sm text-text-muted">Kunde inte ladda kort — försök igen.</p>
        <button type="button" onClick={onBack} className="btn-pill--ghost mt-3 text-sm">
          Tillbaka
        </button>
      </div>
    );
  }

  const displayTitle =
    pick.card.content_class === 'PLAY' ? pick.card.title_sv ?? category.label_sv : category.label_sv;

  const handleSave = async () => {
    if (!userId) {
      setError('Logga in för att spara till Vit.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await ensureVitHub(userId, category.projectId);
      const entryId = await saveVitEntry(userId, {
        projectId: category.projectId,
        kind: pick.card.content_class === 'PLAY' ? 'card' : 'card',
        bankId: pick.bankId,
        content_class: pick.card.content_class,
        responseText: responseText.trim() || undefined,
        cardDateKey: pick.dateKey,
        categoryId,
        inputMode: 'kompass_discovery',
        zone: 'mabra',
      });
      const summary = [pick.card.body_sv, responseText.trim()].filter(Boolean).join('\n\n');
      setSavedEntryId(entryId);
      setSavedSummary(summary);
      onSaved?.(summary);
      await recordDiscoveryMilestoneIfNew(userId, categoryId, pick.bankId);
    } catch {
      setError('Kunde inte spara. Kontrollera nätverk.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={clsx(`${prefix}-flow`)} aria-label={`Kort: ${category.label_sv}`}>
      <button type="button" onClick={onBack} className={clsx(`${prefix}-back`)}>
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        Tillbaka
      </button>

      <p className={clsx(`${prefix}-flow-kicker`)}>{category.label_sv}</p>
      <h3 className={clsx(`${prefix}-flow-title`)}>{displayTitle}</h3>
      <p className={clsx(`${prefix}-flow-body`)}>{pick.card.body_sv}</p>

      <label className={clsx(`${prefix}-flow-label`)}>
        Din reflektion (valfritt)
        <textarea
          className={clsx(`${prefix}-flow-input`, 'input-glass mt-1.5 w-full text-sm')}
          rows={3}
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="En rad räcker — eller lämna tomt."
          maxLength={5000}
        />
      </label>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {!savedEntryId ? (
        <div className={clsx(`${prefix}-flow-actions`)}>
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="btn-pill--secondary text-sm"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Spara till Vit'}
          </button>
          <button type="button" onClick={onDone} className="btn-pill--ghost text-sm">
            Hoppa över
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-success">Sparat i din Vit hub.</p>
          {userId ? (
            <MabraVitEvidencePrompt
              userId={userId}
              vitEntryId={savedEntryId}
              summary={savedSummary}
              bankId={pick.bankId}
              onDone={onDone}
            />
          ) : null}
          {!userId ? (
            <button type="button" onClick={onDone} className="btn-pill--ghost mt-2 text-sm">
              Klar
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
