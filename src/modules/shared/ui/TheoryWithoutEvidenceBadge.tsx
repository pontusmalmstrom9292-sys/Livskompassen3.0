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
        'mt-2 flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 px-2.5 py-2',
        className,
      ].join(' ')}
      role="note"
      aria-label={label}
    >
      <FileQuestion className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-dim" aria-hidden />
      <p className="text-[10px] leading-relaxed tracking-wide text-accent/85">
        <Badge variant="warning" className="mb-1 text-[9px] uppercase tracking-widest">
          {label}
        </Badge>
        <span className="mt-0.5 block normal-case tracking-normal text-text-muted">
          {isHamn
            ? 'Svaret bygger på tolkning utan konkret citat eller logistik i det inklistrade meddelandet — behandla som hypotes.'
            : 'Svaret bygger på tolkning utan låst källpost i arkivet — behandla som hypotes, inte bevis.'}
        </span>
      </p>
    </div>
  );
}
