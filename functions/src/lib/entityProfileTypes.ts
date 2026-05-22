/** G9 — EntityProfile / SystemSynapse (blueprint-aligned, owner-bound WORM). */

export type EntityRole = 'MOTPART' | 'BARN' | 'ANVANDARE' | 'NATVERK' | 'MYNDIGHET' | 'SKOLA';

export type SystemSynapseCategory =
  | 'INTEGRITY'
  | 'GROWTH'
  | 'SECURITY'
  | 'BIOGRAPHY'
  | 'COGNITIVE'
  | 'SENSOR'
  | 'PROTECTION';

export type HallucinationRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export interface EntityProfileDoc {
  ownerId: string;
  userId: string;
  entityKey: string;
  role: EntityRole;
  displayName: string;
  aliases: string[];
  category?: string;
  behavioralPatterns: string[];
  groundingNotes?: string;
  isKeyEntity: boolean;
  source: 'seed' | 'user';
  createdAt?: FirebaseFirestore.Timestamp;
}

export interface SystemSynapseDoc {
  ownerId: string;
  userId: string;
  title: string;
  category: SystemSynapseCategory;
  analysis: string;
  groundingPoints: string[];
  hallucinationRisk: HallucinationRisk;
  relatedEntityKeys?: string[];
  source: 'seed' | 'agent';
  createdAt?: FirebaseFirestore.Timestamp;
}

export interface EntityProfileSeedEntry {
  entityKey: string;
  role: EntityRole;
  displayName: string;
  aliases: string[];
  category?: string;
  behavioralPatterns?: string[];
  groundingNotes?: string;
}

/** Kanoniska KEY_ENTITIES — anti-hallucination grounding (från Kampspar-PROFIL-SEED aktörskarta). */
export const KEY_ENTITY_SEEDS: EntityProfileSeedEntry[] = [
  {
    entityKey: 'user_pontus',
    role: 'ANVANDARE',
    displayName: 'Pontus',
    aliases: ['jag', 'pappa', 'användaren'],
    category: 'ANVANDARE',
    groundingNotes: 'Primär användare. ADHD F90.0B, GAD F41.1. Grey Rock/BIFF mot ex.',
  },
  {
    entityKey: 'motpart_isabelle',
    role: 'MOTPART',
    displayName: 'Isabelle',
    aliases: ['ex', 'barnens mor', 'motpart', 'mamma'],
    category: 'MOTPART',
    behavioralPatterns: ['konflikt', 'parallellt föräldraskap'],
    groundingNotes: 'Ex-partner. Vårdnadskonflikt. Kommunikation: logistik 10%, ignorera känslomässiga beten 90%.',
  },
  {
    entityKey: 'barn_kasper',
    role: 'BARN',
    displayName: 'Kasper',
    aliases: ['kasper', 'son äldre'],
    category: 'BARN',
    groundingNotes: 'Son född 2018-08-19. Barnen-silo: children_logs.',
  },
  {
    entityKey: 'barn_arvid',
    role: 'BARN',
    displayName: 'Arvid',
    aliases: ['arvid', 'son yngre'],
    category: 'BARN',
    groundingNotes: 'Son född 2021-06-02. Barnen-silo: children_logs.',
  },
  {
    entityKey: 'natverk_farmor',
    role: 'NATVERK',
    displayName: 'Elisabeth Franck',
    aliases: ['farmor', 'elisabeth'],
    category: 'SLAKT',
    groundingNotes: 'Farmor. Nätverk — neutral dokumentation.',
  },
  {
    entityKey: 'myndighet_soc',
    role: 'MYNDIGHET',
    displayName: 'Socialtjänst Mölndal',
    aliases: ['soc', 'socialtjänsten', 'anna fagergren'],
    category: 'MYNDIGHET',
    behavioralPatterns: ['formell kommunikation'],
    groundingNotes: 'Anna Fagergren samordning. Affärsmässig ton vid kontakt.',
  },
  {
    entityKey: 'skola_kasper',
    role: 'SKOLA',
    displayName: 'Kaspers skola',
    aliases: ['skola', 'rektor', 'lena törning', 'ann skolresurs'],
    category: 'SKOLA',
    groundingNotes: 'Tredjepart kring skolbeteende — dokumentera fakta, inte känsloargument.',
  },
];

export const SYSTEM_SYNAPSE_SEEDS: Array<{
  title: string;
  category: SystemSynapseCategory;
  analysis: string;
  groundingPoints: string[];
  hallucinationRisk: HallucinationRisk;
  relatedEntityKeys?: string[];
}> = [
  {
    title: 'Tre silos — permanent minne',
    category: 'INTEGRITY',
    analysis:
      'Kunskap (kampspar/kb_docs), Valv (reality_vault), Barnen (children_logs) får aldrig blandas i RAG.',
    groundingPoints: [
      'knowledgeVaultQuery läser endast kampspar + kb_docs',
      'valvChatQuery läser endast reality_vault',
      'childrenLogsQuery läser endast children_logs',
    ],
    hallucinationRisk: 'LOW',
  },
  {
    title: 'Grey Rock mot motpart',
    category: 'PROTECTION',
    analysis: 'BIFF/Grey Rock vid kontakt med ex — ingen JADE.',
    groundingPoints: ['Logistik 10%', 'Känslomässiga beten 90% ignoreras'],
    hallucinationRisk: 'LOW',
    relatedEntityKeys: ['motpart_isabelle'],
  },
  {
    title: 'ADHD + GAD — kognitiv avlastning',
    category: 'COGNITIVE',
    analysis: 'Ett mikrosteg i taget. Paralys-Brytaren vid överväldigande.',
    groundingPoints: ['F90.0B', 'F41.1', 'RSD — neurologisk sårbarhet'],
    hallucinationRisk: 'LOW',
    relatedEntityKeys: ['user_pontus'],
  },
];
