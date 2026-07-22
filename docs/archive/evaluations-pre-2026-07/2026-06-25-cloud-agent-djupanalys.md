# Cloud Agent djupanalys — repo-kartläggning, GAP & säker städning

**Datum:** 2026-06-25
**Plattform:** Cursor Cloud Agent
**Modell/läge:** Claude Opus 4.7 (Agent-läge)
**Branch:** `cursor/projektkartlaggning-och-stadning-44a0`
**Status:** plan + säker städning klar — riskfyllda förslag väntar på Pontus OK

**Användarens mål (sammanfattning):**
1. Analysera projektet säkert.
2. Bygg ut för **Android via Android Studio** + **webbapp på dator** primärt för att visa **Valvet/Arkivet** (alla moduler behöver inte finnas där).
3. Minimal egen insats för Pontus — låt AI-agenter göra mest.
4. Undvik onödiga månadsutgifter.
5. Följ projektets regler. Var tydlig med plattform, modell, vilka filer som ändras, och risker.
6. Först: kartlägg + plan. Sedan: bara säkra ändringar. Riskfyllda kräver godkännande.

---

## 1. Nuläge — vad finns och vad fungerar

### Tech-stack (verifierat mot `package.json`, `firebase.json`, `capacitor.config.ts`)

| Lager | Verktyg | Status |
|---|---|---|
| Frontend | React 18 + Vite 8 + Tailwind 3 + Zustand 5 + react-router 7 | byggt, deployat på Hosting |
| Backend | Firebase Functions (Node 20, west1), Firestore, Storage, Vertex/Gemini | byggt, deployat |
| Mobil | Capacitor 8 (Android) — `appId: com.livskompassen.app` | klart för G85 daily driver |
| Hosting | `https://gen-lang-client-0481875058.web.app` | live |
| Säkerhet | WORM-rules, App Check `APP_CHECK_ENFORCE=true` (kod), CMEK, WebAuthn | live, Console Enforce **avsiktligt av** |
| Tre silor | Kunskap (`kampspar`/`kb_docs`), Valv (`reality_vault`), Barnen (`children_logs`) | etablerade, ingen cross-RAG |

### Fas-status (kort)

- **Fas 1–11:** klart — sanering, app-shell, Firebase-synk, alla 6 superhubbar.
- **Fas 13–23:** klart — WORM medium, Hex P0/P2, evolution_ledger dual-write, Pansarläge, Töm Skallen, SOS, Paralys-Brytaren, Tyst Läge.
- **Fas 24 (aktiv produktvåg 1):** P0 + PV1a + PV1b + S24 + HITL1 + 23C/D/E **done**, **Android G85 7-dagars daily driver kvar**.
- **Arkiv-GAP G1–G17 + F8:** alla **done**. Endast **V1 (Genkit-migrering) wait** + **App Check Console Enforce defer**.

**Slutsats:** appen är arkitektur-mässigt mogen och deployad. Återstående jobb är **driftverifiering + polish** snarare än ny funktionalitet.

---

## 2. Hittade förbättringar och teknisk skuld

### A. Säker städning (gör nu, ingen risk)

Följande filer är **committade men oanvända** — verifierat med kodsökning:

| Fil | Storlek | Varför borta? |
|---|---|---|
| `tsconfig (kopia).app.json` | 1 KB | Mac Finder-dubblett av `tsconfig.app.json`, äldre version saknar `ignoreDeprecations` + `shared/patterns`/`evolution`/`adaptation` |
| `delete_v1.mjs` | 0,7 KB | Engångsskript för att radera v1 functions — G4 done sedan 2026-05-22 (0 v1 kvar) |
| `extract.py` | 0,7 KB | Hårdkodad `/Users/Livskompassen/.gemini/...`-path; fungerar bara på Pontus Mac |
| `extracted_responses.txt` | 8 KB | Output från `extract.py`; analysen lever vidare i andra evals |
| `test_plan.txt` | 0,5 KB | 4-radig anteckning om `/avancerad-ekonomi`-route; redan implementerad i `AppRoutes` |
| `test-dock.css` | 6 KB | Mockup-CSS märkt `MOCKUP GLASSMORPHIC`, **ingen** import i kod |
| `google-cloud-cli-darwin-arm.tar.gz` | **59 MB** | Mac-binär av gcloud SDK — redan listad i `.gitignore` (`google-cloud-cli*.tar.gz`) men committad innan ignore lades till |
| `npm` | 0 B | Tom fil — sannolikt felaktigt skapad via `> npm` redirect |
| `~/Downloads/gen-lang-client-0481875058-xxxx.json` | 0 B | **Tomt** placeholder från Mac-Finder; namnet matchar Firebase-projektet men innehållet är 0 byte → **inga credentials läckte**. Hela `~/`-mappen är felplacerad och bör bort. |

