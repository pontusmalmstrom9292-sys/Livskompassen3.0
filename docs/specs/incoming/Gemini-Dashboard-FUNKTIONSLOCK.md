# Gemini Dashboard — funktionslås (inkorg → kanon)

**Status:** LÅST SOM KRAV · **runtime synkad 2026-05-23** (F-01–F-08 PASS/DELVIS i kod)  
**Källor:** [`docs/evaluations/2026-05-22-inkorg-gemini-dashboard-funktioner.md`](../../evaluations/2026-05-22-inkorg-gemini-dashboard-funktioner.md)  
**Skärmdumpar:** [`docs/evaluations/artifacts/screenshots-gemini-dashboard-2026-05-22/`](../../evaluations/artifacts/screenshots-gemini-dashboard-2026-05-22/)  
**Färger:** Följ `docs/specs/design-master.md` (Obsidian Calm) — Gemini-färger är **inte** låsta.

### Statusöversikt

| ID | Status | Notering |
|----|--------|----------|
| F-01 | **PASS** | Header alla L1 + Safe Mode |
| F-02 | **PASS** | Hem + Familjen översikt |
| F-03 | **PASS** | L3 TabBar `/familjen` |
| F-04 | **PASS** | Profilkort seed |
| F-05 | **PASS** | `memory_anchors` WORM |
| F-06 | **PASS** | `ValidationReminder` i minnesankare |
| F-07 | **PASS** | `VaultCrossReference` |
| F-08 | **PASS** | `VaultEntryForm` wormLock |

---

## Princip

| Låst | Ej låst |
|------|---------|
| Funktion, copy-struktur, datatyper, WORM/silo-regler | Exakta hex, emoji, 5-ikon dock som L1 |
| L3-flikar **inuti** ett livsområde eller dedikerad “Stress-översikt” | Andra TabBar på samma nivå som Hjärtat/Vardagen L2 |
| Kasper + Arvid som enda barnprofiler | Mock-checkbox-WORM |

---

## F-01 — Statusrad (kognitiv laddning + KASAM-läge)

**Skärm:** `01-dashboard-oversikt.png`

| Krav | Detalj |
|------|--------|
| F-01.1 | Skala **1–5** “Kognitiv laddning just nu” — ett tryck, sparas session/lokalt (ej prestationsgraf). |
| F-01.2 | Indikator **“Extrem trötthet”** vid hög belastning → triggar reducerad UI (Safe Mode-lik), inte bara text. |
| F-01.3 | **KASAM-läge** väljare (t.ex. “Trygg Hamn-läge”) kopplat till befintlig KASAM-kväll / hanterbarhet — inte ny agent-RAG. |

**Repo (PASS):**

| Krav | Bevis |
|------|-------|
| F-01.1 | `src/modules/core/cognitive/CognitiveLoadBar.tsx:29-44` — skala 1–5, `setCognitiveLoad` |
| F-01.2 | `src/modules/core/cognitive/cognitiveLoadStorage.ts:51` — nivå 4–5 → `safeMode`; `MainLayout.tsx:42` — `app-layout--safe-mode`; `HomePage.tsx:21-27` — döljer ClusterGrid |
| F-01.3 | `CognitiveLoadBar.tsx:53-65` — `KASAM_MODES` select; koppling `KasamEvening` / kompasser via store |

**Global header:** `MainLayout.tsx:56-58` — `CognitiveLoadBar` i `app-header__cognitive` på alla routes (inkl. mobil, `compact`-variant).

---

## F-02 — Kompassråd för dagen

**Skärm:** `02-kompassrad-dagen.png`

| Krav | Detalj |
|------|--------|
| F-02.1 | Ett kort med **dagens råd** (lågaffektivt, max ~2 meningar). |
| F-02.2 | Fasta **taggar/chips:** `BIFF`, `Ingen JADE`, `Parallellt föräldraskap` (påminnelse, inte klickbara essays). |
| F-02.3 | Råd får bytas av tid på dygn / kognitiv skala — deterministisk lista eller checkin, inte fri LLM på hem. |

**Repo (PASS):**

| Krav | Bevis |
|------|-------|
| F-02.1–2 | `DailyCompassAdvice.tsx:10-22` — kort + `COMPASS_DAY_CHIPS` |
| F-02.3 | `dailyCompassTips.ts:24` — `getDailyCompassTip(load)` deterministiskt; `HomePage.tsx:18`; `FamiljenOversiktPanel.tsx:26` |

---

## F-03 — Stress-översikt med L3-flikar (inte ny L1-dock)

**Skärm:** flera (tab-rad synlig på 01, 07, 08)

| Flik | Funktion | Route-mål i repo |
|------|----------|------------------|
| Översikt | F-01 + F-02 + ingångar | `/familjen` (default) |
| BIFF-Sköld | Hamn-flöde | `/hamn` (extern från TabBar) |
| Vagus-Andning | Andning | `/mabra` (extern) |
| Korsreferens | WORM-sök + logg | `/familjen?tab=korsref` |
| Barnfokus | F-04 + F-05 + F-06 | `/familjen?tab=barnfokus` |

**Låsning:** Max **en** TabBar per L1-kluster. Denna rad är **L3** under Familjen — **inte** parallell med `navigation-master` L2.

**Repo (PASS):** `familjenTabs.tsx:4-13` — `FAMILJEN_TABS`; `FamiljenPage.tsx:37-50` — `TabBar` + paneler; externa flikar → `navigate('/hamn'|'\/mabra')` (`FamiljenPage.tsx:21-23`).

---

