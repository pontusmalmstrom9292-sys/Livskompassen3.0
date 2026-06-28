import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { textStyles } from '../tokens';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  lead?: string;
  aside?: ReactNode;
};

/** Section — vertical rhythm block with optional header. */
export function Section({ children, eyebrow, title, lead, aside, className, ...rest }: SectionProps) {
  return (
    <section className={cn('ds-section', className)} {...rest}>
      {(eyebrow || title || lead || aside) && (
        <div className="ds-section__header">
          <div className="min-w-0">
            {eyebrow ? <p className={textStyles.eyebrow}>{eyebrow}</p> : null}
            {title ? <h2 className={cn(textStyles.titleSection, 'mt-1')}>{title}</h2> : null}
            {lead ? <p className={cn(textStyles.body, 'mt-1 text-text-muted')}>{lead}</p> : null}
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
