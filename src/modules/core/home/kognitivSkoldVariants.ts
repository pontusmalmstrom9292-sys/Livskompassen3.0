/** K01–K10 — synkad med `scripts/generate_kognitiv_skold_variants.mjs` */
export const KOGNITIV_SKOLD_VARIANT_IDS = [
  'K01-sjo-solnedgang',
  'K02-aurora-fjall',
  'K03-obsidian-stjarna',
  'K04-hamn-ember',
  'K05-regn-dimma',
  'K06-nordic-flat',
  'K07-frost-is',
  'K08-valv-marmor',
  'K09-astrolab-sacred',
  'K10-urban-rim',
] as const;

export type KognitivSkoldVariantId = (typeof KOGNITIV_SKOLD_VARIANT_IDS)[number];

export const DEFAULT_KOGNITIV_SKOLD_VARIANT: KognitivSkoldVariantId = 'K06-nordic-flat';

export const KOGNITIV_SKOLD_STORAGE_KEY = 'livskompass.kSkold';

export type KognitivSkoldTokens = {
  id: KognitivSkoldVariantId;
  title: string;
  panelTop: string;
  panelBottom: string;
  shield: string;
  rim: string;
  gold: string;
  glow: string;
};

export const KOGNITIV_SKOLD_VARIANTS: Record<KognitivSkoldVariantId, KognitivSkoldTokens> = {
  'K01-sjo-solnedgang': {
    id: 'K01-sjo-solnedgang',
    title: 'Sjö solnedgång',
    panelTop: '#1a2830',
    panelBottom: '#0a1210',
    shield: 'var(--compass-disk)',
    rim: 'var(--color-accent-gold)',
    gold: '#f5e6b8',
    glow: '#ffb74d',
  },
  'K02-aurora-fjall': {
    id: 'K02-aurora-fjall',
    title: 'Aurora fjällsjö',
    panelTop: '#0a1020',
    panelBottom: '#1a0830',
    shield: '#0a2838',
    rim: '#7ec8e3',
    gold: '#c8e6ff',
    glow: '#4dd0e1',
  },
  'K03-obsidian-stjarna': {
    id: 'K03-obsidian-stjarna',
    title: 'Obsidian stjärnhimmel',
    panelTop: '#0c0a14',
    panelBottom: '#080810',
    shield: '#121018',
    rim: '#9a8b6a',
    gold: '#e8dcc8',
    glow: '#fff8e7',
  },
  'K04-hamn-ember': {
    id: 'K04-hamn-ember',
    title: 'Hamn ember',
    panelTop: '#2a1810',
    panelBottom: '#120c08',
    shield: '#2a1f14',
    rim: '#c97b4a',
    gold: '#ffd9a8',
    glow: '#ff8a50',
  },
  'K05-regn-dimma': {
    id: 'K05-regn-dimma',
    title: 'Regn dimma',
    panelTop: '#0f2e2a',
    panelBottom: '#081818',
    shield: '#0f2e2a',
    rim: '#5ee0b8',
    gold: '#b8f0d8',
    glow: '#2ee6a6',
  },
  'K06-nordic-flat': {
    id: 'K06-nordic-flat',
    title: 'Nordic flat guld',
    panelTop: '#0a1614',
    panelBottom: '#12151f',
    shield: '#142220',
    rim: 'var(--color-accent-gold)',
    gold: 'var(--color-accent-gold)',
    glow: 'var(--color-accent-gold)',
  },
  'K07-frost-is': {
    id: 'K07-frost-is',
    title: 'Frost is',
    panelTop: '#1a2830',
    panelBottom: '#0e1820',
    shield: '#1a2830',
    rim: '#b8d4e8',
    gold: '#e8f4ff',
    glow: '#ffffff',
  },
  'K08-valv-marmor': {
    id: 'K08-valv-marmor',
    title: 'Valv marmor',
    panelTop: '#1c1a18',
    panelBottom: '#101010',
    shield: '#1c1a18',
    rim: 'var(--color-accent-gold)',
    gold: '#f0e0b0',
    glow: '#c9a227',
  },
  'K09-astrolab-sacred': {
    id: 'K09-astrolab-sacred',
    title: 'Astrolab sacred',
    panelTop: '#0c2a28',
    panelBottom: '#081410',
    shield: '#0c2a28',
    rim: 'var(--color-accent-gold)',
    gold: '#f5e6b8',
    glow: '#ffe082',
  },
  'K10-urban-rim': {
    id: 'K10-urban-rim',
    title: 'Urban dusk',
    panelTop: '#101820',
    panelBottom: '#080c12',
    shield: '#101820',
    rim: '#8b7cf6',
    gold: 'var(--color-accent-gold)',
    glow: '#64ffda',
  },
};

export function isKognitivSkoldVariantId(value: string | null | undefined): value is KognitivSkoldVariantId {
  return Boolean(value && (KOGNITIV_SKOLD_VARIANT_IDS as readonly string[]).includes(value));
}

export function resolveKognitivSkoldVariantId(
  value: string | null | undefined,
): KognitivSkoldVariantId {
  return isKognitivSkoldVariantId(value) ? value : DEFAULT_KOGNITIV_SKOLD_VARIANT;
}