## F-04 — Barnfokus: profilkort Arvid & Kasper

**Skärm:** `03-barnfokus-banner.png`, `04-barn-profilkort-arvid-kasper.png`

| Krav | Detalj |
|------|--------|
| F-04.1 | Banner: “Barnfokus: Den trygga hamnen” + kort föräldraskaps-copy (Grey Rock/parallel parenting). |
| F-04.2 | **Två kort** — Arvid, Kasper — med initial, underrubrik (Trygghet/Utveckling vs Lekfullhet/Glädje). |
| F-04.3 | 2–3 **observationspunkter** + en **Fokus-rad** (⭐, ett verbalt mikrosteg). |
| F-04.4 | Data: seed/profil (Firestore entity profile eller statisk seed JSON) — **inte** LLM-genererat vid varje load. |

**Repo (PASS):** `BarnfokusBanner.tsx`; `ChildProfileCards.tsx`; `childProfiles.ts:11` — statisk seed; `FamiljenPage.tsx:44-45`.

---

## F-05 — Mina positiva minnesankare

**Skärm:** `05-minnesankare-lista.png`, `06-minnesankare-paminnelse.png`

| Krav | Detalj |
|------|--------|
| F-05.1 | Lista **positiva stunder** (text + relativ tid: Idag/Igår/…). |
| F-05.2 | Inmatning + “Spara ankare” — **ett fält**, ett steg. |
| F-05.3 | **Skild från WORM-bevis** — känslomässig återhämtning, inte juridisk valvtext. Collection `memory_anchors` med egen retention/PII-regel. |
| F-05.4 | Ingen cross-RAG till Kunskap/Valv-Chat/Barnen-agenter. |

**Repo (PASS):**

| Krav | Bevis |
|------|-------|
| F-05.1–2 | `MemoryAnchorsPanel.tsx` — lista + spara |
| F-05.3 | `firestore.rules:33-41` — append-only; `.context/security.md` § memory_anchors |
| F-05.4 | Ingen RAG-callable för `memory_anchors` — endast klient CRUD |

---

## F-06 — Påminnelse (validering)

**Skärm:** `09-paminnelse-dig.png` (även footer i 06)

| Krav | Detalj |
|------|--------|
| F-06.1 | Statisk eller sällan roterad **valideringsruta** under Barnfokus/minnesankare. |
| F-06.2 | Copy ska vara klinisk/lågaffektiv — ingen skuld, ingen JADE. |

**Repo (PASS):** `ValidationReminder.tsx:13`; renderas i `MemoryAnchorsPanel.tsx:118` under barnfokus-fliken.

---

## F-07 — Korsreferens / Oföränderliga Verklighetsvalvet (WORM)

**Skärm:** `07-worm-korsreferens.png`

| Krav | Detalj |
|------|--------|
| F-07.1 | Sökfält + **snabbfilter** (Skola, Sömn, Hämtning). |
| F-07.2 | Lista **SÄKRAD POST** med datum, titel, monospace-lik fakta, taggar. |
| F-07.3 | Verklighetskontroll-text när träffar finns (mot gaslighting) — faktabaserad, inte terapi. |
| F-07.4 | Läser `reality_vault` + ev. `children_logs` — **ägare-scopad** klientläsning, ingen mock. |

**Repo (PASS):** `VaultCrossReference.tsx:68` — F-07 + F-08; `VaultPage.tsx` flik Korsreferens; Valv-Chat på Sök-flik separat.

---

## F-08 — Säkra nytt minnesbevis (WORM-skriv)

**Skärm:** `08-worm-nytt-bevis-form.png`

| Krav | Detalj |
|------|--------|
| F-08.1 | Rubrik + brödtext — **objektiva fakta**, placeholder mot känslotolkning. |
| F-08.2 | CTA “Lås inlägg i Valvet” → `saveVaultLog` / WORM, **inte** toast-mock. |
| F-08.3 | Efter spar: post visas som F-07.2 med OFÖRÄNDERLIG-markering. |

**Repo (PASS):** `VaultEntryForm.tsx` — `variant="wormLock"`; `saveVaultLog` + `assertWormPayload` (`src/modules/core/firebase/firestore.ts`).

---

## Sacred / säkerhet (oförhandlingsbart)

- WORM: `reality_vault` create-only, inga UI som låtsas låsa utan Firestore.
- BIFF: `analyzeMessage` + DCAP — inte lokal `setBiffDrafts`.
- Barnen-RAG: **ingen** Grey Rock/BIFF i barnen-modulen (`barnenModuleRouteGuard`).
- Zero Footprint: känsliga fält rensas vid logout (`SafeHarborPage.tsx:52` unmount wipe).

---

## Implementeringsordning (historik — klart 2026-05-23)

| Prio | ID | Status |
|------|-----|--------|
| P0 | F-07, F-08 | **done** |
| P0 | F-03 | **done** |
| P1 | F-04, F-05, F-06 | **done** |
| P2 | F-01, F-02 | **done** |

**Nästa säkerhet (ej UX):** [`G17-Server-PIN-WebAuthn-GAP.md`](../modules/G17-Server-PIN-WebAuthn-GAP.md) — `kör [GAP]` när du vill server-PIN.

**Nästa verifiering:** [`docs/SMOKE_CHECKLIST.md`](../../SMOKE_CHECKLIST.md) #11–20 (telefon/prod).

---

## Kod från användaren?

**Behövs inte** för funktionslås — skärmdumpar + denna fil räcker.  
**Skicka inte** `gemini-dashboard-interactive-App.tsx` till `src/App.tsx` — integrera i befintliga moduler.
