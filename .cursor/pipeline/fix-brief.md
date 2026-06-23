# Cursor Pipeline — Fix Brief

**Attempt:** 1 / 5

## Failande steg

### Frontend Vite build

```

```

### Pre-deploy smoke gate

```
11:59:54 AM [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
`optimizeDeps.rollupOptions` / `ssr.optimizeDeps.rollupOptions` is deprecated. Use `optimizeDeps.rolldownOptions` instead. Note that this option may be set by a plugin. Set VITE_DEPRECATION_TRACE=1 to see where it is called.
Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`
[vite:react-babel] We recommend switching to `@vitejs/plugin-react-oxc` for improved performance. More information at https://vite.dev/rolldown
[smoke:e2e-locked-ux] FAIL — playwright test

```

### npm run smoke:predeploy

```
file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:13
  if (!condition) throw new Error(`${rel}: ${message}`);
                        ^

Error: src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx: saknar: canonicalValvRoute
    at assert (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:13:25)
    at mustInclude (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:26:5)
    at main (file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:151:3)
    at file:///Users/Livskompassen/StudioProjects/Livskompassen3.0/scripts/smoke_design_modules.mjs:545:1
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.15.0

```

## Instruktion

Fixa **Frontend Vite build** med minsta möjliga diff.
Kör sedan: `cd functions && npm run build && npm run build && npm run smoke:predeploy`

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.