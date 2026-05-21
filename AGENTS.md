# Livskompassen Cursor Agent Brief

## Project Overview

Livskompassen v2 is a Life OS and multi-agent ecosystem for Lagen om Autonomi, Clean Input, cognitive offloading, and secure evidence handling. Kompis is the user-facing AI navigator; the backend protects user data through Layered Defense, deterministic code, Firebase, Google Cloud, and Vertex/Gemini.

This repository is the current source of truth for React/Vite frontend work, Firebase configuration, Cloud Functions, Data Connect output, and AI-agent orchestration. Legacy Express routes live in `docs/archive/server-legacy/` only.

## Before Writing Code

1. Read `.context/system-plan.md` to confirm the current phase and active risks.
2. Read `.context/arkiv-minne.md` for Hela arkivet / permanent minne / three silos (required for RAG, Dossier, or cross-module memory work).
3. Read `.context/architecture.md`, `.context/arkitektur-beslut.md`, `.context/security.md`, `.context/database.md`, `.context/design-language.md`, and `.context/agents.md`.
4. Apply the relevant `.cursor/rules/*.mdc` files before editing.
5. For substantial changes, prepare a REASONS plan: Requirements, Entities, Approach, Structure, Operations, Norms, Safeguards.
6. Preserve Sacred Features: Verklighetsvalvet, Sanningens Sköld, Morgonkompassen, Dossier-Generator, Speglings-Systemet, Zero Footprint, and Kill Switch.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand.
- Backend: Firebase Cloud Functions, Google Cloud, Vertex AI, Gemini.
- Data: Firestore/Data Connect, RAG-oriented evidence structures, immutable snapshots.
- AI: Kompis Supervisor, A2A agent cards, DCAP, shared prompt rules in `functions/src/sharedRules.ts`.
- Tooling: Cursor rules/hooks/MCP and Firebase plugin in `.cursor/settings.json`.

## Cursor Subagents

- Use `explore` for broad, read-only codebase mapping and architecture discovery.
- Use `shell` for terminal-heavy workflows such as builds, Firebase CLI checks, and Git inspection.
- Use `generalPurpose` for complex multi-step investigations when the right search path is unclear.
- Use `ci-investigator` only when a specific PR check or CI failure needs diagnosis.
- Keep direct edits in the parent agent unless a separate isolated exploration is clearly useful.

## Skills

Use system rules in `.context/` as the canonical source for architecture and security constraints.

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
