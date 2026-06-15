# Fas 17b — strictNullChecks steg 2 (`shared/**`) — 2026-06-15

**Status:** PASS

**Föregående:** [Fas 17 steg 1 — `core/**`](./2026-06-15-fas14-chat5-smoke-17.md#172-strictnullchecks-steg-1)

---

## Scope

| Mapp | strictNullChecks | Fel |
|------|------------------|-----|
| `src/modules/core/**` | ja (steg 1) | 0 |
| `src/modules/shared/**` | ja (steg 2) | 0 |

**Konfig:** `tsconfig.core-strict.json` — `include` utökad från enstaka `HubErrorBoundary.tsx` till hela `src/modules/shared/**/*.ts(x)`.

**Exkluderat (oförändrat):** `src/**/*.test.ts` via `extends` → `tsconfig.app.json`.

---

## Ändringar

### `tsconfig.core-strict.json`

```diff
   "include": [
     "src/modules/core/**/*.ts",
     "src/modules/core/**/*.tsx",
-    "src/modules/shared/ui/HubErrorBoundary.tsx"
+    "src/modules/shared/**/*.ts",
+    "src/modules/shared/**/*.tsx"
   ]
```

### `src/modules/shared/**`

Inga kodändringar krävdes — alla 21 inkluderade filer passerade `strict: true` + `strictNullChecks: true` utan fel.

Verifierade filer (urval):

- `ui/` — Button, Card, Input, BentoCard, HubErrorBoundary, RAGErrorBoundary, ImmersiveExperienceShell, …
- `utils/` — secureExport, formatters, dateHelpers
- `tags/userTagsApi.ts`, `components/TaggSelector.tsx`, `patterns/tacticPatternLibrary.ts`
- `types/`, `constants/`, `index.ts`

---

## Gates

| Gate | Resultat |
|------|----------|
| `npm run typecheck:core-strict` | **PASS** — 0 fel |
| `npm run build` | **PASS** |

```bash
npm run typecheck:core-strict  # exit 0
npm run build                  # exit 0
```

---

## Säkerhet (oförändrad)

- Inga ändringar i `firestore.rules`, features/, routing eller beteende.
- WORM / tre silos / Zero Footprint — ej rörda.
- Locked UX — ej rörda (ingen merge av Valv/Familjen-kod).

---

## Nästa steg (steg 3 — senare)

Utöka `tsconfig.core-strict.json` till nästa lager, t.ex. `src/modules/kompis/**` eller utvalda `features/`-moduler — efter separat eval och PMIR vid behov.
