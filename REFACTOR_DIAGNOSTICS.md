REFACTOR_DIAGNOSTICS.md

Syfte: här listas manuella import- eller byggfel som Cursor inte kan reparera automatiskt.

Instruktion: när Cursor eller du stöter på imports som inte uppdateras automatiskt, lägg till en rad här med filväg och vad som behöver ändras.

## PHASE 2 — kandidatscan (2026-06-01)

| Namn | Källa | Status |
|------|--------|--------|
| **formatDate** | `core/utils/timeMath.ts` → `formatDateLocal` | **Flyttad** till `@/shared/utils/dateHelpers` (+ alias `formatDate`). `timeMath` vidare-exporterar. Build PASS. |
| **Card** | `core/ui/BentoCard.tsx` (~65 imports) | **Nästa** — flytta till `@/shared/ui/BentoCard`, behåll `Card` som alias, re-export i `core/ui/BentoCard.tsx`. |
| **Button** | Endast stub i `shared/ui/Button.tsx` | **Ingen källfil** — projektet använder rå `btn-pill--*` på `<button>`. Stub kvar tills dedikerad komponent tas i bruk. |
| **Input** | — | **Saknas** som delad komponent (endast `type="email"` i formulär). |
| **useForm** | Endast stub i `shared/hooks/useForm.ts` | **Ingen källfil** utanför shared. |
| **validateEmail** | — | **Saknas** i repo (ingen träff i `src/`). |

## Alias

- `@/shared` → `src/modules/shared` (vite + `tsconfig.app.json` paths), tillagt PHASE 2.

## Manuella uppföljningar

- `workTime.ts` re-exporterar `formatDateLocal` via `timeMath` — OK, kedja intakt.
- Efter **Card**-flytt: kör `npm run smoke:locked-ux` om Valv/Familjen-paneler påverkas visuellt.

Status: formatDate redo för commit; Card/Button/Input/useForm/validateEmail enligt tabell.
