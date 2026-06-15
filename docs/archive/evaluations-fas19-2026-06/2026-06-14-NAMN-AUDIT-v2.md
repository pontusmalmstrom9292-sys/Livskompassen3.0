# NAMN-AUDIT v2 — user-facing copy (2026-06-14)

**Status:** Batch 1 implementerad i kod. **Utökar:** [`2026-05-31-NAMN-AUDIT.md`](./2026-05-31-NAMN-AUDIT.md) (ersätter inte).

**Kanon i kod (v2):**

- [`src/modules/core/copy/valvNavCopy.ts`](../../src/modules/core/copy/valvNavCopy.ts) — Valv-zoner inkl. Min utveckling
- [`src/modules/core/copy/compassWidgetLabels.ts`](../../src/modules/core/copy/compassWidgetLabels.ts) — widget-etiketter batch 1
- [`src/modules/core/copy/compassBannerQuotes.ts`](../../src/modules/core/copy/compassBannerQuotes.ts) — roterande kompass-citat

**Oförändrat:** `vaultTab=mitt_vit`, `functions/` agent-id, Firestore collection-namn.

---

## Inventering (≥40 rader)

| id | Nuvarande | Problem | Förslag enklare svenska | Fil/komponent | Synlig för användare? |
|----|-----------|---------|-------------------------|---------------|----------------------|
| N01 | Mitt Vit | Förvirras med Vite-bygget; «Vit» oklar | **Min utveckling** + ingress: «Dina reflektioner och frågekort — inte bevis mot ex.» | valvNavCopy, VaultVitHubPanel | Ja |
| N02 | KASAM | Jargonsförkortning (känsla av sammanhang) | **Stäng dagen** / **Kvällscheck** | KasamEvening, compassFlows, compassAdaptiveCards | Ja |
| N03 | Paralys / Paralys-Brytaren | Klinisk/neuro-jargong | **Ett litet steg** | ParalysPanel, HomeTaskPanel, compassAdaptiveCards | Ja |
| N04 | Fokus (Planering-flik) | Otydligt vs «fokusproblem» | **Nästa steg** | planning/constants.ts | Ja |
| N05 | Frågesport | Låter lek — men är kunskapstest | **Testa dig** | homeActionCategories | Ja |
| N06 | Känslokort | Abstrakt | **Känsla & lek** | compassWidgetCatalog, mabraHubRegistry | Ja |
| N07 | Kompasser | Metafor utan förklaring | **Dygnsrytm** (alternativ) eller behåll + ingress | navTruth, VardagenPage | Ja |
| N08 | Handling | Vagt — planering? | **Planera & göra** (alternativ) | navTruth | Ja |
| N09 | Livslogg | Tekniskt | **Barnens mående** (alternativ) | navTruth, FamiljenPage | Ja |
| N10 | Orkester | Dev/metafor (agent-orkester) | **Meddelande-analys** (redan delvis i Valv-flik) | VaultOrkesterPanel, Barnporten | Ja (Valv) |
| N11 | Vävaren | Intern metafor | **Förslag på taggar** (v1 done delvis) | vavarenCopy, DossierPage | Delvis |
| N12 | Närvaro | Kan låta som streak | Behåll — **inte** streak-skuld (räknar unika dagar) | OdForgeKompassSuperHub | Ja (Forge-lab) |
| N13 | Din eld | Gamification/streak-metafor | Dölj eller byt till **Närvaro** | HOME-HERO-KANON, HomeStreakChip | Idé/dold |
| N14 | Fortsätt kompassen | Oklart vad som händer | **Checka in** / **Ett steg till** | HomeForgeKompassBridge, ObsidianForgeLabPage | Ja (Forge-lab) |
| N15 | Styr med mening | Abstrakt marknadsfras | Behåll eyebrow eller byt till fas-citat | HomeGreeting | Ja |
| N16 | Dagens fokus | «Fokus»-jargong | **Dagens riktning** (redan i DagensRiktningCard) | homeCompassPhase phaseLabel | Ja |
| N17 | Kväll — KASAM (BentoCard) | Dubbel jargong | **Stäng dagen** | KasamEvening | Ja |
| N18 | KASAM — tre korta steg… | Jargong i prompt | **Tre korta steg för att stänga dagen** | compassAdaptiveCards | Ja |
| N19 | Paralys-brytare (actionLabel) | Jargong | **Ett litet steg** | compassAdaptiveCards | Ja |
| N20 | Snabb (Forge «Mer») | Oklart | **Mer snabbstart** | OdForgeKompassSuperHub | Ja (Forge-lab) |
| N21 | Lek & lär | OK men vagt | Behåll — tydlig i Forge-läge | OdForgeKompassSuperHub | Ja (Forge-lab) |
| N22 | Vit hub | Intern silo-term | **Min utveckling** | vitHubCopy, VALV_DRAWER_HINTS | Ja |
| N23 | Spara till Vit | Oklar zon | **Spara till utveckling** | MabraExplicitSavePanel | Ja |
| N24 | Öppna Mitt Vit i Valv | Se N01 | **Öppna Min utveckling i Valv** | vitHubCopy | Ja |
| N25 | MåBra | Varumärke — OK | Behåll — etablerat | navTruth | Ja |
| N26 | Liv och göra | Oklart scope | Behåll eller **Vardagen** | navTruth drawer | Ja |
| N27 | Familj och gränser | Långt men tydligt | Behåll | navTruth | Ja |
| N28 | Trygg Hamn | Metafor — etablerad | Behåll (BIFF-kontext) | navTruth, Hamn | Ja |
| N29 | Kunskapsbank | OK bakom PIN | Behåll | valvNavCopy | Ja (Valv) |
| N30 | Djupare (zon) | Vagt | Behåll v1 — eller **Fördjupat** | valvNavCopy | Ja (Valv) |
| N31 | WORM | Dev-jargong | **Låst post** (v1 done) | evidenceCopy | Ska vara borta i UI |
| N32 | DCAP / RAG | Dev-jargong | Ska inte synas | — | Nej (intern) |
| N33 | Vite | Byggverktyg | Ska inte synas | — | Nej (intern) |
| N34 | Begriplighet / Hanterbarhet / Meningsfullhet | KASAM-delsteg — OK svenska | Behåll stegnamn (ersätter KASAM-rubrik) | KasamEvening | Ja |
| N35 | Morgonkompass / Dagskompass / Kvällskompass | OK metafor | Behåll + roterande citat | compassFlows, HomeAdaptiveCompass | Ja |
| N36 | Sanningens Ankare | Produkt-poetik | Behåll — etablerad i morgon | compassAdaptiveCards | Ja |
| N37 | Minne | Oklart vs arkiv | **Sparade anteckningar** (alternativ) | compassAdaptiveCards | Delvis |
| N38 | Luckor | Oklart | **Fyll i det som saknas** (desc finns) | homeActionCategories | Ja |
| N39 | Utforska (Forge deck) | OK | Behåll | OdForgeKompassSuperHub | Ja (Forge-lab) |
| N40 | Assistentroller | v1 Orkester-renaming | Behåll v1 | VaultOrkesterPanel | Ja (Valv) |
| N41 | Personregister för assistenter | v1 done | Behåll | EntityRegistryCard | Ja (Valv) |
| N42 | Fokus: steg N av M | «Fokus» i mikrosteg-räknare | **Steg N av M** | ParalysPanel | Ja |
| N43 | Dagens riktning | Tydlig | Behåll | DagensRiktningCard | Ja |
| N44 | Checka in nu | Tydlig | Behåll | DagensRiktningCard | Ja |
| N45 | «Vit» i exporttitel | Silo-jargong | **Min utveckling — personlig export** | exportVitHubReport | Ja |

