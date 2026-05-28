import type { PlaneringHubModuleId } from './planeringHubModules';

export type PlaneringHubLayoutStyle =
  | 'grid'
  | 'list'
  | 'sections'
  | 'orbit'
  | 'bento'
  | 'strip'
  | 'minimal'
  | 'tiles';

export type PlaneringHubLayoutId =
  | 'verktygslada'
  | 'kompakt'
  | 'bento-studio'
  | 'tid-arbete'
  | 'foto-minne'
  | 'minimal-fokus'
  | 'foralder-vardag'
  | 'orbit-guld';

export type PlaneringHubLayout = {
  id: PlaneringHubLayoutId;
  label: string;
  lead: string;
  emoji: string;
  style: PlaneringHubLayoutStyle;
  /** CSS accent tone for layout shell */
  shell: 'gold' | 'emerald' | 'amber' | 'lavender' | 'rose' | 'slate';
  modules: PlaneringHubModuleId[];
  /** Orbit/bento: hero module */
  featured?: PlaneringHubModuleId;
};

export const DEFAULT_PLANERING_HUB_LAYOUT_ID: PlaneringHubLayoutId = 'verktygslada';

export const PLANERING_HUB_LAYOUTS: PlaneringHubLayout[] = [
  {
    id: 'verktygslada',
    label: 'Verktygslåda',
    lead: 'Klassiska kort — allt du behöver ofta.',
    emoji: '🧰',
    style: 'grid',
    shell: 'gold',
    modules: ['inkop', 'handling', 'fokus', 'inkorg', 'projekt', 'nytt-projekt'],
  },
  {
    id: 'kompakt',
    label: 'Kompakt',
    lead: 'Tät lista — snabb scanning.',
    emoji: '☰',
    style: 'list',
    shell: 'slate',
    modules: [
      'inkop',
      'handling',
      'fokus',
      'inkorg',
      'tidtagning',
      'projekt',
      'anteckning',
      'ekonomi',
    ],
  },
  {
    id: 'bento-studio',
    label: 'Bento Studio',
    lead: 'Stora och små rutor — visuellt arbetsbord.',
    emoji: '▦',
    style: 'bento',
    shell: 'amber',
    featured: 'handling',
    modules: ['handling', 'inkop', 'tidtagning', 'fokus', 'foton', 'projekt'],
  },
  {
    id: 'tid-arbete',
    label: 'Tid & arbete',
    lead: 'Tidtagning och listor först.',
    emoji: '⏲',
    style: 'sections',
    shell: 'gold',
    modules: [
      'tidtagning',
      'kalender',
      'handling',
      'inkop',
      'ekonomi',
      'deadline',
    ],
  },
  {
    id: 'foto-minne',
    label: 'Foto & minne',
    lead: 'Bilder, projekt och anteckningar.',
    emoji: '📷',
    style: 'tiles',
    shell: 'rose',
    modules: ['foton', 'projekt', 'nytt-projekt', 'anteckning', 'inkop'],
  },
  {
    id: 'minimal-fokus',
    label: 'Minimal fokus',
    lead: 'Tre val — låg kognitiv last.',
    emoji: '◎',
    style: 'minimal',
    shell: 'lavender',
    featured: 'fokus',
    modules: ['fokus', 'handling', 'inkop'],
  },
  {
    id: 'foralder-vardag',
    label: 'Förälder vardag',
    lead: 'Lista, rutiner, barnlogg-vänligt tempo.',
    emoji: '🏠',
    style: 'strip',
    shell: 'emerald',
    modules: ['inkop', 'rutiner', 'handling', 'projekt', 'foton', 'priolista'],
  },
  {
    id: 'orbit-guld',
    label: 'Orbit guld',
    lead: 'Handling i centrum — övrigt runt.',
    emoji: '◉',
    style: 'orbit',
    shell: 'gold',
    featured: 'handling',
    modules: ['fokus', 'inkop', 'tidtagning', 'inkorg', 'projekt', 'mikrofokus'],
  },
];

const LAYOUT_MAP = new Map(PLANERING_HUB_LAYOUTS.map((l) => [l.id, l]));

export function getPlaneringHubLayout(id: PlaneringHubLayoutId): PlaneringHubLayout {
  return LAYOUT_MAP.get(id) ?? LAYOUT_MAP.get(DEFAULT_PLANERING_HUB_LAYOUT_ID)!;
}

export function isPlaneringHubLayoutId(
  raw: string | null | undefined,
): raw is PlaneringHubLayoutId {
  return PLANERING_HUB_LAYOUTS.some((l) => l.id === raw);
}
