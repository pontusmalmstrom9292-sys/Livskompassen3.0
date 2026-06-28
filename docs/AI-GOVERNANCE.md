# AI Governance — Livskompassen v2

**Version:** 1.1 · **Last updated:** 2026-06-28  
**Authority:** Permanent repository workflow for all AI coding assistants.  
**Owner:** Pontus (product) · Lead architect agents maintain structure.

This document is the **single workflow contract**. Tool-specific setup lives in [`docs/WORKFLOWS/`](./WORKFLOWS/). Technical kanon (WORM, silos, locked UX) stays in [`.cursor/rules/`](../.cursor/rules/) — do not duplicate here.

---

## 1. Who must follow this

| Platform | Instruction source | Limitation |
|----------|-------------------|------------|
| **Cursor** | `.cursor/index.mdc` + `.cursor/rules/ai-governance-*.mdc` | Rules auto-attach by glob; user must open repo in Cursor |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) | Repo instructions only in supported IDEs; Jules/cloud may need issue body |
| **VS Code Copilot Chat** | Same as GitHub Copilot + [WORKFLOWS/vscode-copilot.md](./WORKFLOWS/vscode-copilot.md) | No always-on rules; paste pre-flight if chat ignores repo file |
| **Claude Code** | [`AGENTS.md`](../AGENTS.md) at repo root | Reads `AGENTS.md` when present; no `.mdc` support |
| **OpenAI Codex / CLI** | `AGENTS.md` + `docs/AI-GOVERNANCE.md` | Pass file paths explicitly in prompt |
| **Gemini CLI** | `AGENTS.md` + `docs/PROJECT_STATE.md` | No native rule files; optional `GEMINI.md` pointer |
| **Terminal agents** | `npm run smoke:governance` + this file | No automatic context — agent must read files |

