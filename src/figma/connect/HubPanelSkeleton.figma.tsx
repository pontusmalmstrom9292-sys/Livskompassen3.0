import figma from '@figma/code-connect/react';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

figma.connect(
  HubPanelSkeleton,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-441',
  {
    props: {
      label: figma.textContent('Label'),
    },
    example: ({ label }) => <HubPanelSkeleton label={label} lines={3} />,
  },
);
