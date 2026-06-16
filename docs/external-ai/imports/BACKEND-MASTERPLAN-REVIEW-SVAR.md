# Backend Masterplan Review — extern svar (Prompt G)

**Datum:** 2026-06-16  
**Källor:** Gemini Pro (pass 1), Opus 4.8 (pass 2), Gemini Pro (pass 3 — formell granskning)  
**Konsensus:** **GO för FREEZE** (alla tre)

---

## Konsensus (alla granskare)

| Punkt | Gemini (1) | Opus 4.8 | Gemini (3) |
|-------|------------|----------|------------|
| GO / NO-GO FREEZE | GO | GO | GO |
| Backend-arkitektur | Korrekt | Korrekt | Korrekt |
| Inte bygga nu | AI-assistent UI | AI-assistent UI | AI-assistent UI |
| Delad risk #1 | Cross-RAG | Cross-RAG / silo | Cross-RAG (`barnenModuleRouteGuard`) |
| Delad risk #2 | DCAP injection | Auth/session | App Check Console |
| Delad risk #3 | Auth/session | HITL | Anonym auth / email i prod |
| Smoke-luckor | Barnen, Zero Footprint, HITL | Barnen, Zero Footprint, Inkast | Hjärtat/Drogfrihet, manuell Valv/Barnen, hybrid planering |

**Tolkning:** FREEZE = lås koden, inga nya features. Gemini (3) vill att tre **P0**-punkter verifieras **innan riktig produktionsdata** — inte innan lokal test av kedjan.

---

## Pass 3 — Gemini Pro (formell granskning, 2026-06-16)

### 1. Backend-arkitektur

Korrekt att centralisera DCAP, RAG, SynapseBus och WORM i Firebase Functions (`sharedRules.ts`, `synapseBus.ts`, append-only i `firestore.rules`).

### 2. GO / NO-GO för FREEZE

**GO FOR FREEZE** — lås backend-kärnan; endast buggfixar + content ingest (KEEP).

*Nyans:* Kritiska risker ska åtgärdas/verifieras innan **faktisk bevisanalys i produktion** — inte nödvändigtvis innan lokal smoke/test.

### 3. Top 3 risker (Gemini → P0 före prod)

| # | Risk | Filvägar | Repo-status (2026-06-16) |
|---|------|----------|---------------------------|
| 1 | **Cross-RAG / U5.5** | `knowledgeVaultQuery`, `barnenModuleRouteGuard.ts` | Kod **done**; register säger "delvis" — smoke finns |
| 2 | **App Check** | `appCheck.ts`, `callableGuards.ts`, Firebase Console | Kod `APP_CHECK_ENFORCE=true` **done**; Console enforce **pending** |
| 3 | **Anonym auth / email** | `firestore.rules`, `requireEmailAuth.ts` | Prod ska ha `VITE_REQUIRE_EMAIL_AUTH=true`; rules `isSensitiveAuth` |

### 4. Top 3 smoke-luckor

1. Hjärtat (`/dagbok`) + Drogfrihet — ingen automatiserad smoke
2. Valv + Barnen — fortfarande mycket manuell smoke (USER)
3. Planering/admin/projects — hybrid-modell, inte strikt auto

### 5. Inte bygga nu

**AI-assistent UI** (DEFER).

---

## Pass 2 — Opus 4.8

### GO / NO-GO

**GO**

### Top 3 risker

1. Siloseparation / Cross-RAG — `firestore.rules`
2. Session / Auth edge-cases — `vaultSessionGate.ts`, `callableGuards.ts`, `appCheck.ts`
3. HITL bevishantering — `approveWeaverMetadata.ts`, `inkastStorageOnFinalize.ts`

### Top 3 smoke-luckor

1. Barnen-silo guard (`knowledgeVaultQuery`)
2. Session-idle + Zero Footprint
3. Inkast/metadata triggers

---

## Pass 1 — Gemini (tidigt svar)

**GO** — Cross-RAG, DCAP injection, Auth/session. Smoke: Barnen guard, HITL, Zero Footprint.

---

## Praktisk slutsats för Pontus

| Fråga | Svar |
|-------|------|
| Ska FREEZE hållas? | **Ja** — alla granskare säger GO |
| Kan du testa skärmdump → WORM → Valv-chat lokalt? | **Ja** — med ditt konto / dev-miljö |
| Innan riktig känslig prod-data? | Verifiera: App Check Console enforce, email-auth i prod-build, kör `npm run smoke:tier1` |

Extern granskning **klar**. Ingen fler uppladdning till Gemini/Opus för Prompt G.
