import { readFileSync } from 'fs';

const designSrc = `export const FIGMA_COMPONENT_NODE_IDS = {
  BentoCard: '16:434',
  'Hub/Header': '16:435',
  EmptyState: '16:439',
  HubPanelSkeleton: '16:441',
  'Dock/Shell': '19:515',
  DockNavButton: '19:514',
  'Button/BIFF': '19:555',
  StatusBadge: '19:564',
  HubDropdownNav: '16:442',
  CognitiveLoadStrip: '16:443',
} as const;`;

const nodes = {};

const idMatch = designSrc.match(/export const FIGMA_COMPONENT_NODE_IDS = \{([\s\S]*?)\} as const;/);
if (idMatch) {
  const lines = idMatch[1].split('\n');
  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length >= 2) {
      // Avoid matching if there are multiple colons in the string, although IDs are formatted as "16:434"
      // Wait, parts[1] will have " '16" and parts[2] will have "434',"
      // So split(':') is bad because node IDs have colons!
      // Better to use regex matching the line.
      const match = line.match(/^\s*['"]?([^'":]+)['"]?\s*:\s*['"]([^'"]+)['"]/);
      if (match) {
        const key = match[1];
        const val = match[2];
        nodes[key] = val;
      }
    }
  }
}

console.log(nodes);
