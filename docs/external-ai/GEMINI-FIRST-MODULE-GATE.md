# Första modul-gate — Brusfilter P1

**Status:** P1 v1 **LOCK** 2026-06-17 (Orkester + `processBrusfilter` i prod).  
**Nästa gate:** P1 v2 Inkast HITL · P2 Dossier v2 — se flow-karta §6.

**Status:** Väntar på Pontus **godkänn** i [`2026-06-17-flow-pipeline-karta.md`](../evaluations/2026-06-17-flow-pipeline-karta.md) §6.

---

## Kedja (efter godkännande)

| Steg | Var | Prompt |
|------|-----|--------|
| 1 | Google Flow | Flow-karta §9.1 |
| 2 | ChatBox | Flow-karta §9.2 |
| 3 | Gemini granskar | Klistra ChatBox-svar → APPROVED? |
| 4 | Cursor | Flow-karta §9.3 |
| 5 | verifier | `npm run smoke:inkast` + `smoke:valv-security` |

---

## Ett kommando till Gemini nu

```
Jag godkänner Flow-kartan P1 Brusfilter. Ge mig §9.1 FLOW-prompten att klistra in i Google Flow.
```

*(Byt "godkänner" till "avvisar" eller "ändra X" om du vill justera först.)*

---

## Efter Flow-export

Klistra Flow-export i Gemini → be om CHATBOX-prompt (§9.2) → sedan CURSOR (§9.3).

Ingen prod-kod i Cursor före godkännande.
