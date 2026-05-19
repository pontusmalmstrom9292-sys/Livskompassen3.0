# ARKITEKTUR_BESLUT — Beslutsmatris (Livskompassen PROD)

Fyll i **Beslut** och **Status** när varje punkt är diskuterad.  
Markera steg `[x]` endast efter ditt uttryckliga godkännande och efter git-push enligt `GIT_WORKFLOW.md`.

**Senast uppdaterad:** 2026-05-19  
**Ansvarig:** Pontus  
**Steg 0 commit:** `7b75f64` (godkänt och sparat lokalt)

---

## Steg 0 — Repository & styrning

| ID | Fråga | Alternativ | Beslut | Status |
|----|-------|------------|--------|--------|
| 0.1 | Aktiv produktionsmapp | Livskompassen_PROD | **Livskompassen_PROD** | [x] |
| 0.2 | Legacy (v2, 2.0, cursor) | Referens / arkiv / ignorera | **Referens endast** | [x] |
| 0.3 | Konfliktkarta | `.cursorrules` | **Aktiv** | [x] |
| 0.4 | GitHub remote | URL | _väntar — se `GITHUB_SETUP.md`_ | [ ] |

---

## Steg 1 — Datamodell (vertikal skärva 1)

| ID | Fråga | Alternativ | Beslut | Status |
|----|-------|------------|--------|--------|
| 1.1 | Ägarfält i Firestore | `userId` / `ownerId` | _ | [ ] |
| 1.2 | Vault collection-path | `/vault/{id}` / `users/{uid}/vault/{id}` | _ | [ ] |
| 1.3 | CheckIn path | `/checkins/{id}` / nestat under user | _ | [ ] |
| 1.4 | Kampspår (kanonisk) | `users/{uid}/kampspar` / annat | _ | [ ] |
| 1.5 | `reality_vault` vs `vault` | En collection / två syften | _ | [ ] |
| 1.6 | `firebase-blueprint.json` | Rot / under `config/` | _ | [ ] |
| 1.7 | Data Connect | Avvakta / ersätt Movie-schema | _ | [ ] |

**Godkännande steg 1:** _datum_ — **Git tag/commit:** _hash_

---

## Steg 2 — Säkerhet (vertikal skärva 2)

| ID | Fråga | Alternativ | Beslut | Status |
|----|-------|------------|--------|--------|
| 2.1 | Vault-skrivning | Callable Function / Admin API | _ | [ ] |
| 2.2 | `server.js` legacy | Arkivera / radera | _ | [ ] |
| 2.3 | `notifyNewFile` | Auth secret / App Check / avveckla | _ | [ ] |
| 2.4 | WebAuthn challenges | Firestore / Redis | _ | [ ] |
| 2.5 | E-postverifiering i rules | Ja / Nej | _ | [ ] |
| 2.6 | GCP-projekt-ID (kanonisk) | `gen-lang-client-…` / annat | _ | [ ] |

**Godkännande steg 2:** _datum_ — **Git tag/commit:** _hash_

---

## Steg 3 — Agent-runtime (vertikal skärva 3)

| ID | Fråga | Alternativ | Beslut | Status |
|----|-------|------------|--------|--------|
| 3.1 | Enda runtime | `functions/` only | _ | [ ] |
| 3.2 | `spejaren.js` | `_archive/` / radera | _ | [ ] |
| 3.3 | `agentEngine.ts` | Anropa `analyzeMessage` / ta bort | _ | [ ] |
| 3.4 | `aiRoutes.ts` Express | Avveckla / dev-only | _ | [ ] |
| 3.5 | Prompts i `sharedRules.ts` | Flytta Kompis + DCAP | _ | [ ] |
| 3.6 | A2A-dokumentation | "Partiell" tills executors finns | _ | [ ] |

**Godkännande steg 3:** _datum_ — **Git tag/commit:** _hash_

---

## Steg 4 — SDK & region (vertikal skärva 4)

| ID | Fråga | Alternativ | Beslut | Status |
|----|-------|------------|--------|--------|
| 4.1 | Gemini SDK | `@google/genai` only | _ | [ ] |
| 4.2 | Functions-region | `europe-west1` | _ | [ ] |
| 4.3 | Frontend Functions-region | Matcha backend | _ | [ ] |
| 4.4 | Modell (produktion) | `gemini-1.5-pro` / annat | _ | [ ] |
| 4.5 | Migrera `vertexai` i DCAP/cache | Ja / Nej / senare | _ | [ ] |

**Godkännande steg 4:** _datum_ — **Git tag/commit:** _hash_

---

## Steg 5 — Frontend (vertikal skärva 5)

| ID | Fråga | Alternativ | Beslut | Status |
|----|-------|------------|--------|--------|
| 5.1 | UI-källa | Merge från livskompassen-v2 | _ | [ ] |
| 5.2 | Design | GEMINI Obsidian/Nordic Dusk | _ | [ ] |
| 5.3 | State | Zustand | _ | [ ] |
| 5.4 | `geminiService` mock | Ersätt med Functions | _ | [ ] |
| 5.5 | Macro-Dock + Kompass-filter | Implementera enligt GEMINI §7 | _ | [ ] |

**Godkännande steg 5:** _datum_ — **Git tag/commit:** _hash_

---

## Steg 6 — Arkiv & dokumentation (vertikal skärva 6)

| ID | Fråga | Alternativ | Beslut | Status |
|----|-------|------------|--------|--------|
| 6.1 | Legacy-kod | `_archive/` mapp | _ | [ ] |
| 6.2 | Postman collection | Uppdatera / ta bort | _ | [ ] |
| 6.3 | `.context/` från v2 | Kopiera till PROD | _ | [ ] |
| 6.4 | `system_plan.md` | Synka med steg ovan | _ | [ ] |

**Godkännande steg 6:** _datum_ — **Git tag/commit:** _hash_

---

## REASONS-logg (större beslut)

| Datum | Steg | Sammanfattning | Safeguards |
|-------|------|----------------|------------|
| | | | |

---

## Snabbreferens: "Vem vinner"

Se `.cursorrules` §4. Vid konflikt under implementation: **GEMINI** > legacy-kod; **functions/** > andra agentspår; **blueprint + rules** måste vara synkade före klient-release.
