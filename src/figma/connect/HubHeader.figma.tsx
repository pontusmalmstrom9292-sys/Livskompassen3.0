import figma from '@figma/code-connect/react';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

/** Figma: Hub/Header → kod: HubPageShell (header-delen av hub-layouten). */
figma.connect(
  HubPageShell,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-435',
  {
    props: {
      eyebrow: figma.textContent('Eyebrow'),
      title: figma.textContent('Title'),
      lead: figma.textContent('Lead'),
    },
    example: ({ eyebrow, title, lead }) => (
      <HubPageShell eyebrow={eyebrow} title={title} lead={lead} lockViewport>
        <HubPanelSkeleton />
      </HubPageShell>
    ),
  },
);