**Vinst:** -60 MB i repo + tydligare projekt-rot. **Risk:** ingen — inga referenser i kod.

### B. Möjligen-känslig data (KRÄVER PONTUS OK — frågar innan)

| Fil/mapp | Storlek | Riskbedömning |
|---|---|---|
| `narcissistisk förälder/` (root) | 24 MB | RTF + PNG-bilder med beteendeanalyser och guider om dold narcissism. Detta är **PII** kring familjekonflikten. Repo-policyn (`.gitignore`) säger redan att `docs/archive/drive-backup/` ska bort av PII-skäl — denna mapp ligger oavsiktligt på roten. **Förslag:** flytta till `docs/archive/drive-backup/narcissistisk-foralder/` (gitignored) eller helt utanför repo. **Kräver din OK** eftersom flytt påverkar ev. referenser och git-historik. |
| `Livskompassen_System_Blueprint.pdf` (root, 9,4 MB) | 9,4 MB | Stor binär på roten. Bör flyttas till `docs/specs/` eller utanför repo. **Kräver din OK** för att inte bryta länkar. |
| `exportedData/` (4,1 MB) | 4,1 MB | Firebase emulator-export (auth_export, firestore_export m.fl.). Bör vara `.gitignore`. **Kräver din OK** — kan innehålla testdata med riktiga UIDs. |

### C. Defer / backlog (befintliga, redan registrerade)

| ID | Beskrivning | Var det spåras |
|---|---|---|
| **App Check Console Enforce** | Aktivera i Firebase Console (kod redan fail-closed) | `MODUL-GAP-OVERSIKT.md` — *valfritt extra lager* |
| **Android G85 daily driver 7d** | Manuell test på Motorola G85 | Fas 24 P0 |
| **Hex P2 (Barnporten + Dossier print)** | Markerad **done** 2026-06-15 men nästa-listad i `SENASTE-SAMMANFATTNING` | dubbelkolla |
| **M3.0-C Fitness/Näring** | PMIR + masterplan defer | masterplan |
| **V1 Genkit-migrering** | wait — beslut: ej migrera | GAP-register |

### D. Webbapp på dator för Valv/Arkiv (ditt mål)

**Bra nyhet:** `/valvet`-routen finns redan, deployad på Hosting, med tabs för Mönster, Orkester, Kunskapsbank, Dossier. Layouten är dock **mobile-first**.

**Frågor till dig (inte ändringar):**
1. Räcker det att vi **förbättrar desktop-layouten** på `/valvet` (t.ex. bredare grid, sidopanel för filtrering)? Eller vill du ha **separat desktop-route** typ `/valvet/desktop`?
2. Vilka delar av Valv ska vara synliga på dator: bara läsa bevis/Mönster/Dossier, eller även Inkast och Barnen?
3. Ska desktop-läget vara **read-only** (titta-på-arkivet-fönster) eller även tillåta WORM-create?

**Min rekommendation (default):** Bygga **read-only desktop-vy** på existerande `/valvet`-route med Tailwind responsiva breakpoints (`lg:`/`xl:`) — ingen ny route, ingen ny rules-ändring, ingen extra månadskostnad. Detta är ett klassiskt zon-builder-jobb (`specialist-valv-builder`) som AI-agent kan göra autonomt efter Pontus OK.

---

## 3. Kostnadsfilosofi (mot dina regler)

Projektet följer redan governance-regeln "GRATIS FÖRST". Aktuella kostnadsdrivare:

