import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ensureVitHub, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import type { MabraProjectId } from '../constants/mabraProjects';
import { VIT_HUB_LANDED, VIT_HUB_VAULT_LINK } from '../lib/vitHubCopy';
import { vitHubFilteredLink } from '../lib/vitHubLinks';
import { pickVitProjectCard } from '../lib/pickVitProjectCard';
import { writeVitProjectLastSeen } from '../lib/vitProjectLastSeen';
import { getMabraRsdErrorCopy } from '../lib/mabraRsdErrorCopy';
import { fetchBankParafrasCoach } from '../api/mabraCoachService';
import { vitBankParafrasFallback } from '../lib/vitBankParafrasFallback';

type Props = {
  userId: string | undefined;
  projectId: MabraProjectId;
  onSaved?: () => void;
};

const COPY = {
  identityLabel: 'Vem är jag i det här?',
  identityPlaceholder: 'Ett ord eller en kort rad…',
  feelingLabel: 'Hur känner jag kring upplevelsen?',
  feelingHint: 'Kropp, plats eller temperatur — inget facit.',
  save: 'Spara känslominne',
  login: 'Logga in för att spara i Vit hub.',
  error: 'Kunde inte spara just nu. Försök igen när nätverket finns.',
  empty: 'Skriv minst en rad — identitet eller känsla.',
} as const;

function formatMemoryText(identity: string, feeling: string): string {
  const parts: string[] = [];
  if (identity) parts.push(`Identitet: ${identity}`);
  if (feeling) parts.push(`Känsla: ${feeling}`);
  return parts.join('\n');
}

/** P2+ känslominne — två prompts, sparas som vit_entries kind memory. */
export function VitMemoryFlowPanel({ userId, projectId, onSaved }: Props) {
  const pick = useMemo(() => pickVitProjectCard({ uid: userId, projectId }), [userId, projectId]);
  const [identity, setIdentity] = useState('');
  const [feeling, setFeeling] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [coachLine, setCoachLine] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!userId) return;
    const idTrim = identity.trim();
    const feelTrim = feeling.trim();
    if (!idTrim && !feelTrim) {
      setError(COPY.empty);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await ensureVitHub(userId, projectId);
      await saveVitEntry(userId, {
        projectId,
        kind: 'memory',
        bankId: pick.card.bankId,
        content_class: 'REFLECTION',
        responseText: formatMemoryText(idTrim, feelTrim),
        cardDateKey: pick.dateKey,
      });
      writeVitProjectLastSeen(projectId);
      setSaved(true);
      const memoryNote = formatMemoryText(idTrim, feelTrim);
      try {
        const parafras = await fetchBankParafrasCoach(pick.card.bankId, memoryNote);
        setCoachLine(parafras.redirectToSpeglar ? null : parafras.coach);
      } catch {
        setCoachLine(vitBankParafrasFallback(pick.card.text_sv));
      }
      onSaved?.();
    } catch {
      setError(getMabraRsdErrorCopy());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="home-module-panel__question-box">
        <p className="text-sm text-text-muted">{COPY.identityLabel}</p>
        <p className="mt-1 text-xs text-text-dim">Uppvärmning: {pick.card.text_sv}</p>
      </div>

      <label className="block text-xs text-text-muted">
        {COPY.identityLabel}
        <input
          type="text"
          value={identity}
          onChange={(e) => {
            setIdentity(e.target.value);
            setSaved(false);
            setCoachLine(null);
            setError(null);
          }}
          className="input-glass mt-2 w-full text-sm"
          placeholder={COPY.identityPlaceholder}
          disabled={!userId || saving}
        />
      </label>

      <label className="block text-xs text-text-muted">
        {COPY.feelingLabel}
        <textarea
          value={feeling}
          onChange={(e) => {
            setFeeling(e.target.value);
            setSaved(false);
            setCoachLine(null);
            setError(null);
          }}
          rows={3}
          className="input-glass mt-2 w-full text-sm"
          placeholder={COPY.feelingHint}
          disabled={!userId || saving}
        />
      </label>

      <p className="text-center text-[10px] uppercase tracking-wider text-text-dim">
        {pick.card.lens} · {pick.card.bankId}
      </p>

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

      {saved ? (
        <p className="text-xs text-success">
          {VIT_HUB_LANDED}{' '}
          <Link
            to={vitHubFilteredLink('memory', projectId)}
            className="text-accent underline-offset-2 hover:underline"
          >
            {VIT_HUB_VAULT_LINK}
          </Link>
        </p>
      ) : null}
      {coachLine ? (
        <p className="text-xs leading-relaxed text-text-muted">{coachLine}</p>
      ) : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
