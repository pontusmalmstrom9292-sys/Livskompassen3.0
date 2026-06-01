REFACTOR_DIAGNOSTICS.md

Syfte: här listas manuella import- eller byggfel som Cursor inte kan reparera automatiskt.

Instruktion: när Cursor eller du stöter på imports som inte uppdateras automatiskt, lägg till en rad här med filväg och vad som behöver ändras.

## PHASE 2 — kandidatscan (2026-06-01)

| Namn | Källa | Status |
|------|--------|--------|
| **formatDate** | `core/utils/timeMath.ts` → `formatDateLocal` | **Flyttad** till `@/shared/utils/dateHelpers` (+ alias `formatDate`). `timeMath` vidare-exporterar. Build PASS. |
| **Card** | `core/ui/BentoCard.tsx` → `@/shared/ui/BentoCard` | **Flyttad** 2026-06-01. `Card` = alias. ~65 imports → `@/shared`. `core/ui/BentoCard.tsx` vidare-export. Build PASS. |
| **Button** | Endast stub i `shared/ui/Button.tsx` | **Ingen källfil** — projektet använder rå `btn-pill--*` på `<button>`. Stub kvar tills dedikerad komponent tas i bruk. |
| **Input** | — | **Saknas** som delad komponent (endast `type="email"` i formulär). |
| **useForm** | Endast stub i `shared/hooks/useForm.ts` | **Ingen källfil** utanför shared. |
| **validateEmail** | — | **Saknas** i repo (ingen träff i `src/`). |

## Alias

- `@/shared` → `src/modules/shared` (vite + `tsconfig.app.json` paths), tillagt PHASE 2.

## Manuella uppföljningar

- `workTime.ts` re-exporterar `formatDateLocal` via `timeMath` — OK, kedja intakt.
- Efter **Card**-flytt: kör `npm run smoke:locked-ux` om Valv/Familjen-paneler påverkas visuellt.

## PHASE 3 — navigationRegistry (2026-06-01)

| Route | Status |
|-------|--------|
| **Hjärtat** `/dagbok` | Wired via `NAVIGATION_STRUCTURE.lifeJournal` + `RedirectToLifeJournalTab` (`/valv`, `/speglar`, `/kunskap`). |
| **Vardagen** `/vardagen` | **Uppdaterad** — renderar `VardagenPage` (tidigare redirect till `/liv`). Registry-tabbar `kompasser`/`ekonomi`. |
| **Familjen** `/familjen` | **Uppdaterad** — renderar `FamiljShellPage`; `/familj` legacy-redirect via registry. |

Build PASS · `smoke:locked-ux` PASS · `smoke:orkester` PASS.

**Dev-test:** `npm run dev` → `/dagbok`, `/vardagen`, `/familjen` (Familjen redirect tills nästa steg).

Status: formatDate + Card + PHASE 3 route 1 (Vardagen) på gren; Familjen route kvar.

## PHASE 3 — navigation registry wire — 2026-06-01T18:57:10Z

Build: OK
Lint: Not present
Test: Not present

Issues:

- (build warning) `vite build` => chunk > 500 kB after minification (`dist/assets/index-*.js` ~1.64 MB)
  Suggested fix: optional code-split via `manualChunks` / dynamic `import()` — not blocking for refactor branch.

- (npm) `Unknown env config "devdir"` during npm scripts
  Suggested fix: review local/global `.npmrc` for unsupported `devdir` key (environment-only; build still OK).

## PHASE 4 — Familjen registry route — 2026-06-01T18:59:51Z

Build: OK
Lint: Not present
Test: Not present

Issues:

- (build warning) `vite build` => chunk > 500 kB after minification (`dist/assets/index-*.js` ~1.64 MB)
  Suggested fix: optional code-split via `manualChunks` / dynamic `import()` — not blocking.

- (npm) `Unknown env config "devdir"` during npm scripts
  Suggested fix: review local/global `.npmrc` for unsupported `devdir` key (environment-only; build still OK).

Notes:

- `/familjen` renderar `FamiljShellPage` via `NAVIGATION_STRUCTURE.family`; `/familj` och `/barnen` legacy-redirect till registry.
- `/hamn` och `/drogfrihet` pekar fortfarande på `/familj?tab=…` (hamn/drogfrihet finns i `familj`-hub, inte `familjen`-tabs i navTruth).
- `smoke:locked-ux` PASS efter ändring.
