# Orkester natt — rolling log (2026-05-24 … 2026-05-28)

**Senaste körning:** [`docs/evaluations/2026-05-29-orkester-natt.md`](../../evaluations/2026-05-29-orkester-natt.md)

**Kör:** `npm run orkester:night`

---

# Orkester nattpass — 2026-05-24

**Kört:** 2026-05-24T00:38:26.443Z
**Git:** cursor/planering-kbt-p1 @ 21309d96 (32 unstaged)

## Faser

| Fas | Status | ms |
|-----|--------|-----|
| UX Guardian | PASS | 318 |
| ADK Weaver | PASS | 12139 |
| Functions build | PASS | 9626 |
| Frontend build | PASS | 9260 |
| ESLint | SKIP_FAIL | 12366 |

## Sammanfattning

Alla obligatoriska faser **PASS**. Locked UX, ADK wiring och build gröna.

**Extra fixar (samma natt):**
- `FyrenSmartWidgetBar.tsx` — trasiga motion-hjälpare borttagna (JSX parse-fel)
- `functions/src/index.ts` — eslint no-useless-assignment
- Nya regler: `grunder-kanon.mdc`, `anti-hallucination.mdc`, `orkester-autorun.mdc`
- 5 specialist-agents + Conductor i `.cursor/agents/`
- `npm run smoke:orkester` + `npm run orkester:night`

## Nästa steg (1)

Manuell smoke enligt `docs/SMOKE_CHECKLIST.md` (#1–7, #18) om du deployat nyligen.

## Detaljer (FAIL)

---

# Orkester nattpass — 2026-05-26

**Kört:** 2026-05-26T23:47:56.791Z
**Git:** main @ 9c1a55b4 (0 unstaged)

## Faser

| Fas | Status | ms |
|-----|--------|-----|
| UX Guardian | PASS | 351 |
| Innehall U6 | PASS | 153 |
| Locked icons | PASS | 132 |
| ADK Weaver | PASS | 11099 |
| Functions build | PASS | 9256 |
| Frontend build | PASS | 7898 |
| ESLint | SKIP_FAIL | 7898 |

## Sammanfattning

Alla obligatoriska faser **PASS**. Locked UX, ADK wiring och build gröna.

## Nästa steg (1)

Manuell smoke enligt `docs/SMOKE_CHECKLIST.md` (#1–7, #18) om du deployat nyligen.

## Detaljer (FAIL)

---

# Orkester nattpass — 2026-05-27

**Kört:** 2026-05-27T00:03:35.523Z
**Git:** main @ 7210502b (8 unstaged)

## Faser

| Fas | Status | ms |
|-----|--------|-----|
| UX Guardian | PASS | 273 |
| Innehall U6 | PASS | 227 |
| Locked icons | PASS | 130 |
| ADK Weaver | PASS | 11543 |
| Functions build | PASS | 8442 |
| Frontend build | PASS | 8430 |
| ESLint | SKIP_FAIL | 8510 |

## Sammanfattning

Alla obligatoriska faser **PASS**. Locked UX, ADK wiring och build gröna.

## Nästa steg (1)

Manuell smoke enligt `docs/SMOKE_CHECKLIST.md` (#1–7, #18) om du deployat nyligen.

## Detaljer (FAIL)

---

# Orkester nattpass — 2026-05-28

**Kört:** 2026-05-28T22:56:30.210Z
**Git:** main @ ff672f11 (16 unstaged)

## Faser

| Fas | Status | ms |
|-----|--------|-----|
| UX Guardian | FAIL | 442 |
| Innehall U6 | PASS | 234 |
| Locked icons | PASS | 175 |
| ADK Weaver | PASS | 17826 |
| Functions build | PASS | 54608 |
| Frontend build | PASS | 31619 |
| ESLint | SKIP_FAIL | 23519 |

## Sammanfattning

1 fas(er) **FAIL** — se detaljer i `.orkester/runs/`.

## Nästa steg (1)

Fixa **UX Guardian** — file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:13.

## Detaljer (FAIL)

### UX Guardian

```
file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:13
  if (!condition) throw new Error(`${rel}: ${message}`);
                        ^

Error: src/modules/evidence/vault/components/VaultPage.tsx: saknar: getMainVaultTabBarItems
    at assert (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:13:25)
    at mustInclude (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:25:5)
    at main (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:44:3)
    at file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:59:1
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.15.0

```

