import figma from '@figma/code-connect/react';
import { BentoCard } from '@/shared/ui/BentoCard';

figma.connect(
  BentoCard,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-434',
  {
    props: {
      title: figma.textContent('Title'),
      description: figma.textContent('Description'),
      glow: figma.enum('Glow', {
        None: undefined,
        Gold: 'gold',
        Blue: 'blue',
        Green: 'green',
      }),
      children: figma.children('Slot'),
    },
    example: ({ title, description, glow, children }) => (
      <BentoCard title={title} description={description} glow={glow}>
        {children}
      </BentoCard>
    ),
  },
);
