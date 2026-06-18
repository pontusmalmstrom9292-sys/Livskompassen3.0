import type { ReactNode } from 'react';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';

type Props = {
  title: string;
  meta?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

/** Progressive disclosure på MåBra-hubben — färre synliga block (IA Våg 3). */
export function MabraHubCollapsible({ title, meta, defaultOpen = false, children }: Props) {
  return (
    <CalmCollapsible title={title} meta={meta} defaultOpen={defaultOpen} glow="green">
      {children}
    </CalmCollapsible>
  );
}
