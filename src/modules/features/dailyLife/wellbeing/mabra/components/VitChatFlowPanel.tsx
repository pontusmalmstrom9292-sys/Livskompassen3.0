import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/design-system';
import { ensureVitHub, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import { VIT_HUB_LANDED, VIT_HUB_VAULT_LINK } from '../lib/vitHubCopy';
import { vitHubFilteredLink } from '../lib/vitHubLinks';
import { fetchVitChatCoach } from '../api/mabraCoachService';
import type { MabraProjectId } from '../constants/mabraProjects';
import { pickVitProjectCard } from '../lib/pickVitProjectCard';
import { shouldRedirectMabraCoachToSpeglar } from '../lib/mabraCoachGuard';
import { getMabraRsdErrorCopy } from '../lib/mabraRsdErrorCopy';
import { writeVitProjectLastSeen } from '../lib/vitProjectLastSeen';
import { MabraSpeglarGuardHint } from './MabraSpeglarGuardHint';

type Props = {
  userId: string | undefined;
  projectId: MabraProjectId;
  onSaved?: () => void;
};

const MESSAGE_MAX = 500;

const COPY = {
  hint: 'Ett steg i taget. Inget facit — bara utforska inåt.',
  placeholder: 'Skriv en tanke, fråga eller observation…',
  send: 'Skicka till coach',
  sending: 'Coach svarar…',
  saved: 'Dialog sparad i din Vit hub.',
  login: 'Logga in för att chatta och spara i Vit hub.',
  error: 'Kunde inte nå coachen just nu. Försök igen om en stund.',
  empty: 'Skriv något kort först — ett ord räcker.',
} as const;

function formatChatTurn(userMessage: string, coachReply: string): string {
  return `Du: ${userMessage}\n\nCoach: ${coachReply}`;
}

/** P3 — «Lär tillsammans» via mabraCoach vit_chat + silo-guard. */
export function VitChatFlowPanel({ userId, projectId, onSaved }: Props) {
  const pick = useMemo(() => pickVitProjectCard({ uid: userId, projectId }), [userId, projectId]);
  const [message, setMessage] = useState('');
  const [coachReply, setCoachReply] = useState('');
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardDismissed, setGuardDismissed] = useState(false);
  const [showGuard, setShowGuard] = useState(false);

  const trimmed = message.trim();
  const guardActive = shouldRedirectMabraCoachToSpeglar(trimmed) && !guardDismissed;

  const handleSend = async () => {
    if (!userId) return;
    if (!trimmed) {
      setError(COPY.empty);
      return;
    }
    if (guardActive) {
      setShowGuard(true);
      return;
    }

    setSending(true);
    setError(null);
    setShowGuard(false);
    setSaved(false);

    try {
      const result = await fetchVitChatCoach(
        projectId,
        trimmed,
        pick.card.text_sv,
        pick.card.bankId,
      );
      if (result.redirectToSpeglar) {
        setShowGuard(true);
        setGuardDismissed(false);
        setCoachReply('');
        return;
      }

      setCoachReply(result.coach);
      await ensureVitHub(userId, projectId);
      await saveVitEntry(userId, {
        projectId,
        kind: 'chat_turn',
        bankId: pick.card.bankId,
        content_class: 'REFLECTION',
        responseText: formatChatTurn(trimmed, result.coach),
        cardDateKey: pick.dateKey,
      });
      writeVitProjectLastSeen(projectId);
      setSaved(true);
      onSaved?.();
    } catch {
      setError(getMabraRsdErrorCopy());
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="home-module-panel__question-box">
        <p className="text-xs uppercase tracking-wider text-text-muted">Uppstart · {pick.card.bankId}</p>
        <p className="mt-1 text-sm leading-relaxed text-accent">{pick.card.text_sv}</p>
        <p className="mt-2 text-xs text-text-muted">{COPY.hint}</p>
      </div>

      <label className="block text-xs text-text-muted">
        Din rad
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value.slice(0, MESSAGE_MAX));
            setSaved(false);
            setGuardDismissed(false);
            setShowGuard(false);
            setError(null);
          }}
          rows={3}
          className="input-glass mt-2 w-full text-sm"
          placeholder={COPY.placeholder}
          aria-label="Ditt meddelande till Vit-coachen"
          disabled={!userId || sending}
        />
      </label>

      {showGuard || guardActive ? (
        <MabraSpeglarGuardHint onStay={() => setGuardDismissed(true)} />
      ) : null}

      {!userId ? (
        <p className="text-xs text-text-muted">{COPY.login}</p>
      ) : (
        <Button
          variant="accent"
          className="min-h-11 w-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={() => void handleSend()}
          disabled={sending}
        >
          {sending ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden />
              {COPY.sending}
            </>
          ) : (
            COPY.send
          )}
        </Button>
      )}

      {coachReply ? (
        <div className="rounded-xl border border-border-strong bg-surface-2/50 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Coach</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{coachReply}</p>
        </div>
      ) : null}

      {saved ? (
        <p className="text-xs text-success">
          {VIT_HUB_LANDED}{' '}
          <Link
            to={vitHubFilteredLink('chat_turn', projectId)}
            className="inline-flex min-h-11 items-center text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            {VIT_HUB_VAULT_LINK}
          </Link>
        </p>
      ) : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
