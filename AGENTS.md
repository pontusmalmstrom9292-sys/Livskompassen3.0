# Livskompassen Cursor Agent Brief

## Project Overview

Livskompassen v2 is a Life OS and multi-agent ecosystem for Lagen om Autonomi, Clean Input, cognitive offloading, and secure evidence handling. Kompis is the user-facing AI navigator; the backend protects user data through Layered Defense, deterministic code, Firebase, Google Cloud, and Vertex/Gemini.

This repository is the current source of truth for React/Vite frontend work, Firebase configuration, Cloud Functions, Data Connect output, and AI-agent orchestration. Legacy Express routes live in `docs/archive/server-legacy/` only.

## Before Writing Code

1. Read `.context/system-plan.md` to confirm the current phase and active risks.
2. Read `.context/domän-covert-narcissism.md` when working on Valv, Inkast, Hamn, Mönster, or upload routing (~80% HCF/covert bevis-prior).
3. Read `.context/arkiv-minne.md` for Hela arkivet / permanent minne / three silos (required for RAG, Dossier, or cross-module memory work).
4. Read `.context/architecture.md`, `.context/arkitektur-beslut.md`, `.context/security.md`, `.context/database.md`, `.context/design-language.md`, and `.context/agents.md`.
5. Apply the relevant `.cursor/rules/*.mdc` files before editing.
6. For substantial changes, prepare a REASONS plan: Requirements, Entities, Approach, Structure, Operations, Norms, Safeguards.
7. Preserve Sacred Features: Verklighetsvalvet, Sanningens Sköld, Morgonkompassen, Dossier-Generator, Speglings-Systemet, Draft Layer, and Device Clear. Kill Switch (shake-to-kill) removed 2026-06-01 — see `.context/security.md`.
8. Preserve **Locked UX Features** (do not remove): Middagsfrågan; Valv **Mönster** + **Orkester**; design locks for **Planering**, **Fyren widget**, **Barnporten** (barn PWA + egen Orkester + Valv HITL). Register: [`.context/locked-ux-features.md`](.context/locked-ux-features.md). Verify: `npm run smoke:locked-ux`.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand.
- Backend: Firebase Cloud Functions, Google Cloud, Vertex AI, Gemini.
- Data: Firestore/Data Connect, RAG-oriented evidence structures, immutable snapshots.
- AI: Kompis Supervisor, A2A agent cards, DCAP, shared prompt rules in `functions/src/sharedRules.ts`.
- Tooling: Cursor rules/hooks/MCP and Firebase plugin in `.cursor/settings.json`.

## Development

- **Frontend:** `npm run dev` from repo root (Vite, port 5173).
- **Functions:** `npm run build` from `functions/` compiles TypeScript.
- **Lint:** `npx eslint .` from repo root (`eslint.config.js`).

## Cursor Cloud specific instructions

- The startup dependency refresh uses `npm ci --legacy-peer-deps` at the repo root because current npm strict peer resolution rejects the existing `firebase@12` and `@capacitor-firebase/authentication@6` peer range combination. Do not remove that flag until those package ranges are aligned.
- Cloud shells may resolve `node` through `/exec-daemon` even after `nvm use`; when testing Functions runtime behavior, put the Node 20 nvm binary first in `PATH` before running `functions` commands.
- Local app smoke tests need the ignored `.env` Firebase Web SDK values from `.env.example` / the active Firebase app config; do not commit `.env`.
- Android Gradle builds need `ANDROID_HOME` / `ANDROID_SDK_ROOT`; in Cursor Cloud the SDK is under `$HOME/android-sdk` when present.

## Cursor Subagents

Built-in: `explore`, `bash`, `browser` — use for research, shell, browser (do not duplicate).

### Orkester (nattpass)

`npm run orkester:night` eller Conductor — [`docs/ORKESTER-AUTORUN.md`](docs/ORKESTER-AUTORUN.md) · [`.cursor/agents/orkester-conductor.md`](.cursor/agents/orkester-conductor.md)

