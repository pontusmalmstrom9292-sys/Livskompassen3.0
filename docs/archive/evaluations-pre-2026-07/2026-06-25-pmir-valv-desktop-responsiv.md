# PMIR — Valv desktop-responsiv (Z1)

**Datum:** 2026-06-25
**Branch:** `cursor/valv-desktop-responsiv-44a0`
**Steg:** 2 av 4 i `2026-06-25-cloud-agent-djupanalys.md`
**Zon:** Z1 (Verklighetsvalvet `/valvet`)
**Skribent:** specialist-valv-builder

## Plan (1 mening)

Bredda Valv-vyn på desktop (lg/xl/2xl) så `/valvet` blir den primära dator-vyn — utan att ändra routes, regler, `valvInputModes.ts`, Locked UX-flikar eller Sacred Features.

## Mål

Pontus använder mest mobil men vill att webbappen på dator visar Valvet/Arkivet primärt. Förbättra läsbarhet, översikt och utnyttja desktop-bredd utan att duplicera flöden eller lägga till nya routes.

## Filer som planeras röras

| Fil | Karaktär | Påverkan |
|---|---|---|
| `src/styles/obsidian-calm-2.css` | Lägg till desktop-breakpoints (lg/xl/2xl) under befintlig `.valvet-route-page--desktop`-block | Bredare container, sticky filter-rad, sluss för stack-bredd |
| `src/modules/features/lifeJournal/evidence/vault/components/valv.css` | Lägg till desktop grid-variant för `.valv-log-list` (lg→2 kol, xl→3 kol) + sticky filter-utility-klass | Bättre arkivlista-översikt på dator |
| `src/modules/features/lifeJournal/evidence/vault/components/zones/ValvSamlaZone.tsx` | Lägga Tailwind `lg:` på filter-raden för sticky-uppförande | Sticky filter på dator |

Ingen TSX-logik, ingen route, inga regler, inga `valvInputModes.ts`.

## Breakpoints

- **base (mobil):** oförändrad (1 kolumn).
- **`sm` (≥640px):** behåller befintligt `.valvet-route-page--desktop`-block (1 kol arkiv, dock dolt).
- **`lg` (≥1024px):** Container max-width 80rem; arkivlista 2-kol grid; filter-rad sticky.
- **`xl` (≥1280px):** Container max-width 90rem; arkivlista 3-kol grid.
- **`2xl` (≥1536px):** Container max-width 100rem (1600px).

## Layout-mönster

- **Wider main container.** Override `.app-main:has(.valvet-route-page--desktop)` `max-width` på lg/xl/2xl. Befintlig `64rem` sm-regel kvar.
- **Frigör `module-shell__stack max-w-5xl`.** Tillagd selektor `.valvet-route-page--desktop .module-shell__stack` med `max-width: none` på lg+. Den globala 5xl-regeln gäller fortfarande andra hubbar (Hjärtat/Familjen/Vardagen) — endast Valv på dator blir bredare.
- **Arkiv-grid.** `.valvet-route-page--desktop .valv-log-list` → grid på lg+. `space-y-2` på `<ul>` neutraliseras inom griden via `> li { margin-top: 0 }` så Tailwind-utilities inte konflikt-rendera.
- **Sticky filter-rad.** Lägg klass `lg:sticky lg:top-0 lg:z-10 lg:bg-surface/80 lg:backdrop-blur` på den existerande "Arkivlista / Endast ankare"-raden i `ValvSamlaZone.tsx`. Använder endast tokens (`bg-surface` finns).
- Mönster-, Orkester-, Kunskaps- och Aktörskartepanelerna får automatiskt bredare yta via bredare container. De har redan `CalmCollapsible` och fluid inre layout — ingen kodändring krävs.

## Locked UX-bevarande

| Locked UX | Hur det bevaras |
|---|---|
| `VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel`, `VaultAktorskartaPanel`, `VaultKanonDocsPanel` | Inga ändringar — bredare container ger bara mer plats. |
| Tabs `logga`, `sok`, `monster`, `orkester`, `kunskapsbank`, `aktorskarta`, `dossier`, `docs`, `forensic_*` | `vaultTabs.ts` orörd, `tabRegistry.ts` orörd. |
| `ValvInputModePicker` (Mer-select inkl) | Komponenten orörd. |
| WORM, Zero Footprint, WebAuthn-gate, Fyren 3s | `VaultPage` gate-logik orörd. `vaultSessionLifecycle.ts` orörd. |
| Hide dock + Fyren på desktop | Befintlig regel bevaras. |
| Inga nya WORM-create-flöden | Inga komponenter får nya create-paths. Bara visuella ändringar. |
| Inga hex-färger i `features/` | Endast tokens: `var(--surface)`, `bg-surface`, `text-accent`, befintliga `--color-obsidian-surface` osv. |

## Sacred Features-kontroll

- **Verklighetsvalvet** — visning oförändrad, bara bredare.
- **Sanningens Sköld** — ingen path-ändring.
- **Speglings-Systemet** — finns under Forensik → orörd.
- **Dossier-Generator** — `dossier`-fliken orörd.
- **Draft Layer** / **Device Clear** — orörd.
- **WebAuthn/PIN-gate via Fyren 3s** — `VaultLockedGate` + `hasVaultGate()` orörda.

## Tonalitet

Trygg, klinisk, lågaffektiv. Inga JADE-fraser. Pontus läser commit-meddelanden — håll dem korta och konkreta.

## Smoke-gates (ordning)

1. `npm run smoke:locked-ux` — säkerställ inga namnade strängar bröts.
2. `npm run smoke:design-modules` — säkerställ struktur intakt.
3. `npm run smoke:valv-security` — säkerställ session-lifecycle intakt.
4. `npm run smoke:valv` — bör PASS.
5. `npm run build` — exit 0.

## Risk

- **Låg.** Endast CSS + 1 Tailwind-rad i en TSX. Inga komponent-strukturer ändras, inga datakällor, inga prompts, inga regler.
- **Tilldragen risk:** `:has()` selector kräver modern webbläsare — Pontus använder Chrome desktop, fullt stöd sedan slutet av 2023.
- **Fallback:** Vid äldre browser visas befintlig 64rem-vy (sm-regel kvar).

## Out of scope (kommande PR)

- Sidopanel-väljare (vänster/höger) — kan diskuteras separat.
- Nya WORM-create-flöden från desktop.
- Förändringar i `valvInputModes.ts`.
- Mönster/Orkester sida-vid-sida på samma skärm (kräver TabBar-omtag).
