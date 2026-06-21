import figma from '@figma/code-connect/react';
import { EmptyState } from '@/core/ui/EmptyState';

figma.connect(
  EmptyState,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-439',
  {
    props: {
      message: figma.textContent('Message'),
    },
    example: ({ message }) => <EmptyState message={message} />,
  },
);
