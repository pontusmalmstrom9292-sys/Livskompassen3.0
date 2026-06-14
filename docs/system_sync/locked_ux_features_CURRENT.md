# Locked UX Features (låsta — får inte tas bort)

**Status:** Låst 2026-05-23. Ändring kräver explicit produktbeslut i commit/PR.

Dessa är **inte** Sacred Features i säkerhetslagret, men de är **låsta produktflöden** för trygg hamn (Barnen) och Pansaret (Valv). Agent och refaktor får inte ta bort, döpa om eller gömma dem utan att uppdatera denna fil och smoke.

---

## 1. Barnfokus-frågor (Familjen / Barnen — ev. «Middagsfrågan»)

| | |
|---|---|
| **Route** | `/familjen?tab=reflektion` → `FamiljenPage` → `FamiljenInputSuperModule` (läge `barnfokus`) |
| **Syfte** | Roterande frågor (roligt, kunskap, knas, lära känna, utveckling, valv-bank) → minneslista |
| **Kod** | `FamiljenBarnfokusDelegate.tsx`, `barnfokusQuestionForToday`, `BARNFOKUS_QUESTIONS`, `category: 'barnfokus'` |
| **Spec** | `docs/design/FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md` · [`docs/specs/Familjen-INPUT-SUPERHUB-SPEC.md`](../docs/specs/Familjen-INPUT-SUPERHUB-SPEC.md) |
| **Krav** | Knapp **Spara till {barn}s logg**; **Annan fråga**; optimistisk minneslista; **inte** enbart middag-rubrik |
| **Smoke** | `npm run smoke:locked-ux` · manuell #19 |

---

## 2. Pansaret — Mönster & Orkester (Valv-baksida)

| | |
|---|---|
| **Route** | `/valvet?vaultTab=…` → `VaultPage` (PIN/WebAuthn) · legacy `/dagbok?tab=bevis` redirect |
| **Zoner** | **Samla** · **Analysera** · **Kunskap** · **Exportera** · **Forensik** — [`VALV-HUBB-SPEC.md`](../docs/design/VALV-HUBB-SPEC.md) |
| **Flikar** | **Arkiv** · **Granska inkommande** · **Mönster** · **Meddelanden eller SMS-analys** (`vaultTab=orkester`) · **Dossier** · **Kunskapsbank** · **Personer i ärendet** |
| **Mönster** | `VaultMonsterPanel` + `buildVaultFrequencyReport` (deterministisk regex, ingen LLM-sanning) |
| **Meddelanden / SMS-analys** | `VaultOrkesterPanel` + `PRODUCT_AGENTS` + SMS-tråd → `analyzeMessage` (flik-ID `orkester` oförändrat) |
| **Kunskapsbank** | `VaultKunskapsbankPanel` — `KunskapPage` + `FamiljenKunskapHubTab` (U1 silos) |
| **Aktörskarta (G9)** | `VaultAktorskartaPanel` + `EntityAddForm` + `addEntityProfile` — manuella personer, append-only metadata för agenter (ej RAG, ej publik meny) |
| **Smoke** | `npm run smoke:locked-ux` · `npm run smoke:entities` · manuell #20 i `docs/SMOKE_CHECKLIST.md` |

---

## 3. Planering + Projekt (design låst — hybrid)

| | |
|---|---|
| **Beslut** | [`docs/design/PLANERING-PROJEKT-HYBRID.md`](../docs/design/PLANERING-PROJEKT-HYBRID.md) |
| **Handling (fast)** | P3 Kanban ATT GÖRA · VÄNTAR · KLART — `/planering` |
| **Projekt (flex)** | Lista, anteckning, bild, egna planeringar — `/projekt` |
| **Widget** | v2 [`galleri/widget/v2/W1-kompakt-projekt.png`](../docs/design/galleri/widget/v2/W1-kompakt-projekt.png) |
| **Spec** | `PROJEKT-SPEC.md`, `PLANERING-P3-KANBAN-SPEC.md`, `WIDGET-BAR-SPEC.md` |
| **Smoke** | Hybrid-spec + kanon-PNG finns |

---

## 4. Planeringssidan (äldre register — se §3 hybrid)

| | |
|---|---|
| **Route (plan)** | `/planering` |
| **Spec** | `docs/design/PLANERINGSSIDA-SPEC.md`, mockups `docs/design/planering/` |
| **Krav** | P1–P4 + Projekt; e-postregler `planning_email_rules`; **inte** ex-brus hit |
| **Smoke** | Spec-fil + nyckelsträngar i `smoke_locked_ux.mjs` |

---

## 5. Fyren Edge — widget + tyst inspelning (design låst)

