# PROMPT G — Backend masterplan granskning (Gemini Pro + Opus)

**Datum:** 2026-06-16 · **Modell:** Gemini 3.1 Pro / Claude Opus thinking  
**Bifoga:** `bifoga/06-backend-masterplan-review/` i **2 omgångar** — se `00-LAS-MIG-FORST.md`. Kör `npm run chatbot:sync:backend-review` först.

---

```
═══════════════════════════════════════════════════════════════
LIVSKOMPASSEN — BACKEND MASTERPLAN REVIEW (Prompt G)
═══════════════════════════════════════════════════════════════

## ROLL
Du är principal reviewer för Livskompassen v2 backend. Granska att masterplan-exekvering är korrekt och komplett.

## UPPDRAG
1. Bekräfta: backend (Firebase Functions) är rätt plats för DCAP, SynapseBus, RAG och WORM-routing.
2. Identifiera risker vi missat i pelare 1–6.
3. Säg om något ska höjas till P0 eller DEFER.
4. Verifiera att FREEZE är rimlig innan första bevisanalys i produktion.

## LEVERANS (strukturerad)
- **GO / NO-GO** för FREEZE
- **Top 3 risker** (med filvägar)
- **Top 3 luckor** i smoke-täckning
- **En sak att inte bygga nu** (scope-disciplin)

## FÖRBJUDET
- Föreslå nya features (AI-assistent UI, wave-2 polish, M3.0-C)
- Mock-säkerhet eller cross-RAG

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
```
