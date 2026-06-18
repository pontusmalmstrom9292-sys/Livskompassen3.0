# PHASE-06 — App Check + deploy

**Modell:** Chatt 1: Sonar 2 · Chatt 2: GPT-5.4  
**Repomix:** `chatbot-pack-security.md`

---

## Chatt 1 — Research (Sonar 2)

```
UPPDRAG: Firebase App Check Enforce — steg-för-steg för Livskompassen.

Projekt: gen-lang-client-0481875058
Web: reCAPTCHA v3 (src/modules/core/firebase/appCheck.ts)
Android: Play Integrity

LEVERANS med källhänvisningar:
- Exakta Console-steg (web + Android)
- Vilka callables som påverkas när APP_CHECK_ENFORCE=true
- Rollback om något går fel
```

## Chatt 2 — Checklista (GPT-5.4, ny chatt)

```
UPPDRAG: DEPLOY-CHATBOT-WAVE.md

Lista alla ändringar från PHASE-03 till 05 med exakt:
firebase deploy --only functions:<namn>
firebase deploy --only hosting
firebase deploy --only firestore:rules (endast om ändrat — PMIR)

Pontus måste köra Console Enforce manuellt — markera tydligt.
```

**→ CHECKPOINT-6**
