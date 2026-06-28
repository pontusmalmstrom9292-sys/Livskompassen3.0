import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { saveVaultLog } from '@/core/firebase/firestore';
import { VAULT_UI_NAME } from '@/core/copy/evidenceCopy';
import { WormSaveConfirmSheet } from '@/core/security/WormSaveConfirmSheet';
import { buildVaultPayloadFromChildLog } from '../utils/childLogEvidence';
import type { ChildAlias } from '../constants';

type Props = {
  userId: string;
  childAlias: ChildAlias;
  childrenLogId: string;
  observation: string;
  category: string;
  childrenImpact?: string;
  onDone: () => void;
};

export function SaveAsEvidencePrompt({
  userId,
  childAlias,
  childrenLogId,
  observation,
  category,
  childrenImpact,
  onDone,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveVaultLog(
        userId,
        buildVaultPayloadFromChildLog({
          childAlias,
          observation,
          category,
          childrenImpact,
          childrenLogId,
        }),
      );
      setSaved(true);
      setConfirmOpen(false);
    } catch {
      setError(`Kunde inte spara i ${VAULT_UI_NAME.toLowerCase()}et. Kontrollera inloggning och regler.`);
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="mt-4 space-y-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3">
        <p className="text-sm text-success">Sparat som bevis med länk till livsloggen.</p>
        <Link to="/valvet" className="ds-btn ds-btn--ghost text-sm">
          Öppna {VAULT_UI_NAME}
        </Link>
        <button type="button" onClick={onDone} className="ds-btn ds-btn--secondary mt-2 text-sm">
          Klar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3">
      <p className="flex items-center gap-2 text-sm text-text-muted">
        <Shield className="h-4 w-4 text-gold" />
        Vill du spara samma observation som forensiskt bevis?
      </p>
      <p className="text-xs text-text-dim">
        Inget sparas automatiskt. Du väljer explicit — neutral formulering rekommenderas.
      </p>
      {confirmOpen ? (
        <WormSaveConfirmSheet
          contextLabel={`Observation från ${childAlias}s logg`}
          busy={saving}
          onConfirm={() => void handleSave()}
          onCancel={() => setConfirmOpen(false)}
        />
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={saving}
            onClick={() => setConfirmOpen(true)}
            className="ds-btn ds-btn--secondary text-sm"
          >
            Spara som bevis
          </button>
          <button type="button" onClick={onDone} className="ds-btn ds-btn--ghost text-sm">
            Nej, bara livslogg
          </button>
        </div>
      )}
      {error && !confirmOpen && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