| | |
|---|---|
| **Spec** | `docs/design/WIDGET-BAR-SPEC.md`, `docs/design/HOMESCREEN-WIDGETS-SPEC.md`, `docs/design/ANDROID-WIDGETS-SPEC.md` |
| **Kod** | `FyrenWidgetBar.tsx`, `/widget/*`, `android/…/widgets/*`, `ingestWidgetRecording` |
| **Krav** | WH1: datumstämpel, AI-titel, WORM, sammanfattning i `truth`, ljudfil `evidenceUrl`; **ingen synlig REC** |
| **Data** | `reality_vault` WORM, `category: tyst_inspelning` |
| **Smoke** | Spec-fil + nyckelsträngar |

---

## 6. Sidomeny / hamburger (design låst — Vardag + Valv)

| | |
|---|---|
| **Kanonbild** | `docs/design/references/MENU-DRAWER-KANON.png` |
| **Spec** | `docs/design/references/MENU-DRAWER-KANON.md` |
| **Sektioner** | **Vardag** (publikt) · **Valv** (endast efter PIN/gate på Valv-route) |
| **Kod** | `navTruth.ts`, `NavigationDrawer.tsx`, `DrawerModeToggle.tsx` |
| **Krav** | Skymningsbakgrund; aktiv rad **guld**; **ingen** Valv-växlare/snabbchips i publikt läge |
| **Smoke** | Kanonfil + spec + `DRAWER_VARDAG_ITEMS` / `DRAWER_VALV_ENTRIES` + `vaultOpen` i NavigationDrawer |

---

## 7. Barnporten — barnens hub (design låst)

| | |
|---|---|
| **Route (barn)** | `/barnporten` (PWA) · **förälder** `/familjen?tab=barnporten` |
| **Spec** | `docs/design/BARNPORTEN-SPEC.md`, infografik `docs/design/barnporten/infographic.html` |
| **Orkester** | `src/modules/barnporten/constants/barnportenAgents.ts` — **egen** barn-Orkester (skild från Valv-Orkester) |
| **Valv** | Endast HITL `promoteChildLogToVault` — **aldrig** auto från privat barnlogg |
| **Widget** | CB1–CB4 (barn); **inte** samma som förälder W1 |
| **Smoke** | Spec + `barnportenAgents.ts` + mockup-mapp |

### 7b. Inkorg → Valv-bro (HITL — **låst 2026-05-29**)

| | |
|---|---|
| **Kanon UI** | [`docs/design/barnporten/mockups/barnporten-inkorg-valv-kanon.png`](../docs/design/barnporten/mockups/barnporten-inkorg-valv-kanon.png) |
| **Route (förälder)** | `/familjen?tab=barnporten` → `BarnportenInboxPanel` |
| **Flöde** | Barnmeddelande i inkorg → vuxen granskar → explicit godkännande → `reality_vault` WORM |
| **Kod** | `BarnportenInboxPanel.tsx` · `SaveAsEvidencePrompt.tsx` · `buildVaultPayloadFromChildLog` (`sourceRef`) |
| **HITL** | **Human-In-The-Loop** — inget sparas automatiskt; vuxen trycker **Spara som bevis** / **Flytta till Valv (HITL)** |
| **Tidsstämpel** | `saveVaultLog` → Firestore `serverTimestamp()` → Valv visar **SERVER-TIDSSTÄMPEL** |
| **Efter spar** | Länk **Granska i Valv** → `/valvet` |
| **Tagline (mål-UI)** | *Skapa trygghet. Bygg tillit.* · *Från inkorg till Valv – för framtiden.* |
| **Status (mål-UI)** | *Klar för långtidslagring* · HITL-badge med sköld |

**Får inte:** auto-promote från `private_child` / *Bara för mig*; ta bort HITL-steg; spara till Valv utan `sourceRef: children_logs/{id}`; ta bort inkorg-panelen eller mockup-kanon.

---

## 8. Arbetsliv — modulhub (låst)

| | |
|---|---|
| **Route** | `/arbetsliv` · redirect `/stampla` → `?tab=stampla` |
| **Kod** | `src/modules/arbetsliv/components/ArbetslivHubPage.tsx` |
| **Publikt** | Stämpel · Tid & flex · Logg |
| **Valv-menyn** | Frånvaro · Lön & spec → `vaultTab=arbetsliv_*` · zon `arbetsliv_forensic` |
| **Vardagen** | `/vardagen?tab=ekonomi` = veckopeng/matlåda |
| **Eval** | `docs/evaluations/2026-05-25-arbetsliv-hub.md` |
| **Smoke** | `npm run smoke:arbetsliv` |

**Får inte:** ta bort menyrad Arbetsliv eller stämpel-hub utan produktbeslut.

---

## 8b. Trygg Hamn — snabb ingång vs Valv (**godkänt 2026-05-29**)

