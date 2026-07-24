import { NAV_PATHS } from '@/core/navigation/navTruth';
import { VAULT_UI_NAME } from '@/core/copy/evidenceCopy';
import { HOME_SUPERHUB_ROUTES } from '@/core/home/homeSuperhubRoutes';
import { DAGBOK_REMEMBER_LINES } from '@/features/lifeJournal/diary/diary/constants/dagbokReminders';
import {
  materialEnabled,
  type LifeHubMaterialKey,
  type LifeHubPreset,
  type LifeHubPresetId,
} from '@/core/lifeOs/lifeHubPresets';
import type { ModuleHelpLine } from '@/core/ui/ModuleHelpHint';

export type ModuleHelpId =
  | 'dagbok'
  | 'valv'
  | 'familjen'
  | 'capture'
  | 'speglar'
  | 'ekonomi'
  | 'mabra'
  | 'planering'
  | 'hamn'
  | 'arbetsliv'
  | 'drogfrihet'
  | 'valv_monster'
  | 'valv_orkester'
  | 'barnporten'
  | 'inkast_tags'
  | 'hub_familjen'
  | 'hub_mabra'
  | 'hub_hamn'
  | 'hub_vardagen';

export type ModuleHelpEntry = {
  title: string;
  lines: readonly ModuleHelpLine[];
  action?: { label: string; to: string; search?: string };
  presetGate?: {
    presetIds: LifeHubPresetId[];
    materialKey: LifeHubMaterialKey;
  };
};

