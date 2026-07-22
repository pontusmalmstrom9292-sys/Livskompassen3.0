# Figma B2 — dock sync (L1 Chrome)

**Datum:** 2026-06-25  
**Plattform:** Cursor (Agent) · Figma MCP  
**Figma:** [Obsidian Calm Master](https://www.figma.com/design/ua5am9TPvb3wSGKfUJxIV5) · sida `01 — Chrome`  
**Kanon:** [`DOCK-KANON.md`](../design/references/DOCK-KANON.md) · [`VALV-ICON-KANON.md`](../design/references/VALV-ICON-KANON.md) · DAD `design-calm.mdc`

## Status: PÅGÅR (spec klar · Figma-bygge väntar MCP)

| Check | Resultat |
|-------|----------|
| Kod — prod dock | `ExecutiveDockBar.tsx` (extended + mix-E) via `FloatingDock.tsx` |
| Kod — legacy triad | CSS `dock-classic*` i `index.css` (Familjen \| kompass \| Dagbok) |
| DOCK-KANON | Ingen synlig mitt-text · ingen båge · Valv via 3s hold (aria only) |
| B1 drawer | **PASS** — [`2026-06-20-figma-b1-drawer-sync.md`](./2026-06-20-figma-b1-drawer-sync.md) |
| Smoke (dock) | `smoke:locked-ux` — ingen synlig `dock-compass-hub__label` |

## Scope B2

Bygg på sida **`01 — Chrome`** (under befintlig drawer-sektion):

| Frame | Beskrivning | Kodreferens |
|-------|-------------|-------------|
| `Dock/ClassicTriad` | 3 zoner: Familjen · kompass endast · Dagbok | `dock-classic*` + DOCK-KANON |
| `Dock/ExecutiveExtended` | 6 zoner: Anteckning · Familj · KOMPASS · Mentil · Inkast · Resurser | `ExecutiveDockBar` extended |
| `Dock/ExecutiveMixE` | 4 zoner: Familjen · KOMPASS · Valv · Planering | `ExecutiveDockBar` mix-e |
| `Dock/States` | Variant-set: idle · side-active · compass-home · compass-holding | CSS states |

**Viewport:** 390×120 (G85 bredd, dock-höjd inkl. svävande kompass).

## DOCK-KANON (obligatoriskt)

| Position | Synligt | aria-label |
|----------|---------|------------|
| Vänster | Ikon + **Familjen** | Familjen |
| Mitten | **Kompass endast** (guld ring) — **ingen text** | Hem |
| Höger | Ikon + **Dagbok** | Dagbok |

- **Ingen båge** under kompass (platt `dock-nav--hub`).
- **Ingen** synlig «Hamn» / «Valv» i dock-etiketter.
- Touch ≥ 44px på sidoknappar.

## Token-bindning (A1)

Använd variabler från sida `00 — Tokens & Components`:

- `--accent` / guld `#d4af37`
- `--surface`, `--glass`, `--border`
- `--text-muted` för inaktiva etiketter

## Figma MCP — steg 1: discovery

```js
// use_figma · fileKey ua5am9TPvb3wSGKfUJxIV5 · skillNames: figma-use
const chromePage = figma.root.children.find((p) => p.name === '01 — Chrome');
if (!chromePage) throw new Error('Sida 01 — Chrome saknas');
await figma.setCurrentPageAsync(chromePage);

const topLevel = chromePage.children.map((n) => ({
  id: n.id,
  name: n.name,
  type: n.type,
  x: n.x,
  y: n.y,
  w: 'width' in n ? n.width : null,
}));

return { pageId: chromePage.id, topLevel };
```

## Figma MCP — steg 2: ClassicTriad frame

```js
// use_figma · skillNames: figma-use,figma-generate-design
const PAGE = '01 — Chrome';
const page = figma.root.children.find((p) => p.name === PAGE);
await figma.setCurrentPageAsync(page);

await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

const rightmost = page.children.reduce((m, n) => Math.max(m, n.x + ('width' in n ? n.width : 0)), 0);
const startX = rightmost + 120;
const startY = 900;

const section = figma.createFrame();
section.name = 'B2 — Dock';
section.x = startX;
section.y = startY;
section.layoutMode = 'VERTICAL';
section.itemSpacing = 32;
section.primaryAxisSizingMode = 'AUTO';
section.counterAxisSizingMode = 'AUTO';
section.fills = [];
page.appendChild(section);

function sideBtn(label, active) {
  const btn = figma.createAutoLayout();
  btn.name = `Side/${label}${active ? '/Active' : ''}`;
  btn.layoutMode = 'VERTICAL';
  btn.primaryAxisAlignItems = 'CENTER';
  btn.counterAxisAlignItems = 'CENTER';
  btn.itemSpacing = 4;
  btn.paddingTop = btn.paddingBottom = 4;
  btn.paddingLeft = btn.paddingRight = 4;
  btn.resize(44, 56);
  btn.layoutSizingHorizontal = 'FIXED';
  btn.layoutSizingVertical = 'HUG';

  const icon = figma.createEllipse();
  icon.resize(32, 32);
  icon.fills = [{ type: 'SOLID', color: { r: 0.04, g: 0.04, b: 0.04 } }];
  icon.strokes = [{ type: 'SOLID', color: { r: 0.83, g: 0.69, b: 0.22, a: active ? 0.5 : 0.28 } }];
  icon.strokeWeight = 1;
  btn.appendChild(icon);

  const txt = figma.createText();
  txt.fontName = { family: 'Inter', style: 'Medium' };
  txt.characters = label;
  txt.fontSize = 8;
  txt.fills = [{ type: 'SOLID', color: active ? { r: 0.83, g: 0.69, b: 0.22 } : { r: 0.55, g: 0.58, b: 0.65 } }];
  btn.appendChild(txt);
  return btn;
}

function compassCenter(holding) {
  const wrap = figma.createAutoLayout();
  wrap.name = holding ? 'Compass/Holding' : 'Compass/Idle';
  wrap.layoutMode = 'VERTICAL';
  wrap.primaryAxisAlignItems = 'CENTER';
  wrap.counterAxisAlignItems = 'CENTER';
  wrap.resize(56, 56);
  wrap.layoutSizingHorizontal = 'HUG';
  wrap.layoutSizingVertical = 'HUG';

  const plate = figma.createEllipse();
  plate.resize(44, 44);
  plate.fills = [{ type: 'SOLID', color: { r: 0.06, g: 0.05, b: 0.04 } }];
  plate.strokes = [{ type: 'SOLID', color: { r: 0.83, g: 0.69, b: 0.22, a: holding ? 0.62 : 0.38 } }];
  plate.strokeWeight = 1.5;
  wrap.appendChild(plate);

  const mark = figma.createText();
  mark.fontName = { family: 'Inter', style: 'Regular' };
  mark.characters = '✦';
  mark.fontSize = 18;
  mark.fills = [{ type: 'SOLID', color: { r: 0.83, g: 0.69, b: 0.22 } }];
  plate.appendChild(mark);
  mark.x = 14;
  mark.y = 10;
  return wrap;
}

const triadFrame = figma.createAutoLayout();
triadFrame.name = 'Dock/ClassicTriad';
triadFrame.layoutMode = 'HORIZONTAL';
triadFrame.primaryAxisAlignItems = 'CENTER';
triadFrame.counterAxisAlignItems = 'CENTER';
triadFrame.itemSpacing = 8;
triadFrame.paddingTop = 6;
triadFrame.paddingBottom = 6;
triadFrame.paddingLeft = 12;
triadFrame.paddingRight = 12;
triadFrame.cornerRadius = 16;
triadFrame.resize(352, 72);
triadFrame.layoutSizingHorizontal = 'FIXED';
triadFrame.layoutSizingVertical = 'HUG';
triadFrame.fills = [{ type: 'SOLID', color: { r: 0.04, g: 0.06, b: 0.12, a: 0.85 } }];
triadFrame.strokes = [{ type: 'SOLID', color: { r: 0.83, g: 0.69, b: 0.22, a: 0.22 } }];
triadFrame.strokeWeight = 1;

triadFrame.appendChild(sideBtn('Familjen', true));
triadFrame.appendChild(compassCenter(false));
triadFrame.appendChild(sideBtn('Dagbok', false));
section.appendChild(triadFrame);

const label = figma.createText();
label.fontName = { family: 'Inter', style: 'Regular' };
label.characters = 'DOCK-KANON · ingen mitt-text · 390 viewport';
label.fontSize = 11;
label.fills = [{ type: 'SOLID', color: { r: 0.55, g: 0.58, b: 0.65 } }];
section.appendChild(label);

return {
  createdNodeIds: [section.id, triadFrame.id],
  sectionId: section.id,
  triadId: triadFrame.id,
};
```

## Figma MCP — steg 3: ExecutiveExtended (prod)

Replikera grid 6 kolumner enligt `executive-chrome.css`:

- Bar: full bredd 390, `border-radius` top 22px, glass gradient
- Kompass: 86×94px, `margin-top: -70px`, hero mark 78px
- Etiketter: uppercase 6.4px tracking

(Kör separat `use_figma`-anrop efter ClassicTriad — kopiera sideBtn/compass helpers.)

## Gate (ingen kodändring denna våg)

```bash
npm run smoke:locked-ux
npm run build
```

## Nästa efter B2 PASS

1. Uppdatera `src/figma/connect/DockShell.figma.tsx` → node-id i fil `ua5am9TPvb3wSGKfUJxIV5`
2. Starta **B3** (`figma-L1-widget`) — Fyren peek/expanded
