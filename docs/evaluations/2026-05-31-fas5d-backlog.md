# Fas 5D — Backlog (Life OS / Projekt / Barnporten)

**Status:** Agent-pass **2026-06-01** — PMIR kvar för P2 rules + Barnporten QR/CB2.

| Spår | Agent 2026-06-01 | Nästa |
|------|------------------|-------|
| Projekt P2 | **SKIP** — [`2026-05-31-blocker-projekt-p2.md`](./2026-05-31-blocker-projekt-p2.md) | Explicit order: `firestore.rules` + `project_rules` |
| Barnporten Fas 2 | **SKIP** — [`2026-05-31-blocker-barnporten-fas2.md`](./2026-05-31-blocker-barnporten-fas2.md) | Manuell #3 + barnenhet |
| MaterialPack-editor | **SKIP** — [`2026-05-31-blocker-lifeos-d.md`](./2026-05-31-blocker-lifeos-d.md) | `kör kopplingar D` efter PMIR |

P1 (bild, lokala regler, CB1) **done** i repo.

---

## Projekt P2+

| Item | Spec / kanon | Kommando |
|------|--------------|----------|
| `project_rules` Firestore + rules PMIR | [`PROJEKT-SPEC.md`](../specs/modules/PROJEKT-SPEC.md) | `kör projekt P2` |
| Bild-uppladdning `project_media/` | Storage deploy **done** 2026-05-29 | manuell smoke USER |
| MaterialPack-editor | [`LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../design/LIFE-OS-KOPPLINGAR-KOMIHAG.md) Fas D | `kör kopplingar D` |

---

## Barnporten

| Item | Kanon |
|------|-------|
| Route `/barnporten` | Finns — [`BARNPORTEN-SPEC.md`](../design/BARNPORTEN-SPEC.md) |
| CB2+, QR, full PWA | [`2026-05-29-barnporten-cursor-plan.md`](./2026-05-29-barnporten-cursor-plan.md) |
| Valv HITL bro | Locked — ingen auto-promote |

**Kommando:** `kör barnporten`

---

## Övrigt

- Opt-in minne-ingest (trauma-policy)
- Kunskap våg 8 ingest (`specialist-kunskap-seed`)
- Gemini NotebookLM V2-jämförelse — [`gemini-handoff/V2-PROMPT.md`](../gemini-handoff/V2-PROMPT.md)