| Fas | Agent | Trigger |
|-----|-------|---------|
| 1–4 | ux-guardian, adk-weaver, security-auditor, smoke-runner | orkester nattpass |
| 5 | Zone-builders (Z1, Z3+6, Z5+2, Z4) | `/specialist-valv-builder` etc. |
| 6 | `specialist-verifier` | `/specialist-verifier` |
| 7 | Conductor rapport | — |

### Slutbygge (zon)

| Agent | Zon | Trigger |
|-------|-----|---------|
| `specialist-valv-builder` | Z1 Valv | `/specialist-valv-builder` |
| `specialist-hjartat-inkast-builder` | Z3+6 Hjärtat+Inkast | `/specialist-hjartat-inkast-builder` |
| `specialist-familjen-hamn-builder` | Z5+2 Familjen+Hamn | `/specialist-familjen-hamn-builder` |
| `specialist-vardagen-builder` | Z4 Vardagen | `/specialist-vardagen-builder` |
| `specialist-verifier` | Alla (efter build) | `/specialist-verifier` |

Deploy efter PASS: skill [`.cursor/skills/livskompassen-deploy/SKILL.md`](.cursor/skills/livskompassen-deploy/SKILL.md) — inte subagent.

### Innehåll (routing)

- **`specialist-innehall-dirigent`** — klassar FACT/REFLECTION/PLAY/EVIDENCE; kanon [`docs/INNEHALL-REGISTER.md`](docs/INNEHALL-REGISTER.md)
- **MåBra-innehåll:** `specialist-mabra-curator` — REFLECTION/PLAY → [`docs/specs/modules/Mabra-CONTENT-BANK.md`](docs/specs/modules/Mabra-CONTENT-BANK.md).
- **Kunskap-fakta:** `specialist-kunskap-seed` — FACT → [`docs/specs/modules/Kunskap-CONTENT-SEED.md`](docs/specs/modules/Kunskap-CONTENT-SEED.md) (ingest separat).
- Keep direct edits in the parent agent unless a separate isolated exploration is clearly useful.

### CTO Custom Modes (2026-06 audit)

Pontus-godkända dagliga bollplank — regler i `.cursor/rules/backend-ingest-logic.mdc`, `chameleon-ui-modularity.mdc`, `ai-cognitive-companion.mdc`.

| Agent | Slash-kommando (syns i `/`-menyn) | Subagent | Fokus |
|-------|-----------------------------------|----------|-------|
| YOLO-vakt | `/yolo-vakt` | `.cursor/agents/yolo-vakt.md` | Read-only säkerhetsaudit |
| Minnes-Arkitekten | `/minnes-arkitekten` | `.cursor/agents/minnes-arkitekten.md` | Auto kunskaps-ingest |
| Design-Labbet | `/design-labbet` | `.cursor/agents/design-labbet.md` | Chameleon UI |
| Android-Kompis | `/android-kompis` | `.cursor/agents/android-kompis.md` | G85, cap sync, deploy |
| Bild-Arkitekten | `/bild-arkitekten` | `.cursor/agents/bild-arkitekten.md` | Bild till kod (Chameleon) |
| Krav-Analytiker | `/krav-analytiker` | `.cursor/agents/livskompassen-master-architect.md` | Idé till Blueprint (Plan) |

**Viktigt:** `/`-menyn läser **`.cursor/commands/*.md`**. `.cursor/agents/` är subagents (Task-delegation). Båda pekar på samma roll — använd slash-kommandot i chatten.

## Skills & rules (uppgift → vägledning)

| Uppgift | Skill | Cursor rule |
| --- | --- | --- |
| ADK synapser, auto-ingest | `livskompassen-synapser-adk` | `synapser-adk.mdc` |
| RAG, silo, cross-read | `livskompassen-memory-silo-guard`, `livskompassen-rag-retrieval` | `memory-silo.mdc` |
| Vector Search ANN | `livskompassen-vector-search` | — |
| Hela arkivet / Dossier-minne | `livskompassen-arkiv-master` | `livskompassen-core.mdc` |
| Agent cards / prompts | `livskompassen-memory-agents` | `backend-agents.mdc` |
| Deploy / Firebase | plugin `firebase-basics` | `firebase-workflow.mdc`, **`deploy-paminnelser.mdc`** |
| Planering / dubbelarbete | — | **`planering-kanon-guard.mdc`** |
| Firestore rules / WORM | plugin `firebase-firestore-standard` | `security-firestore.mdc` |
| Natt-/batch-autorun | — | `orkester-autorun.mdc`, `grunder-kanon.mdc`, `anti-hallucination.mdc` |
| Innehåll fakta/lek (U6) | — | `innehall-register.mdc`, `grunder-kanon.mdc` |
| Modulutökning (cursor-plan) | — | [`docs/evaluations/MALL-cursor-plan.md`](docs/evaluations/MALL-cursor-plan.md) + `*-SPEC.md` + `module_plan.md` |

