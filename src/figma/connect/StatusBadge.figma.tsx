import figma from '@figma/code-connect/react';
import { StatusBadge } from '@/modules/core/ui/StatusBadge';

figma.connect(
  StatusBadge,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=19-564',
  {
    props: {
      variant: figma.enum('Variant', {
        worm: 'worm',
        locked: 'locked',
        risk: 'risk',
        ai: 'ai',
      }),
      label: figma.textContent('Label'),
    },
    example: ({ variant, label }) => <StatusBadge variant={variant} label={label} />,
  },
);
