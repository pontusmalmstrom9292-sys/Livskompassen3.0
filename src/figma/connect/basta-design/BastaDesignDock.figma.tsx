import figma from '@figma/code-connect/react';
import { BastaDesignDock } from '@/modules/core/layout/basta-design/BastaDesignDock';

/**
 * Figma Make dock — 6 zoner + hero-kompass (ExecutiveDockBar under ME-basta-design).
 * Make: https://www.figma.com/make/XAkUe9ztRt1Nes0ysXL8Xb/bästa-design
 */
figma.connect(
  BastaDesignDock,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=19-515',
  {
    example: () => <BastaDesignDock />,
  },
);
