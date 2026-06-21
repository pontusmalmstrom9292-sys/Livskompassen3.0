import figma from '@figma/code-connect/react';
import { BiffRewriteButton } from '@/modules/shared/ui/BiffRewriteButton';

figma.connect(
  BiffRewriteButton,
  'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=19-555',
  {
    props: {
      disabled: figma.enum('State', {
        Idle: false,
        Loading: false,
        Disabled: true,
      }),
    },
    example: () => (
      <BiffRewriteButton
        text="Exempeltext som behöver BIFF-tvätt enligt Grey Rock."
        onRewrite={() => undefined}
      />
    ),
  },
);