| | |
|---|---|
| **Snabb** | `/hamn` — `BiffPublicPanel` (Grey Rock), Speglar-länk, utan PIN |
| **Djup** | Valv → Forensik → **Hamn · Analys** (`hamn_analys`) — triage, bevis, HITL |
| **Redirect** | `/hamn?tab=analys` → `/valvet?vaultTab=hamn_analys` |
| **Kanon** | [`docs/design/VALV-HUBB-SPEC.md`](../docs/design/VALV-HUBB-SPEC.md) |

**Får inte:** kräva Valv-PIN för första BIFF-svar eller ta bort `/hamn` från Vardag-drawer.

---

## 9. Valv-baksida — samlad PIN-vägg (2026-05-25)

| | |
|---|---|
| **Ingång** | Hamburgermeny → sektion **Valv** · `/valvet?vaultTab=…` |
| **Kunskap** | All kunskap (Vardagen, Familjen, Hem) → **Kunskapsbank** — **inte** publik `/vardagen?tab=kunskap` |
| **Forensic** | Hamn analys, Speglar fördjupat, Dagbok arkiv, Familjen mönster, Arbetsliv frånvaro/lön |
| **U1** | Kunskapsbank anropar `knowledgeVaultQuery` — **aldrig** cross-RAG till Valv/Barnen |
| **Kod** | `VaultPage.tsx`, `VaultKunskapsbankPanel.tsx`, `VaultForensicPanel.tsx`, `navTruth.ts` |

---

## 10. Produktikoner D1 · M2 (låst) · app-ikon upplåst

| ID | Plats | Fil | Status |
|----|-------|-----|--------|
| ~~**B1**~~ | App / favicon | `public/favicon.svg` | **Upplåst** — P1–P5 i `phone-icon-variants/PREVIEW.md` |
| **D1** | Header, dock, hero | `LivskompassMark.tsx` | LÅST |
| **M2** | Kompis-avatar | `KompisMark.tsx` | LÅST |

| | |
|---|---|
| **Register** | `.context/locked-icons.md` · stil: `docs/design/ICON-STYLE-GUIDE.md` |
| **App-ikon** | `docs/design/themes/phone-icon-variants/PREVIEW.md` · `npm run android:icons:phone` |
| **Smoke** | `npm run smoke:locked-icons` |

**Får inte:** Lucide-kompass i Kompis, minimal linje-D1, eller Vite-lila favicon utan beslut.

---

## 11. MåBra — Universal Input Superhub (`MabraInputSuperModule`) — **låst 2026-06-14**

| | |
|---|---|
| **Route** | `/mabra/input` · `/mabra/projekt/:projectId?inputMode=…` · `MabraRoutes.tsx` |
| **Syfte** | Polymorf inmatningshub för MåBra (Vit) — byt läge utan att byta sida |
| **Kod** | `MabraInputSuperModule.tsx` · `mabraInputModes.ts` · `supermodule/*` |
| **Spec** | [`docs/specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md`](../docs/specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md) |
| **Eval** | [`docs/evaluations/2026-06-14-fas6-mabra-superhub-djupanalys.md`](../docs/evaluations/2026-06-14-fas6-mabra-superhub-djupanalys.md) |
| **Fas** | 6A→6E **AVSLUTAD** 2026-06-14 — registrerad i `.context/system-plan.md` |

### Input modes (låsta lägen)

| Mode | Beskrivning |
|------|-------------|
| `checkin` | Humör/energi check-in |
| `emotional_memory` | Känslominnen (WORM) |
| `vit_card` | Vit frågekort |
| `vit_chat` | Lär tillsammans (Vit-chatt) |
| `vit_memory` | Känslominne (Vit) |
| `reflection_tool` | Reflektionskort/deck |
| `exercise_note` | Anteckning efter övning |
| `dagbok_bridge` | Bro till Hjärtat/dagbok |
| `inkast` | Granska innan spar (HITL) |

### Säkerhetsgränser (obligatoriska)

| Princip | Tillämpning |
|---------|-------------|
| **WORM** | `vit_entries` och `emotional_memory` — append-only; **ingen** `update`/`delete` |
| **Zero Footprint** | Reflektioner (`reflection_tool`, m.m.) i **RAM** och **localStorage**; molnsparande kräver **strikt uttryckliga HITL-åtgärder** (Human-in-the-loop) |
| **Inkast** | Läge `inkast` kräver **manuellt godkännande** — **ingen** automatisk marknadsföring till Valv, Barnen eller annan silo |
| **U1 silos** | Ingen cross-RAG till Kunskap; ex/konflikt → Speglar/Hamn (guard) |

**Får inte:** ta bort eller gömma lägesväxlaren; införa spridda inmatningsformulär utanför Superhub i MåBra-zonen; auto-promote från inkast; skriva till WORM-samlingar utan befintlig delegate-logik; ändra kärnlogik utan explicit produktbeslut (Pontus) + PMIR.

