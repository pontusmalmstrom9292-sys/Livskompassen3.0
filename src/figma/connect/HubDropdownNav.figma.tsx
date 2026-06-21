import figma from '@figma/code-connect/react';
import { HubDropdownNav } from '@/core/ui/HubDropdownNav';

const SAMPLE_ITEMS = [
  { id: 'a' as const, label: 'Vy A' },
  { id: 'b' as const, label: 'Vy B' },
];

figma.connect(
  HubDropdownNav,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-442',
  {
    props: {
      glowColor: figma.enum('Glow', {
        Gold: 'gold',
        Blue: 'blue',
        Green: 'green',
      }),
    },
    example: ({ glowColor }) => (
      <HubDropdownNav
        items={SAMPLE_ITEMS}
        activeId="a"
        onChange={() => {}}
        glowColor={glowColor}
        ariaLabel="Välj vy"
      />
    ),
  },
);
