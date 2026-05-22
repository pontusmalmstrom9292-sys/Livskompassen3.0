import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { deriveGreyRockVariants, type GreyRockVariant } from '../utils/greyRockVariants';

type GreyRockVariantsProps = {
  reply: string;
  agentName?: string | null;
  riskScore?: number | null;
  hitlRequired?: boolean;
  onSaveEvidence?: () => void;
  savingEvidence?: boolean;
  evidenceSaved?: boolean;
  onKlar?: () => void;
};

function VariantCard({ variant }: { variant: GreyRockVariant }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(variant.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl border border-border-strong bg-surface/40 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-widest text-accent-secondary">
          {variant.label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="btn-pill--ghost flex items-center gap-1 text-xs"
        >
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Kopierat' : 'Kopiera'}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm text-text-muted">{variant.text}</p>
    </div>
  );
}

export function GreyRockVariants({
  reply,
  agentName,
  riskScore,
  hitlRequired,
  onSaveEvidence,
  savingEvidence,
  evidenceSaved,
  onKlar,
}: GreyRockVariantsProps) {
  const variants = deriveGreyRockVariants(reply);

  return (
    <BentoCard title="Grey Rock-svar">
      {agentName && (
        <p className="mb-2 text-[10px] uppercase tracking-widest text-accent/60">{agentName}</p>
      )}
      {hitlRequired && (
        <div className="mb-3 rounded-xl border border-border-strong bg-surface/50 px-3 py-2 text-sm text-text-muted">
          Hög risk flaggad. Förslagen är vägledning — överväg HITL-uppföljning.
        </div>
      )}
      {riskScore !== null && riskScore !== undefined && (
        <p className="mb-3 text-[10px] uppercase tracking-widest text-text-dim">
          Riskpoäng: {riskScore}
        </p>
      )}

      <div className="space-y-3">
        {variants.map((v) => (
          <VariantCard key={v.id} variant={v} />
        ))}
      </div>

      {onSaveEvidence && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSaveEvidence}
            disabled={savingEvidence}
            className="btn-pill--secondary text-xs"
          >
            Spara original som bevis
          </button>
          {evidenceSaved && (
            <p className="text-sm text-success">Sparat i Verklighetsvalvet.</p>
          )}
        </div>
      )}

      {onKlar && (
        <button
          type="button"
          onClick={onKlar}
          className="mt-4 btn-pill--ghost text-xs uppercase tracking-widest"
        >
          Klar — rensa
        </button>
      )}
    </BentoCard>
  );
}
