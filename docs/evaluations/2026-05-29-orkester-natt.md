# Orkester nattpass — 2026-05-29

**Kört:** 2026-05-29T17:56:52.376Z
**Git:** main @ 2d3d3041 (1 unstaged)

## Faser

| Fas | Status | ms |
|-----|--------|-----|
| UX Guardian | FAIL | 453 |
| Innehall U6 | PASS | 138 |
| Locked icons | PASS | 127 |
| ADK Weaver | PASS | 8832 |
| Functions build | PASS | 6935 |
| Frontend build | PASS | 7701 |
| ESLint | SKIP_FAIL | 8187 |

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

Error: src/modules/evidence/vault/components/VaultPage.tsx: saknar: getPansaretVaultTabBarItems
    at assert (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:13:25)
    at mustInclude (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:25:5)
    at main (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:44:3)
    at file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:75:1
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.15.0

```
