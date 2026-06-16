# Orkester nattpass — 2026-06-14

**Kört:** 2026-06-14T22:33:20.319Z
**Git:** main @ 2732b23cd (10 unstaged)

## Faser

| Fas | Status | ms |
|-----|--------|-----|
| UX Guardian | FAIL | 559 |
| Cursor-native rollout | SKIP_FAIL | 521 |
| Innehall U6 | PASS | 134 |
| Locked icons | PASS | 132 |
| ADK Weaver | PASS | 8348 |
| Capability Gate | FAIL | 52 |
| Evaluate Economy Access | FAIL | 38 |
| Functions build | PASS | 7980 |
| Frontend build | PASS | 16711 |
| ESLint | SKIP_FAIL | 14546 |

## Sammanfattning

3 fas(er) **FAIL** — se detaljer i `.orkester/runs/`.

## Nästa steg (1)

Fixa **UX Guardian** — file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:13.

## Detaljer (FAIL)

### UX Guardian

```
file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:13
  if (!condition) throw new Error(`${rel}: ${message}`);
                        ^

Error: src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx: saknar: getVaultZoneTabBarItems
    at assert (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:13:25)
    at mustInclude (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:25:5)
    at main (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:137:3)
    at file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:382:1
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.15.0

```

### Capability Gate

```
node:internal/modules/package_json_reader:301
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
        ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'firebase-admin' imported from /Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/orkester_capability_gate.mjs
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
    at packageResolve (node:internal/modules/esm/resolve:764:81)
    at moduleResolve (node:internal/modules/esm/resolve:855:18)
    at defaultResolve (node:internal/modules/esm/resolve:988:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:697:20)
    at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:714:38)
    at ModuleLoader.resolveSync (node:internal/modules/esm/loader:746:52)
    at #resolve (node:internal/modules/esm/loader:679:17)
    at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:599:35)
    at ModuleJob.syncLink (node:internal/modules/esm/module_job:162:33) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v24.15.0

```

### Evaluate Economy Access

```
node:internal/modules/package_json_reader:301
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
        ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'firebase-admin' imported from /Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/orkester_wiring.mjs
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
    at packageResolve (node:internal/modules/esm/resolve:764:81)
    at moduleResolve (node:internal/modules/esm/resolve:855:18)
    at defaultResolve (node:internal/modules/esm/resolve:988:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:697:20)
    at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:714:38)
    at ModuleLoader.resolveSync (node:internal/modules/esm/loader:746:52)
    at #resolve (node:internal/modules/esm/loader:679:17)
    at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:599:35)
    at ModuleJob.syncLink (node:internal/modules/esm/module_job:162:33) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v24.15.0

```
