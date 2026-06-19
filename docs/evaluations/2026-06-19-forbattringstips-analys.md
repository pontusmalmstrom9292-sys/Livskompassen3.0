# Strategisk plan — förbättringstips (inbox batch 01–11)

**Datum:** 2026-06-19  
**Status:** Godkänd våg 1 (docs-only)  
**Källa:** [`docs/inbox/forbattringstips/`](../inbox/forbattringstips/) · 11 batcher  
**Superprompt:** [`STRATEGIC-PLAN-MASTER-SUPERPROMPT.md`](../prompts/STRATEGIC-PLAN-MASTER-SUPERPROMPT.md)  
**YOLO:** `npm run smoke:predeploy` PASS 2026-06-19 · merge/deploy NO-GO (dirty tree + divergerad main)

---

## Sammanfattning

Externa tips (batch 01–11) innehåller mycket som **redan finns** i prod (Smart Inkast, ChameleonInputShell, Zustand, WORM, DCAP/inboxClassifier, smoke-gated CI) och flera förslag som **strider mot kanon** (cross-RAG, gamification, Gmail/Kalender, wholesale RBAC-rules, self-healing utan HITL). Batch 04 ger värdefull intern korrektion (anti-gamification, HITL, visuell stabilitet). Bästa värdet ligger i selectiva **DEFER/PMIR**-idéer: offline-kö, andnings-feedback, PII-scanner, Local Vault, hash chain — efter Fas 22-gate.

---

## KEEP / DEFER / REJECT / PMIR

| Tip # | Sammanfattning | Klass | Bevis/kanon |
|-------|----------------|-------|-------------|
| T1 | `submitInkastLite` + AI-klassificering | **KEEP** | `functions/src/callables/inbox.ts`, `submitInkastLite.ts` |
| T2 | `ChameleonInputShell` + SuperModule | **KEEP** | `src/modules/core/ui/ChameleonInputShell.tsx` |
| T3 | Zustand | **KEEP** | `package.json` zustand ^5.0.13 |
| T4 | DCAP före LLM | **KEEP** | `inboxClassifier.ts`, `routeFromDcap` |
| T5 | WORM `evolution_ledger` | **KEEP** | `firestore.rules:1208–1211` |
| T6 | Fristående `UploadText` + `useInkastStore` | **DEFER** | Prod: `CapturePanel`, `InkastDirectPanel` |
| T7 | React Joyride onboarding | **DEFER** | Ej i repo · Fas 22+ UX |
| T8 | RBAC `hasRole(Admin/PowerUser)` rules | **REJECT** | Prod: `isOwner` — single-user |
| T9 | Hybrid / cross-silo RAG | **REJECT** | U1 · grunder-kanon |
| T10 | Self-healing AI utan HITL | **REJECT** | batch 04 · `smoke:weaver-hitl` |
| T11 | Gamification / streaks | **REJECT** | batch 04 · design-calm · U6 |
| T12 | Dynamiskt AI-temaskift (auto) | **REJECT** | batch 04 · Chameleon = användarvalt läge |
| T13 | Google Kalender / Gmail | **REJECT** | livskompassen-governance |
| T14 | Temporal.io / GKE | **DEFER** | batch 04 · serverless räcker |
| T15 | Jest + Cypress + Snyk CI | **DEFER** | Prod: smoke:predeploy i GH Actions |
| T16 | Staging / canary deploy | **DEFER** | Tips-YAML felaktig · endast main deploy idag |
| T17 | Pre-commit Husky | **DEFER** | TIPS-GAP-MATRIX #8 |
| T18 | Playwright e2e | **DEFER** | Smoke-scripts är kanon |
| T19 | IndexedDB + Workbox offline | **PARTIAL** | workbox deps · offline-kö ofullständig |
| T20 | TensorFlow.js edge DCAP | **DEFER** | Zero Footprint-idé |
| T21 | Local Vault (krypterad IndexedDB) | **PMIR** | batch 04 |
| T22 | WORM hash chaining | **PMIR** | batch 04 |
| T23 | Stealth exit / panikskärm | **PMIR** | batch 04 · delvis MåBra panic |
| T24 | Dead Man's Switch | **PMIR** | batch 04 |
| T25 | Affekt-Termometer (prediktiv) | **DEFER** | Valv Mönster-koppling |
| T26 | Projektions-Inverteraren | **REJECT** | WORM-epistemik · domän |
| T27 | PII leakage scanner CI | **DEFER** | smoke:barn-epistemik delvis |
| T28 | Andnings-spinner vid upload | **KEEP** (princip) | Obsidian Calm |
| T29 | `src/modules/supermodules/` path | **PARTIAL** | Prod: `features/*/supermodule/` |
| T30 | Prompt JSON mallar | **PARTIAL** | governance JSON · runtime sharedRules |
| T31 | PlantUML arkitektur | **KEEP** (dok) | Alignad med prod + HITL |
| T32 | Monorepo Nx/Turborepo | **DEFER** | Scope creep |
| T33 | Community OSS UI-bibliotek | **REJECT** | Obsidian Calm locked |

Fullständig batch-lista: [`docs/inbox/forbattringstips/README.md`](../inbox/forbattringstips/README.md).

---

## Riskregister

| ID | Risk | Nivå | Mitigation |
|----|------|------|------------|
| R1 | Wholesale rules-ersättning med RBAC | H | PMIR · diff mot firestore.rules |
| R2 | smoke:prompts doc-sync | M | smoke:guard i CI (predeploy tier1) |
| R3 | Dirty tree / oreviewad inbox | M | Committa docs våg 1 · rensa cache |
| R4 | Governance≠runtime prompt-drift | M | PMIR vid sharedRules.ts |
| R5 | Fas 22.3 rules wire | H | Blocker utan 22.2 PMIR OK |
| R6 | LLM silo-klassificering utan DCAP | H | REJECT · behåll inboxClassifier |
| R7 | Gamification i roadmap (batch 05) | H | REJECT · stryk från extern roadmap |
| R8 | App Check enforce prod | M | Fas 22.10 · Pontus Console |

---

## Våg 1–3 (plan)

| Våg | Status | Mål |
|-----|--------|-----|
| **1** | **DONE (docs)** | Evaluation + TIPS-GAP-MATRIX + inbox ANALYSERAD |
| 2 | Väntar OK | Offline-kö + andnings-feedback i befintlig Capture/Inkast |
| 3 | Väntar OK | CI PR-trigger smoke:predeploy · ev. preview channel |

---

## PMIR-kandidater (implementation senare)

1. `firestore.rules` (Fas 22.3)
2. `functions/src/sharedRules.ts`
3. Local Vault / krypterad IndexedDB
4. WORM hash chaining
5. Stealth exit / global panic shell
6. `.husky/pre-commit` + smoke:guard
7. Firebase preview channels (staging/canary)

---

## YOLO-preliminärt

- **Prod-kod + smoke:predeploy:** GO
- **Merge/deploy:** NO-GO (dirty tree, main ahead 5 / behind 4)

---

## Nästa steg

Våg 2 kräver separat Pontus-OK: förbättra offline-kö i `src/modules/capture/` utan ny parallell UploadText-modul.