**If a tool cannot enforce a rule automatically:** document the gap in [§8 Limitations](#8-known-limitations), use the closest supported alternative, and **never invent** unsupported behaviour.

---

## 2. Mandatory pre-flight (before any work)

Read **in this order**. Do not guess phase or scope.

| # | File | Purpose |
|---|------|---------|
| 1 | [`docs/PROJECT_STATE.md`](./PROJECT_STATE.md) | Active phase, active programs, verified status |
| 2 | [`docs/ROADMAP.md`](./ROADMAP.md) | **Active program** phase order (e.g. Premium UI Phase 0–10) |
| 3 | [`docs/TODO.md`](./TODO.md) | Actionable tasks for current work |
| 4 | [`docs/DASHBOARD.md`](./DASHBOARD.md) | Live progress metrics (no guessed %) |
| 5 | This file | Workflow, DoD, self-review |
| 6 | [`.context/system-plan.md`](../.context/system-plan.md) | Canonical phase history (Fas 1–24+) |


## Phase hierarchy (do not confuse)

| Level | File | Example now |
|-------|------|-------------|
| **System phase** | `docs/PROJECT_STATE.md` + `.context/system-plan.md` | **Fas 24** AKTIV |
| **Active program** | `docs/ROADMAP.md` | Premium UI Polish Phase 0 |

System phase wins on conflict. `ROADMAP.md` is the **program** roadmap, not the system Fas number.

**Determine system phase and active program from `PROJECT_STATE.md`** — never guess Fas number or program phase from chat context. On conflict between docs, `PROJECT_STATE.md` wins until Pontus updates it.

**Domain kanon (read when touching code):**

- [`.cursor/index.mdc`](../.cursor/index.mdc) — WORM, tre silos, DCAP, Zero Footprint
- [`docs/governance/GUARD-REGLERBOK.md`](./governance/GUARD-REGLERBOK.md) — PMIR, locked UX, hallucination protocol

---

## 3. During work

| Rule | Detail |
|------|--------|
| **Stay in phase** | Implementation only inside active phase/program in `PROJECT_STATE.md` |
| **Never work ahead** | No future-phase features, hub redesigns, or speculative refactors |
| **Never redesign** | Polish/refine per DAD; layout hierarchy unchanged unless PMIR |
| **Never remove functionality** | Deprecate with PMIR; locked UX is sacred |
| **Never skip documentation** | Task incomplete until post-task docs updated (§5) |
| **Minimal diff** | Smallest safe change; reuse existing components |
| **PMIR-stopp** | `firestore.rules`, `storage.rules`, locked UX, runtime prompters, mass delete, prod deploy → wait for Pontus OK |

---

## 4. Definition of Done (summary)

Full checklist: [`docs/DEFINITION-OF-DONE.md`](./DEFINITION-OF-DONE.md) · Cursor rule: `ai-governance-definition-of-done.mdc`.

A task is **not complete** until all apply:

1. **Scope** — Matches assigned TODO item; no unrelated changes  
2. **Build** — `npm run build` (or touched package) passes  
3. **Smoke** — Relevant smoke scripts green (see `PROJECT_STATE.md` smoke matrix)  
4. **Self-review** — §6 checklist passed  
5. **Documentation** — §5 files updated  
6. **PMIR** — No forbidden changes without approval  

Program-specific DoD (e.g. Premium UI): [`docs/Completion-Criteria.md`](./Completion-Criteria.md).

---

## 5. After every completed task (mandatory)

Update **all that apply**. If documentation was not updated, **the task is NOT complete.**

| File | What to update |
|------|----------------|
| [`docs/ROADMAP.md`](./ROADMAP.md) | Phase status, blockers, revised estimates |
| [`docs/TODO.md`](./TODO.md) | Check off items; add follow-ups |
| [`docs/DASHBOARD.md`](./DASHBOARD.md) | Status columns, metrics (measured, not guessed) |
| [`docs/PROGRESS.md`](./PROGRESS.md) | New log entry (template at bottom) |
| [`docs/PROJECT_STATE.md`](./PROJECT_STATE.md) | Active phase, last smoke, blockers |

**Optional but recommended:** `docs/evaluations/YYYY-MM-DD-<topic>.md` for audits, YOLO reports, large waves.

---

## 6. AI self-review (before marking complete)

Perform explicitly. Fix failures before completion.

| Area | Check |
|------|-------|
| **Architecture** | Matches 3-zone routing; no cross-silo RAG; DCAP before LLM |
| **Performance** | No new heavy deps; blur/animation guarded; scale-to-zero |
| **Accessibility** | Focus visible; 44px touch; contrast; `prefers-reduced-motion` |
| **Design consistency** | Executive Midnight DAD; DS tokens; no new `btn-pill--` |
| **Token usage** | CSS/DS tokens, not hardcoded hex in modules |
| **Responsive layout** | 320–1440px; dock clearance; G85 if mobile touched |
| **Code duplication** | Reused existing components/utilities |
| **Testing** | Smoke + relevant unit/e2e for touched area |
| **Documentation** | §5 files updated |

Cursor rule: `ai-governance-self-review.mdc`.

---

## 7. Governance operations

Full detail: [`docs/WORKFLOWS/documentation-governance.md`](./WORKFLOWS/documentation-governance.md).

| Question | Answer |
|----------|--------|
| **Who updates docs?** | The agent that completed the task; Pontus approves phase changes |
| **When?** | Same session as code merge; before declaring done |
| **How?** | Edit markdown; run `npm run smoke:governance` |
| **New phases?** | Pontus + masterplan eval → update `.context/system-plan.md` → `PROJECT_STATE.md` → ROADMAP |
| **New features?** | Register in `docs/MODUL-FUNKTIONS-REGISTER.md`; PMIR if locked/sacred |
| **Releases?** | `npm run smoke:predeploy:build` → yolo-vakt GO → Pontus OK → deploy skill |

---

## 8. Known limitations

| Tool | Cannot auto-enforce | Closest alternative |
|------|---------------------|---------------------|
| Copilot Chat (VS Code) | Always-on phase gate | Open `PROJECT_STATE.md` first; pin in Copilot context |
| Claude Code | `.mdc` glob rules | Read `AGENTS.md` + run `npm run smoke:governance` |
| Gemini CLI | Repository rules | Pass `docs/PROJECT_STATE.md` in every session |
| Codex CLI | Multi-file pre-read | `node scripts/ai_preflight.mjs` prints read list |
| Jules / cloud agents | Full `.cursor/` tree | Issue template + `.github/copilot-instructions.md` |
| Terminal one-shot | Post-task doc updates | `npm run smoke:governance` fails if stale |

---

## 9. Validation

```bash
npm run smoke:governance
```

Checks required files exist, `PROJECT_STATE` freshness, and Copilot pack phrases.

---

## 10. Index

| Area | Location |
|------|----------|
| Design authority | [`docs/DESIGN-BIBLE/`](./DESIGN-BIBLE/) |
| Architecture | [`docs/ARCHITECTURE/`](./ARCHITECTURE/) |
| Per-tool workflows | [`docs/WORKFLOWS/`](./WORKFLOWS/) |
| Guard / PMIR | [`docs/governance/GUARD-REGLERBOK.md`](./governance/GUARD-REGLERBOK.md) |
| Cost guard | [`docs/governance/GCP-KOSTNADSVAKT.md`](./governance/GCP-KOSTNADSVAKT.md) |
| Audit report | [`docs/GOVERNANCE-AUDIT.md`](./GOVERNANCE-AUDIT.md) |
| Cursor rules index | [`.cursor/index.mdc`](../.cursor/index.mdc) |
