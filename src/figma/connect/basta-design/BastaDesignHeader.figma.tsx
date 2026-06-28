import figma from '@figma/code-connect/react';
import { BastaDesignHeader } from '@/modules/core/layout/basta-design/BastaDesignHeader';

/**
 * Figma Make header — Livskompassen + guldornament.
 * Make: https://www.figma.com/make/XAkUe9ztRt1Nes0ysXL8Xb/bästa-design
 */
figma.connect(
  BastaDesignHeader,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-435',
  {
    example: () => (
      <BastaDesignHeader accountOpen={false} onAccountOpenChange={() => undefined} onMenuClick={() => undefined} />
    ),
  },
);
