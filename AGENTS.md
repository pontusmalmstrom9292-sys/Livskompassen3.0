# AGENTS.md — Livskompassen v2

For Claude Code, OpenAI Codex/CLI, Gemini CLI, terminal agents.

## Phase hierarchy

- **System phase:** `docs/PROJECT_STATE.md` (Fas 24) — wins on conflict
- **Active program:** `docs/ROADMAP.md` (Premium UI Polish Phase 10)

## Every session — read in order

1. `docs/PROJECT_STATE.md`
2. `docs/ROADMAP.md`
3. `docs/TODO.md`
4. `docs/DASHBOARD.md`
5. `docs/AI-GOVERNANCE.md`

Preflight: `node scripts/ai_preflight.mjs`

## Rules

WORM · tre silos · DCAP · Zero Footprint · Locked UX · PMIR gates  
After task: update TODO, DASHBOARD, PROGRESS, ROADMAP (if needed), PROJECT_STATE (if needed)  
Validate: `npm run smoke:governance` · merge: `npm run smoke:predeploy:build`

Cursor → `.cursor/rules/ai-governance-entry.mdc`  
Copilot → `.github/copilot-instructions.md`  
DoD → `docs/DEFINITION-OF-DONE.md`

## Cursor Cloud specific instructions

One product, three surfaces from the same repo: a React 19 + Vite PWA (frontend), Firebase Cloud Functions (Gemini AI backend, `functions/`), and a Capacitor Android wrapper. Package manager is **npm** with two lockfiles (root + `functions/`); `.npmrc` pins `legacy-peer-deps=true` and Node 22 is required. Dependencies are installed by the startup update script — do not reinstall unless something is missing.

Standard commands (already defined in `package.json` — don't duplicate, just use):
- Frontend dev server: `npm run dev` → http://localhost:5173 (Vite, `--host`).
- Lint: `npm run lint` (currently reports ~38 pre-existing errors in the codebase; a clean environment does not mean zero lint errors).
- Backend build: `cd functions && npm run build` (tsc). Frontend build: `npm run build` (tsc + vite). Full local gate: `npm run smoke:predeploy:build`.
- Unit tests: `npm run test:agents-ui` (vitest). Smoke scripts: `npm run smoke:*` (mostly offline Node checks).

Non-obvious runtime caveats:
- This is a **live-Firebase** app. Firebase web config in `src/modules/core/firebase/init.ts` falls back to placeholder values, so with no `VITE_FIREBASE_*` / `GEMINI_API_KEY` secrets the app **still boots and renders the full dashboard**, but anonymous sign-in fails (`identitytoolkit … signUp 400`) and nothing persists. Real end-to-end against the cloud needs those secrets in `.env` (see `.env.example`).
- To exercise core flows locally without cloud secrets, run the **Firebase Emulator Suite** (`firebase emulators:start --only auth,firestore`, needs `firebase-tools` + Java). The frontend does **not** auto-connect to emulators — you must temporarily add `connectAuthEmulator`/`connectFirestoreEmulator` in `init.ts`/`firestore.ts` (revert before commit). In the emulator, data lands under projectId `gen-lang-client-0481875058` (the app's config), not the emulator's launch project.
- `firestore.rules`: "sensitive" collections (`journal`, `reflection_entries`, `emotional_memory`, `reality_vault`, `children_logs`) require an **email-verified** user (`isSensitiveAuth`). Anonymous users can only create non-sensitive docs (`checkins`, `mabra_sessions`, `transactions`, `user_widgets`, `mabra_progress`) — useful when picking a no-secrets smoke action (e.g. the home "Dagens Ankare" card writes to `checkins`).
- App Check does not block in dev: without `VITE_APP_CHECK_RECAPTCHA_SITE_KEY` it is skipped.
