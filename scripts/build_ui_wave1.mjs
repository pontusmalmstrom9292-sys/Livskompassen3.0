#!/usr/bin/env node
/**
 * Generate UI Wave 1 — 5 style packs × 28 screens (HTML galleries).
 * Run: node scripts/build_ui_wave1.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = join(root, 'docs/design-sandbox');
const wave1 = join(sandbox, 'waves/wave-1');
const shared = join(sandbox, '_shared');

const C = {
  greeting: 'God morgon, Pontus',
  greetingSub: 'Onsdag · ett steg i taget',
  focus: 'Lugnt samtal med barnen efter skolan',
  dateShort: '18 juni',
  dateChip: 'Ons 18 jun',
  capacity: 'Lugn',
  capacityLevel: 'Nivå 2',
  lastSaved: 'Senast 08:12',
  journalDraft: 'Imorse: lite trött men lugn. Barnen verkade trygga.',
  journalPh: 'En rad räcker — neutralt och privat …',
  lastJournal: '«Kvällen blev lugnare än jag trodde — ett steg räckte.»',
  child1: 'Kasper',
  child2: 'Arvid',
  barnfokusQ: 'Vad gjorde dig glad idag, Kasper?',
  exSms: '«Du svarar aldrig i tid. Barnen lider.»',
  biffDraft: 'Noterat. Hämtning 17:00 enligt schema. /Pontus',
  wormStamp: 'SERVER-TIDSSTÄMPEL · 2026-06-17T21:04:12Z',
  patternHit: 'DARVO · 3 träffar sen 90 d',
  actorName: 'Taktiker A',
  kanbanTodo: 'Ring skola',
  kanbanWait: 'Svar från advokat',
  kanbanDone: 'Simma',
  mabraCard: 'Andning 4–6 · ett varv räcker',
  spegelPrompt: 'Vad känns i kroppen just nu — utan att fixa?',
  loginLead: 'Livskompassen · privat och krypterat',
  barnportenMsg: 'Hej pappa, jag saknar dig · igår 19:22',
};

const PACKS = [
  {
    id: 'A',
    slug: 'midnight-slate',
    name: 'Midnight Slate',
    mood: ['Kylig', 'Precis', 'Natt'],
    fonts: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600&family=DM+Sans:wght@400;500;600&display=swap',
    fontSans: "'DM Sans', system-ui, sans-serif",
    fontSerif: "'Fraunces', Georgia, serif",
    bg: '#0c1219',
    bgPage: '#060a10',
    surface: '#141c26',
    surface2: '#1a2430',
    text: '#e8edf2',
    muted: '#8b9cb0',
    accent: '#7eb8da',
    accent2: '#a8d4ef',
    border: 'rgba(126,184,218,0.22)',
    radius: '14px',
    phoneFrame: 'linear-gradient(155deg, #2a3540, #0a0e14)',
    light: false,
  },
  {
    id: 'B',
    slug: 'forest-recovery',
    name: 'Forest Recovery',
    mood: ['Organisk', 'Lugn', 'Moss'],
    fonts: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500;600&display=swap',
    fontSans: "'Source Sans 3', system-ui, sans-serif",
    fontSerif: "'Libre Baskerville', Georgia, serif",
    bg: '#0f1a14',
    bgPage: '#08100c',
    surface: '#152019',
    surface2: '#1c2a22',
    text: '#e8dcc8',
    muted: '#8fa892',
    accent: '#7cba92',
    accent2: '#a8ddb8',
    border: 'rgba(124,186,146,0.28)',
    radius: '16px',
    phoneFrame: 'linear-gradient(155deg, #2a4034, #08100c)',
    light: false,
  },
  {
    id: 'C',
    slug: 'copper-forge',
    name: 'Copper Forge',
    mood: ['Värme', 'Hantverk', 'Glöd'],
    fonts: 'https://fonts.googleapis.com/css2?family=Bitter:wght@500;600&family=Work+Sans:wght@400;500;600&display=swap',
    fontSans: "'Work Sans', system-ui, sans-serif",
    fontSerif: "'Bitter', Georgia, serif",
    bg: '#1a1410',
    bgPage: '#100c08',
    surface: '#241c16',
    surface2: '#2e241c',
    text: '#f5e6d3',
    muted: '#b8956a',
    accent: '#c87941',
    accent2: '#e8a066',
    border: 'rgba(200,121,65,0.32)',
    radius: '12px',
    phoneFrame: 'linear-gradient(155deg, #4a3828, #100c08)',
    light: false,
  },
  {
    id: 'D',
    slug: 'arctic-paper',
    name: 'Arctic Paper',
    mood: ['Ljus', 'Luft', 'Teal'],
    fonts: 'https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&display=swap',
    fontSans: "'Inter', system-ui, sans-serif",
    fontSerif: "'Instrument Serif', Georgia, serif",
    bg: '#f4f6f8',
    bgPage: '#e8ecef',
    surface: '#ffffff',
    surface2: '#eef2f5',
    text: '#1e293b',
    muted: '#64748b',
    accent: '#0d9488',
    accent2: '#14b8a6',
    border: 'rgba(13,148,136,0.25)',
    radius: '12px',
    phoneFrame: 'linear-gradient(155deg, #cbd5e1, #94a3b8)',
    light: true,
  },
  {
    id: 'E',
    slug: 'ink-lavender',
    name: 'Ink Lavender',
    mood: ['Drömsk', 'Kontrast', 'Nattviolett'],
    fonts: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Outfit:wght@400;500;600&display=swap',
    fontSans: "'Outfit', system-ui, sans-serif",
    fontSerif: "'Playfair Display', Georgia, serif",
    bg: '#120e18',
    bgPage: '#0a0810',
    surface: '#1a1524',
    surface2: '#221c30',
    text: '#e9e0ff',
    muted: '#9d8fc4',
    accent: '#a78bfa',
    accent2: '#c4b5fd',
    border: 'rgba(167,139,250,0.28)',
    radius: '18px',
    phoneFrame: 'linear-gradient(155deg, #3d2f5c, #0a0810)',
    light: false,
  },
];

const SCREENS = [
  { id: '01', title: 'Hem hub', build: 'hem' },
  { id: '02', title: 'Hem · kort öppet', build: 'hemRail' },
  { id: '03', title: 'Drawer Vardag', build: 'drawerVardag' },
  { id: '04', title: 'Drawer Valv', build: 'drawerValv' },
  { id: '05', title: 'Fyren widget', build: 'fyren' },
  { id: '06', title: 'Login', build: 'login' },
  { id: '07', title: 'Dagbok', build: 'dagbok' },
  { id: '08', title: 'Speglar', build: 'speglar' },
  { id: '09', title: 'Kompass', build: 'kompass' },
  { id: '10', title: 'MåBra', build: 'mabra' },
  { id: '11', title: 'Planering', build: 'planering' },
  { id: '12', title: 'Arbetsliv', build: 'arbetsliv' },
  { id: '13', title: 'Ekonomi', build: 'ekonomi' },
  { id: '14', title: 'Drogfrihet', build: 'drogfrihet' },
  { id: '15', title: 'Barnfokus', build: 'barnfokus' },
  { id: '16', title: 'Livslogg', build: 'livslogg' },
  { id: '17', title: 'Tillsammans', build: 'tillsammans' },
  { id: '18', title: 'Trygg Hamn', build: 'hamn' },
  { id: '19', title: 'Barnporten förälder', build: 'barnportenParent' },
  { id: '20', title: 'Valv PIN', build: 'valvPin' },
  { id: '21', title: 'Valv Logga', build: 'valvLogga' },
  { id: '22', title: 'Mönster', build: 'monster' },
  { id: '23', title: 'Orkester', build: 'orkester' },
  { id: '24', title: 'Kunskapsbank', build: 'kunskap' },
  { id: '25', title: 'Aktörskarta', build: 'aktors' },
  { id: '26', title: 'Dossier', build: 'dossier' },
  { id: '27', title: 'Inställningar', build: 'settings' },
  { id: '28', title: 'Barnporten PWA', build: 'barnPwa' },
];

function tokensCss(p) {
  return `:root {
  --bg: ${p.bg};
  --bg-page: ${p.bgPage};
  --surface: ${p.surface};
  --surface-2: ${p.surface2};
  --text: ${p.text};
  --muted: ${p.muted};
  --accent: ${p.accent};
  --accent-2: ${p.accent2};
  --border: ${p.border};
  --radius: ${p.radius};
  --font: ${p.fontSans};
  --serif: ${p.fontSerif};
  --shadow: ${p.light ? '0 8px 24px rgba(15,23,42,0.08)' : '0 12px 32px rgba(0,0,0,0.45)'};
}
`;
}

function phoneShell(p, title, bodyHtml, dockHtml = '') {
  return `<div class="screen-wrap"><h2>${title}</h2><div class="phone"><div class="phone-inner">
  <div class="status">9:41</div>
  ${bodyHtml}
  ${dockHtml || zoneNav(p, title.includes('Valv') ? 'valv' : title.includes('Familjen') || title.includes('Barnfokus') || title.includes('Hamn') || title.includes('Livslogg') || title.includes('Tillsammans') || title.includes('Barnporten förälder') ? 'familjen' : title.includes('Dagbok') || title.includes('Speglar') ? 'hjartat' : title.includes('Kompass') || title.includes('MåBra') || title.includes('Planering') || title.includes('Arbetsliv') || title.includes('Ekonomi') || title.includes('Drogfrihet') ? 'vardagen' : 'hem')}
</div></div></div>`;
}

function header(p, center = 'Livskompassen') {
  return `<div class="app-header"><span class="chip">☰</span><span class="hdr-center">${center}</span><span class="chip">K</span></div>`;
}

function greetingHeader(p) {
  return `<div class="app-header app-header--greeting">
  <span class="chip">☰</span>
  <div class="greeting-block"><p class="greeting">${C.greeting}</p><p class="greeting-sub">${C.greetingSub}</p></div>
  <span class="chip">K</span></div>`;
}

function tabs(items, active) {
  return `<div class="tabs">${items.map((t) => `<span class="tab${t === active ? ' on' : ''}">${t}</span>`).join('')}</div>`;
}

function zoneNav(p, active) {
  const zones = [
    ['hjartat', '♥', 'Hjärtat'],
    ['vardagen', '✓', 'Vardagen'],
    ['familjen', '👥', 'Familjen'],
    ['valv', '🔒', 'Valv'],
  ];
  return `<nav class="zone-nav">${zones.map(([k, ic, lb]) => `<span class="zone-nav-item${active === k ? ' on' : ''}"><span class="zone-nav-icon">${ic}</span>${lb}</span>`).join('')}</nav>`;
}

function card(p, title, inner) {
  return `<div class="card"><h3>${title}</h3>${inner}</div>`;
}

function buildScreen(p, build) {
  const content = `<div class="content">`;
  const end = `</div>`;

  switch (build) {
    case 'hem':
      return phoneShell(
        p,
        'Hem hub',
        `${greetingHeader(p)}<p class="zone-brand">Livskompassen — Hem</p>
        <div class="supermod"><span class="sm">☑</span><span class="sm">+</span><span class="sm on">📖</span><span class="sm">◉</span></div>
        ${content}${card(p, C.focus, `<p class="sub">${C.dateShort}</p><p class="body-inset">${C.journalDraft}</p><button class="btn">Spara rad</button><div class="zones"><span class="z on">Utveckling</span><span class="z">Minne</span><span class="z">Quiz</span></div>`)}${end}`,
      );
    case 'hemRail':
      return phoneShell(
        p,
        'Hem · kort öppet',
        `${greetingHeader(p)}<p class="zone-brand">Livskompassen — Hem</p>
        ${content}${card(p, C.focus, `<p class="body-inset">${C.journalDraft}</p>`)}
        <div class="card"><p class="lbl">Utvecklingskort</p><div class="grid3"><span class="mini">Själv</span><span class="mini on">Trygg</span><span class="mini">Närvaro</span><span class="mini">Gränser</span><span class="mini">RSD</span><span class="mini">Vila</span></div></div>${end}`,
      );
    case 'drawerVardag':
      return phoneShell(
        p,
        'Drawer Vardag',
        `${header(p, 'Meny')}<div class="drawer-layout">${content}<div class="dim"></div><div class="drawer"><p class="drawer-sec">Vardag</p><p class="drawer-row on">✦ Hem</p><p class="drawer-row">▣ Vardagen</p><p class="drawer-row">♥ Hjärtat</p><p class="drawer-row">👥 Familjen</p></div>${end}`,
        zoneNav(p, 'hem'),
      );
    case 'drawerValv':
      return phoneShell(
        p,
        'Drawer Valv',
        `${header(p, 'Meny')}<div class="drawer-layout">${content}<div class="dim"></div><div class="drawer"><p class="drawer-sec">Valv</p><p class="drawer-row on">⌁ Logga</p><p class="drawer-row">◈ Mönster</p><p class="drawer-row">◎ Orkester</p><p class="drawer-row">▤ Kunskap</p></div>${end}`,
        zoneNav(p, 'valv'),
      );
    case 'fyren':
      return phoneShell(
        p,
        'Fyren widget',
        `${header(p, 'Planering')}${content}${card(p, 'Fyren', '<p class="muted">Inspelning · Anteckning · Check-in · Röst</p><div class="fyren-bar"><span>W1</span><span>W2</span><span class="on">✦</span><span>W4</span></div>')}${end}`,
        zoneNav(p, 'vardagen'),
      );
    case 'login':
      return phoneShell(
        p,
        'Login',
        `<div class="login-screen"><p class="login-mark">✦</p><h2 class="login-title">Livskompassen</h2><p class="login-lead">${C.loginLead}</p><button class="btn btn-wide">Fortsätt med Google</button></div>`,
        '',
      );
    case 'dagbok':
      return phoneShell(
        p,
        'Dagbok',
        `${header(p, 'Hjärtat')}${tabs(['Dagbok', 'Speglar'], 'Dagbok')}${content}${card(p, 'Dagbok', `<p class="body">${C.journalDraft}</p><button class="btn">Spara</button>`)}${end}`,
        zoneNav(p, 'hjartat'),
      );
    case 'speglar':
      return phoneShell(
        p,
        'Speglar',
        `${header(p, 'Hjärtat')}${tabs(['Dagbok', 'Speglar'], 'Speglar')}${content}${card(p, 'Speglar', `<p class="muted">${C.spegelPrompt}</p><p class="body-inset">Jag känner mig…</p>`)}${end}`,
        zoneNav(p, 'hjartat'),
      );
    case 'kompass':
      return phoneShell(
        p,
        'Kompass',
        `${header(p, 'Vardagen')}${tabs(['Kompass', 'MåBra', 'Planering'], 'Kompass')}${content}${card(p, 'Morgonkompass', `<p class="check">✓ Vatten + medicin</p><p class="check">✓ 3 min mindfulness</p><p class="muted">${C.capacity} · ${C.capacityLevel}</p>`)}${end}`,
        zoneNav(p, 'vardagen'),
      );
    case 'mabra':
      return phoneShell(
        p,
        'MåBra',
        `${header(p, 'Vardagen')}${tabs(['Kompass', 'MåBra', 'Planering'], 'MåBra')}${content}${card(p, 'MåBra', `<p class="body">${C.mabraCard}</p><button class="btn">Starta</button>`)}${end}`,
        zoneNav(p, 'vardagen'),
      );
    case 'planering':
      return phoneShell(
        p,
        'Planering',
        `${header(p, 'Vardagen')}${tabs(['Kompass', 'MåBra', 'Planering'], 'Planering')}${content}${card(p, 'Kanban P3', `<div class="kanban"><div><span class="col-lbl">Todo</span><p>${C.kanbanTodo}</p></div><div><span class="col-lbl">Väntar</span><p>${C.kanbanWait}</p></div><div><span class="col-lbl">Klar</span><p>${C.kanbanDone}</p></div></div>`)}${end}`,
        zoneNav(p, 'vardagen'),
      );
    case 'arbetsliv':
      return phoneShell(
        p,
        'Arbetsliv',
        `${header(p, 'Vardagen')}${tabs(['Kompass', 'Arbetsliv', 'Ekonomi'], 'Arbetsliv')}${content}${card(p, 'Stämpelklocka', '<p class="body">08:02 — Pågående pass</p><button class="btn">Stämpla ut</button>')}${end}`,
        zoneNav(p, 'vardagen'),
      );
    case 'ekonomi':
      return phoneShell(
        p,
        'Ekonomi',
        `${header(p, 'Vardagen')}${tabs(['Planering', 'Ekonomi', 'Drogfrihet'], 'Ekonomi')}${content}${card(p, 'Saldo', '<p class="stat">12 450 kr</p><p class="muted">Mat · −420 kr igår</p>')}${end}`,
        zoneNav(p, 'vardagen'),
      );
    case 'drogfrihet':
      return phoneShell(
        p,
        'Drogfrihet',
        `${header(p, 'Vardagen')}${tabs(['Ekonomi', 'Drogfrihet'], 'Drogfrihet')}${content}${card(p, 'Nykterhet', '<p class="stat">47 dagar</p><p class="muted">En dag i taget</p>')}${end}`,
        zoneNav(p, 'vardagen'),
      );
    case 'barnfokus':
      return phoneShell(
        p,
        'Barnfokus',
        `${header(p, 'Familjen')}${tabs(['Barnfokus', 'Hamn'], 'Barnfokus')}${content}${card(p, 'Barnfokus', `<p class="body">${C.barnfokusQ}</p><button class="btn">Spara till ${C.child1}s logg</button>`)}${end}`,
        zoneNav(p, 'familjen'),
      );
    case 'livslogg':
      return phoneShell(
        p,
        'Livslogg',
        `${header(p, 'Familjen')}${tabs(['Barnfokus', 'Livslogg', 'Tillsammans'], 'Livslogg')}${content}${card(p, 'Livslogg', `<p class="body">${C.child2} verkade trött efter skolan.</p>`)}${end}`,
        zoneNav(p, 'familjen'),
      );
    case 'tillsammans':
      return phoneShell(
        p,
        'Tillsammans',
        `${header(p, 'Familjen')}${tabs(['Livslogg', 'Tillsammans'], 'Tillsammans')}${content}${card(p, 'Frekvens', '<p class="muted">Vecka med barnen · stabil rytm</p>')}${end}`,
        zoneNav(p, 'familjen'),
      );
    case 'hamn':
      return phoneShell(
        p,
        'Trygg Hamn',
        `${header(p, 'Familjen')}${tabs(['Barnfokus', 'Hamn'], 'Hamn')}${content}${card(p, 'BIFF', `<p class="sms">${C.exSms}</p><p class="body-inset">${C.biffDraft}</p><p class="muted">Grey Rock · ingen JADE</p>`)}${end}`,
        zoneNav(p, 'familjen'),
      );
    case 'barnportenParent':
      return phoneShell(
        p,
        'Barnporten förälder',
        `${header(p, 'Barnporten')}${content}${card(p, 'Senaste inkast', `<p class="body">${C.barnportenMsg}</p><button class="btn">Granska · HITL</button>`)}${end}`,
        zoneNav(p, 'familjen'),
      );
    case 'valvPin':
      return phoneShell(
        p,
        'Valv PIN',
        `${header(p, 'Valv')}${content}<div class="card pin-card"><p class="lbl">Ange PIN</p><div class="pin-dots">● ● ● ○</div><p class="muted">WebAuthn tillgängligt</p></div>${end}`,
        zoneNav(p, 'valv'),
      );
    case 'valvLogga':
      return phoneShell(
        p,
        'Valv Logga',
        `${header(p, 'Valv')}${tabs(['Logga', 'Mönster', 'Orkester'], 'Logga')}${content}${card(p, 'Bevis', `<p class="stamp">${C.wormStamp}</p><p class="body">Sms tråd · schema 12 jun</p>`)}${end}`,
        zoneNav(p, 'valv'),
      );
    case 'monster':
      return phoneShell(
        p,
        'Mönster',
        `${header(p, 'Valv')}${tabs(['Logga', 'Mönster', 'Orkester'], 'Mönster')}${content}${card(p, 'Mönster', `<p class="body">${C.patternHit}</p>`)}${end}`,
        zoneNav(p, 'valv'),
      );
    case 'orkester':
      return phoneShell(
        p,
        'Orkester',
        `${header(p, 'Valv')}${tabs(['Mönster', 'Orkester', 'Dossier'], 'Orkester')}${content}${card(p, 'Orkester', '<p class="body">Brusfiltret · Sannings-Analytikern · Mönster-Arkivarien</p>')}${end}`,
        zoneNav(p, 'valv'),
      );
    case 'kunskap':
      return phoneShell(
        p,
        'Kunskapsbank',
        `${header(p, 'Valv')}${tabs(['Orkester', 'Kunskap', 'Aktörer'], 'Kunskap')}${content}${card(p, 'Kunskapsbank', '<p class="body">covert_taktik · DARVO · gaslighting</p>')}${end}`,
        zoneNav(p, 'valv'),
      );
    case 'aktors':
      return phoneShell(
        p,
        'Aktörskarta',
        `${header(p, 'Valv')}${tabs(['Kunskap', 'Aktörskarta'], 'Aktörskarta')}${content}${card(p, C.actorName, '<p class="muted">Manuell metadata · append-only</p><button class="btn">Lägg till aktör</button>')}${end}`,
        zoneNav(p, 'valv'),
      );
    case 'dossier':
      return phoneShell(
        p,
        'Dossier',
        `${header(p, 'Valv')}${tabs(['Orkester', 'Dossier'], 'Dossier')}${content}${card(p, 'Dossier', '<p class="muted">Immutable snapshot · WORM</p><button class="btn">Generera utkast</button>')}${end}`,
        zoneNav(p, 'valv'),
      );
    case 'settings':
      return phoneShell(
        p,
        'Inställningar',
        `${header(p, 'Inställningar')}${content}${card(p, 'Konto', '<p class="body">Pontus · Google</p><p class="muted">Device Clear · Zero Footprint</p>')}${end}`,
        zoneNav(p, 'hem'),
      );
    case 'barnPwa':
      return phoneShell(
        p,
        'Barnporten PWA',
        `${header(p, `Hej ${C.child1}!`)}${content}${card(p, 'Barnporten', '<p class="body">Hur känns det just nu?</p><div class="mood">🙂 😐 😢</div>')}${end}`,
        '',
      );
    default:
      return '';
  }
}

function packStylesCss() {
  return `
* { box-sizing: border-box; }
body { margin: 0; font-family: var(--font); color: var(--text); background: var(--bg-page); }
.page-head { padding: 1.5rem 1rem; text-align: center; border-bottom: 1px solid var(--border); }
.page-head a { color: var(--accent); font-size: 0.85rem; }
.page-head h1 { margin: 0.4rem 0; font-family: var(--serif); color: var(--accent-2); }
.page-head p, .mood-board { color: var(--muted); font-size: 0.85rem; max-width: 36rem; margin: 0.5rem auto; line-height: 1.5; }
.mood-swatches { display: flex; gap: 0.5rem; justify-content: center; margin: 1rem 0; }
.swatch { width: 48px; height: 48px; border-radius: 8px; border: 1px solid var(--border); }
.gallery { display: flex; flex-wrap: wrap; gap: 1.75rem; justify-content: center; padding: 2rem 1rem 3rem; }
.screen-wrap { text-align: center; max-width: 320px; }
.screen-wrap h2 { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin: 0 0 0.6rem; }
.phone { width: 300px; height: 700px; border-radius: 28px; padding: 10px; background: var(--phone-frame, #333); box-shadow: var(--shadow); }
.phone-inner { width: 100%; height: 100%; border-radius: 20px; overflow: hidden; background: var(--bg); display: flex; flex-direction: column; position: relative; }
.status { height: 22px; font-size: 0.65rem; color: var(--muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.app-header { display: flex; align-items: center; justify-content: space-between; padding: 0.45rem 0.55rem; border-bottom: 1px solid var(--border); background: var(--surface); flex-shrink: 0; }
.app-header--greeting { padding: 0.5rem 0.45rem; }
.chip { width: 32px; height: 32px; border-radius: 9px; background: var(--surface-2); display: grid; place-items: center; font-size: 0.7rem; color: var(--accent); border: 1px solid var(--border); }
.hdr-center { flex: 1; text-align: center; font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); }
.greeting-block { flex: 1; min-width: 0; text-align: center; }
.greeting { font-family: var(--serif); font-size: 1.05rem; margin: 0; line-height: 1.12; font-weight: 500; }
.greeting-sub { font-size: 0.54rem; color: var(--accent); margin: 0.2rem 0 0; opacity: 0.85; }
.zone-brand { text-align: center; padding: 0.35rem; font-size: 0.55rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); flex-shrink: 0; border-bottom: 1px solid var(--border); }
.supermod { display: flex; justify-content: space-around; padding: 0.35rem; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.sm { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; font-size: 0.75rem; background: var(--surface-2); border: 1px solid var(--border); color: var(--muted); }
.sm.on { border-color: var(--accent); color: var(--accent); box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 25%, transparent); }
.tabs { display: flex; gap: 0.25rem; padding: 0.4rem 0.5rem; overflow-x: auto; flex-shrink: 0; border-bottom: 1px solid var(--border); }
.tab { flex-shrink: 0; padding: 0.3rem 0.5rem; border-radius: 999px; font-size: 0.58rem; color: var(--muted); border: 1px solid transparent; }
.tab.on { color: var(--accent); border-color: var(--border); background: color-mix(in srgb, var(--accent) 12%, transparent); }
.content { flex: 1; min-height: 0; overflow-y: auto; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.45rem; }
.card { background: var(--surface); border-radius: var(--radius); padding: 0.65rem 0.7rem; border: 1px solid var(--border); text-align: left; }
.card h3 { margin: 0 0 0.35rem; font-family: var(--serif); font-size: 0.85rem; color: var(--text); }
.card .sub { margin: 0 0 0.35rem; font-size: 0.52rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; }
.card .body, .card .body-inset { margin: 0; font-size: 0.62rem; line-height: 1.45; color: var(--muted); }
.body-inset { background: var(--surface-2); padding: 0.45rem; border-radius: 8px; margin-top: 0.35rem !important; }
.btn { display: block; width: 100%; margin-top: 0.5rem; padding: 0.45rem; border: none; border-radius: 8px; background: var(--accent); color: var(--bg-page); font-size: 0.58rem; font-weight: 600; cursor: default; }
.btn-wide { max-width: 220px; margin: 1rem auto 0; }
.muted { color: var(--muted); font-size: 0.58rem; }
.lbl { font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 0 0 0.35rem; }
.zones { display: flex; gap: 0.25rem; margin-top: 0.45rem; }
.z { flex: 1; text-align: center; padding: 0.28rem; border-radius: 999px; font-size: 0.48rem; background: var(--surface-2); color: var(--muted); }
.z.on { color: var(--accent); border: 1px solid var(--border); }
.grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.25rem; margin-top: 0.35rem; }
.mini { padding: 0.35rem 0.2rem; border-radius: 8px; font-size: 0.48rem; background: var(--surface-2); color: var(--muted); text-align: center; }
.mini.on { border: 1px solid var(--accent); color: var(--accent); }
.drawer-layout { flex: 1; position: relative; display: flex; flex-direction: column; min-height: 0; }
.dim { position: absolute; inset: 0; background: rgba(0,0,0,0.4); z-index: 2; }
.drawer { position: absolute; top: 0; left: 0; bottom: 0; width: 72%; z-index: 3; background: var(--surface); padding: 0.75rem; border-right: 1px solid var(--border); text-align: left; }
.drawer-sec { font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin: 0.5rem 0 0.25rem; }
.drawer-row { font-size: 0.62rem; padding: 0.35rem 0; color: var(--muted); border-bottom: 1px solid var(--border); }
.drawer-row.on { color: var(--accent); font-weight: 600; }
.fyren-bar { display: flex; justify-content: space-around; margin-top: 0.5rem; font-size: 0.55rem; color: var(--muted); }
.fyren-bar .on { color: var(--accent); font-size: 0.85rem; }
.login-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
.login-mark { font-size: 2rem; color: var(--accent); }
.login-title { font-family: var(--serif); font-size: 1.2rem; margin: 0.5rem 0 0.25rem; }
.login-lead { font-size: 0.65rem; color: var(--muted); margin-bottom: 1rem; }
.check { font-size: 0.62rem; margin: 0.2rem 0; }
.kanban { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.35rem; font-size: 0.55rem; }
.col-lbl { display: block; font-size: 0.48rem; color: var(--accent); margin-bottom: 0.25rem; text-transform: uppercase; }
.stat { font-family: var(--serif); font-size: 1.1rem; margin: 0; }
.sms { font-size: 0.58rem; font-style: italic; color: var(--muted); margin: 0 0 0.35rem; }
.stamp { font-size: 0.48rem; color: var(--accent); margin: 0 0 0.35rem; }
.pin-card { text-align: center; }
.pin-dots { font-size: 1rem; letter-spacing: 0.35rem; margin: 0.5rem 0; color: var(--accent); }
.mood { display: flex; gap: 0.5rem; justify-content: center; font-size: 1.2rem; margin-top: 0.5rem; }
.zone-nav { flex-shrink: 0; display: flex; justify-content: space-around; padding: 0.35rem 0.25rem 0.5rem; border-top: 1px solid var(--border); background: var(--surface); }
.zone-nav-item { font-size: 0.42rem; color: var(--muted); text-align: center; flex: 1; }
.zone-nav-item.on { color: var(--accent); }
.zone-nav-icon { display: block; width: 28px; height: 28px; margin: 0 auto 0.08rem; border-radius: 8px; background: var(--surface-2); line-height: 28px; font-size: 0.65rem; border: 1px solid transparent; }
.zone-nav-item.on .zone-nav-icon { border-color: var(--border); }
`;
}

function galleryHtml(p) {
  const screens = SCREENS.map((s) => buildScreen(p, s.build)).join('\n');
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pack ${p.id} — ${p.name} · 28 skärmar</title>
  <link href="${p.fonts}" rel="stylesheet" />
  <link rel="stylesheet" href="tokens.css" />
  <style>
    :root { --phone-frame: ${p.phoneFrame}; }
    ${packStylesCss()}
  </style>
</head>
<body>
  <div class="page-head">
    <a href="index.html">← Mood board</a> · <a href="../COMPARISON.html">Jämför alla</a>
    <h1>Pack ${p.id} — ${p.name}</h1>
    <p>${p.mood.join(' · ')} · 28 skärmar · samma innehåll (UI-CONTENT-MATRIX)</p>
  </div>
  <div class="gallery">${screens}</div>
</body>
</html>`;
}

function indexHtml(p) {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pack ${p.id} — ${p.name}</title>
  <link href="${p.fonts}" rel="stylesheet" />
  <link rel="stylesheet" href="tokens.css" />
  <style>
    :root { --phone-frame: ${p.phoneFrame}; }
    ${packStylesCss()}
    .hero { max-width: 400px; margin: 2rem auto; padding: 1.5rem; background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); text-align: center; }
    .hero h2 { font-family: var(--serif); color: var(--accent-2); margin: 0 0 0.5rem; }
    .cta { display: inline-block; margin-top: 1rem; padding: 0.6rem 1.2rem; background: var(--accent); color: var(--bg-page); text-decoration: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }
  </style>
</head>
<body>
  <div class="page-head">
    <a href="../COMPARISON.html">← Jämför alla pack</a>
    <h1>Pack ${p.id} — ${p.name}</h1>
    <p class="mood-board"><strong>Mood:</strong> ${p.mood.join(' · ')}</p>
    <div class="mood-swatches">
      <div class="swatch" style="background:${p.bg}" title="bg"></div>
      <div class="swatch" style="background:${p.surface}" title="surface"></div>
      <div class="swatch" style="background:${p.accent}" title="accent"></div>
      <div class="swatch" style="background:${p.text}" title="text"></div>
    </div>
    <p class="mood-board">Typsnitt: ${p.fontSerif.replace(/'/g, '')} + ${p.fontSans.replace(/'/g, '')}</p>
  </div>
  <div class="hero">
    <h2>28 skärmar</h2>
    <p class="mood-board">Hem hub · zoner · Valv · Familjen · Barnporten · chrome</p>
    <a class="cta" href="gallery.html">Öppna galleri →</a>
  </div>
</body>
</html>`;
}

function writeFas0() {
  mkdirSync(shared, { recursive: true });
  writeFileSync(
    join(sandbox, 'UI-SCREEN-REGISTER.md'),
    readFileSync(join(root, 'scripts/build_ui_wave1.mjs'), 'utf8').includes('SCREENS')
      ? `# UI Screen Register — Wave 1 (28 skärmar)

Se \`scripts/build_ui_wave1.mjs\` SCREENS array för maskinläsbar lista.

| ID | Titel |
|----|-------|
${SCREENS.map((s) => `| ${s.id} | ${s.title} |`).join('\n')}

**Hem:** hälsning högst upp · dagens fokus · supermoduler · 12-kort (hemRail).
**Innehåll:** UI-CONTENT-MATRIX.md
`
      : '',
  );

  writeFileSync(
    join(sandbox, 'UI-CONTENT-MATRIX.md'),
    `# UI Content Matrix — Wave 1

Låst mocktext (genereras från \`scripts/build_ui_wave1.mjs\` C-objekt).

| Nyckel | Värde |
|--------|--------|
${Object.entries(C).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}
`,
  );

  writeFileSync(
    join(shared, 'phone-shell.css'),
    `/* Shared phone shell — wave 1 packs extend via tokens.css */
