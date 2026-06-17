# Modul-gate — P1/P2 stängd · nästa: system-gap-syntes

**Status:** P1 v1+v2 **LOCK** 2026-06-17 · P2 Dossier v2 **LOCK** 2026-06-17  
**Nästa gate:** **System-gap-syntes** — Deep Research MASTER + SA1–SA10 → Cursor-subagent

---

## Kedja (nästa gate)

| Steg | Var | Prompt / artefakt |
|------|-----|-------------------|
| 1 | Gemini Deep Research | `GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md` + SA1–SA10 |
| 2 | Spara | `docs/external-ai/imports/research-2026-06-18-*.md` |
| 3 | Cursor subagent | [`CURSOR-FLOW-CREDITS-SYNTHESIS.md`](./bifoga/03-prompter/CURSOR-FLOW-CREDITS-SYNTHESIS.md) |
| 4 | Leverans | `docs/evaluations/2026-06-18-system-gap-syntes.md` |
| 5 | Pontus | Godkänn **en** PMIR i taget från syntes-rapporten |
| 6 | Cursor + verifier | Implement → smoke → ny LOCK i BUILD-STATE |

---

## Ett kommando till Gemini nu

```
Starta system-audit: bifoga 05-research-handoff/ och kör GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER. Spara syntes till imports/.
```

---

## BACKEND-POLICY

Research får föreslå `backend_impact: YES`. Implementation kräver separat PMIR — inte blockeras i research-fasen.
