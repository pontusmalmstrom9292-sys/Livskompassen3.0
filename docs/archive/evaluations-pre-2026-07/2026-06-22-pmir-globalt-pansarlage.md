# PMIR-P7 — Globalt Pansarläge (Kognitiv Grind / Survival Mode)

**Beslutsunderlag inför eventuell implementation**

Denna PMIR föreslår en ny funktion som bygger vidare på `capacityBand` (Fas 19.5), `BiochemicalShieldHub` och insikterna i `DESIGN-FREEPORT-IMPROVEMENT-BACKLOG.md` (FP-034). 

Syftet är att radikalt minska kognitiv överbelastning och erbjuda en säker, extremt minimalistisk tillflyktsort när den exekutiva förmågan är låg eller i en akut HCF-situation (High Conflict Feature).

---

## 1. Feature: Globalt Pansarläge (Survival Mode)

Ett globalt app-läge som, när det aktiveras, döljer all navigering, alla dashboards (Hem, Valv, Planering, Ekonomi) och alla valmöjligheter. Gränssnittet ersätts helt av en mörk, minimalistisk vy (Obsidian Calm) som endast tillåter tre handlingar:

1. **Ett mikrosteg för kroppen:** Direkt länk till 4-7-8 andning eller `BiochemicalShieldHub` (vagusnerv-stimulans).
2. **Kognitiv dumpning (Inkast):** En enkel textruta för att snabbt tömma hjärnan (matar in text till den befintliga `inboxClassifier` utan att användaren behöver sortera eller tänka).
3. **Lås upp appen:** En diskret PIN-/Biometri-gate för att stänga Pansarläget och återgå till det fulla gränssnittet.

---

## 2. Varför nu

- Projektet har nyligen implementerat Kapacitets-coachen (`capacityBand`) och `evolution_ledger` (Fas 19.5). Vi kan mäta låg kapacitet, men UI:t reflekterar det inte fullt ut.
- Superhubbarna (Fas 6-11) har konsoliderat all input. Systemet är nu redo att abstrahera bort även dessa bakom ett "Nödläge".
- I `arkitektur-nav-analys.md` nämns exakt detta behov: *"Global kapacitetsgrind: vid låg kapacitet, visa endast Hem + ett mikrosteg-kort (Paralys-Brytaren) — dölj launcher-grid"*.
- Lösningen förstärker domänen "Covert Narcissism" och WORM genom att skapa en extremt diskret vy som fungerar som plausible deniability (appen ser ut som en tråkig andningsapp om skärmen råkar vara igång).

---

## 3. Vad som påverkas

- **Routing:** `AppRoutes.tsx` eller `MainLayout` får en villkorlig rendering. Om statet `isPansarActive` är sant, renderas `GlobalPansarView` istället för barn-routerna.
- **State:** En ny, enkel Zustand-store (`usePansarStore`).
- **UI:** En ny komponent `GlobalPansarView.tsx` som återanvänder `InkastLite` och `ParalysPanel`.
- **Hooks:** Befintlig `BiochemicalShieldHub` kan få en knapp som triggar detta läge (`triggerPansarlage()`).

---

## 4. Vad som INTE påverkas

- **Backend / WORM:** Ingen ny databaslogik, inga ändrade `firestore.rules`.
- **RAG / Silos:** Kognitiv isolering förblir intakt (inget cross-RAG). Inkast dirigeras precis som idag via `inboxClassifier.ts`.
- **Befintliga Superhubbar:** UX-låsningarna i `locked-ux-features.md` berörs inte, eftersom Pansarläget lägger sig *över* hela rounting-trädet, inte inuti dem.

---

## 5. Riskanalys

| Risk | Sannolikhet | Konsekvens | Mitigering (Lösning) |
|---|---|---|---|
| **Säkerhetsutlåsning** | Låg | Hög | Användaren behöver logga ett viktigt HCF-bevis men fastnar i Pansarläget. Löst genom att Pansarlägets Inkast-text behandlas av backend och kan flaggas som `reality_vault` bevis, PLUS en snabb PIN-lås-upp-knapp. |
| **Plausible Deniability** | Låg | Låg | Att appen plötsligt byter form kan se skumt ut. Löst genom att övergången är mjuk (morph/fade 300ms) och UI:t ser ut som ett "Energisparläge" eller "Fokusläge". |
| **State loop / Flimmer** | Låg | Medel | Om läget triggas automatiskt av en AI-bedömning som pendlar. Löst genom deterministisk låsning: läget slås på och kräver manuell PIN för att slås av (ej auto-av). |

---

## 6. Security/Privacy & Silo Impact

- **Security/Privacy:** Positiv. Minskar risken för "shoulder surfing" om användaren är stressad på offentlig plats eller i konflikt. Skapar en "Panic Screen" utan att behöva skaka telefonen (vilket redan finns som fysisk fail-safe).
- **Silo Impact:** Ingen. Data flödar genom befintliga kanaler och isoleras enligt WORM-principerna.

---

## 7. UX Impact

- **Kognitiv Avlastning:** Maximal. Bryter paralysen genom att helt eliminera valmöjligheter (Hick's Law).
- **Designspråk:** 100% Obsidian Calm. Endast neutrala toner, inga onödiga ikoner eller "wellness-brus". Enkelhet framför allt.

---

## 8. Rollout-strategi

1. **Autonomt bygge:** Implementera `usePansarStore`, `GlobalPansarView` och integrera Inkast-mekaniken i vyn.
2. **Mounting:** Lägg in vyn högst upp i `AppRoutes.tsx` med z-index över allt annat.
3. **Trigger:** Koppla en "Aktivera Kognitivt Skydd"-knapp i `BiochemicalShieldHub` och på Hem-dashboarden.
4. **Smoke-test:** Verifiera att ingen routing blöder igenom.
5. **Uppdatera dokumentation:** Lägg in Pansarläget i `locked-ux-features.md`.

---

## 9. Smoke/Testbehov

- `npm run smoke:locked-ux` (säkerställ att app-shellet inte går sönder).
- **Manuell test 1:** Trigga Pansarläge -> Försök navigera via webbläsarens bakåt-knapp (ska blockeras).
- **Manuell test 2:** Skriv text i Inkast -> Verifiera att datan landar i rätt Firestore-collection (`inbox`).
- **Manuell test 3:** Ange PIN -> Verifiera att appen återgår exakt till det state/den sida användaren var på.

---

## 10. GO / NO-GO Rekommendation

**GO.** 
Detta är en hög-värde, låg-risk feature. Den kräver ingen omskrivning av befintlig Firebase- eller WORM-logik, bryter inga silor, och adresserar ett av systemets absoluta kärnvärden (kognitiv offloading vid extrem stress/överbelastning).

---

## 11. Beslut (För Pontus)

- **Ska Pansarläget triggas automatiskt** vid `capacityBand === 'SURVIVAL'` (från AI-coach) eller förbli **strikt manuellt (opt-in)** för att undvika överraskningar? *(Rekommendation: Manuell trigger först).*
- **Är placeringen av Inkastet i Pansarläget OK** trots att allt ska in i Superhubbar, då Inkastet tekniskt sett använder samma backend/inboxClassifier?

*Vänligen bekräfta för att gå vidare med implementering (autonomt bygge av Frontend-delarna kan starta direkt).*
