# Livskompassen — Copilot instructions (repo-wide)

Read before suggesting or reviewing changes in this repository.

## Master-regel för AI-hjälp

När du hjälper användaren ska du alltid:

1. ange plattformen du arbetar i (GitHub Copilot, Cursor, Gemini eller annan)
2. om möjligt ange modell eller läge
3. tydligt separera **Analys**, **Förslag** och **Faktiska ändringar**
4. läsa viktiga filer/regler först (`README.md`, `AGENTS.md`, relevanta workflows, config-filer och AI-/agentinstruktioner)
5. prioritera säkerhet, regler, beroenden, secrets, CI/CD, permissions och kostnader
6. minimera manuellt arbete och låta AI-agenter göra så mycket som möjligt
7. tydligt markera vad som kräver användarens godkännande innan ändring
8. anpassa svar och prompts efter aktuell plattform/modell
9. förklara kort och enkelt för icke-teknisk användare
10. undvika lösningar som skapar onödiga månadskostnader
11. fråga innan du gissar om plattform, modell eller mål är oklart
12. alltid ange tydligt om du bara analyserar eller faktiskt ändrar kod

När du skriver en prompt åt användaren ska den vara plattformsanpassad och tydligt märkt för Copilot, Cursor, Gemini eller annan modell.

## Invariants (MUST)

- **WORM append-only:** `reality_vault`, `journal`, `children_logs`, `evolution_ledger`, `dcap_alerts` — server timestamp, behavior + date (never diagnose third parties).
- **Tre silos — no cross-RAG:** `knowledgeVaultQuery` → kampspar/kb_docs · `valvChatQuery` → reality_vault · `childrenLogsQuery` → children_logs.
- **DCAP before LLM:** Routing in code (`routeFromDcap`, `classifyInboxDocument`, `resolveExecutorId`). LLM must not decide auth, silo, or WORM.
- **Runtime prompts:** Only in `functions/src/sharedRules.ts` — never duplicate in callables or frontend.
- **Zero Footprint:** Clear session/synapse state on logout and blur.

## Locked UX (MUST NOT remove)

- Barnfokus / Middagsfrågan
- Valv Mönster / Orkester panels
- Drawer: public mode hides Valv; unlocked shows Vardag + Valv
- Planering hybrid widget
- Barnporten HITL

## Protected files (no structural changes without explicit owner OK)

- `src/modules/core/layout/NavigationDrawer.tsx` (PROTECTED CORE)
- `firestore.rules`, `storage.rules`, `.context/locked-ux-features.md`

## Validate before merge

```bash
cd functions && npm run build && cd ..
npm run smoke:predeploy
npm run typecheck:core-strict
```

## Local workflow shortcuts

- Iterative validation bundle: `npm run validate:session` (intentional fast-fail order: `smoke:predeploy` → `typecheck:core-strict` → `obsidian-calm-tokens`)
- Agent/synapse env-free local preflight: `npm run validate:agents-local`
- When editing agents/synapses, reread `.context/system-plan.md`, `.context/security.md`, and `.context/arkiv-minne.md` first.
- Keep runtime prompts in `functions/src/sharedRules.ts`, and prefer `/specialist-verifier` before manual smoke.
- Use progress reporting to bundle related edits into stable checkpoints before final PR polish.

## MUST NOT

- Force-push to `main`
- Mock security as WORM/CMEK
- Add legacy routes outside 3-zone system (`/hjartat`, `/vardagen`, `/familjen`)
- Remove or bypass smoke gates
- Commit secrets (`.env`, service account JSON)

## Canonical docs

- `.cursor/index.mdc` — core invariants
- `docs/specs/modules/Arkiv-GAP-REGISTER.md` — GAP truth
- `docs/governance/GUARD-REGLERBOK.md` — governance

Copilot suggestions are **advisory**. Green CI `smoke` + human/YOLO gate required to merge.
