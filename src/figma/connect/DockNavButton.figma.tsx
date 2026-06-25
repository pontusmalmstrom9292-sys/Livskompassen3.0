import figma from '@figma/code-connect/react';
import { DockNavButton } from '@/modules/core/layout/DockNavButton';

figma.connect(
  DockNavButton,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=19-514',
  {
    props: {
      label: figma.textContent('Label'),
      active: figma.enum('State', {
        Idle: false,
        Active: true,
      }),
      icon: figma.instance('Icon'),
    },
    example: ({ label, active, icon }) => (
      <DockNavButton label={label} icon={icon} active={active} tileVariant="calm" />
    ),
  },
);
