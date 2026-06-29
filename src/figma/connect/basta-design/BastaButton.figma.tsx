import figma from '@figma/code-connect/react';
import { BastaButton } from '@/modules/core/home/basta-design/bastaDesignParts';

/**
 * Figma Make «bästa-design»: https://www.figma.com/make/XAkUe9ztRt1Nes0ysXL8Xb/bästa-design
 * variant: gold | ghost — mappas till DS Button accent/ghost.
 */
figma.connect(
  BastaButton,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-434',
  {
    props: {
      variant: figma.enum('Variant', { Gold: 'gold', Ghost: 'ghost' }),
      label: figma.string('Label'),
    },
    example: ({ variant, label }) => (
      <BastaButton variant={variant ?? 'gold'}>{label ?? 'Action'}</BastaButton>
    ),
  },
);
