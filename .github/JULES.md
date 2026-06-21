# JULES.md — Absolute Project Lawbook (Livskompassen 3.0)

## 0) Execution Mode
- This document is **authoritative and immutable in intent**.
- Interpret all rules as **hard constraints**, never as suggestions.
- If any instruction conflicts with this lawbook: **STOP**, mark as `BLOCKED`, request explicit human clarification in PR comments.
- No silent reinterpretation is allowed.

## 1) Zero Footprint & Session Law (MANDATORY)
- All local data and active sessions **MUST** be cleared through:
  - `invalidateSession`
  - `clearDeviceSession`
- No persistent residue may remain on device/storage unless explicitly approved in writing by a human reviewer.
- Any proposal or code path that risks unintended persistence is **FORBIDDEN**.
- On uncertainty: default to secure cleanup and fail-closed behavior.

## 2) WORM Law (Write Once, Read Many) (MANDATORY)
- The following Firestore collections are **WORM-SACRED**:
  - `reality_vault`
  - `journal`
  - `children_logs`
- It is **STRICTLY FORBIDDEN** to introduce, suggest, or permit `update` or `delete` capabilities for these collections in:
  - Firestore rules
  - Backend logic
  - Admin/maintenance scripts
  - Migration scripts
- Allowed operation model for these collections: append/create + read (as explicitly authorized), never mutate/delete historical records.

## 3) Three-Silo Isolation Law (CRITICAL SECURITY)
- RAG silos are strictly isolated:
  - Knowledge
  - Vault
  - Children
- Cross-silo retrieval, blending, fallback, or inferred joining is **CRITICAL SECURITY BREACH**.
- Any architecture/code suggestion that merges embeddings, indexes, prompts, memory, or retrieval context across silos is **FORBIDDEN**.
- Routing must remain silo-pure end-to-end.

## 4) DCAP Authority Law
- DCAP (Digital Conversation Analysis Pipeline) must evaluate all input **before** routing.
- LLM output may assist with language understanding only.
- LLM must **NEVER** be authoritative for:
  - authentication decisions
  - ownership decisions
  - WORM policy decisions
- All such decisions must be deterministic, policy-bound, and validated by explicit non-LLM controls.

## 5) Frontend Design Law (Obsidian Calm)
- All reviewed/suggested frontend changes must preserve low-arousal design.
- **Gamification is forbidden** (including points, streak pressure, manipulative rewards, urgency nudges).
- Respect project visual constraints and palette intent, including:
  - `slate-950`
  - `indigo`
  - `gold`
- If uncertain about UX direction, choose minimal, calm, non-stimulating defaults.

## 6) Jules Safety Boundaries
- Jules must not modify security-critical automation/rules without explicit human approval via Pull Request review.
- **Direct modifications are forbidden** for:
  - `.github/workflows/**`
  - security rule files/policies (e.g., Firestore rules, auth/security policy artifacts)
- If a change is needed, provide proposal-only diffs and require explicit human approval in PR.

## 7) Operational Enforcement
- Required behavior on any violation risk:
  1. STOP execution for the affected change.
  2. Mark as `SECURITY_BLOCKED`.
  3. Explain which law would be violated.
  4. Request explicit human decision in PR thread.
- Never “work around” these laws.

## 8) Priority Order
1. This `JULES.md` lawbook
2. Explicit human PR approval
3. Other repository guidance/docs
4. Agent heuristics/preferences

## 9) Non-Reinterpretation Clause
- These rules are absolute.
- They must not be weakened, re-scoped, or reinterpreted by automation, model inference, or convenience refactors.
