# Gemini Dashboard — funktionslås (inkorg → kanon)

**Status:** LÅST SOM KRAV (inkorg 2026-05-22) — ej implementerat i full omfattning  
**Källor:** [`docs/evaluations/2026-05-22-inkorg-gemini-dashboard-funktioner.md`](../../evaluations/2026-05-22-inkorg-gemini-dashboard-funktioner.md)  
**Skärmdumpar:** [`docs/evaluations/artifacts/screenshots-gemini-dashboard-2026-05-22/`](../../evaluations/artifacts/screenshots-gemini-dashboard-2026-05-22/)  
**Färger:** Följ `docs/specs/design-master.md` (Obsidian Calm) — Gemini-färger är **inte** låsta.

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

**Repo idag:** Delvis — `KasamEvening`, `compassAdaptiveCards`, `/mabra` akut. **GAP:** global header på alla L1.

---

## F-02 — Kompassråd för dagen

**Skärm:** `02-kompassrad-dagen.png`

| Krav | Detalj |
|------|--------|
| F-02.1 | Ett kort med **dagens råd** (lågaffektivt, max ~2 meningar). |
| F-02.2 | Fasta **taggar/chips:** `BIFF`, `Ingen JADE`, `Parallellt föräldraskap` (påminnelse, inte klickbara essays). |
| F-02.3 | Råd får bytas av tid på dygn / kognitiv skala — deterministisk lista eller checkin, inte fri LLM på hem. |

**Repo idag:** Delvis — `HomeHeroCompass`, `AdaptiveMemoryCards`, Kompasser-flöden.

---

## F-03 — Stress-översikt med L3-flikar (inte ny L1-dock)

**Skärm:** flera (tab-rad synlig på 01, 07, 08)

| Flik | Funktion | Route-mål i repo |
|------|----------|------------------|
| Översikt | F-01 + F-02 + ingångar | `/` eller ny `/oversikt` **eller** överst på `/familjen` |
| BIFF-Sköld | Hamn-flöde | `/hamn` |
| Vagus-Andning | Andning | `/mabra` (hub panic_rsd) |
| Korsreferens | WORM-sök + logg | Valv + ev. barnlogg **silo-säkrat** |
| Barnfokus | F-04 + F-05 + F-06 | `/familjen` |

**Låsning:** Max **en** TabBar per L1-kluster. Denna rad är **L3** under “Trygg hamn / Familjen” eller en samlad “Översikt”-modul — **inte** parallell med `navigation-master` L2 för Hjärtat/Vardagen.

---

## F-04 — Barnfokus: profilkort Arvid & Kasper

**Skärm:** `03-barnfokus-banner.png`, `04-barn-profilkort-arvid-kasper.png`

| Krav | Detalj |
|------|--------|
| F-04.1 | Banner: “Barnfokus: Den trygga hamnen” + kort föräldraskaps-copy (Grey Rock/parallel parenting). |
| F-04.2 | **Två kort** — Arvid, Kasper — med initial, underrubrik (Trygghet/Utveckling vs Lekfullhet/Glädje). |
| F-04.3 | 2–3 **observationspunkter** + en **Fokus-rad** (⭐, ett verbalt mikrosteg). |
| F-04.4 | Data: seed/profil (Firestore entity profile eller statisk seed JSON) — **inte** LLM-genererat vid varje load. |

**Repo idag:** `CHILD_ALIASES`, `BarnensPage` logg — **GAP:** profilkort-UI och fokusrad.

---

## F-05 — Mina positiva minnesankare

**Skärm:** `05-minnesankare-lista.png`, `06-minnesankare-paminnelse.png`

| Krav | Detalj |
|------|--------|
| F-05.1 | Lista **positiva stunder** (text + relativ tid: Idag/Igår/…). |
| F-05.2 | Inmatning + “Spara ankare” — **ett fält**, ett steg. |
| F-05.3 | **Skild från WORM-bevis** — känslomässig återhämtning, inte juridisk valvtext. Får ligga i `journal` eller ny collection `memory_anchors` med **egen** retention/PII-regel (dokumentera i security vid implementation). |
| F-05.4 | Ingen cross-RAG till Kunskap/Valv-Chat/Barnen-agenter. |

**Repo idag:** **GAP** — finns inte som modul.

---

## F-06 — Påminnelse (validering)

**Skärm:** `09-paminnelse-dig.png` (även footer i 06)

| Krav | Detalj |
|------|--------|
| F-06.1 | Statisk eller sällan roterad **valideringsruta** under Barnfokus/minnesankare. |
| F-06.2 | Copy ska vara klinisk/lågaffektiv — ingen skuld, ingen JADE. |

**Repo idag:** **GAP** som dedikerad komponent; copy kan ligga i `constants` / entity profile.

---

## F-07 — Korsreferens / Oföränderliga Verklighetsvalvet (WORM)

**Skärm:** `07-worm-korsreferens.png`

| Krav | Detalj |
|------|--------|
| F-07.1 | Sökfält + **snabbfilter** (Skola, Sömn, Hämtning). |
| F-07.2 | Lista **SÄKRAD POST** med datum, titel, monospace-lik fakta, taggar. |
| F-07.3 | Verklighetskontroll-text när träffar finns (mot gaslighting) — faktabaserad, inte terapi. |
| F-07.4 | Läser `reality_vault` + ev. `children_logs` — **server/silo-guard**, ingen klient-only mock. |

**Repo idag:** Delvis — `VaultPage`, `valv_chatt`, `VaultLogList`; **GAP:** enhetlig korsreferens-vy + barnlogg i samma UI.

---

## F-08 — Säkra nytt minnesbevis (WORM-skriv)

**Skärm:** `08-worm-nytt-bevis-form.png`

| Krav | Detalj |
|------|--------|
| F-08.1 | Rubrik + brödtext — **objektiva fakta**, placeholder mot känslotolkning. |
| F-08.2 | CTA “Lås inlägg i Valvet” → `saveVaultLog` / WORM, **inte** toast-mock. |
| F-08.3 | Efter spar: post visas som F-07.2 med OFÖRÄNDERLIG-markering. |

**Repo idag:** Delvis — `VaultEntryForm`, `assertWormPayload`.

---

## Sacred / säkerhet (oförhandlingsbart)

- WORM: `reality_vault` create-only, inga UI som låtsas låsa utan Firestore.
- BIFF: `analyzeMessage` + DCAP — inte lokal `setBiffDrafts`.
- Barnen-RAG: **ingen** Grey Rock/BIFF i barnen-modulen (`barnenModuleRouteGuard`).
- Zero Footprint: känsliga fält rensas vid blur/logout.

---

## Implementeringsordning (förslag — ett steg i taget)

| Prio | ID | Varför |
|------|-----|--------|
| P0 | F-08, F-07 | Sacred Valv + bevis redan nära |
| P0 | F-03 flikar → routes | Tydlig navigation utan ny dock |
| P1 | F-04 | Familjen — kärna för användaren |
| P1 | F-05, F-06 | Ny datamodell — kräver security-spec |
| P2 | F-01, F-02 | Header + råd på hem |

---

## Kod från användaren?

**Behövs inte** för att **låsa funktioner** — skärmdumpar + denna fil räcker.  
**Skicka kod** om Gemini gav en **andra** `App.tsx` för dashboard/flikar — då arkiveras som [`artifacts/`](../../evaluations/artifacts/) + diff mot befintlig prototyp.

**Nästa:** `kör UX-inkorg-analys` eller `implementera F-04 profilkort i /familjen`.
