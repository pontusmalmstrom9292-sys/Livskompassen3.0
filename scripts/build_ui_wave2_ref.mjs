#!/usr/bin/env node
/**
 * Wave 2 — referensdriven Life OS (glass/neu + kompass)
 * Källa: användarens ref-bilder (desktop dashboard + mobil HEM)
 */
import { mkdirSync, writeFileSync, cpSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pack = join(root, 'docs/design-sandbox/waves/wave-2/ref-compass-life-os');
const wave2 = join(root, 'docs/design-sandbox/waves/wave-2');
const mockups = join(root, 'docs/design-sandbox/mockups');

mkdirSync(pack, { recursive: true });

const tokensSrc = join(mockups, 'brass-depth-tokens.css');
if (existsSync(tokensSrc)) cpSync(tokensSrc, join(pack, 'tokens.css'));

const C = {
  greeting: 'God morgon, Pontus',
  greetingSub: 'Onsdag · ett steg i taget',
  greetingParen: '(Onsdag, ett steg i taget)',
  focus: 'Lugnt samtal med barnen efter skolan',
  focusDate: '18 juni',
  hubText: 'Imorse: lite trött men lugn. Barnen verkade trygga.',
  lastSaved: '«Kvällen blev lugnare än jag trodde — ett steg räckte.»',
  exSms: '«Du struntar alltid i schemat — barnen lider.»',
  biffDraft: 'Schema enl. överenskommelse ons 18/6 kl 15:00. Bekräfta mottagande.',
  barnQuestion: 'Vad gjorde dig glad idag, Kasper?',
  wormStamp: 'WORM · server 2026-06-18T08:14:02Z',
  child1: 'Kasper',
  child2: 'Arvid',
};

const sharedStyles = `
* { box-sizing: border-box; }
body { margin: 0; font-family: var(--font); color: var(--text); background: #040810; }
.page-head { padding: 1.5rem 1rem; text-align: center; border-bottom: 1px solid var(--border); }
.page-head a { color: var(--accent); font-size: 0.8rem; text-decoration: none; }
.page-head h1 { margin: 0.4rem 0; font-family: var(--serif); font-size: 1.15rem; color: var(--accent-light); }
.page-head p { color: var(--muted); font-size: 0.78rem; max-width: 42rem; margin: 0.5rem auto; line-height: 1.55; }
.ref-badge { display: inline-block; margin-top: 0.5rem; padding: 0.25rem 0.6rem; border-radius: 8px; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); border: 1px solid rgba(46,196,182,0.3); background: rgba(46,196,182,0.06); }
.gallery { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; padding: 2rem 1rem 3rem; }
.screen-wrap { text-align: center; }
.screen-wrap h2 { font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-light); margin: 0 0 0.65rem; max-width: 320px; margin-left: auto; margin-right: auto; }
.screen-wrap.wide h2 { max-width: 920px; }

.phone { width: 300px; height: 700px; border-radius: 32px; padding: 10px; background: linear-gradient(155deg, #3a4250, #0a0e14); box-shadow: 0 26px 56px rgba(0,0,0,0.75); margin: 0 auto; }
.phone-inner { width: 100%; height: 100%; border-radius: 22px; overflow: hidden; display: flex; flex-direction: column; position: relative; background: var(--bg); }
.phone-alive::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 85% 45% at 50% -8%, rgba(212,175,55,0.06), transparent 58%), radial-gradient(ellipse 50% 35% at 100% 100%, rgba(99,102,241,0.04), transparent 50%); pointer-events: none; z-index: 0; }
.phone-alive > * { position: relative; z-index: 1; }

.monitor { width: min(920px, 96vw); border-radius: 16px; padding: 12px; background: linear-gradient(160deg, #2a3040, #0c1018); box-shadow: 0 30px 70px rgba(0,0,0,0.8); margin: 0 auto; }
.monitor-inner { border-radius: 10px; overflow: hidden; background: var(--bg); min-height: 520px; display: flex; flex-direction: column; }

.app-header { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.55rem; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(18,27,46,0.88); backdrop-filter: blur(8px); flex-shrink: 0; }
.chip { width: 32px; height: 32px; border-radius: 9px; background: rgba(0,0,0,0.28); box-shadow: var(--neu-in); display: grid; place-items: center; font-size: 0.65rem; color: var(--accent); border: none; }
.hdr-title { flex: 1; text-align: center; font-family: var(--serif); font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-light); }
.greeting-block { flex: 1; min-width: 0; text-align: center; }
.greeting { font-family: var(--serif); font-size: 1.08rem; margin: 0; color: #f8f8f8; line-height: 1.12; font-weight: 500; }
.greeting-sub { font-family: var(--font); font-size: 0.54rem; color: rgba(184,160,106,0.88); margin: 0.2rem 0 0; }
.greeting-paren { font-size: 0.58rem; color: rgba(186,198,214,0.75); margin: 0.15rem 0 0; font-style: italic; }

.compass-hero { text-align: center; padding: 0.55rem 0.5rem 0.35rem; flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.compass-star { font-size: 2.4rem; line-height: 1; color: var(--accent); text-shadow: 0 0 24px rgba(212,175,55,0.35), 0 0 48px rgba(212,175,55,0.12); filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)); }
.zone-orbit { display: flex; justify-content: space-around; padding: 0.35rem 0.25rem 0.25rem; gap: 0.2rem; }
.orbit-btn { flex: 1; border: none; background: transparent; cursor: default; display: flex; flex-direction: column; align-items: center; gap: 0.15rem; }
.orbit-icon { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; font-size: 0.72rem; color: var(--muted); background: rgba(0,0,0,0.25); box-shadow: var(--neu-out); border: 1px solid rgba(255,255,255,0.06); }
.orbit-btn.on .orbit-icon { color: var(--accent-light); border: 2px solid rgba(212,175,55,0.45); box-shadow: var(--neu-out), 0 0 14px rgba(212,175,55,0.15); }
.orbit-lbl { font-size: 0.34rem; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); line-height: 1.15; max-width: 4.2rem; }
.orbit-btn.on .orbit-lbl { color: var(--accent); font-weight: 600; }

.scroll-main { flex: 1; min-height: 0; overflow-y: auto; padding: 0.45rem 0.5rem; display: flex; flex-direction: column; gap: 0.38rem; }
.sec-lbl { margin: 0 0 0.35rem; font-size: 0.48rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); font-weight: 600; opacity: 0.92; text-align: left; }
.card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.32rem; }
.card-grid .span2 { grid-column: span 2; }
.glass { position: relative; isolation: isolate; border-radius: 14px; padding: 0.55rem 0.58rem; text-align: left;
  background: radial-gradient(ellipse 90% 55% at 50% 0%, rgba(255,255,255,0.04), transparent 52%), linear-gradient(158deg, rgba(24,34,54,0.78) 0%, rgba(14,22,38,0.62) 100%);
  backdrop-filter: blur(10px); box-shadow: var(--neu-deep); border: none; }
.glass::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; background: linear-gradient(148deg, rgba(230,220,200,0.22), rgba(212,175,55,0.14), rgba(120,100,70,0.2)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
.glass > * { position: relative; z-index: 1; }
.inset { border-radius: 10px; padding: 0.45rem 0.5rem; background: rgba(4,14,26,0.5); box-shadow: var(--neu-in); border: 1px solid rgba(255,255,255,0.05); font-size: 0.56rem; line-height: 1.45; color: rgba(186,198,214,0.92); min-height: 2.8rem; }
.inset-sm { min-height: 1.6rem; font-size: 0.52rem; }
.body { margin: 0; font-size: 0.56rem; line-height: 1.45; color: rgba(234,234,234,0.88); }
.muted { color: var(--muted); font-size: 0.5rem; }
.stat-lg { font-family: var(--serif); font-size: 1.05rem; color: var(--accent-light); margin: 0.15rem 0; }
.btn-row { display: flex; gap: 0.28rem; margin-top: 0.35rem; align-items: center; }
.btn { border: none; border-radius: 8px; padding: 0.32rem 0.5rem; font-size: 0.48rem; font-weight: 600; letter-spacing: 0.06em; cursor: default; }
.btn-gold { background: linear-gradient(145deg, #c9a227, #9a7b2f); color: #051220; box-shadow: var(--neu-out); }
.btn-teal { background: linear-gradient(145deg, var(--teal), #1fa89c); color: #051220; }
.btn-ghost { background: rgba(0,0,0,0.22); color: var(--muted); box-shadow: var(--neu-in); border: 1px solid rgba(255,255,255,0.05); }
.badge { display: inline-block; padding: 0.12rem 0.35rem; border-radius: 999px; font-size: 0.42rem; background: rgba(212,175,55,0.15); color: var(--accent); border: 1px solid rgba(212,175,55,0.25); }
.check { display: flex; align-items: center; gap: 0.28rem; margin-top: 0.2rem; font-size: 0.52rem; }
.dot { width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(212,175,55,0.45); box-shadow: var(--neu-in); flex-shrink: 0; }
.dot.done { background: rgba(212,175,55,0.25); }
.spark { height: 32px; margin: 0.3rem 0; border-radius: 8px; background: rgba(0,0,0,0.2); position: relative; overflow: hidden; }
.spark svg { position: absolute; inset: 4px 6px; width: calc(100% - 12px); height: calc(100% - 8px); }
.analysis { display: flex; align-items: center; gap: 0.35rem; margin-top: 0.35rem; padding: 0.35rem; border-radius: 8px; background: rgba(46,196,182,0.08); border: 1px solid rgba(46,196,182,0.2); font-size: 0.48rem; color: var(--teal); }
.spinner { width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgba(46,196,182,0.25); border-top-color: var(--teal); animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.paper-stack { display: flex; gap: -4px; margin-top: 0.35rem; }
.paper { width: 36px; height: 44px; border-radius: 4px; background: linear-gradient(160deg, rgba(240,220,170,0.12), rgba(180,150,90,0.06)); border: 1px solid rgba(212,175,55,0.15); box-shadow: var(--neu-out); transform: rotate(-3deg); }
.paper:nth-child(2) { transform: rotate(2deg) translateX(-8px); }
.paper:nth-child(3) { transform: rotate(-1deg) translateX(-16px); }
.bottom-nav { flex-shrink: 0; display: flex; justify-content: space-around; padding: 0.38rem 0.25rem 0.55rem; background: rgba(12,18,32,0.96); border-top: 1px solid rgba(255,255,255,0.06); }
.bn-item { flex: 1; text-align: center; border: none; background: transparent; font-size: 0.38rem; color: var(--muted); }
.bn-item.on { color: var(--accent); }
.bn-icon { display: block; width: 28px; height: 28px; margin: 0 auto 0.08rem; border-radius: 9px; background: rgba(0,0,0,0.28); box-shadow: var(--neu-in); line-height: 28px; font-size: 0.65rem; }
.bn-item.on .bn-icon { border: 1px solid rgba(212,175,55,0.35); color: var(--accent); box-shadow: var(--neu-out), 0 0 12px rgba(212,175,55,0.12); }

/* Desktop 3-col */
.desk-head { display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(12,18,32,0.9); }
.desk-title { font-family: var(--serif); font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent-light); margin: 0; }
.desk-status { font-size: 0.55rem; color: var(--muted); }
.desk-hero { text-align: center; padding: 0.75rem 1rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
.desk-hero .compass-star { font-size: 3rem; }
.desk-hero .greeting { font-size: 1.35rem; }
.desk-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; padding: 0.75rem 1rem 1rem; flex: 1; }
.desk-col .glass { margin-bottom: 0.55rem; }
.gantt { height: 6px; border-radius: 999px; margin: 0.35rem 0; background: linear-gradient(90deg, var(--accent-dim), var(--accent)); opacity: 0.85; }
.gantt.dim { background: linear-gradient(90deg, rgba(148,163,184,0.28), rgba(148,163,184,0.12)); }
.progress-row { display: flex; align-items: center; gap: 0.35rem; font-size: 0.52rem; margin-top: 0.25rem; }
.progress-bar { flex: 1; height: 5px; border-radius: 999px; background: rgba(0,0,0,0.3); overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-dim), var(--accent)); border-radius: inherit; }

.drawer-layout { flex: 1; position: relative; min-height: 0; }
.dim { position: absolute; inset: 0; background: rgba(0,0,0,0.45); z-index: 2; }
.drawer { position: absolute; top: 0; left: 0; bottom: 0; width: 74%; z-index: 3; background: rgba(18,27,46,0.97); padding: 0.75rem; border-right: 1px solid var(--border); text-align: left; overflow-y: auto; }
.drawer-sec { font-size: 0.48rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin: 0.6rem 0 0.25rem; }
.drawer-row { font-size: 0.58rem; padding: 0.38rem 0; color: var(--muted); border-bottom: 1px solid rgba(255,255,255,0.05); }
.drawer-row.on { color: var(--accent-light); font-weight: 600; }
.pin-dots { font-size: 1.1rem; letter-spacing: 0.4rem; color: var(--accent); text-align: center; margin: 0.75rem 0; }
.tabs { display: flex; gap: 0.25rem; padding: 0.4rem 0.5rem; overflow-x: auto; flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.tab { flex-shrink: 0; padding: 0.32rem 0.55rem; border-radius: 999px; font-size: 0.48rem; color: var(--muted); border: 1px solid transparent; }
.tab.on { color: var(--accent); border-color: rgba(212,175,55,0.22); background: rgba(212,175,55,0.08); }
.kanban { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.35rem; }
.col-lbl { font-size: 0.44rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.25rem; display: block; }
.task-card { padding: 0.35rem; border-radius: 8px; background: rgba(0,0,0,0.22); font-size: 0.5rem; margin-top: 0.2rem; box-shadow: var(--neu-in); }
`;

function sparkline() {
  return `<div class="spark"><svg viewBox="0 0 120 24" preserveAspectRatio="none"><polyline fill="none" stroke="#d4af37" stroke-width="1.5" points="0,18 25,14 50,16 75,8 100,10 120,6"/></svg></div>`;
}

function mobileRefHome() {
  return `
<div class="phone"><div class="phone-inner phone-alive">
  <div class="app-header">
    <button class="chip" type="button">☰</button>
    <p class="hdr-title">Hem · Life OS</p>
    <button class="chip" type="button">K</button>
  </div>
  <div class="compass-hero">
    <div class="compass-star">✦</div>
    <div class="zone-orbit">
      <button class="orbit-btn on" type="button"><span class="orbit-icon">♥</span><span class="orbit-lbl">Livskompassen</span></button>
      <button class="orbit-btn" type="button"><span class="orbit-icon">▦</span><span class="orbit-lbl">Vardagen</span></button>
      <button class="orbit-btn" type="button"><span class="orbit-icon">👥</span><span class="orbit-lbl">Familjen</span></button>
      <button class="orbit-btn" type="button"><span class="orbit-icon">🔒</span><span class="orbit-lbl">Valvet</span></button>
    </div>
    <p class="greeting">${C.greeting}</p>
    <p class="greeting-paren">${C.greetingParen}</p>
  </div>
  <div class="scroll-main">
    <div class="card-grid">
      <div class="glass">
        <p class="sec-lbl">Snabbinmatning</p>
        <div class="inset inset-sm">${C.hubText}</div>
        <div class="btn-row"><button class="btn btn-ghost" type="button">✎</button><button class="btn btn-ghost" type="button">🎤</button></div>
      </div>
      <div class="glass">
        <p class="sec-lbl">Dagens dagbok</p>
        <div class="inset inset-sm" style="font-style:italic;color:var(--muted)">New idea intake…</div>
        <div class="btn-row"><button class="btn btn-teal" type="button">Capture +</button><span class="badge">8</span></div>
      </div>
      <div class="glass span2">
        <p class="sec-lbl">Priority tasks</p>
        <p class="body">Logistik · Reflektion · Client call</p>
        <div class="analysis"><span class="spinner"></span> Analysis in progress</div>
      </div>
      <div class="glass">
        <p class="sec-lbl">Handling</p>
        <p class="stat-lg">11 245 kr</p>
        ${sparkline()}
        <p class="muted">↑ stabil vecka</p>
      </div>
      <div class="glass">
        <p class="sec-lbl">Ekonomi</p>
        <p class="body">Checking · 4 920 kr</p>
        <p class="muted">Transaktioner · 3 nya</p>
      </div>
      <div class="glass">
        <p class="sec-lbl">Recent docs</p>
        <div class="paper-stack"><div class="paper"></div><div class="paper"></div><div class="paper"></div></div>
      </div>
      <div class="glass">
        <p class="sec-lbl">Q-mål</p>
        <div class="check"><span class="dot done"></span><span class="body">Simma 2×/v</span></div>
        <div class="check"><span class="dot"></span><span class="body">BIFF-utkast klart</span></div>
      </div>
    </div>
  </div>
  <nav class="bottom-nav">
    <button class="bn-item on" type="button"><span class="bn-icon">⌂</span>Hem</button>
    <button class="bn-item" type="button"><span class="bn-icon">☑</span>Planera</button>
    <button class="bn-item" type="button"><span class="bn-icon">✦</span>Fyren</button>
    <button class="bn-item" type="button"><span class="bn-icon">📖</span>Dagbok</button>
    <button class="bn-item" type="button"><span class="bn-icon">⋯</span>Mer</button>
  </nav>
</div></div>`;
}

function desktopRefDashboard() {
  return `
<div class="monitor"><div class="monitor-inner phone-alive">
  <div class="desk-head">
    <p class="desk-title">Livskompass — Life OS</p>
    <span class="desk-status">System status · Online</span>
  </div>
  <div class="desk-hero">
    <div class="compass-star">✦</div>
    <div class="zone-orbit" style="max-width:520px;margin:0.35rem auto 0">
      <button class="orbit-btn on" type="button"><span class="orbit-icon">♥</span><span class="orbit-lbl">Hjärtat</span></button>
      <button class="orbit-btn" type="button"><span class="orbit-icon">▦</span><span class="orbit-lbl">Vardagen</span></button>
      <button class="orbit-btn" type="button"><span class="orbit-icon">👥</span><span class="orbit-lbl">Familjen</span></button>
      <button class="orbit-btn" type="button"><span class="orbit-icon">🔒</span><span class="orbit-lbl">Valvet PIN</span></button>
    </div>
    <p class="greeting">${C.greeting}</p>
    <p class="greeting-paren">${C.greetingParen}</p>
  </div>
  <div class="desk-cols">
    <div class="desk-col">
      <div class="glass">
        <p class="sec-lbl">Handling & exekvering</p>
        <p class="sec-lbl" style="opacity:0.7;margin-top:0.5rem">Snabbinmatning</p>
        <div class="inset">${C.hubText}</div>
        <div class="btn-row"><button class="btn btn-ghost" type="button">✎</button><button class="btn btn-ghost" type="button">🎤</button></div>
      </div>
      <div class="glass">
        <p class="sec-lbl">HITL-förhandsvisning</p>
        <p class="body muted">Inkast väntar granskning · 2 filer</p>
      </div>
    </div>
    <div class="desk-col">
      <div class="glass">
        <p class="sec-lbl">Dagens dagbok & logg</p>
        <div class="inset inset-sm">New idea intake…</div>
        <div class="btn-row"><button class="btn btn-teal" type="button">Capture +</button></div>
        <p class="sec-lbl" style="margin-top:0.5rem">Priority tasks</p>
        <p class="body">Logistik · Fokuserad · Call</p>
        <p class="sec-lbl" style="margin-top:0.5rem">Senast sparade</p>
        <p class="body" style="font-style:italic">${C.lastSaved}</p>
      </div>
    </div>
    <div class="desk-col">
      <div class="glass">
        <p class="sec-lbl">Översikt & framsteg</p>
        <p class="body">Projekt Alpha</p><div class="gantt" style="width:70%"></div>
        <p class="body">Projekt Gamma</p><div class="gantt dim" style="width:45%"></div>
        <div class="progress-row"><span>Q-mål</span><div class="progress-bar"><div class="progress-fill" style="width:59%"></div></div><span class="muted">59%</span></div>
      </div>
      <div class="glass">
        <p class="sec-lbl">Kommunikation</p>
        <button class="btn btn-gold" type="button" style="width:100%;margin-top:0.25rem">Trygg Hamn · BIFF</button>
      </div>
    </div>
  </div>
</div></div>`;
}

function fyrenCompact() {
  return `
<div class="phone"><div class="phone-inner phone-alive">
  <div class="app-header"><span class="chip">☰</span><p class="hdr-title">Fyren</p><span class="chip">K</span></div>
  <div class="scroll-main">
    <div class="glass">
      <p class="sec-lbl">Prioriterade steg</p>
      <p class="body" style="font-family:var(--serif);font-size:0.72rem;color:var(--accent-light)">Morgonkompassen</p>
      <div class="check"><span class="dot done"></span><span class="body">Vatten + medicin</span></div>
      <div class="check"><span class="dot done"></span><span class="body">3 min mindfulness</span></div>
      <div class="check"><span class="dot"></span><span class="body">Client call</span></div>
      <div class="check"><span class="dot"></span><span class="body">Review Q4 plan</span></div>
    </div>
    <div class="glass">
      <p class="sec-lbl">Dagens dagbok</p>
      <button class="btn btn-ghost" type="button" style="width:100%;margin-bottom:0.25rem">Manuell rutin</button>
      <button class="btn btn-ghost" type="button" style="width:100%">Life OS-rutin</button>
    </div>
    <div class="glass">
      <p class="sec-lbl">Senast sparade</p>
      <p class="body" style="font-style:italic">${C.lastSaved}</p>
    </div>
    <button class="btn btn-gold" type="button" style="width:100%">Tappa för detaljer</button>
  </div>
</div></div>`;
}

function hemV3Hub() {
  return `
<div class="phone"><div class="phone-inner phone-alive">
  <div class="app-header">
    <button class="chip" type="button">☰</button>
    <div class="greeting-block"><p class="greeting">${C.greeting}</p><p class="greeting-sub">${C.greetingSub}</p></div>
    <button class="chip" type="button">K</button>
  </div>
  <p class="hdr-title" style="padding:0.35rem;border-bottom:1px solid rgba(255,255,255,0.05)">Livskompassen — Hem</p>
  <div class="zone-orbit" style="border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:0.35rem">
    <button class="orbit-btn" type="button"><span class="orbit-icon">☑</span><span class="orbit-lbl">Kompass</span></button>
    <button class="orbit-btn" type="button"><span class="orbit-icon">+</span><span class="orbit-lbl">Inkast</span></button>
    <button class="orbit-btn on" type="button"><span class="orbit-icon">📖</span><span class="orbit-lbl">Dagbok</span></button>
    <button class="orbit-btn" type="button"><span class="orbit-icon">◉</span><span class="orbit-lbl">Check-in</span></button>
  </div>
  <div class="scroll-main">
    <div class="glass">
      <p class="body" style="font-family:var(--serif);font-size:0.88rem;color:#f4f4f5;margin-bottom:0.2rem">${C.focus}</p>
      <p class="muted">${C.focusDate}</p>
      <div class="inset" style="margin-top:0.35rem">${C.hubText}</div>
      <div class="btn-row"><button class="btn btn-teal" type="button">Spara rad</button><button class="btn btn-ghost" type="button">🎤</button></div>
      <p class="muted" style="margin-top:0.35rem;font-style:italic">${C.lastSaved}</p>
    </div>
    <div class="glass"><p class="sec-lbl">Utvecklingskort</p><p class="muted">12 kategorier · tryck för att utfälla</p></div>
  </div>
  <nav class="bottom-nav">
    <button class="bn-item on" type="button"><span class="bn-icon">♥</span>Hjärtat</button>
    <button class="bn-item" type="button"><span class="bn-icon">▦</span>Vardagen</button>
    <button class="bn-item" type="button"><span class="bn-icon">👥</span>Familjen</button>
    <button class="bn-item" type="button"><span class="bn-icon">🔒</span>Valv</button>
  </nav>
</div></div>`;
}

function screenDrawer() {
  return `
<div class="phone"><div class="phone-inner phone-alive drawer-layout">
  <div class="app-header"><span class="chip">☰</span><p class="hdr-title">Hem</p><span class="chip">K</span></div>
  <div class="scroll-main" style="opacity:0.35"><div class="glass"><p class="body">${C.focus}</p></div></div>
  <div class="dim"></div>
  <aside class="drawer">
    <p class="drawer-sec">Vardag</p>
    <p class="drawer-row on">Hem</p><p class="drawer-row">Hjärtat</p><p class="drawer-row">Vardagen</p><p class="drawer-row">Familjen</p>
    <p class="drawer-sec">Valv · upplåst</p>
    <p class="drawer-row">Logga</p><p class="drawer-row">Mönster</p><p class="drawer-row">Orkester</p><p class="drawer-row">Kunskapsbank</p><p class="drawer-row">Aktörskarta</p>
  </aside>
</div></div>`;
}

function screenValvPin() {
  return `
<div class="phone"><div class="phone-inner phone-alive">
  <div class="app-header"><span class="chip">←</span><p class="hdr-title">Valvet</p><span class="chip"></span></div>
  <div class="scroll-main" style="justify-content:center;align-items:center;text-align:center">
    <div class="compass-star" style="font-size:1.8rem">🔒</div>
    <p class="greeting" style="font-size:0.95rem;margin-top:0.5rem">Ange PIN</p>
    <p class="pin-dots">● ● ● ○</p>
    <p class="muted">${C.wormStamp}</p>
  </div>
</div></div>`;
}

function screenHamn() {
  return `
<div class="phone"><div class="phone-inner phone-alive">
  <div class="app-header"><span class="chip">←</span><p class="hdr-title">Trygg Hamn</p><span class="chip">K</span></div>
  <div class="scroll-main">
    <div class="glass"><p class="sec-lbl">Inkorg · ex-sms</p><p class="body" style="font-style:italic">${C.exSms}</p></div>
    <div class="glass"><p class="sec-lbl">BIFF-utkast</p><div class="inset">${C.biffDraft}</div><div class="btn-row"><button class="btn btn-gold" type="button">Kopiera</button><button class="btn btn-ghost" type="button">Spara till Valv</button></div></div>
  </div>
</div></div>`;
}

function screenBarnfokus() {
  return `
<div class="phone"><div class="phone-inner phone-alive">
  <div class="app-header"><span class="chip">←</span><p class="hdr-title">Familjen · Barnfokus</p><span class="chip">K</span></div>
  <div class="scroll-main">
    <div class="glass"><p class="body" style="font-family:var(--serif);font-size:0.82rem">${C.barnQuestion}</p>
    <div class="inset" style="margin-top:0.35rem">Lego med Arvid i 40 min — han skrattade högt.</div>
    <button class="btn btn-teal" type="button" style="width:100%;margin-top:0.4rem">Spara till ${C.child1}s logg</button></div>
  </div>
</div></div>`;
}

function screenPlanering() {
  return `
<div class="phone"><div class="phone-inner phone-alive">
  <div class="app-header"><span class="chip">←</span><p class="hdr-title">Planering</p><span class="chip">K</span></div>
  <div class="tabs"><span class="tab">Kompass</span><span class="tab">MåBra</span><span class="tab on">Handling</span><span class="tab">Ekonomi</span></div>
  <div class="scroll-main"><div class="kanban">
    <div><span class="col-lbl">Todo</span><div class="task-card">Ring skola</div><div class="task-card">Simma 20 min</div></div>
    <div><span class="col-lbl">Waiting</span><div class="task-card">Svar från advokat</div></div>
    <div><span class="col-lbl">Done</span><div class="task-card">Medicin</div></div>
  </div></div>
</div></div>`;
}

const screens = [
  { title: '★ Ref mobil · HEM Life OS', html: mobileRefHome(), wide: false },
  { title: '★ Ref desktop · 3-kolumn dashboard', html: desktopRefDashboard(), wide: true },
  { title: 'Fyren · kompakt', html: fyrenCompact(), wide: false },
  { title: 'Hem v3 · hub (samma innehåll)', html: hemV3Hub(), wide: false },
  { title: 'Drawer · Vardag + Valv', html: screenDrawer(), wide: false },
  { title: 'Valv · PIN', html: screenValvPin(), wide: false },
  { title: 'Familjen · Barnfokus', html: screenBarnfokus(), wide: false },
  { title: 'Trygg Hamn · BIFF', html: screenHamn(), wide: false },
  { title: 'Vardagen · Planering P3', html: screenPlanering(), wide: false },
];

function galleryHtml() {
  const blocks = screens
    .map(
      (s) => `
  <div class="screen-wrap${s.wide ? ' wide' : ''}">
    <h2>${s.title}</h2>
    ${s.html}
  </div>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ref Compass Life OS — galleri</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="tokens.css" />
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="page-head">
    <a href="index.html">← Mood board</a> · <a href="../COMPARISON.html">Wave 2</a> · <a href="../../../mockups/01-home-compass-module.html">Hem v3</a>
    <h1>Compass Life OS — referensgalleri</h1>
    <p>Byggt från dina ref-bilder: glass/neu, guld-kompass, fylliga kort, läsbar typografi. 9 högfidelitets-skärmar (inte wireframes).</p>
    <span class="ref-badge">Wave 2 · Ref C</span>
  </div>
  <div class="gallery">${blocks}</div>
</body>
</html>`;
}

function indexHtml() {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <title>Compass Life OS — mood</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="tokens.css" />
  <style>
    body { margin: 0; min-height: 100vh; font-family: Inter, system-ui; color: var(--text); background: var(--bg); display: grid; place-items: center; padding: 2rem; text-align: center; }
    h1 { font-family: var(--serif); color: var(--accent-light); letter-spacing: 0.12em; }
    .mood { font-size: 1.1rem; color: var(--muted); margin: 1rem 0 2rem; }
    .sw { display: flex; gap: 0.75rem; justify-content: center; margin: 1.5rem 0; }
    .sw span { width: 56px; height: 56px; border-radius: 12px; border: 1px solid var(--border); }
    a { display: inline-block; margin-top: 1rem; padding: 0.65rem 1.2rem; border-radius: 10px; background: linear-gradient(145deg, var(--accent), var(--accent-dim)); color: #051220; font-weight: 600; text-decoration: none; }
    p { max-width: 28rem; line-height: 1.55; color: var(--muted); font-size: 0.85rem; }
  </style>
</head>
<body>
  <div>
    <div style="font-size:3rem;color:var(--accent)">✦</div>
    <h1>COMPASS LIFE OS</h1>
    <p class="mood">Glas · Neu · Guld-kompass · Dashboard</p>
    <div class="sw">
      <span style="background:#051220"></span>
      <span style="background:#121b2e"></span>
      <span style="background:#d4af37"></span>
      <span style="background:#2ec4b6"></span>
    </div>
    <p>Referens: desktop Life OS + mobil HEM på valet-tray. Serif-hälsning centrerad under kompass. Fylliga widget-kort — inte palett-byte på wireframes.</p>
    <a href="gallery.html">Öppna galleri (9 skärmar) →</a>
  </div>
</body>
</html>`;
}

function comparisonHtml() {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <title>Wave 2 — Referens Compass Life OS</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Cormorant+Garamond:wght@500&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui; background: #060a12; color: #e2e8f0; padding: 2rem 1rem; }
    h1 { font-family: 'Cormorant Garamond', serif; color: #e8dcc0; text-align: center; }
    .lead { text-align: center; color: #94a3b8; max-width: 36rem; margin: 0.5rem auto 2rem; line-height: 1.55; font-size: 0.88rem; }
    .card { max-width: 420px; margin: 0 auto; padding: 1.5rem; border-radius: 16px; background: #121b2e; border: 1px solid rgba(212,175,55,0.15); text-align: center; }
    .card h2 { color: #d4af37; font-family: 'Cormorant Garamond', serif; }
    .card p { color: #94a3b8; font-size: 0.85rem; line-height: 1.5; }
    .card a { display: inline-block; margin: 0.5rem 0.25rem; padding: 0.55rem 1rem; border-radius: 8px; background: linear-gradient(145deg, #c9a227, #9a7b2f); color: #051220; font-weight: 600; text-decoration: none; font-size: 0.85rem; }
    .card a.secondary { background: rgba(255,255,255,0.06); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); }
    .note { margin-top: 2rem; text-align: center; font-size: 0.78rem; color: #64748b; }
    .note a { color: #d4af37; }
  </style>
</head>
<body>
  <h1>Wave 2 — efter ref-bild C</h1>
  <p class="lead">Wave 1 avvisades (wireframes). Detta pack bygger direkt på dina referensbilder: kompass-centrum, glass/neu-kort, desktop 3-kolumn + mobil HEM.</p>
  <article class="card">
    <h2>Compass Life OS</h2>
    <p>Glas · Neu · Guld · Dashboard<br>9 högfidelitets-skärmar</p>
    <a href="ref-compass-life-os/gallery.html">Öppna galleri</a>
    <a href="ref-compass-life-os/index.html" class="secondary">Mood board</a>
  </article>
  <p class="note">Wave 1 arkiverad: <a href="../wave-1/COMPARISON.html">5 palettpack</a> · Feedback i <a href="../../UI-VAL-LOG.md">UI-VAL-LOG.md</a></p>
</body>
</html>`;
}

writeFileSync(join(pack, 'gallery.html'), galleryHtml());
writeFileSync(join(pack, 'index.html'), indexHtml());
writeFileSync(join(wave2, 'COMPARISON.html'), comparisonHtml());

// Update mockups index link
const mockIndex = join(mockups, 'index.html');
if (existsSync(mockIndex)) {
  let html = readFileSync(mockIndex, 'utf8');
  if (!html.includes('wave-2/COMPARISON.html')) {
    html = html.replace(
      '</body>',
      '  <p style="margin-top:1rem"><a href="../waves/wave-2/COMPARISON.html">★ Wave 2 — Compass Life OS (ref C)</a></p>\n</body>',
    );
    writeFileSync(mockIndex, html);
  }
}


console.log('Wave 2 ref gallery: 9 screens → docs/design-sandbox/waves/wave-2/ref-compass-life-os/');
