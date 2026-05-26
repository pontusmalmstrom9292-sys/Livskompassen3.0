# Orkester — backlog av tidigare delplaner

**Syfte:** En kanonisk checklista som samlar återkommande arbete (ikoner, innehåll, git, secrets) och kopplar det till [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md). Terminal kör det mesta via `npm run orkester:night`; Cursor-Conductor kör Fas B/C efter PASS.

**Senast uppdaterad:** 2026-05-26

---

## Ordlista (ikoner — undvik förvirring)

| Term | Betydelse |
|------|-----------|
| **B1 / D1 / M2** | Prod-låst trio — [`.context/locked-icons.md`](../.context/locked-icons.md) |
| **M2** | Orakelöga i `KompisMark.tsx` (v2 `M2-orakeloga.svg`) |
| **M1** (v4-filnamn) | **Slot 1** i kompis-raden (`M1-m2-orakel-v2.svg`) — samma ankare som M2, inte gamla Stjärnkompis |
| **v4 batch** | [`icons-proposals/2026-05-26-v4-round2-dna/`](./design/icons-proposals/2026-05-26-v4-round2-dna/) — förslag tills produktbeslut |

---

## Fas A — Terminal (deterministisk)

Kör:

```bash
npm run orkester:night
```

Ingår i nattpasset (via [`scripts/orkester_autorun.mjs`](../scripts/orkester_autorun.mjs)):

1. `smoke:locked-ux` + `smoke:design-modules`
2. `smoke:innehall` (U6 innehållskanon)
3. `smoke:locked-icons` (B1/D1/M2)
4. `smoke:orkester` (ADK wiring)
5. Functions `npm run build`
6. Frontend `npm run build`
7. ESLint (optional — fail soft)

**Output:** `.orkester/state.json`, `.orkester/runs/<timestamp>.json`, `docs/evaluations/YYYY-MM-DD-orkester-natt.md`

---

## Fas B — Design / ikoner (valfritt per kväll)

Kör **endast** om generator eller v2-premium ändrats:

```bash
npm run icons:proposals-v4
```

Visuell kontroll: [`icons-proposals/2026-05-26-v4-round2-dna/preview.html`](./design/icons-proposals/2026-05-26-v4-round2-dna/preview.html) (eller `./serve-preview.sh` i samma mapp).

**Medvetet utanför nattpass:** genererar 130 SVG — ska inte köras varje natt.

---

## Fas C — Git / arbetsyta (agent eller manuellt)

Efter terminal-PASS:

1. `git status` — om kvarlämnade ändringar (auth, Android, `capacitor.config.ts`, `package.json`, `smoke_orkester_wiring.mjs`): **egen commit/PR** eller medvetet `git stash` — ingen auto-merge i backlog.
2. **MUST NOT committa:** `.env`, service account `*.json`, filer kopierade från `~/Downloads/` in i repot — se [AGENTS.md](../AGENTS.md).

Typiska öppna spår (uppdatera vid behov):

| Spår | Exempel |
|------|---------|
| Auth / Capacitor | `src/modules/core/auth/*`, `capacitor.config.ts`, `android/*` |
| Ikoner (redan på main) | `KompisMark.tsx`, v4-förslag — ofta klart efter dedikerad commit |

---

## Fas D — Rapport

I morgonrapporten (`docs/evaluations/YYYY-MM-DD-orkester-natt.md`) eller en kort rad i slutet:

```markdown
## Backlog (A–C)
- [ ] A Terminal PASS
- [ ] B Ikoner (om relevant)
- [ ] C Git ren / commit planerad
```

Conductor/agent: markera B/C efter manuell eller delegerad genomgång.

---

## Cursor Conductor

Säg: **«Kör orkester nattpass»** → läs [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) + denna fil + `.orkester/state.json`.

| Efter | Gör |
|-------|-----|
| `orkester:night` PASS | Fas B om ikon-generator ändrats; Fas C om `git status` inte är ren |
| FAIL | Fixa **en** fas i taget — se rapportens första FAIL |

---

## Relaterat

- [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) — terminal + specialister
- [`ICON-STYLE-GUIDE.md`](./design/ICON-STYLE-GUIDE.md) · [`theme-lab/ICON-DECISIONS.md`](./design/theme-lab/ICON-DECISIONS.md)
- [`INNEHALL-REGISTER.md`](./INNEHALL-REGISTER.md) — U6 smoke
- [`.cursor/rules/orkester-autorun.mdc`](../.cursor/rules/orkester-autorun.mdc)
