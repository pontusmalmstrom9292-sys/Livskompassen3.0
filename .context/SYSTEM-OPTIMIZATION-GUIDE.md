# 🚀 LIVSKOMPASSEN 3.0 — SYSTEM OPTIMIZATION GUIDE
**Status: Analyzeringskomplett | Datum: 2026-06-06 | Version: 1.1**

---

## 📋 INNEHÅLLSFÖRTECKNING
1. [Executive Summary](#executive-summary)
2. [Kritiska Problem](#kritiska-problem)
3. [Kostnadsoptimering](#kostnadsoptimering)
4. [Säkerhet](#säkerhet)
5. [Cursor-Prompts](#cursor-prompts-färdiga)
6. [Gemini-Prompts](#gemini-prompts)
7. [Implementeringsplan](#implementeringsplan)
8. [Tillägg: Säkerhetsregler, arbetsflöde och policy för ändringar](#tillagg-sakerhetsregler-arbetsflode-och-policy-for-andringar)
9. [Färdiga prompts för Cursor & Gemini (kopiera/klistra)](#fardiga-prompts-for-cursor--gemini-kopieraklista)
10. [Pre-deploy checklist & CI-krav](#pre-deploy-checklist--ci-krav)

---

## EXECUTIVE SUMMARY

### 🎯 Projektöversikt
**Livskompassen** är en avancerad React + TypeScript-app med:
- **Frontend**: Vite, React Router, Zustand, Firebase SDK
- **Backend**: 32 Cloud Functions (monolitisk index.ts, 54 KB)
- **Database**: Firestore (WORM-mönster för immutability)
- **AI**: Vertex AI, Gemini, Vector Search
- **Mobile**: Capacitor (Android)

### ⚠️ KRITISKA FYND

| Problem | Allvarlighetsgrad | Påverkan | Sparande |
|---------|-------------------|----------|-----------|
| **Functions monolith** (54 KB index.ts) | 🔴 Hög | Långsam deploy, svår debug | 15-20% |
| **Anonymous Auth aktiverat** | 🔴 Hög | Datatajning, säkerhetshål | Security |
| **Firestore ooptimerad** | 🟠 Medel | 10x kostnad utan index | 30% |
| **Vector Search på us-west1** | 🟠 Medel | Dyr region | 40% |
| **Potentiella AI-hallucineringar** | 🟠 Medel | Felaktig data | Validation |
| **Kod-dubbletter** | 🟡 Låg | Maintainability | 5-10% |

### 💰 KOSTNAD-RESULTAT

Se tidigare uppskattning i filen — mål: < $20/mån efter optimering med Google AI Pro.

---

## KRITISKA PROBLEM

(Se tidigare sektioner för detaljer — inkluderar anonym-auth risk, monolitisk functions-fil, Firestore-indexering, region för vector search, och hallucination-risks.)

---

## KOSTNADSOPTIMERING

(Se tidigare rekommendationer: Prioritera grounding, caching, region-migrering, consolidating functions, indexering.)

---

## SÄKERHET

(Se tidigare avsnitt — men nedan finns nu en utökad policy för hur vi hanterar ändringar så att vi INTE bryter produktens funktionalitet.)

---

## IMPLEMENTERINGSPLAN

(Se tidigare veckoplan med Vecka 1–4.)

---

## TILLÄGG — SÄKERHETSREGLER, ARBETSFLÖDE OCH POLICY FÖR ÄNDRINGAR

Detta avsnitt läggs till för att tydliggöra att inga ändringar i produktion får ske utan fullständig analys och planering.

1) "No-change-until-plan" policy
- Inga ändringar i main branch eller produktion utan följande checklist:
  - Fullständig repo-audit (Cursor) + riskbedömning godkänd.
  - Migrationsscript för dataändringar och rollback-script finns och testats i emulator eller staging.
  - Backup/snapshot av Firestore & Storage skapad före migration (gcloud firestore export).
  - CI: lint, build, unit tests, integration tests och smoke-tests gröna i PR.
  - PR är draft och kräver minst en godkänd review av repo owner innan merge.
  - Feature flags eller remote-config används för att gradvis slå på funktionen.

2) Rollout-policy
- Stegvis rollout: deploy till staging → intern QA → canary (1% användare eller staging användare) → full rollout.
- Varje steg måste ha checkpunkter (test, logg, kostnadsmonitor).
- Vid kostnadsspike (över angiven threshold) ska en "stop-loss" automatisk åtgärd köras som kan pausa dyra jobs (exempel: radera/pausa scheduled AI-jobb).

3) Secret management
- Alla känsliga värden (GEMINI_API_KEY, VAULT_PIN_HASH, GOOGLE_CLIENT_SECRET) ska ligga i Secret Manager eller Firebase Functions secrets.
- Ingen VITE_* som innehåller hemligheter i prod. VITE_* får bara användas för icke-känslig konfiguration.

4) Backup & rollback
- Standard: ta snapshot med `gcloud firestore export` och `gsutil cp` till krypterad bucket.
- För varje migration: skapa checkpoints och en rollback-skript som kan återställa snapshot.

5) Kostnadsgate
- Konfigurera Billing Alerts i GCP + webhook till slack/email.
- Ange "soft" och "hard" thresholds.
  - Soft: skicka e-post till ägare
  - Hard: pausjobben som genererar kostnad (funktioner med label "billing-sensitive").

---

## FÄRDIGA PROMPTS — CURSOR & GEMINI (KOPIERA/KLISSA)

Nedan ligger färdiga prompts som du kan köra i Cursor och Gemini. Kopiera dem som de är.

A) Cursor — Full repo-audit + riskanalys (KRAV: inga ändringar förrän plan godkänd)

```
UPPDRAG: Kör en fullständig, automatiserad audit av hela repositoryt (alla filer under root). Målet:
1) Lista alla riskfaktorer (särskilt säkerhet, data-integritet, och AI-hallucination-risk).
2) Identifiera alla Cloud Functions som anropar AI (Gemini/Vertex) och vilka som skriver till WORM/immutable collections.
3) Identifiera dubbletter och liknande funktioner som kan konsolideras.
4) Generera en prioriterad, stegvis ändringsplan (milestones) med:
   - exakta filändringar (diff/patch) för refaktorering utan logikändring
   - migration-skript (Firestore bulk-writer eller node script) för varje datamodifiering
   - testplan: unit + integration + smoke-tests att köra innan merge
   - rollback-plan för varje migration (hur återställa snapshot)
   - uppskattad tidsåtgång och risknivå per steg
5) Föreslå minimal uppsättning ändringar som ger högst kostnadsbesparing med lägst risk (t.ex. disable anonymous auth, flytta Vector Search region, caching).
6) OUTPUT ska inkludera:
   - En "master plan" markdown i repo (.context/PROPOSED_CHANGE_PLAN.md)
   - Patchfiler (git diff/patch) men INTE applicera dem
   - Checklistor för CI: lint, build, smoke, kostnads-trigger, backup, manual-approval

KRAV: Kör inte commit/merge. Svara endast med analys + patchar + plan. För varje föreslagen patch ange risk (High/Medium/Low) och vilka tests som krävs innan merge.
```

B) Cursor — Generera PR-skelett efter att analysen godkänts

```
UPPDRAG: När master plan godkänts, skapa en ny branch och generera en PR-skelett (inklusive filpatchar som i analysen). PR:n ska:
1) Inkludera migrations-script under scripts/migrations/<ticket>/
2) Lägga till smoke-tests (scripts/smoke_*.mjs) som körs av CI
3) Inkludera instruktioner för snapshot/backup före deploy
4) Markera vilka secrets som behövs i Secret Manager och vilka env-variabler ska tas bort (t.ex. VITE_VAULT_PIN)
5) Dra inte merge — PR skapas för review. Ange checklistor som måste vara gröna innan merge.

OUTPUT: Skapa branch feature/refactor-... med patchar och öppna PR (draft) mot main. PR ska vara draft och inkluderar "do not merge" label samt reviewer request till repo owner.
```

C) Gemini — Hallucination-Prevention design & validator-mall

```
UPPDRAG: Generera kodmall för groundingValidator.ts och en test-svit. Krav:
1) groundingValidator.ts: funktion validateAIOutput(generatedText, groundingSources[], threshold=70) -> { isValid, confidence, issues[], suggestions[] }
   - Extract claims (named entities, dates, facts)
   - Cross-check each claim against groundingSources (Firestore docs or vector-search hits)
   - Return confidence score (0-100) och lista med problem
2) Generera unit tests (jest) som simulerar 3 scenarion: exact match, partial match, hallucination.
3) Visa hur detta integreras i exempel-funktion (knowledgeVaultQuery eller valvChatQuery) med retry/fallback: om confidence < threshold → reroute to manual review queue (inbox_queue) and return best-effort answer with confidence flag.
4) Ge kodsnippets för att logga hallucination incidents (Firestore collection: ai_incidents/) utan exponering av PII.

OUTPUT: groundingValidator.ts + __tests__ + integration-example-patch (ej commit).
```

D) Cursor — "No-change-until-plan" policy enforcement (PR-template + CODEOWNERS)

```
UPPDRAG: Lägg till en policyfil .github/PULL_REQUEST_TEMPLATE/SYSTEM_CHANGE_CHECKLIST.md och en CODEOWNERS rad som kräver attestering från "repo owner" innan merge för alla PR som modifierar functions/src/* eller firestore.rules. Checklist bör innehålla:
- [ ] Cursor full-audit PASS
- [ ] Migration scripts present
- [ ] Backup snapshot created (link)
- [ ] Smoke tests green
- [ ] Billing alert thresholds set
- [ ] Secret manager entries created
- [ ] Manual approval by owner

OUTPUT: policyfil + PR-template patch (draft).
```

---

## PRE-DEPLOY CHECKLIST & CI-KRAV

1) Local build
- npm ci && npm run build
2) Lint
- npm run lint (konfigureras om ej existerar)
3) Unit tests
- npm test
4) Integration + smoke i emulator
- firebase emulators:start --only firestore,functions
- npm run smoke:all (i emulator)
5) Backup
- gcloud firestore export gs://<bucket>/backups/<timestamp>
6) Deploy to staging/preview
- firebase hosting:channel:deploy preview-<branch>
7) Canary (staged rollout)
- Feature flag ON för 1% eller intern test-grupp
8) Full deploy
- firebase deploy --only functions,hosting
9) Post-deploy smoke
- npm run smoke:all (against prod)

CI: GitHub Actions ska verifiera steg 1–4 på varje PR (draft) och inte tillåta merge förrän checklist är grön.

---

## REKOMMENDATIONER FÖR KVARVARANDE GOOGLE-KREDITER

- Prioritera tunga jobb under kreditperiod: embedding-reindex, reindex & migration i batch.
- Använd emulators mycket (Firestore & Functions) för att spara credits.
- Testa grounding & Gemini i Google AI Studio med gratiskvoter.
- Sätt budget-alarm innan du kör stora batcher.

---

## NÄSTA STEG

1) Kör Cursor prompt A (full audit). Få master plan och patcher.
2) Granska plan, godkänn migrationer per steg
3) Kör Cursor prompt B (PR-skelett) för första ändringen (disable anonymous auth + create PR draft)
4) Kör Gemini prompt C för groundingValidator implementation
5) Fullfölja refaktorering i små, testade steg

---

**Document Version**: 1.1  
**Last Updated**: 2026-06-06  
**Status**: Uppdaterad i branch feature/system-optimization-guide. Klar för review ✅
