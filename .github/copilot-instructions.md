# Livskompassen — Copilot instructions (repo-wide)

Read before suggesting or reviewing changes in this repository.

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
