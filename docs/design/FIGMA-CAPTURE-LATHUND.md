# Figma — fånga hela Livskompassen

Kanonfil: **Livskompassen — Full App**  
https://www.figma.com/design/VL3p2rwWdo2DTwRhCgyLkt

## Förutsättningar

1. `npm run dev` (port 5173)
2. Capture-script i `index.html` (tillfälligt under batch)
3. Logga in i appen i webbläsaren (många routes har `AuthGate`)
4. För Valv-flikar: lås upp valv med PIN i samma session

## A — Cursor + Figma MCP (automatiskt, begränsat på Starter)

Cursor kan anropa `generate_figma_design` per skärm. **Starter-plan har daglig MCP-gräns** — vid limit, använd B eller C.

Skärmlista: `scripts/figma-capture-routes.json` (26 routes)

```bash
node scripts/figma-batch-open.mjs --list
```

## B — Figma capture-verktygsfält (rekommenderat efter första skärm)

1. Fånga **en** skärm via Cursor eller manuell hash-URL
2. I webbläsaren visas Figma capture-toolbar
3. Navigera i appen (dock/meny) till nästa skärm
4. Klicka **Re-capture** i toolbaren — ny sida läggs i samma Figma-fil

Ordning (en i taget):

| # | Route |
|---|-------|
| 1 | `/` |
| 2 | `/vardagen?tab=kompasser` |
| 3 | `/mabra` |
| 4 | `/planering?tab=handling` |
| 5 | `/vardagen?tab=ekonomi` |
| 6 | `/arbetsliv` |
| 7 | `/arbetsliv?tab=stampla` |
| 8–13 | `/familjen?tab=…` (reflektion, livslogg, tillsammans, barnporten, hamn, drogfrihet) |
| 14–15 | `/hjartat?tab=reflektion`, `speglar` |
| 16–22 | `/valvet?vaultTab=…` (logga, sok, monster, orkester, dossier, kunskapsbank, aktorskarta) |
| 23–26 | `/projekt`, `/barnporten`, `/installningar`, `/kompis` |

Döp Figma-sidor efter capture (högerklicka sida → Rename).

## C — Befintliga PNG-referenser (snabb arkiv)

`docs/design/galleri/skarmar/` och `docs/design/references/` — dra in som referenslager.

## D — Bygg design system i Figma (efter captures)

Tokens från kod:

- `src/modules/core/theme/themeRegistry.ts` (Theme Pack I)
- `.cursorrules` Obsidian Calm
- `docs/design/TYPE-SCALE.md`

Figma-sidstruktur (förslag):

1. **Foundations** — färger, typografi, spacing
2. **Components** — dock, drawer, hub-kort, widget
3. **Screens** — alla captures

Cursor Agent (när MCP-limit reset): *"Bygg Obsidian Calm variables i Figma-fil VL3p2rwWdo2DTwRhCgyLkt från themeRegistry."*

## Städa efter batch

Ta bort capture-script från `index.html`:

```html
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
```

## Relaterade filer

- `scripts/figma-open-capture.sh`
- `scripts/figma-capture-routes.json`
- `scripts/figma-batch-open.mjs`