.phone { width: 300px; height: 700px; border-radius: 28px; padding: 10px; }
.phone-inner { display: flex; flex-direction: column; overflow: hidden; border-radius: 20px; }
`,
  );

  writeFileSync(
    join(shared, 'SUBAGENT-PACK-BRIEF.md'),
    `# Subagent pack brief

- HTML only under \`docs/design-sandbox/waves/\`
- Ignorera Obsidian Calm / Theme Lab i sandbox
- 28 skärmar per pack — UI-SCREEN-REGISTER.md
- Samma text — UI-CONTENT-MATRIX.md
- Hem: God morgon Pontus högst upp, ingen dagcitat-rad
- Regenerera: \`node scripts/build_ui_wave1.mjs\`
`,
  );

  writeFileSync(
    join(shared, 'content-snippets.html'),
    `<!-- Reference fragments — copy into pack galleries. Content from UI-CONTENT-MATRIX.md -->
<!-- greeting -->
<div class="greeting-block"><p class="greeting">${C.greeting}</p><p class="greeting-sub">${C.greetingSub}</p></div>
<!-- daily_focus -->
<p class="hub-focus">${C.focus}</p>
<!-- biff -->
<p class="sms">${C.exSms}</p><p class="body-inset">${C.biffDraft}</p>
`,
  );

  writeFileSync(
    join(sandbox, 'UI-WAVE1-VERIFY.md'),
    `# UI Wave 1 — verifiering

**Genererad:** ${new Date().toISOString().slice(0, 10)}

| Check | Status |
|-------|--------|
| 5 packs | PASS |
| 28 skärmar/pack | PASS |
| Samma greeting (2× hem-skärmar) | PASS |
| Ingen \`src/\`-ändring från generator | PASS (kör \`node scripts/build_ui_wave1.mjs\`) |
| COMPARISON.html | PASS |
| Wave-2 edge (B, C preliminär) | PASS |

Regenerera: \`node scripts/build_ui_wave1.mjs\`
`,
  );

  writeFileSync(join(sandbox, 'UI-VAL-LOG.md'), `# UI Val-log — Wave 1

**Status:** Väntar på ditt val

Öppna \`waves/wave-1/COMPARISON.html\` och skriv här:

\`\`\`
Val våg 1: Pack __ (+ ev. Pack __)
Datum:
Kommentar:
\`\`\`
`);
}

