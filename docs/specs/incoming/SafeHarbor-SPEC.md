# SafeHarbor-SPEC

Källa: extern planerings-AI. Konsoliderad till `.context/modules/safe_harbor.md`.

## 1. Syfte och användarbehov

Sacred Feature — känslomässig brandvägg för kommunikation med högkonflikt-expartner. Minskar kognitiv stress via BIFF (Brief, Informative, Friendly, Firm) och Grey Rock — ingen JADE.

## 2. Route och ingång

- **Route:** `/hamn` (AuthGate)
- **Variant A (aktiv):** FloatingDock Anchor, HomePage bento
- **Variant B (planerad):** Primär ingång som bro från `/speglar` efter gaslighting-spegling

## 3. UX-flöde (Progressive Disclosure)

**Spec (målbild):**

1. Inmatning — klistra in exets meddelande
2. Brusfiltret — objektiv kärnfråga utan skuld/gaslighting
3. Användarens mål — kort avsikt (t.ex. "säg nej till fredag")
4. Generering — BIFF/Grey Rock-svar
5. Kopiera + Klar — Zero Footprint

**Idag (kod):** ett steg — klistra in → `analyzeMessage` → svar + kopiera. Brusfilter, mål-steg, Klar-knapp och valv-export saknas i UI.

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

- Bakgrund `#020617`, yta `#0f172a` + glass blur
- Guld `#FDE68A`, Fortsätt indigo `#818CF8`, kopiera/klar emerald `#2DD4BF`
- Outfit + Inter
- Förbjudet: lila, turkos, regnbåge, naturteman, count-up

## 5. Datamodell (Firestore, WORM)

Zero Footprint som standard — inga toxiska meddelanden lagras permanent.

**Planerat:** valfritt "Spara som bevis" → async append till `reality_vault` (WORM).

**Idag:** ingen Firestore-write från Hamn-modulen.

## 6. Backend och agenter

- **Callable:** `analyzeMessage` — Kompis Supervisor + DCAP (inte separat `generateBiffResponse`)
- **Agenter:** Gräns-Arkitekten / BIFF-Skölden via supervisor-routing; Brusfiltret internt i DCAP

*(Extern spec nämnde `generateBiffResponse` — finns inte som egen callable i [`functions/src/index.ts`](../../../functions/src/index.ts).)*

## 7. Säkerhet

- AuthGate på `/hamn`
- Zero Footprint vid Klar/unmount/kill switch — **delvis** (global kill switch; ingen Klar-knapp i UI)
- CMEK vid eventuell valv-export (drift)
- Ex-meddelanden: endast via autentiserad callable, aldrig klient-LLM

## 8. Status idag vs planerat

**Idag:** `SafeHarborPage`, `biffService` → `analyzeMessage`, kopiera svar, riskScore.

**Planerat:** visuellt Brusfilter-steg, mål-fält, flerstegs-wizard, bro Speglar→Hamn, "Klar" + state reset, "Spara som bevis" → valv.

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Brusfilter visar kärnfråga utan laddade ord | **partial** — DCAP backend, ej separat UI-steg |
| 2 | BIFF-svar utan JADE | **partial** — svar genereras; kvalitet via supervisor |
| 3 | Navigering bort / kill switch nollställer formulär | **planned** — unmount/Klar saknas |
| 4 | "Spara som bevis" → `reality_vault` | **planned** |

## 10. Kopplingar

- **Speglings-Systemet** — bro `/speglar` → `/hamn` med meddelande som kontext (planerad)
- **Verklighetsvalvet** — WORM vid "Spara som bevis" (planerad)

## 11. Navigation

- **Variant A (aktiv):** synlig Anchor i dock + bento
- **Variant B (planerad):** primär ingång från Speglar efter gaslighting
