import { useState } from 'react';
import { Button } from '@/design-system';
import { VIT_VAULT_TAB_LABEL } from '@/core/copy/valvNavCopy';
import { useNavigate } from 'react-router-dom';
import { ensureVitHub, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { useDiaryStore } from '@/features/lifeJournal/diary/diary/store/diaryStore';
import { mabraDagbokBridgeUrl } from '../constants';
import type { MabraProjectId } from '../constants/mabraProjects';
import type { MabraSymptomHub } from '../types';
import { localDateKey, type MabraExplicitSaveSource } from './mabraExplicitSave';

type Props = {
  source: MabraExplicitSaveSource | null;
  userId: string | undefined;
  vitProjectId: MabraProjectId;
  hubSymptom?: MabraSymptomHub | null;
  onVitSaved?: () => void;
  onDagbokBridged?: () => void;
  /** Fas 6D — byt läge i superhub istället för navigate till Hjärtat. */
  onSwitchToDagbokBridge?: () => void;
};

const COPY = {
  title: 'Vill du spara detta?',
  hint: `Inget sparas automatiskt. Du väljer själv om texten ska till ${VIT_VAULT_TAB_LABEL} eller Dagbok.`,
  vit: `Spara till ${VIT_VAULT_TAB_LABEL.toLowerCase()}`,
  dagbok: 'Spara till dagbok',
  login: 'Logga in för att spara i molnet.',
  vitSaved: `Sparat i ${VIT_VAULT_TAB_LABEL.toLowerCase()}.`,
  vitError: `Kunde inte spara till ${VIT_VAULT_TAB_LABEL.toLowerCase()} just nu.`,
  empty: 'Skriv minst en rad innan du kan spara.',
} as const;

/**
 * HITL — explicit användaråtgärd krävs innan RAM/localStorage flyttas till WORM.
 */
export function MabraExplicitSavePanel({
  source,
  userId,
  vitProjectId,
  hubSymptom,
  onVitSaved,
  onDagbokBridged,
  onSwitchToDagbokBridge,
}: Props) {
  const navigate = useNavigate();
  const setDiaryDraft = useDiaryStore((s) => s.setDiaryDraft);
  const [savingVit, setSavingVit] = useState(false);
  const [vitSaved, setVitSaved] = useState(false);
  const [vitError, setVitError] = useState<string | null>(null);

  const responsePayload = source?.responseText.trim() ?? '';
  const canSave = responsePayload.length > 0;

  const handleSaveToVit = async () => {
    if (!userId || !source || !canSave) return;
    setSavingVit(true);
    setVitError(null);
    try {
      await ensureVitHub(userId, vitProjectId);
      await saveVitEntry(userId, {
        projectId: vitProjectId,
        kind: 'card',
        bankId: source.bankId,
        content_class: 'REFLECTION',
        responseText: responsePayload,
        cardDateKey: localDateKey(),
      });
      setVitSaved(true);
      onVitSaved?.();
    } catch {
      setVitError(COPY.vitError);
    } finally {
      setSavingVit(false);
    }
  };

  const handleBridgeToDagbok = () => {
    if (!canSave || !source) return;
    setDiaryDraft(responsePayload);
    if (onSwitchToDagbokBridge) {
      onDagbokBridged?.();
      onSwitchToDagbokBridge();
      return;
    }
    const target = hubSymptom
      ? mabraDagbokBridgeUrl(hubSymptom)
      : `${NAV_PATHS.HJARTAT}?from=mabra&energy=low`;
    onDagbokBridged?.();
    navigate(target);
  };

  return (
    <div className="mt-5 rounded-xl border border-emerald-500/25 bg-surface-2/80 p-4">
      <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
        {COPY.title}
      </p>
      <p className="mt-1 text-xs text-text-muted">{COPY.hint}</p>

      {!canSave ? (
        <p className="mt-3 text-sm text-text-muted">{COPY.empty}</p>
      ) : (
        <pre className="mt-3 max-h-32 overflow-y-auto rounded-lg border border-border bg-surface/50 p-3 text-xs leading-relaxed text-text-muted whitespace-pre-wrap">
          {responsePayload}
        </pre>
      )}

      {!userId ? (
        <p className="mt-3 text-xs text-text-muted">{COPY.login}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            className="flex-1 text-sm disabled:opacity-50"
            disabled={!canSave || savingVit || vitSaved}
            onClick={() => void handleSaveToVit()}
          >
            {savingVit ? 'Sparar…' : vitSaved ? COPY.vitSaved : COPY.vit}
          </Button>
          <Button
            variant="ghost"
            className="flex-1 text-sm disabled:opacity-50"
            disabled={!canSave}
            onClick={handleBridgeToDagbok}
          >
            {COPY.dagbok}
          </Button>
        </div>
      )}

      {vitError ? <p className="mt-2 text-xs text-text-muted">{vitError}</p> : null}
    </div>
  );
}