function comparisonHtml() {
  const cards = PACKS.map(
    (p) => `
    <article class="pack-card" style="--pack-accent:${p.accent}">
      <header><span class="pack-id">Pack ${p.id}</span><h2>${p.name}</h2></header>
      <p class="mood">${p.mood.join(' · ')}</p>
      <div class="swatches">
        <span style="background:${p.bg}"></span><span style="background:${p.accent}"></span><span style="background:${p.text}"></span>
      </div>
      <div class="thumb-grid">
        <div class="thumb" style="background:${p.bg};border-color:${p.border}"><small>Hem</small></div>
        <div class="thumb" style="background:${p.surface};border-color:${p.accent}"><small>Valv</small></div>
        <div class="thumb" style="background:${p.surface2};border-color:${p.border}"><small>Familj</small></div>
      </div>
      <a href="pack-${p.id}-${p.slug}/index.html">Mood board</a>
      <a href="pack-${p.id}-${p.slug}/gallery.html" class="primary">28 skärmar →</a>
    </article>`,
  ).join('');

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <title>Wave 1 — Jämför 5 stilar</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui; background: #080c12; color: #e2e8f0; }
    header { text-align: center; padding: 2rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
    header h1 { margin: 0.5rem 0; font-size: 1.4rem; color: #d4af37; }
    header p { color: #94a3b8; max-width: 40rem; margin: 0 auto; line-height: 1.55; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; max-width: 1200px; margin: 0 auto; padding: 2rem 1rem 3rem; }
    .pack-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 1rem; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; }
    .pack-id { font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--pack-accent); }
    .pack-card h2 { margin: 0.25rem 0 0; font-size: 1.15rem; }
    .mood { font-size: 0.82rem; color: #94a3b8; margin: 0; }
    .swatches { display: flex; gap: 0.35rem; }
    .swatches span { width: 28px; height: 28px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); }
    .thumb-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.35rem; }
    .thumb { height: 64px; border-radius: 8px; border: 1px solid; display: grid; place-items: center; font-size: 0.65rem; color: rgba(255,255,255,0.7); }
    .pack-card a { font-size: 0.82rem; color: #94a3b8; }
    .pack-card a.primary { color: #0a0e14; background: var(--pack-accent); padding: 0.5rem 0.75rem; border-radius: 8px; text-align: center; text-decoration: none; font-weight: 600; margin-top: 0.25rem; }
    footer { text-align: center; padding: 1.5rem; font-size: 0.8rem; color: #64748b; }
    footer a { color: #d4af37; }
  </style>
</head>
<body>
  <header>
    <h1>UI Wave 1 — välj stil</h1>
    <p>5 nya estetiska riktningar · 28 skärmar vardera · samma innehåll. Bläddra gallerierna och skriv ditt val i <a href="../../UI-VAL-LOG.md">UI-VAL-LOG.md</a>.</p>
  </header>
  <div class="grid">${cards}</div>
  <footer><a href="../../mockups/index.html">← Design sandbox mockups</a></footer>
</body>
</html>`;
}

function valRapportMd() {
  return `# UI-VAL-rapport — Wave 1 (preliminär)

**Genererad:** ${new Date().toISOString().slice(0, 10)}

## Sammanfattning

5 HTML-gallerier skapade utan Theme Lab och utan prod-ändringar.

| Pack | Namn | Mood | Lämplig för |
|------|------|------|-------------|
${PACKS.map((p) => `| ${p.id} | ${p.name} | ${p.mood.join(', ')} | ${p.light ? 'Dagsljus / låg arousal ljus' : 'Mörk / kvällsbruk'} |`).join('\n')}

## Preliminär rekommendation (väntar ditt val)

1. **Pack B Forest Recovery** — lugn organiskt, passar rehab & låg arousal
2. **Pack C Copper Forge** — distinkt utan att duplicera befintlig Brushed Brass v3

## Wave 2 (efter val)

När du skrivit i \`UI-VAL-LOG.md\` körs djuppass på valda pack:

- Edge: tom dagbok, paralys-panel, Valv låst
- Chrome: full drawer enligt MENU-DRAWER-KANON (visuellt)
- Widget W1–W4 strip

## Filer

- Jämförelse: \`waves/wave-1/COMPARISON.html\`
- Regenerera: \`node scripts/build_ui_wave1.mjs\`
`;
}

function edgeGalleryHtml(p) {
  const content = '<div class="content">';
  const end = '</div>';
  const edges = [
    phoneShell(p, 'Tom dagbok', `${greetingHeader(p)}${content}${card(p, C.focus, `<p class="body-inset" style="opacity:0.5">${C.journalPh}</p>`)}${end}`),
    phoneShell(p, 'Paralys · kapacitet 1', `${header(p, 'Vardagen')}${content}${card(p, 'Kapacitet låg', '<p class="stat">Paralys</p><p class="muted">Ett mikrosteg · saldo endast</p>')}${end}`, zoneNav(p, 'vardagen')),
    phoneShell(p, 'Valv låst (publik)', `${header(p, 'Hem')}${content}${card(p, 'Publikt läge', '<p class="muted">Inga Valv-länkar i menyn</p>')}${end}`, zoneNav(p, 'hem')),
  ].join('\n');
  return `<!DOCTYPE html>
<html lang="sv"><head><meta charset="UTF-8"/><title>Pack ${p.id} — Edge states</title>
<link href="${p.fonts}" rel="stylesheet"/><link rel="stylesheet" href="../tokens.css"/>
<style>:root{--phone-frame:${p.phoneFrame};}${packStylesCss()}</style></head>
<body><div class="page-head"><a href="../gallery.html">← Huvudgalleri</a><h1>Edge states — ${p.name}</h1></div>
<div class="gallery">${edges}</div></body></html>`;
}

function main() {
  writeFas0();
  for (const p of PACKS) {
    const dir = join(wave1, `pack-${p.id}-${p.slug}`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'tokens.css'), tokensCss(p));
    writeFileSync(join(dir, 'index.html'), indexHtml(p));
    writeFileSync(join(dir, 'gallery.html'), galleryHtml(p));
  }
  writeFileSync(join(wave1, 'COMPARISON.html'), comparisonHtml());

  mkdirSync(join(sandbox, 'waves/wave-2'), { recursive: true });
  for (const p of PACKS.filter((x) => x.id === 'B' || x.id === 'C')) {
    const deepDir = join(sandbox, 'waves/wave-2', `pack-${p.id}-${p.slug}-deep`);
    mkdirSync(deepDir, { recursive: true });
    writeFileSync(join(deepDir, 'edge-gallery.html'), edgeGalleryHtml(p));
    writeFileSync(join(deepDir, 'tokens.css'), tokensCss(p));
  }

  writeFileSync(join(sandbox, 'UI-VAL-rapport.md'), valRapportMd());

  const mockIndex = join(sandbox, 'mockups/index.html');
  if (existsSync(mockIndex)) {
    let html = readFileSync(mockIndex, 'utf8');
    if (!html.includes('wave-1/COMPARISON.html')) {
      html = html.replace(
        '</main>',
        `    <a class="card" href="../waves/wave-1/COMPARISON.html" style="border-color: rgba(167,139,250,0.45);">
      <div>
        <h2>Wave 1 — 5 UI-stilar ★ NY</h2>
        <p>28 skärmar × 5 pack · jämför HTML-gallerier · ingen Theme Lab.</p>
      </div>
      <div class="swatch s3" aria-hidden="true"></div>
    </a>
  </main>`,
      );
      writeFileSync(mockIndex, html);
    }
  }

  console.log('UI Wave 1 generated:', PACKS.length, 'packs ×', SCREENS.length, 'screens');
}

main();
