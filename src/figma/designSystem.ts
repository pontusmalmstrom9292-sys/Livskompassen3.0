/** Livskompassen Obsidian Calm — master design file (Figma). */
export const FIGMA_DESIGN_FILE_KEY = 'Qp6b3nSJXq7qgFiwvDBk2C';

/** Uppdateras av L0-atoms-pluginet → scripts/figma/apply-code-connect-nodes.mjs */
export const FIGMA_COMPONENT_NODE_IDS = {
  BentoCard: '16:434',
  'Hub/Header': '16:435',
  EmptyState: '16:439',
  HubPanelSkeleton: '16:441',
  'Dock/Shell': '19:515',
  DockNavButton: '19:514',
  'Button/BIFF': '19:555',
  StatusBadge: '19:564',
} as const;

export type FigmaComponentKey = keyof typeof FIGMA_COMPONENT_NODE_IDS;

const FILE_SLUG = 'Livskompassen-Obsidian-Calm';

/** Figma Code Connect URL for a document node id (`123:456`). */
export function figmaDesignUrl(nodeId: string): string {
  const slug = nodeId.replace(':', '-');
  return `https://www.figma.com/design/${FIGMA_DESIGN_FILE_KEY}/${FILE_SLUG}?node-id=${slug}`;
}

/** Full URLs — speglas som string literals i src/figma/connect/*.figma.tsx (krav från Figma CLI). */
export const FIGMA_CONNECT_URLS: Record<FigmaComponentKey, string> = {
  BentoCard: 'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-434',
  'Hub/Header': 'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-435',
  EmptyState: 'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-439',
  HubPanelSkeleton: 'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=16-441',
  'Dock/Shell': 'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=19-515',
  DockNavButton: 'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=19-514',
  'Button/BIFF': 'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=19-555',
  StatusBadge: 'https://www.figma.com/design/Qp6b3nSJXq7qgFiwvDBk2C/Livskompassen-Obsidian-Calm?node-id=19-564',
};