---

## Batch 1 — implementerat (2026-06-14)

| Gammalt | Nytt | Status |
|---------|------|--------|
| KASAM (UI) | Stäng dagen / Kvällscheck | Implementerat |
| Paralys (UI) | Ett litet steg | Implementerat |
| Fokus (Planering-flik) | Nästa steg | Implementerat |
| Frågesport | Testa dig | Implementerat |
| Känslokort | Känsla & lek | Implementerat |
| Mitt Vit | Min utveckling | Implementerat |

## Roterande citat

- `pickQuote(phase, date)` i `compassBannerQuotes.ts`
- Wired: HomeGreeting, compassAdvice, HomeForgeKompassBridge, OdForgeKompassSuperHub micro-tip
- `phaseLead` i homeCompassPhase — kort action-hint (kompletterar, dubblerar inte citat)

## Väntar på produkt-OK

| id | Nuvarande | Förslag |
|----|-----------|---------|
| N07 | Kompasser | Dygnsrytm |
| N08 | Handling | Planera & göra |
| N09 | Livslogg | Barnens mående |
| N10 | Orkester (låst UX-flik internt) | Assistent-analys (slug oförändrad) |
| N13 | Din eld | Dölj helt eller slå ihop med Närvaro |
| N14 | Fortsätt kompassen | Checka in |

## Smoke

`npm run smoke:copy-audit` — statisk grep, inga batch-1-förbjudna termer i user-facing TSX utan copy-konstant.