Kanon för arkitektur och säkerhet: `.context/` (system-plan, arkiv-minne, security). Dokumentationsindex: [`docs/README.md`](docs/README.md). **Systemkontroll / röda tråden:** [`docs/SYSTEMKONTROLL.md`](docs/SYSTEMKONTROLL.md). **Fas 19 gate (pre-flight):** [`.cursor/rules/fas19-masterplan-guard.mdc`](.cursor/rules/fas19-masterplan-guard.mdc) · [`docs/prompts/FAS19-PREFLIGHT-SUPERPROMPT.md`](docs/prompts/FAS19-PREFLIGHT-SUPERPROMPT.md).  
Live GCP-sanning: [`docs/GCP-INVENTORY-LATEST.md`](docs/GCP-INVENTORY-LATEST.md).  
GCP-konsolidering: [`docs/GCP-KONSOLIDERING-BESLUT.md`](docs/GCP-KONSOLIDERING-BESLUT.md).

## Product Agent Roles

| Role | Responsibility |
| --- | --- |
| Sannings-Analytikern | Clinical evidence analysis and strict JSON output. |
| Brusfiltret | Converts emotionally loaded input into clean facts and timeline data. |
| BIFF-Skölden | Produces Brief, Informative, Friendly, Firm Grey Rock communication. |
| Paralys-Brytaren | Reduces executive dysfunction by showing exactly one micro-step. |
| RSD-Kylaren | Provides rational alternatives for rejection-sensitive triggers. |
| Uppgifts-Krossaren | Breaks overwhelming tasks into small, testable action atoms. |
| Speglings-Coachen | Validates without fixing and separates emotion from evidence. |
| Mönster-Arkivarien | Performs forensic long-term pattern analysis across evidence and Drive inputs. |

These roles are project terminology in Cursor now. Runtime backend implementation happens through `functions/src/agents/`, `functions/src/agents/cards/`, and `functions/src/sharedRules.ts`.

## Git & merge (HARD)

- **Single trunk:** develop on `main`; push only `origin` (Livskompassen3.0). Never push `origin-old`.
- Before merge/branch delete: write **Pre-Merge Impact Report** per [`docs/MERGE-IMPACT-RAPPORT.md`](docs/MERGE-IMPACT-RAPPORT.md) (följer med / försvinner / regelanalys).
- Analyze: `.context/system-plan.md`, `grunder-kanon.mdc`, `locked-ux-features.md`, `.context/security.md` (Sacred, WORM, silos).
- Run `npm run smoke:locked-ux` on `main` before calling merge complete.
- **Wait for user OK** ("godkänn merge") before merge, push, or `git push origin --delete`.
- Rule: [`.cursor/rules/git-main-trunk.mdc`](.cursor/rules/git-main-trunk.mdc) (`alwaysApply`). Quick ref: [`docs/GIT-LATHUND.md`](docs/GIT-LATHUND.md). Branches: [`docs/BRANCH-KARTA.md`](docs/BRANCH-KARTA.md).

## Hard Rules

- Do not commit secrets, `.env`, service-account keys, OAuth tokens, or credential JSON files.
- Do not hardcode agent prompts outside `functions/src/sharedRules.ts`.
- Do not use LLM output as the source of truth for authorization, data ownership, or immutable evidence decisions.
- Do not degrade Sacred Features or weaken Device Clear, Draft Layer, or Verklighetsvalvet behavior.
- Do not introduce nature-themed UI. Use Obsidian Calm and Nordic Dusk.
- Keep changes tightly scoped to the requested task and preserve unrelated user work.
