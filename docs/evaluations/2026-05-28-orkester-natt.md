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
