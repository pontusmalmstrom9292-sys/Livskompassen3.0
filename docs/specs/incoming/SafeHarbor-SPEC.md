# SafeHarbor-SPEC

Källa: extern planerings-AI + Kladd 2026-05-21. Konsoliderad till `.context/modules/safe_harbor.md`.

**Kladd-master:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](./Kladd-2026-05-21-PERSONAL-MASTER.md) §F, §G, §H.

## 1. Syfte och användarbehov

Sacred Feature — känslomässig brandvägg för kommunikation med högkonflikt-expartner. Minskar kognitiv stress via BIFF (Brief, Informative, Friendly, Firm) och Grey Rock — ingen JADE.

**Kladd:** 10% logistik / 90% känslomässigt brus ignoreras. Soc-strategi: kort, faktabaserat — barnets behov.

## 2. Route och ingång

- **Route:** `/hamn` (AuthGate)
- **Variant A (aktiv):** FloatingDock Anchor, HomePage bento
- **Variant B (aktiv):** Bro från `/speglar` med `prefilledMessage`

## 3. UX-flöde (Progressive Disclosure)

**Målbild (planerad):**

1. Inmatning — klistra in exets meddelande
2. Brusfiltret — objektiv kärnfråga
3. Användarens mål — kort avsikt
4. Generering — BIFF/Grey Rock
5. Kopiera + Klar — Zero Footprint

**Idag (kod):** klistra in → `analyzeMessage` → svar + kopiera + valfritt *Spara original som bevis*. Brusfilter/mål/Klar som separata UI-steg saknas.

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

- Bakgrund `#020617`, yta `#0f172a` + glass blur
- Guld `#FDE68A`, Fortsätt indigo `#818CF8`, kopiera/klar emerald `#2DD4BF`
- Outfit + Inter
- Förbjudet: lila, turkos, regnbåge, naturteman, count-up

## 5. Datamodell (Firestore, WORM)

Standard: inga toxiska meddelanden lagrade utan explicit val.

**Idag:** *Spara original som bevis* → `saveVaultLog` → `reality_vault` (WORM).

## 6. Backend och agenter

- **Callable:** `analyzeMessage` — Kompis Supervisor + DCAP
- **Agenter:** BIFF-Skölden via supervisor; Brusfiltret internt i DCAP

## 7. Säkerhet

- AuthGate på `/hamn`
- Zero Footprint: global kill switch; Klar-knapp **planerad**
- Ex-meddelanden: endast via autentiserad callable

## 8. Status idag vs planerat

| Område | Kladd 2026-05-21 | Kod |
|--------|------------------|-----|
| BIFF/Grey Rock + kopiera | Ex-sms | **done** |
| `riskScore` (DCAP) | Brus backend | **done** |
| Spara som bevis → valv | WORM original | **done** |
| Bro Speglar | `prefilledMessage` | **done** |
| Brusfilter UI-steg | Metod Kladd #3 | **planned** |
| Klar + unmount cleanup | Zero Footprint | **planned** |
| Dölj tills energi | Fas 2 | **planned** |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Brusfilter visar kärnfråga utan laddade ord | **partial** — DCAP backend |
| 2 | BIFF-svar utan JADE | **partial** — supervisor |
| 3 | Kill switch nollställer formulär | **partial** |
| 4 | Spara som bevis → `reality_vault` | **done** |
| 5 | Speglar-bro med meddelande | **done** |

## 10. Kopplingar

- **Speglar** — `prefilledMessage` → `/hamn` (**done**)
- **Verklighetsvalvet** — WORM vid *Spara som bevis* (**done**)
- **Kunskap** — metodartiklar (gaslighting) — **inte** Hamn

## 11. Navigation

- **Variant A:** Anchor i dock + bento
- **Variant B:** Bro från Speglar efter compare (**done**)

## 12. Tidigare diskussioner att bevara (vision)

- Grey Rock: svara, reagera inte — strikt logistisk dialog.
- BIFF stoppar JADE — appen försvarar inte användaren mot ex automatiskt.
- 10/90-regeln: logistik vs emotionella beten.
- Soc: fakta + tredjepart — inte diagnostiserande etiketter mot motpart (Kladd §C).
- SMS som PDF-export (hel tråd) → valv, inte skärmdumpslängd.

## 13. Avvisade eller alternativa idéer

- **Auto-svar till ex** — avvisat; all utgång manuell.
- **Spara alla inkommande sms automatiskt** — avvisat; explicit bevis-knapp only.
- **Separat `generateBiffResponse` callable** — avvisat; `analyzeMessage` only.
- **Livs-Coachen i Hamn** — avvisat → Kunskap.
- **Dölj alla sms permanent utan användarval** — avvisat MVP; *dölj tills energi* fas 2.

---

**Module plan:** [`src/modules/safe_harbor/module_plan.md`](../../../src/modules/safe_harbor/module_plan.md)  
**Flöde:** [`docs/specs/p2-flode.md`](../p2-flode.md)
