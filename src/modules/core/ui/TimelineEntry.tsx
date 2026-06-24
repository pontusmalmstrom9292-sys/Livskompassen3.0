import { truncateText } from '../utils/truncateText';

type TimelineEntryProps = {
  meta: string;
  body: string;
  truncateAt?: number;
  as?: 'li' | 'div';
  action?: React.ReactNode;
};

export function TimelineEntry({ meta, body, truncateAt = 200, as: Tag = 'li', action }: TimelineEntryProps) {
  const displayBody = truncateAt > 0 ? truncateText(body, truncateAt) : body;

  return (
    <Tag className="glass-card p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] uppercase tracking-widest text-text-dim">{meta}</p>
        {action}
      </div>
      <p className="mt-1 text-text-muted">{displayBody}</p>
    </Tag>
  );
}
