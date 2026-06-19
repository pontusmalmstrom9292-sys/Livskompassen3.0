import type { ReactNode } from 'react';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';

type Props = {
  title: string;
  meta?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

/** B4 — progressive disclosure på Planering-hubben (Obsidian Calm, guld-glow). */
export function PlaneringHubCollapsible({
  title,
  meta,
  defaultOpen = false,
  open,
  onOpenChange,
  children,
}: Props) {
  return (
    <CalmCollapsible
      title={title}
      meta={meta}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      glow="gold"
    >
      {children}
    </CalmCollapsible>
  );
}
