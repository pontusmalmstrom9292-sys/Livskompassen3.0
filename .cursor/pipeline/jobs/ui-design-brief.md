---
PIPELINE PACKAGE: ui-design
LABEL: UI / Obsidian Calm
MODEL: composer-2.5-fast
SCOPE: frontend-only

REPOMIX CONTEXT: exports/ai-studio/repomix-design-full.md

LOCKED UX (MUST NOT remove):
- Barnfokus
- Valv Mönster/Orkester
- drawer plausible deniability

---

---
scope: frontend-only
mustNot:
  - Backend-ändringar (functions/, firestore.rules)
  - Ta bort Locked UX (Barnfokus, Valv Mönster/Orkester, drawer)
  - Hårdkodade hex-färger — använd semantiska tokens
verifyCommands:
  - npm run build
  - npm run smoke:locked-ux
  - npm run smoke:design-modules
---

# UI-design-paket — Cursor Pipeline

Du arbetar mot **design repomix** (Obsidian Calm). Frontend only.

## Uppgift

Underhåll UI enligt Obsidian Calm — dämpat, terapeutiskt, strukturerat. Återanvänd befintliga hub-komponenter (`HubDropdownNav`, `CognitiveLoadStrip`, etc.).

## MUST

- Färger: `bg-surface`, `text-accent`, `border-border` — inte raw hex i className
- Rubriker: `font-display-serif`, uppercase, `tracking-[0.2em]`
- Hörn: `rounded-xl` / `rounded-2xl`
- Locked icons D1/M2/WH1/WH2 — kör `npm run smoke:locked-icons` vid ikon-ändring
- Drawer: Vardag + Valv (PIN) enligt `docs/design/references/MENU-DRAWER-KANON.md`

## READ FIRST

- `.context/design-language.md`
- `.context/locked-ux-features.md`
- `docs/design/**` (KEEP-specs)
- `tailwind.config.js`, `src/index.css`


---
VERIFY before claiming done:
  - cd functions && npm run build
  - npm run build
  - npm run smoke:predeploy

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
