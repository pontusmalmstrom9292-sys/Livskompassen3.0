# CURSOR-HANDOFF-OPEN — efter ChatBox våg 1

Engelska prompts för återstående **OPEN / WIP / DEFER** i [`LIFE-OS-BUILD-STATE.md`](./LIFE-OS-BUILD-STATE.md).

---

## WIP — Upload unified Valv DirectPanel

```
Implement InkastDirectPanel step 2 per UPLOAD-UNIFIED-SPEC.md.
Reuse CapturePanel + routeInboxToWorm — no fourth silo, no auto kb_docs for evidence.
Smoke: npm run smoke:inkast, npm run smoke:locked-ux.
Compare changes against full project context. Work autonomously until smoke PASS.
```

---

## WIP — Valv supermodule UI (PHASE-08 / UI wave B1)

```
Read docs/external-ai/PHASE-08-valv-ui.md and docs/external-ai/UI-WAVE-ROADMAP.md.
Implement Valv zone picker + ValvInputSuperModule per locked UX (Mönster, Orkester, Kunskapsbank, Aktörskarta).
MUST NOT remove VaultMonsterPanel, VaultOrkesterPanel, or vault tabs.
Smoke: npm run smoke:locked-ux, npm run smoke:orkester.
Compare changes against full project context. Work autonomously until smoke PASS.
```

---

## DEFER — MåBra 19.2–19.5 (hybrid-8, evolution_ledger, JOY-17)

**Do not start** until core lock wave is snapshot-complete and Pontus approves Fas 19 scope.

```
Deferred: MåBra hybrid-8 capacity UI, evolution_ledger client paths, JOY-17 gamification guard.
Read docs/evaluations/2026-06-15-fas19-masterplan-v2.md before any work.
```

---

## Optional — Design hygiene (after Pontus OK on HYGIENE-LOG)

```
Archive-only move per HYGIENE-LOG.md CP-7 rows — no DELETE.
Move docs/design/icons-proposals/ → docs/archive/design-2026-06/icons-proposals/
Update DESIGN-KEEP-REGISTER if paths change.
No firestore.rules changes. PMIR if touching locked UX paths.
```
