import figma from '@figma/code-connect/react';
import { CognitiveLoadStrip } from '@/core/ui/CognitiveLoadStrip';

figma.connect(
  CognitiveLoadStrip,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-443',
  {
    props: {
      label: figma.textContent('Label'),
      hint: figma.textContent('Hint'),
    },
    example: ({ label, hint }) => <CognitiveLoadStrip label={label} hint={hint} />,
  },
);
