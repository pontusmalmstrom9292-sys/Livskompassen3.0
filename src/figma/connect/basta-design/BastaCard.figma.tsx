import figma from '@figma/code-connect/react';
import { BastaCard } from '@/modules/core/home/basta-design/bastaDesignParts';

/**
 * Figma Make «bästa-design»: https://www.figma.com/make/XAkUe9ztRt1Nes0ysXL8Xb/bästa-design
 * Make stöder inte Code Connect — node-id är Obsidian Calm-placeholder tills komponent publiceras i Design.
 */
figma.connect(
  BastaCard,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-434',
  {
    props: {
      children: figma.children('Slot'),
    },
    example: ({ children }) => <BastaCard>{children}</BastaCard>,
  },
);
