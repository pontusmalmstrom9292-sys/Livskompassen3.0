import figma from '@figma/code-connect/react';
import { BastaDesignHero } from '@/modules/core/home/basta-design/BastaDesignHero';

/**
 * Figma Make hero — Dagens reflektion + reflektionsfråga (aside).
 * Make: https://www.figma.com/make/XAkUe9ztRt1Nes0ysXL8Xb/bästa-design
 */
figma.connect(
  BastaDesignHero,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-435',
  {
    props: {
      hasEntry: figma.boolean('Has today entry'),
    },
    example: ({ hasEntry }) => (
      <BastaDesignHero
        todayEntry={hasEntry ? { text: 'En stund för dig själv.' } : null}
        onWrite={() => undefined}
      />
    ),
  },
);
