import { useState } from 'react';
import { Button, ButtonLink } from '@/design-system';
import { Loader2, Shield } from 'lucide-react';
import { saveVaultLog } from '@/core/firebase/firestore';
import { VAULT_UI_NAME } from '@/core/copy/evidenceCopy';

type Props = {
  userId: string;
  vitEntryId: string;
  summary: string;
  bankId: string;
  onDone: () => void;
};

/** Kat 4 HITL — valfri promote av vit_entry till Valv med sourceRef. */
export function MabraVitEvidencePrompt({ userId, vitEntryId, summary, bankId, onDone }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveVaultLog(userId, {
        action: `Vit utbildning · ${bankId}`,
        truth: summary.slice(0, 2000),
        sourceRef: `vit_entries/${vitEntryId}`,
        category: 'vit_curriculum',
      });
      setSaved(true);
    } catch {
      setError(`Kunde inte spara i ${VAULT_UI_NAME.toLowerCase()}et. Kontrollera PIN och regler.`);
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="mt-4 space-y-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3">
        <p className="text-sm text-success">Sparat som bevis med länk till Vit-posten.</p>
        <ButtonLink to="/valvet" variant="ghost" className="text-sm">
          Öppna {VAULT_UI_NAME}
        </ButtonLink>
        <Button variant="secondary" className="mt-2 text-sm" onClick={onDone}>
          Klar
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3">
      <p className="flex items-center gap-2 text-sm text-text-muted">
        <Shield className="h-4 w-4 text-gold" />
        Vill du bevara detta som evidens i Valvet?
      </p>
      <p className="text-xs text-text-muted">Inget sparas automatiskt — endast om du väljer explicit.</p>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          className="text-sm"
          disabled={saving}
          onClick={() => void handleSave()}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Spara som bevis'}
        </Button>
        <Button variant="ghost" className="text-sm" onClick={onDone}>
          Nej tack
        </Button>
      </div>
    </div>
  );
}
