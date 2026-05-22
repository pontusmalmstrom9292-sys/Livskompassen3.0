# Monorepo layout (Fas 1)

**Kanonisk rot:** `StudioProjects/Livskompassen2.0/` (denna mapp).

Aktiva lager: `src/`, `functions/`, `.context/`. Legacy Express finns i `docs/archive/server-legacy/`.

**StudioProjects-rot** (`../` utanför detta repo) ska endast innehålla `Livskompassen2.0/`, `Livskompassen2.0.code-workspace` och `Repomix bygge`. Skapa inte `package.json`, `AGENTS.md`, `server/` eller `functions/` där — det förvirrar Cursor och bryter fas 1-planen.
