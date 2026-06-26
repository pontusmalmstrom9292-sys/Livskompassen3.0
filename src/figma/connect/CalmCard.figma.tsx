import figma from '@figma/code-connect/react';
import { CalmCard } from '@/modules/sandbox/components/premium/CalmCard';

/**
 * Sandbox CalmCard — mappas till BentoCard tills dedikerad Figma-komponent finns.
 * Efter Figma-capture: uppdatera node-id till ny Premium/CalmCard-frame.
 */
figma.connect(
  CalmCard,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-434',
  {
    props: {
      children: figma.children('Slot'),
    },
    example: ({ children }) => <CalmCard>{children}</CalmCard>,
  },
);
