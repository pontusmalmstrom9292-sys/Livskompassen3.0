# CURSOR-HANDOFF-OPEN — efter BUILD-STATE LOCK (2026-06-18)

Engelska prompts för återstående **OPEN / PAUSED / DEFER** i [`LIFE-OS-BUILD-STATE.md`](../LIFE-OS-BUILD-STATE.md).

**Senast synkad:** 2026-06-18 (`npm run research:sync:handoff`)

---

## Stängt sedan 2026-06-18 (LOCK — starta inte utan snapshot + Pontus OK)

| Komponent | CHECKPOINT | Notis |
|-----------|------------|-------|
| Upload unified Valv DirectPanel | CP-4b | `InkastDirectPanel.tsx`, `VaultInkastCompact.tsx` |
| Valv supermodule UI (PHASE-08 / B1) | B1 | Mönster, Orkester, Kunskapsbank, Aktörskarta |
| G10 Inkast backend + UI | CP-3 / CP-4 | CapturePanel, CaptureSuperModule |
| P1 Brusfilter v1/v2 | P1 / P1b | Valv Orkester + Inkast HITL |
| P2 Dossier v2 | P2 | AI foreword |
| **P3 Flow-assist** | P3 | `assistPatternMetadata` — Mönster metadata sidecar, rate-limit 2/h |
| Fas 19.1 security sprint | F19.1 | invalidateSession guard, D14 |
| **Fas 19.2–19.5 (MåBra)** | F19.2–19.5 | hybrid-8, hex→tokens, JOY-17, evolution_ledger dual-write |
| MB-PLAY-54321 | V2 | Wizard se→höra→känna→lukta→smaka |
| MB-REF-rsd-04 | V3 | RSD-säker felcopy via mabraCoach |
| Planering modulpinnar | PLAN-PIN | localStorage pins, `PinnedPlaneringModuleSlot` |

---

## PAUSED — Barnporten barn-PWA (V4)

Flagga: `BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED=false`. UI: `BarnportenPausedPanel.tsx`.

```
Do not enable rollout flag without Pontus OK + PMIR.
Smoke after enable: npm run smoke:locked-ux, npm run smoke:barnporten.
Compare changes against full project context. Work autonomously until smoke PASS.
```

---

## DEFER — medvetet senarelagt

| Komponent | CHECKPOINT | Notis |
|-----------|------------|-------|
| M3.0-C Fitness/Näring | F19.N+ | evolution_hub — se masterplan |
| BP-PUSH (FCM barn) | V6 | Ingen implementation utan PMIR |
| AI-assistent UI | — | Efter kärnprodukt stabil |
| P4 MåBra Flow-parafras | — | [PMIR-B utkast](../../evaluations/2026-06-18-pmir-b-p4-mabra-flow-parafras.md) |
| P6 Dossier tidslinje | — | [PMIR-C utkast](../../evaluations/2026-06-18-pmir-c-p6-dossier-timeline.md) |
| Arbetsliv budget→lön | — | PMIR-D — backlog |

```
Deferred per BUILD-STATE. No prod wiring without PMIR + smoke plan.
```

---

## Optional — Design hygiene (efter Pontus OK på HYGIENE-LOG)

```
Archive-only move per HYGIENE-LOG.md CP-7 rows — no DELETE.
Move docs/design/icons-proposals/ → docs/archive/design-2026-06/icons-proposals/
Update DESIGN-KEEP-REGISTER if paths change.
No firestore.rules changes. PMIR if touching locked UX paths.
```

---

## Nästa användarsteg (Pontus)

1. **Använd:** Familjen livslogg (citat/tolkning); MåBra 5-4-3-2-1-lek; Valv Mönster Flow-assist
2. **Nästa PMIR:** P4 Flow-parafras · P6 Dossier tidslinje · P-D Arbetsliv
3. **Research:** `bifoga/05-research-handoff/` 00–09 → Deep Research vid behov
