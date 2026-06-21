import figma from '@figma/code-connect/react';
import { FloatingDock } from '@/modules/core/layout/FloatingDock';

/** Figma: Dock/Shell → kod: FloatingDock (read-only referens, fil låst). */
figma.connect(
  FloatingDock,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=19-515',
  {
    example: () => <FloatingDock />,
  },
);
