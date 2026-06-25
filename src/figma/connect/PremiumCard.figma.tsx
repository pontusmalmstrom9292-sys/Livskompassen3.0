import figma from '@figma/code-connect/react';
import { PremiumCard } from '@/modules/sandbox/components/premium/PremiumCard';

/**
 * Sandbox PremiumCard — guld-kant, gradient. Mappas till BentoCard tills dedikerad node finns.
 */
figma.connect(
  PremiumCard,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-434',
  {
    props: {
      children: figma.children('Slot'),
    },
    example: ({ children }) => <PremiumCard>{children}</PremiumCard>,
  },
);