const REGISTRY: Record<string, ModuleHelpEntry> = {
  dagbok: {
    title: `Dagbok vs ${VAULT_UI_NAME.toLowerCase()}`,
    lines: DAGBOK_REMEMBER_LINES,
    action: { label: `Gå till ${VAULT_UI_NAME}`, to: NAV_PATHS.VALVET },
  },
  'dagbok:reflektion': {
    title: 'Reflektera — journal',
    lines: [
      { label: 'Sparas', text: 'collection `journal` — append-only, privat reflektion.' },
      { label: 'Exempel', text: 'Humör + text — en rad räcker.' },
      { label: 'Inte här', text: 'Sms, skärmdumpar och bevis → Valv (manuellt).' },
    ],
    action: { label: 'Öppna Valv', to: NAV_PATHS.VALVET },
  },
  'dagbok:quick_mirror': {
    title: 'Snabb spegling',
    lines: [
      { label: 'Sparas', text: '`journal` + valfri spegling i session.' },
      { label: 'Zero Footprint', text: 'Spegling lagras inte som RAG — rensas vid logout.' },
    ],
  },
  'dagbok:arkiv': {
    title: 'Minneslista',
    lines: [
      { label: 'Läsläge', text: 'Dina sparade journalrader — inget nytt skrivs här.' },
      { label: 'Bevis', text: 'Behöver du tidslinje för konflikt → Valv separat.' },
    ],
  },

  valv: {
    title: 'Sanningsarkiv',
    lines: [
      { label: 'Silo', text: '`reality_vault` — WORM, create only.' },
      { label: 'Viktigt', text: 'Inget flyttas hit från Dagbok eller Barnen utan ditt godkännande.' },
      { label: 'Tre silos', text: 'Valv-chatt läser bara Valv — aldrig Kunskap eller Barnen-RAG.' },
    ],
  },
  'valv:spara': {
    title: 'Inkast → arkiv',
    lines: [
      { label: 'Gör', text: 'Klistra text eller ladda upp fil — granska innan spar.' },
      { label: 'Sparas', text: 'WORM-post med datum och `truth`-fält.' },
      { label: 'Exempel', text: 'Sms, mejl, skärmdump — neutral fakta, inga diagnoser.' },
    ],
  },
  'valv:granska': {
    title: 'Granska inkommande',
    lines: [
      { label: 'HITL', text: 'Du godkänner varje post innan den blir WORM-bevis.' },
      { label: 'Avvisa', text: 'Fel silo eller känsloutlopp → kassera eller flytta manuellt.' },
    ],
  },
  'valv:analysera': {
    title: 'Mönster & meddelanden',
    lines: [
      { label: 'Mönster', text: 'Deterministisk regex på dina poster — ingen LLM-sanning.' },
      { label: 'Orkester', text: 'BIFF-utkast och SMS-analys — spara till Valv manuellt.' },
    ],
  },
  'valv:kunskap': {
    title: 'Kunskapsbank (bakom PIN)',
    lines: [
      { label: 'Silo', text: 'Kunskap-RAG (`kampspar`) — separat från Valv-bevis.' },
      { label: 'FACT', text: 'Metod och fakta — inte terapi eller BIFF-coaching här.' },
    ],
  },

  familjen: {
    title: 'Barnen-silon',
    lines: [
      { label: 'Sparas', text: '`children_logs` — WORM, append-only.' },
      { label: 'Citat', text: 'Prefix `[citat]` när barnet sa något ordagrant.' },
      { label: 'Tolkning', text: 'Prefix `[tolkning]` för din analys — håll isär.' },
      { label: 'Valv', text: 'Barnlogg flyttas aldrig automatiskt till Valv.' },
    ],
  },
  'familjen:barnfokus': {
    title: 'Barnfokus',
    lines: [
      { label: 'Klass', text: 'PLAY — roterande frågor, inget om vuxenkonflikt.' },
      { label: 'Sparas', text: `{Child}s logg i children_logs.` },
      { label: 'Exempel', text: '«Vad var roligast idag?» — en kort rad räcker.' },
    ],
  },
  'familjen:livslogg_observation': {
    title: 'Livslogg observation',
    lines: [
      { label: 'EVIDENCE', text: 'Observerbart beteende + datum — ingen diagnos på motpart.' },
      { label: 'Valv-bro', text: 'Efter spar kan du erbjudas «Spara som bevis» — du väljer.' },
    ],
  },
  'familjen:inkast': {
    title: 'Familjen inkast',
    lines: [
      { label: 'Routing', text: 'DCAP föreslår silo — du godkänner innan spar.' },
      { label: 'Inte auto', text: 'Barnobservation → children_logs, inte Valv utan HITL.' },
    ],
  },

  capture: {
    title: 'Smart Inkast',
    lines: [
      { label: 'Routing', text: 'Dagbok (`journal`), Valv (`reality_vault`) eller Barnen (`children_logs`).' },
      { label: 'HITL', text: 'Granska alltid innan molnet — inget auto-spar.' },
      { label: 'Taggar', text: 'Hjälper klassning — öppna tagg-guiden vid behov.' },
    ],
  },
  'capture:valv-compact': {
    title: 'Valv-inkast',
    lines: [
      { label: 'Mål', text: 'Bevis och fakta → `reality_vault` efter godkännande.' },
      { label: 'Exempel', text: 'Sms-tråd, mejl, ljud — med datum.' },
    ],
  },
  'capture:hem-capture': {
    title: 'Hem-inkast',
    lines: [
      { label: 'Gör', text: 'Fånga snabbt — redigera i granskningskö.' },
      { label: 'Silo', text: 'Rätt arkiv väljs vid godkännande, inte vid klistra.' },
    ],
  },

  speglar: {
    title: 'Speglar',
    lines: [
      { label: 'Zero Footprint', text: 'Session i minnet — rensas vid logout eller Rensa enheten.' },
      { label: 'Roll', text: 'Validera känsla — fixa inte, inget JADE.' },
      { label: 'Bevis', text: 'Fördjupad jämförelse kräver upplåst Valv-session.' },
    ],
    action: { label: 'Dagbok', to: NAV_PATHS.HJARTAT, search: '?tab=reflektion' },
  },
  'speglar:forensic': {
    title: 'Forensisk spegling',
    lines: [
      { label: 'Läser', text: 'Valv-poster read-only — exkl. vävaren-metadata.' },
      { label: 'Sparas inte', text: 'Chattloggar blir inte WORM.' },
    ],
  },

  ekonomi: {
    title: 'Ekonomi',
    lines: [
      { label: 'Kapacitet', text: 'Nivå 1 = saldo + ett mikrosteg. Mer öppnas vid lugn kapacitet.' },
      { label: 'WORM', text: '`transactions` och ledger — append-only.' },
      { label: 'Inte här', text: 'Ingen Kunskap-RAG eller Valv-bevis.' },
    ],
  },

  mabra: {
    title: 'Mabra',
    lines: [
      { label: 'Sparas', text: 'checkins, mabra_sessions — inte Kunskap-valvet.' },
      { label: 'Vit-zon', text: 'REFLECTION/PLAY — ingen cross-RAG till kampspar.' },
      { label: 'Explicit', text: 'Inget sparas förrän du trycker Spara.' },
    ],
    action: { label: 'Mabra input', to: HOME_SUPERHUB_ROUTES.mabraInput },
  },

  planering: {
    title: 'Planering',
    lines: [
      { label: 'Handling', text: 'P3 Kanban på /planering — Att göra · Väntar · Klart.' },
      { label: 'Projekt', text: 'Flexibla listor och bilder på /projekt.' },
      { label: 'Inte här', text: 'Ex-brus och bevis → Hamn eller Valv.' },
    ],
    action: { label: 'Kanban', to: '/planering' },
  },

  hamn: {
    title: 'Trygg Hamn · BIFF',
    lines: [
      { label: 'Ephemeral', text: 'Sms-analys och utkast — sparas inte automatiskt.' },
      { label: 'BIFF', text: 'Brief, Informative, Friendly, Firm — Grey Rock.' },
      { label: 'Bevis', text: 'Vill du spara sms → Valv manuellt efter session.' },
    ],
    action: { label: 'Valv', to: NAV_PATHS.VALVET },
  },

  arbetsliv: {
    title: 'Arbetsliv',
    lines: [
      { label: 'Gör', text: 'Stämpel, inkomster, veckoflex — ett läge i taget.' },
      { label: 'Valv-bro', text: 'Lönespec kan sparas som bevis — du väljer explicit.' },
    ],
    action: { label: 'Stämpel', to: HOME_SUPERHUB_ROUTES.arbetslivStampla },
  },

  drogfrihet: {
    title: 'Drogfrihet',
    lines: [
      { label: 'Stöd', text: 'Idag, 12-steg, resurser — ingen gamification.' },
      { label: 'Inte terapi', text: 'Akut kris → ring 112 eller jourlinje i Resurser.' },
      { label: 'Sparas', text: 'Reflektion lokalt/session — inte Valv utan du väljer.' },
    ],
  },

  valv_monster: {
    title: 'Mönster (Pansaret)',
    lines: [
      { label: 'Metod', text: 'Deterministisk regex på WORM-texter — ingen LLM som sanning.' },
      { label: 'Sidecar', text: 'Metadata append-only — originalpost ändras inte.' },
      { label: 'Användning', text: 'Frekvens över tid — beteende + datum i underlag.' },
    ],
  },

  valv_orkester: {
    title: 'Meddelanden / SMS-analys',
    lines: [
      { label: 'Brusfilter', text: 'DCAP + logistik + BIFF-utkast — ingen auto-WORM.' },
      { label: 'Spara', text: 'Kopiera till Valv manuellt om du vill ha bevis.' },
      { label: 'Agenter', text: 'Produktagenter — inte auktoritet för ägarskap.' },
    ],
  },

  barnporten: {
    title: 'Barnporten',
    lines: [
      { label: 'Barn-PWA', text: 'Separat app på barnets enhet — ingen Valv-exponering.' },
      { label: 'Ålder', text: 'Verktyg anpassas via evolution_hub (bracket).' },
      { label: 'Valv', text: 'Förälder granskar inkorg — HITL innan bevis i Valv.' },
    ],
    action: { label: 'Öppna Barnporten', to: '/barnporten' },
  },

  inkast_tags: {
    title: 'Tagg-guide',
    lines: [
      { label: 'Syfte', text: 'Taggar hjälper DCAP routa till rätt silo.' },
      { label: 'Beten', text: '#beten = provokationer som triggar JADE — markera, svara inte.' },
      { label: 'Barn', text: 'Barn-taggar → children_logs vid godkännande.' },
    ],
  },

  hub_familjen: {
    title: 'Förälder-hub',
    lines: [
      { label: 'Profil', text: 'Barnfokus och planering prioriteras i din Life Hub-profil.' },
      { label: 'Tips', text: 'Börja med Barnfokus — en fråga, ett barn i taget.' },
    ],
    action: { label: 'Barnfokus', to: NAV_PATHS.FAMILJEN, search: '?tab=reflektion' },
    presetGate: { presetIds: ['foralder_trygg'], materialKey: 'familjen_hub_hint' },
  },

  hub_mabra: {
    title: 'Låg stimulus',
    lines: [
      { label: 'Profil', text: 'Andning och korta steg — inget måste presteras.' },
      { label: 'Tips', text: 'Mabra check-in före tunga beslut.' },
    ],
    action: { label: 'Öppna Mabra', to: '/mabra' },
    presetGate: { presetIds: ['rehab_lag'], materialKey: 'mabra_hub_hint' },
  },

  hub_vardagen: {
    title: 'Vardagsstart',
    lines: [
      { label: 'Ett steg', text: 'Kompass, ekonomi och Mabra visas här — projekt och arbetsliv öppnas på egna sidor.' },
      { label: 'Tips', text: 'Börja med Dygns-Kompassen om dagen känns otydlig.' },
    ],
    action: { label: 'Öppna planering', to: '/planering' },
  },

  hub_hamn: {
    title: 'Grey Rock',
    lines: [
      { label: 'Profil', text: 'BIFF och korta svar när det är tungt.' },
      { label: 'Tips', text: 'Hamn först — spara sms till Valv bara om du behöver bevis.' },
    ],
    action: { label: 'Trygg hamn', to: NAV_PATHS.FAMILJEN, search: '?tab=hamn' },
    presetGate: { presetIds: ['foralder_trygg'], materialKey: 'hamn_hub_hint' },
  },
};

export function getModuleHelp(
  moduleId: ModuleHelpId,
  mode?: string | null,
  preset?: LifeHubPreset | null,
): ModuleHelpEntry | null {
  const modeKey = mode ? `${moduleId}:${mode}` : null;
  const entry = (modeKey ? REGISTRY[modeKey] : null) ?? REGISTRY[moduleId] ?? null;
  if (!entry) return null;

  if (entry.presetGate) {
    if (!preset) return null;
    const { presetIds, materialKey } = entry.presetGate;
    if (!presetIds.includes(preset.id)) return null;
    if (!materialEnabled(preset, materialKey)) return null;
  }

  return entry;
}

/** Smoke / inventering — alla registrerade modulnycklar. */
export const MODULE_HELP_REGISTRY_KEYS = Object.keys(REGISTRY);
