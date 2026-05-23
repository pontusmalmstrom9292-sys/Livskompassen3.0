# Inkorg — BIFF-Detektor (Valvet · egen modul)

**Status:** **Analyserad** — F-V12 **behålls**; Hamn **kvar**  
**Datum:** 2026-05-23  
**Källa:** Användare (2 skärmdumpar + chatt)  
**Skärmdumpar:** [`21-biff-detektor-inkommande.png`](./artifacts/screenshots-inkorg-2026-05-23/21-biff-detektor-inkommande.png) · [`22-biff-detektor-triage-resultat.png`](./artifacts/screenshots-inkorg-2026-05-23/22-biff-detektor-triage-resultat.png)  
**Kod (mock):** [`artifacts/gemini-biff-detector-BiffDetector.tsx`](./artifacts/gemini-biff-detector-BiffDetector.tsx) · [`gemini-biff-detector-types.ts`](./artifacts/gemini-biff-detector-types.ts)

---

## Användarens intent

> **BIFF-detektor:** klistra in meddelande från ex → få **korta, raka svar** tillbaka. Ska finnas i **Valvet** som **egen modul** (bakom skölden).

---

## Placering (låst i inkorg)

| Krav | Detalj |
|------|--------|
| **Gate** | Synlig/endast användbar efter **Fyren** + PIN (`hasVaultGate`) |
| **Modul** | Egen vy/flik i upplåst Valv — **inte** på yttre `/hamn` som primär ingång (användaren vill ha den i valvet) |
| **Copy** | *Kognitiv sköld* · filtrera JADE-fällor **innan** användaren läser fullt brus |

**Öppen fråga (analys):** Repo har idag **Hamn** `/hamn` (`safe_harbor`) med `analyzeBiffMessage` — specialist avgör: flytta UI, duplicera med bro, eller Valv-flik som delar samma callable.

---

## Skärmindex

### 21 — Inkommande text

| UI | Innehåll |
|----|----------|
| Rubrik | **KOGNITIV SKÖLD · BIFF-Detektor** |
| Beskrivning | AI tar smällen; filtrera JADE och dolda aggressioner innan du läser |
| Fält | **INKOMMANDE TEXT** + *Ladda exempel* |
| CTA (nederkant) | Guld knapp (troligen *Kör BIFF Triage*) |

### 22 — Triage-resultat

| UI | Innehåll |
|----|----------|
| CTA | **KÖR BIFF TRIAGE** (orange/guld) |
| Kort 1 | **KÄNSLOMÄSSIGT BRUS (FILTRERAT)** — dolt som standard, *Visa* + öga; badge *Skyddad från RSD* |
| Kort 2 | **LOGISTISK KÄRNA (FAKTA)** — t.ex. *Bekräfta hur Kasper hämtas inför tisdag kl 15:00* |
| Output (intent) | **Korta raka BIFF-svar** att kopiera (mock visar triage — svar kan vara nästa steg i flödet) |

**Design (mock):** guld + mörk — **ej låst**. Repo: Obsidian Calm + Hamn-tokens där relevant.

---

## Utkast funktionslås (F-V12)

| ID | Krav | Detalj |
|----|------|--------|
| F-V12.1 | Klistra in | Textarea för inkommande sms/mejl (ex) |
| F-V12.2 | Triage | Separera **logistik ~10%** vs **beten/brus ~90%** — brus maskerat som default |
| F-V12.3 | RSD-skydd | Emotionellt brus dolt tills explicit *Visa* (progressive disclosure) |
| F-V12.4 | JADE | Varna/filtrera JADE-mönster (backend DCAP finns; klient GAP i inkorg P0) |
| F-V12.5 | BIFF-svar | **1–3 korta, raka** Grey Rock/BIFF-förslag + kopiera — ingen JADE i förslagen |
| F-V12.6 | WORM | Sparas **endast** på explicit användarval → `reality_vault` (ej auto-logg) |
| F-V12.7 | Zero Footprint | Session/state rensas vid stäng valv / logout |
| F-V12.8 | Plats | **Valv egen modul/flik** efter Fyren — se öppen fråga vs `/hamn` |

---

## Snabb GAP mot repo (preliminär)

| Mock | Repo idag | Label | Bevis (vid analys) |
|------|-----------|-------|-------------------|
| BIFF-analys API | `analyzeBiffMessage` | **PASS** | `src/modules/safe_harbor/api/biffService.ts` |
| Hamn-UI | `SafeHarborPage.tsx` | **PASS** | Route `/hamn` |
| Brus maskerat 90% | — | **GAP** | inkorg P0 BIFF maskering |
| Triage två kort | Delvis fakta/beten i API | **DELVIS** | |
| Valv egen modul | — | **GAP** | användaren ≠ nuvarande `/hamn` |
| Tre svar + kopiera | Delvis | **DELVIS** | |
| Mock `BiffDetector.tsx` | Ej i `src/` | **GAP** (inkorg artifact) | `artifacts/gemini-biff-detector-BiffDetector.tsx` |
| Mock `runBiffTriage` | Repo: `analyzeBiffMessage` | **DELVIS** | Byt mock → `analyzeMessage` callable |

### Mock API → repo (vid implementation)

| Mock (`BiffResponse`) | Repo (`GransAnalysis` / callable) |
|------------------------|-----------------------------------|
| `emotionalNoise` | `emotionalBait[]` (join eller första) |
| `logisticCore` | `cleanFacts[]` (join) |
| `responses[3]` | `greyRockReply` + `greyRockVariants` — utöka till 3 varianter |

---

## Relation

| Relaterat | Koppling |
|-----------|----------|
| F-V10 / F-03 | BIFF-flikar i andra mocks — samma metod, annan placering |
| Orkestern F-V11 | Forensisk arkiv — **inte** samma vy som BIFF-triage |
| [`modul-safe_harbor`](./2026-05-22-modul-safe_harbor.md) | Befintlig modulanalys 2026-05-22 |

## Analys 2026-05-23

| Beslut | Detalj |
|--------|--------|
| **Behåll** | F-V12.1–F-V12.8, bild 21–22, artifact `BiffDetector.tsx` |
| **PASS** | `analyzeBiffMessage`, triage, 3 svar — `biffService.ts:32`, `BiffTriagePanel`, `greyRockVariants.ts:8-38` |
| **Behåll `/hamn`** | Yttre ingång — **lägg till** Valv-flik `biff` (delad panel) |
| **DELVIS** | Blur utan *Visa*-toggle; JADE saknas i Hamn |

**Nästa:** P0 #2 i analys.