**Smoke:** `npm run smoke:mabra` · `npm run smoke:emotional-memory` · `npm run smoke:locked-ux`

---

## 12. Familjen — Universal Input Superhub (`FamiljenInputSuperModule`) — **låst 2026-06-14**

| | |
|---|---|
| **Route** | `/familjen?tab=reflektion` · `/familjen?tab=livslogg` · `?inputMode=…` · `FamiljenPage.tsx` |
| **Syfte** | Polymorf inmatningshub för Familjen (Barnen-silo) — byt läge utan sidbyte |
| **Kod** | `FamiljenInputSuperModule.tsx` · `familjenInputModes.ts` · `supermodule/delegates/*` |
| **Spec** | [`docs/specs/Familjen-INPUT-SUPERHUB-SPEC.md`](../docs/specs/Familjen-INPUT-SUPERHUB-SPEC.md) |
| **Eval** | [`docs/evaluations/Familjen-INPUT-SUPERHUB-EVAL.md`](../docs/evaluations/Familjen-INPUT-SUPERHUB-EVAL.md) |
| **Fas** | 7A→7E **AVSLUTAD** 2026-06-14 — registrerad i `.context/system-plan.md` |

### Input modes (låsta lägen)

| Mode | Beskrivning |
|------|-------------|
| `barnfokus` | Dagens fråga — PLAY, optimistisk minneslista |
| `livslogg_stund` | Positiv stund med barnet |
| `fysiologi` | Sömn, ångest, aptit 1–5 |
| `livslogg_observation` | Neutral observation + valfri HITL till Valv |
| `vardagsstruktur` | Rutinobservation |
| `inkast` | Granska innan spar (G10 pipeline, HITL) |

### Säkerhetsgränser (obligatoriska)

| Princip | Tillämpning |
|---------|-------------|
| **WORM** | Alla direkta writes → `saveChildrenLog()` → `children_logs` append-only; **ingen** `update`/`delete` |
| **U1 silos** | Enda write-target = **Barnen** (`children_logs`); **ingen** cross-RAG till Kunskap; Valv endast via `SaveAsEvidencePrompt` (HITL) |
| **Offline block** | `children_logs` ∈ offline-block; delegates visar `offlineWriteUserMessage()` — **ingen** tyst SDK-kö |
| **HITL** | `livslogg_observation` → valfri Valv-bro efter explicit klick; **aldrig** auto-promote från barnfokus/stund/fysio/vardagsstruktur |
| **Zero Footprint** | Delegate unmount → rensa textarea; inga halvfyllda observationer i localStorage |
| **Hub glow** | Container **MÅSTE** ha `glow-bottom-blue` (indigo) — **inte** smaragd (reserverad MåBra) |

**Får inte:** ta bort lägesväxlaren; införa spridda inmatningsformulär utanför Superhub i Familjen write-zon; auto-promote till `reality_vault`; skriva till WORM utan shell-handlers; ändra kärnlogik utan explicit produktbeslut (Pontus) + PMIR.

**Smoke:** `npm run smoke:locked-ux` · `npm run smoke:children` · `npm run smoke:innehall`

---

## 13. Åtgärder-widget — Action Dashboard (PWA hub) — **låst 2026-06-14**

| | |
|---|---|
| **Route** | `/widget/aktioner` → `WidgetActionDashboardPage` |
| **Syfte** | Mobil-först snabbinmatning: reflektion/röst → Valv, stämpel, barnlogg |
| **Kod** | `ActionDashboard.tsx` · `actionDashboardApi.ts` · `actionDashboardOfflineQueue.ts` · `useActionDashboardOfflineFlush.ts` |
| **Kort** | **Multiverktyg** (text + inspelning → `reality_vault`) · **Arbetstid** (`useStampClock`) · **Livslogg** (`children_logs`, kanal `widget`) |
| **Offline** | IndexedDB-kö `livskompassen_action_dashboard_v1` för Valv + barnlogg; flush vid `online` + före utloggning |
| **Krav** | `QueuedBanner` vid kö; röst → transkript (Web Speech) + ljud → Valv direkt; knapp **Spara till {barn}s logg** |
| **Smoke** | `npm run smoke:locked-ux` (aktioner-strängar) |

**Får inte:** ta bort offline-kö; auto-promote barnlogg till Valv; online-only för evidens-silos; ta bort tre-korts-layout utan produktbeslut + PMIR.

---

## Verifiering

```bash
npm run smoke:locked-ux
npm run smoke:locked-icons
npm run smoke:arbetsliv
```

Vid refaktor av `VaultPage`, `FamiljenPage`, eller borttagning av specs ovan: kör smoke innan merge.