| Tjänst | Kostnadsrisk | Status |
|---|---|---|
| Firestore reads/writes | Skala-till-noll fungerar | OK |
| Cloud Functions invocations | west1, on-demand | OK |
| Vertex AI (Gemini) | per-token | begränsas av callable-rate-limits + DCAP före LLM |
| Vector Search ANN endpoint | **fast kostnad ~$0.45/h** = ~$11/dag = ~$330/månad | **VIKTIGT** — kontrollera i `GCP-INVENTORY-LATEST.md` |
| Cloud Storage WORM | 30d retention på `livskompassen-knowledge-vault-worm` | OK |

**Förslag (kräver din OK):** verifiera om Vector Search-endpointen är aktivt deployad eller pausad. Om den är på och oanvänd när du inte använder Kunskapsvalvet kan vi spara ~$300/månad genom att un-deploya och re-deploya vid behov. Detta är inte en städning jag kan göra utan ditt godkännande — det stänger Kunskapsvalv-RAG temporärt.

---

## 4. Plan — vad gör vi och vem gör det

### Vad jag gör nu (säkert, denna PR)

1. **Städning A** — ta bort 9 oanvända filer/mappar (~60 MB).
2. **`.gitignore`-uppdatering** — lägg till `exportedData/`, `~/`, `npm` så de inte committas igen.
3. **Skriv denna analys** + lägg den i `docs/evaluations/`.
4. **Verifiera bygg** efter städning (lint passerar; bygge utan ny `.env` förväntas misslyckas — det är inte städ-relaterat).

### Vad jag inte rör utan din OK (riskfyllt)

1. Flytta/ta bort `narcissistisk förälder/`-mappen (PII).
2. Flytta `Livskompassen_System_Blueprint.pdf` till `docs/specs/`.
3. Lägga `exportedData/` i `.gitignore` **och** `git rm --cached`.
4. Bygga ut desktop-vy för Valv på dator (kräver SPEC + zon-builder-pass).
5. Pausa Vector Search ANN-endpoint för att spara pengar.
6. Aktivera App Check Console Enforce.

### Föreslagen nästa-steg-ordning (du behöver bara säga ett ord)

| # | Säg detta | Effekt |
|---|---|---|
| 1 | "Flytta narcissist-mappen och blueprint-PDF" | Jag flyttar PII-mapp till gitignored plats + PDF till `docs/specs/` |
| 2 | "Bygg Valv desktop-vy" | Jag öppnar PMIR + zon-builder för read-only desktop-layout på `/valvet` |
| 3 | "Pausa vector search för att spara" | Jag kör `gcloud aiplatform index-endpoints undeploy-index` (efter du verifierat fakturan) |
| 4 | "Kör Android G85 testpass" | Jag öppnar `android-kompis`-subagent för 7-dagars daily driver-checklista |

---

## 5. Risker + säkerhetsnotering

- **Inga riktiga credentials läckte:** `~/Downloads/gen-lang-client-0481875058-xxxx.json` är 0 byte (verifierat med `wc -c`). Tom placeholder från Mac-Finder.
- **PII i repo:** `narcissistisk förälder/` är ett **kvarstående riskfyll**. Den är committad till git-historik — även om vi tar bort filen i HEAD finns den kvar i historiken. Om repot någonsin görs publikt måste vi göra `git filter-repo` (kräver explicit beslut).
- **Inga LLM-prompts utanför `sharedRules.ts`** — verifierat under genomgång.
- **Sacred Features intakta:** Verklighetsvalvet, Sanningens Sköld, Morgonkompassen, Dossier-Generator, Speglings-Systemet, Draft Layer, Device Clear — inga ändringar i denna PR.

---

## 6. Färdig prompt (om du vill ge nästa steg till en AI-agent)

> **Prompt för Cursor:** Läs `docs/evaluations/2026-06-25-cloud-agent-djupanalys.md` §4 "Vad jag inte rör utan din OK". Pontus har godkänt punkt **<välj 1–4>**. Genomför **endast** den punkten. Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda. Följ `.cursorrules`, `grunder-kanon.mdc`, `planering-kanon-guard.mdc` och `yolo-vakt-gate.mdc`.

---

**Slut.** Inga moduler ändrade. Inga rules ändrade. Endast städning + denna eval. Status `closed` när du säger något av nästa-stegen ovan.
