import { FileQuestion } from 'lucide-react';
import { Badge } from '@/design-system';

type Props = {
  className?: string;
  /** Hamn = ephemeral (ingen WORM-läsning); Valv = WORM-citations. */
  variant?: 'hamn' | 'valv';
};

/** Epistemisk guard — teori utan observerbart stöd. */
export function TheoryWithoutEvidenceBadge({ className = '', variant = 'valv' }: Props) {
  const isHamn = variant === 'hamn';
  const label = isHamn ? 'Tolkning utan observerbart innehåll' : 'Teori saknar WORM-bevis';
  return (
    <div
      className={[
        'flex items-start gap-2.5 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2.5',
        className,
      ].join(' ')}
      role="note"
      aria-label={label}
    >
      <FileQuestion className="mt-0.5 h-4 w-4 shrink-0 text-accent-dim" aria-hidden />
      <div className="min-w-0 space-y-1">
        <Badge variant="warning" className="text-[9px] uppercase tracking-widest">
          {label}
        </Badge>
        <p className="text-[11px] leading-relaxed text-text-muted">
          {isHamn
            ? 'Svaret bygger på tolkning utan konkret citat eller logistik i det inklistrade meddelandet — behandla som hypotes.'
            : 'Svaret bygger på tolkning utan låst källpost i arkivet — behandla som hypotes, inte bevis.'}
        </p>
      </div>
    </div>
  );
}
