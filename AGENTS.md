# Livskompassen Cursor Agent Brief

## Project Overview

Livskompassen v2 is a Life OS and multi-agent ecosystem for Lagen om Autonomi, Clean Input, cognitive offloading, and secure evidence handling. Kompis is the user-facing AI navigator; the backend protects user data through Layered Defense, deterministic code, Firebase, Google Cloud, and Vertex/Gemini.

This repository is the current source of truth for React/Vite frontend work, Firebase configuration, Cloud Functions, Data Connect output, and AI-agent orchestration. Legacy Express routes live in `docs/archive/server-legacy/` only.

## Before Writing Code

1. Read `.context/system-plan.md` to confirm the current phase and active risks.
2. Read `.context/arkiv-minne.md` for Hela arkivet / permanent minne / three silos (required for RAG, Dossier, or cross-module memory work).
3. Read `.context/architecture.md`, `.context/arkitektur-beslut.md`, `.context/security.md`, `.context/database.md`, `.context/design-language.md`, and `.context/agents.md`.
4. Apply the relevant `.cursor/rules/*.mdc` files before editing (always-on: `livskompassen-core.mdc`, `grunder-kanon.mdc`, `anti-hallucination.mdc`).
5. For substantial changes, prepare a REASONS plan: Requirements, Entities, Approach, Structure, Operations, Norms, Safeguards.
6. Preserve Sacred Features: Verklighetsvalvet, Sanningens Sköld, Morgonkompassen, Dossier-Generator, Speglings-Systemet, Zero Footprint, and Kill Switch.

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

## Cursor Subagents

### Grunder revisionsunderagenter (read-only, `.cursor/agents/`)

| Trigger | Agent | Domän |
| --- | --- | --- |
| `kör grunder U1` | `grunder-u1-hotvektorer` | DCAP, Gräns-Arkitekten, injection-parity |
| `kör grunder U2` | `grunder-u2-systemforsvar` | Circuit breaker, Kill Switch, `dcap_alert`/HITL |
| `kör grunder U3` | `grunder-u3-life-os` | Tre silor, WORM, offentligt/dolt lager |
| `kör grunder U4` | `grunder-u4-orkester` | Cards, ADK, sharedRules vs Genkit vision |
| `kör grunder U5` | `grunder-u5-barn` | Barnen-silo, PA, Dossier, routing |

Parent: `livskompassen-master-architect`. Baseline: [`docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md). Kör **en** U i taget efter större säkerhets-/agent-PR.

### Cursor inbyggda subagents

- Use `explore` for broad, read-only codebase mapping and architecture discovery.
- Use `shell` for terminal-heavy workflows such as builds, Firebase CLI checks, and Git inspection.
- Use `generalPurpose` for complex multi-step investigations when the right search path is unclear.
- Use `ci-investigator` only when a specific PR check or CI failure needs diagnosis.
- Keep direct edits in the parent agent unless a separate isolated exploration is clearly useful.

## Skills & rules (uppgift → vägledning)

| Uppgift | Skill | Cursor rule |
| --- | --- | --- |
| Grunder G01–G52 / slide vs runtime | — | `grunder-kanon.mdc` (always) |
| PASS/FAIL/GAP, inga gissningar | — | `anti-hallucination.mdc` (always) |
| Grunder revision U1–U5 | — | `.cursor/agents/grunder-u1-hotvektorer` … `grunder-u5-barn` (readonly) |
| ADK synapser, auto-ingest | `livskompassen-synapser-adk` | `synapser-adk.mdc` |
| RAG, silo, cross-read | `livskompassen-memory-silo-guard`, `livskompassen-rag-retrieval` | `memory-silo.mdc` |
| Vector Search ANN | `livskompassen-vector-search` | — |
| Hela arkivet / Dossier-minne | `livskompassen-arkiv-master` | `livskompassen-core.mdc` |
| Agent cards / prompts | `livskompassen-memory-agents` | `backend-agents.mdc` |
| Firebase deploy / inventering | plugin `firebase-basics` | `firebase-workflow.mdc` |
| Firestore rules / WORM | plugin `firebase-firestore-standard` | `security-firestore.mdc` |
| Frontend UI (Obsidian Calm) | — | `ui-design.mdc` |

Kanon för arkitektur och säkerhet: `.context/` (system-plan, arkiv-minne, security). Dokumentationsindex: [`docs/README.md`](docs/README.md). **Systemkontroll / röda tråden:** [`docs/SYSTEMKONTROLL.md`](docs/SYSTEMKONTROLL.md).  
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

## Hard Rules

- Do not commit secrets, `.env`, service-account keys, OAuth tokens, or credential JSON files.
- Do not hardcode agent prompts outside `functions/src/sharedRules.ts`.
- Do not use LLM output as the source of truth for authorization, data ownership, or immutable evidence decisions.
- Do not degrade Sacred Features or weaken Zero Footprint, Kill Switch, or Verklighetsvalvet behavior.
- Do not introduce nature-themed UI. Use Obsidian Calm and Nordic Dusk.
- Keep changes tightly scoped to the requested task and preserve unrelated user work.
